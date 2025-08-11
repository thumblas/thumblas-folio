/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  typescript: {
    // Allow building even if there are type errors during initial migration
    ignoreBuildErrors: true,
  },
  eslint: {
    // Allow building even if there are ESLint errors during initial migration
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      { source: '/resume', destination: '/resume.pdf' },
    ];
  },
}

export default nextConfig

