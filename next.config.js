/** @type {import('next').NextConfig} */

const path = require('path')


const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'storage.googleapis.com',
            port: '',
            pathname: '/interact-bucket/**',
        },
    ],
  },
  optimizeFonts:true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

module.exports = nextConfig
