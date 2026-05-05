/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // The Sharp-based optimiser fails on macOS volume mounts (perm errors)
    // and on Google-hosted lh3 URLs that carry query params. We disable it
    // globally — files are already pre-sized PNG/WebP/JPG and the gain from
    // optimisation is small here. To re-enable, remove `unoptimized` and
    // restore `formats` + `remotePatterns`.
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'firebasestorage.googleapis.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' }
    ]
  },
  // NOTE: legacy SPA URL redirects (`/Atractions` → `/atractions` …) were
  // removed because Next.js dev's path matching is case-insensitive, which
  // turned them into infinite redirect loops on the new lower-case routes.
  // If/when the project is deployed alongside live legacy traffic, re-add
  // these as middleware-level redirects with explicit case-sensitive guards.
};

export default nextConfig;
