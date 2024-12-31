/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // This will ignore ESLint errors during the build process
  },
  pageExtensions: ['page.tsx', 'page.ts', 'page.jsx', 'page.js'], // Specify valid page extensions
};

export default nextConfig;
