/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
    serverActions: {
      allowedOrigins: [process.env.ALLOWED_HOSTS || 'localhost']
    }
  },
  reactStrictMode: true,
  output: 'standalone'
};

export default nextConfig;

