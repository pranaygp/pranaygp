import { rewrite, next } from "@vercel/edge";

const descriptions = {
  www: "Blog",
  pgp: "PGP Key",
  cal: "Calendar",
  email: "Email",
  x: "X/Twitter",
  github: "GitHub",
  ig: "Instagram",
  resume: "Download my resume (outdated)",
};

export default function middleware(req: Request) {
  console.log("URL requested", req.url);

  const url = new URL(req.url);
  const subdomain = url.host.split(".")[0];

  console.log("Subdomain", subdomain);

  switch (subdomain) {
    case "resume":
      if (url.pathname === "/resume.pdf") return next(); // Serve the file
      else return redirect("/resume.pdf");
    case "pranay": // if there's no subdomain, it'll show up as "pranay"
    case "www":
      // For blog, we rewrite to have the right certificate
      url.host = "blog.pranay.gp"; // svbtle
      return rewrite(url);
    case "pgp":
    case "key":
      return redirect(
        "https://keys.openpgp.org/vks/v1/by-fingerprint/69CC0E8F6D41F6373F9DAE17547249897F9BE56F"
      );
    case "cal":
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
    default:
      return list();
  }
}

function redirect(url) {
  return new Response(null, {
    status: 308, // Permanent Redirect
    headers: {
      Location: url,
    },
  });
}

function htmlRedirect(url) {
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
            }, 2000); // Delay the redirect by 2 seconds
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
        </ul>
    </body>
    </html>
    `,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}
