import { NextRequest, NextResponse } from "next/server";

const descriptions: Record<string, string> = {
  www: "Blog",
  pgp: "PGP Key",
  call: "Video Call Room",
  calendar: "Calendar",
  email: "Email",
  x: "X/Twitter",
  github: "GitHub",
  ig: "Instagram",
  li: "Linkedin",
  resume: "Download my resume (outdated)",
  mirror: "A mirror",
};

const hidden: Record<string, string> = {
  static: "Static Assets",
  qiuling: "The Qiuling Font",
};

export function middleware(req: NextRequest) {
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
    case "pranay": // if there's no subdomain, it'll show up as "pranay"
    case "www":
      // Serve the Next.js blog for the main domain
      return NextResponse.next();
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
    default:
      // For localhost or unknown subdomains, serve the app
      if (subdomain === "localhost" || url.host === "localhost:3000") {
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

function redirect(url: string) {
  return new Response(null, {
    status: 308,
    headers: {
      Location: url,
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
