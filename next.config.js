/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Für Cross-Origin-Zugriff (lokal)
  allowedDevOrigins: ['localhost', '10.10.30.202'],

  // Environment-Variablen für Build
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;