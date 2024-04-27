import { rewrite } from "@vercel/edge";

export default function middleware(req: Request) {
  console.log("URL requested", req.url);

  const url = new URL(req.url);
  const subdomain = url.host.split(".")[0];

  console.log("Subdomain", subdomain);

  switch (subdomain) {
    case "pranay": // if there's no subdomain, it'll show up as "pranay"
    case "www":
      url.host = "blog.pranay.gp";
      break;
    // return rewrite("http://blog.pranay.gp"); // Domain points to svbtle
    case "pgp":
    case "key":
      url.host = "keys.openpgp.org";
      if (url.pathname === "/")
        url.pathname =
          "/vks/v1/by-fingerprint/69CC0E8F6D41F6373F9DAE17547249897F9BE56F";
      break;
    // return rewrite(
    //   "https://keys.openpgp.org/vks/v1/by-fingerprint/69CC0E8F6D41F6373F9DAE17547249897F9BE56F"
    // );
    case "cal":
    case "calendar":
      url.host = "cal.com";
      if (url.pathname === "/") url.pathname = "pranay";
      break;
    // return rewrite("https://cal.com/pranay");
    case "e":
    case "hey":
    case "mail":
    case "email":
      return rewrite("mailto:hey@pranay.gp");
    case "t":
    case "twitter":
      url.host = "cal.com";
      if (url.pathname === "/") url.pathname = "pranaygp";
      break;
    // return rewrite("https://twitter.com/pranaygp");
    case "g":
    case "github":
      url.host = "github.com";
      if (url.pathname === "/") url.pathname = "pranaygp";
      break;
    // return rewrite("https://github.com/pranaygp");
    default:
      return new Response("Not found", { status: 404 });
  }
  return rewrite(url);
}
