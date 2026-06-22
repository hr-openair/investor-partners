/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Für Cross-Origin-Zugriff (falls nötig)
  allowedDevOrigins: ['localhost', '10.10.30.202'],

  // Output-Konfiguration für Render
  output: 'standalone',

  // Turbopack-Konfiguration (für Entwicklung)
  turbopack: {
    root: process.cwd(),
  },

  // Environment-Variablen für Build
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
};

module.exports = nextConfig;