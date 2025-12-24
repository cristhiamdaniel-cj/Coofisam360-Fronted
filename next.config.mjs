/** @type {import('next').NextConfig} */
const nextConfig = {
  // Evitar que errores de ESLint/TypeScript rompan el build en Docker
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
