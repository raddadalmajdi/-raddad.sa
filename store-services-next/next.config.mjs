/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: false,
  images: { unoptimized: true },
  outputFileTracingRoot: import.meta.dirname,
};

export default nextConfig;