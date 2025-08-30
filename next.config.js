/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  turbopack: {
    resolveAlias: {
      '@': './src'
    }
  }
}

module.exports = nextConfig
