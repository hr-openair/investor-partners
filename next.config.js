/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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