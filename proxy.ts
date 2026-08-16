import { NextRequest, NextResponse } from "next/server";

const descriptions: Record<string, string> = {
  www: "Blog",
  pgp: "PGP Key",
  x: "X/Twitter",
  github: "GitHub",
  ig: "Instagram",
  li: "Linkedin",
  resume: "Download my resume (outdated)",
  mirror: "A mirror",
  avatar: "Inclusive Avatar Generator",
};

const hidden: Record<string, string> = {
  static: "Static Assets",
  qiuling: "The Qiuling Font",
};

// Posts imported from the old Svbtle blog. These used to live at the APEX
// (pranay.gp/<slug>) and at blog.pranay.gp/<slug>. They now live at
// pranay.gp/blog/<slug>. We 301-redirect the old flat URLs to the new
// canonical location so long-standing backlinks keep working.
const legacySlugs = new Set<string>([
  "how-to-learn-things-at-1000x-the-speed",
  "a-case-for-nihilism",
  "musings-on-a-train-to-paris",
  "rfc-request-for-company-a-videobook-platform",
  "say-their-name",
]);

export function proxy(req: NextRequest) {
  console.log("URL requested", req.url);

  const url = new URL(req.url);
  const subdomain = url.host.split(".")[0];

  console.log("Subdomain", subdomain);

  switch (subdomain) {
    case "static":
      return NextResponse.next({
        headers: {
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=1",
        },
      });
    case "resume":
      if (url.pathname === "/resume.pdf") return NextResponse.next();
      else return redirect("/resume.pdf");
    case "call":
    case "video":
      if (url.pathname === "/call.html") return NextResponse.next();
      else return redirect("/call.html");
    case "qiuling":
      if (url.pathname === "/qiuling.ttf") return NextResponse.next();
      else return redirect("/qiuling.ttf");
    case "blog": {
      // Legacy blog.pranay.gp/* → canonical apex. Preserves old backlinks.
      // blog.pranay.gp/<slug>  → https://pranay.gp/blog/<slug>
      // blog.pranay.gp/        → https://pranay.gp/ (homepage is the index)
      const seg = url.pathname.replace(/^\/+|\/+$/g, "");
      const dest = seg ? `https://pranay.gp/blog/${seg}` : "https://pranay.gp/";
      return redirect(dest, 301);
    }
    case "pranay": // if there's no subdomain, it'll show up as "pranay"
    case "www": {
      // The /private dashboard is gated behind HTTP Basic Auth so only I can
      // reach my email / calendar / video-room / tools links. It is never
      // served publicly and is excluded from crawlers via robots.txt + noindex.
      if (
        url.pathname === "/private" ||
        url.pathname.startsWith("/private/")
      ) {
        const unauthorized = requireBasicAuth(req);
        if (unauthorized) return unauthorized;
        return NextResponse.next();
      }
      // The blog index now lives on the homepage — redirect the old /blog
      // index to /. Individual posts still render at /blog/<slug>.
      if (url.pathname === "/blog" || url.pathname === "/blog/") {
        return redirect("https://pranay.gp/", 301);
      }
      // Honor the old flat post URLs (pranay.gp/<slug>) → /blog/<slug>.
      const seg = url.pathname.replace(/^\/+|\/+$/g, "");
      if (legacySlugs.has(seg)) {
        return redirect(`https://pranay.gp/blog/${seg}${url.search}`, 301);
      }
      return NextResponse.next();
    }
    case "pgp":
    case "key":
      return redirect(
        "https://keys.openpgp.org/vks/v1/by-fingerprint/816396CE9A9CC46B0B2D3C8466F99659865FD676"
      );
    case "calendar":
      return redirect("https://cal.com/pranay");
    case "e":
    case "hey":
    case "mail":
    case "email":
      return htmlRedirect("mailto:hey@pranay.gp");
    case "x":
    case "twitter":
      return redirect("https://twitter.com/pranaygp");
    case "g":
    case "github":
      return redirect("https://github.com/pranaygp");
    case "ig":
    case "instagram":
      return redirect("https://instagram.com/pranaygp");
    case "li":
    case "linkedin":
      return redirect("https://www.linkedin.com/in/pranaygp");
    case "avatar":
      url.host = "avatar-teal-seven.vercel.app";
      return NextResponse.rewrite(url);
    default:
      // For localhost or unknown subdomains, serve the app
      if (
        subdomain === "localhost" ||
        url.hostname === "localhost" ||
        url.hostname === "127.0.0.1" ||
        url.host.includes("vercel.app")
      ) {
        // Keep /private gated even on preview/localhost hosts.
        if (
          url.pathname === "/private" ||
          url.pathname.startsWith("/private/")
        ) {
          const unauthorized = requireBasicAuth(req);
          if (unauthorized) return unauthorized;
        }
        return NextResponse.next();
      }
      return list();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except Next.js internals and static files
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

function redirect(url: string, status: number = 308) {
  return new Response(null, {
    status,
    headers: {
      Location: url,
    },
  });
}

// HTTP Basic Auth gate for the private dashboard. Returns a 401 Response when
// credentials are missing/incorrect, or null when the request is authorized.
// Credentials come from env vars so they never live in the repo:
//   PRIVATE_USER (default "pranay") and PRIVATE_PASS (required).
function requireBasicAuth(req: NextRequest): Response | null {
  const expectedUser = process.env.PRIVATE_USER || "pranay";
  const expectedPass = process.env.PRIVATE_PASS || "";

  // If no password is configured, fail closed (deny everyone) rather than
  // accidentally exposing the dashboard.
  const header = req.headers.get("authorization") || "";
  if (expectedPass && header.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6));
      const idx = decoded.indexOf(":");
      const user = decoded.slice(0, idx);
      const pass = decoded.slice(idx + 1);
      if (user === expectedUser && pass === expectedPass) {
        return null; // authorized
      }
    } catch {
      // fall through to 401
    }
  }

  return new Response("Authentication required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="pranay.gp private", charset="UTF-8"',
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

function htmlRedirect(url: string) {
  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Email Redirect</title>
    </head>
    <body>
        <script>
            setTimeout(function() {
                window.location.href = '${url}';
            }, 2000);
        </script>
        <p>If you are not automatically redirected in 2 seconds, <a href="${url}">click here</a> to go to <b>${url}</b>.</p>
    </body>
    </html>
    `,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

function list() {
  return new Response(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>pranaygp linktree</title>
    </head>
    <body>
        <h1>The pranaygp linktree</h1>
        <ul>
            ${Object.entries(descriptions)
              .map(
                ([key, value]) =>
                  `<li><b><a href="https://${key}.pranay.gp">${key}.pranay.gp</a></b> - ${value}</li>`
              )
              .join("")}
              ${Object.entries(hidden)
                .map(
                  ([key, value]) =>
                    `<li style="color:white;"><b><a color="white" style="color:white;cursor:default;" href="https://${key}.pranay.gp">${key}.pranay.gp</a></b> - ${value}</li>`
                )
                .join("")}
        </ul>
    </body>
    </html>
    `,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
