/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fail the production build on type errors instead of shipping them.
  typescript: { ignoreBuildErrors: false },

  // Statically typed Link hrefs (stable in Next 16) — catches broken internal links at build time.
  typedRoutes: true,

  // Allow YouTube thumbnail images through next/image optimization.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },

  // Strip the X-Powered-By header and enable gzip.
  poweredByHeader: false,
  compress: true,

  // Long-lived immutable caching for the static font/asset files we serve.
  async headers() {
    return [
      {
        source: "/:all*(woff2|ttf|otf|png|jpg|jpeg|svg|webp|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
