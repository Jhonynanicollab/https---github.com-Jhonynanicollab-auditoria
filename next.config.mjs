/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // 🚀 No frena el build aunque haya errores de ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
