/** @type {import('next').NextConfig} */

const path = require('path')


const nextConfig = {
  reactStrictMode: false,
  images:{
    unoptimized: true,
    domains:[process.env.NEXT_PUBLIC_BACKEND_URL]
  },
  optimizeFonts:true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

module.exports = nextConfig
