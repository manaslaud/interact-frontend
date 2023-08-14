/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images:{
    unoptimized: false,
    domains:['localhost', process.env.NEXT_PUBLIC_BACKEND_URL]
  },
  optimizeFonts:true,
}

module.exports = nextConfig
