/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove static export for Vercel (Vercel handles this automatically)
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  
}

module.exports = nextConfig
