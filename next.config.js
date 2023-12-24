/** @type {import('next').NextConfig} */

const path = require('path')


const nextConfig = {
  reactStrictMode: false,
  images:{
    domains:[process.env.NEXT_PUBLIC_BACKEND_URL, "storage.googleapis.com"]
  },
  optimizeFonts:true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}

module.exports = nextConfig
