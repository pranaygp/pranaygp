import { NextResponse } from "next/server";
import { rewrite } from "@vercel/edge";

export default function middleware(req: Request) {
  console.log("URL requested", req.url);

  const subdomain = new URL(req.url).host.split(".")[0];

  console.log("Subdomain", subdomain);

  switch (subdomain) {
    case "pranay": // if there's no subdomain, it'll show up as "pranay"
    case "www":
      return rewrite("https://blog.pranay.gp"); // Domain points to svbtle
    case "pgp":
    case "key":
      return rewrite(
        "https://keys.openpgp.org/vks/v1/by-fingerprint/69CC0E8F6D41F6373F9DAE17547249897F9BE56F"
      );
    case "cal":
    case "calendar":
      return rewrite("https://cal.com/pranay");
    case "e":
    case "hey":
    case "mail":
    case "email":
      return rewrite("mailto:hey@pranay.gp");
    case "t":
    case "twitter":
      return rewrite("https://twitter.com/pranaygp");
    case "g":
    case "github":
      return rewrite("https://github.com/pranaygp");
    default:
      return new NextResponse("Not found", { status: 404 });
  }
}
