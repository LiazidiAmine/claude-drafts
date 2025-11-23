/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration compatible avec Capacitor
  output: 'export', // Pour générer des fichiers statiques
  images: {
    unoptimized: true, // Nécessaire pour l'export statique
  },
  // Configuration pour une meilleure compatibilité mobile
  swcMinify: true,
  reactStrictMode: true,
}

module.exports = nextConfig
