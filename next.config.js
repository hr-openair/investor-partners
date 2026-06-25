/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

    // Environment-Variablen für Build explizit freigeben
    env: {
      DATABASE_URL: process.env.DATABASE_URL,
    },


  // TypeScript-Überprüfung beim Build deaktivieren
  typescript: {
    ignoreBuildErrors: true,
  },

  // Redirects für Root-Pfad
  async redirects() {
    return [
      {
        source: '/',
        destination: '/de',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;