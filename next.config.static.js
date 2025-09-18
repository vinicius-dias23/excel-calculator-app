
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para export estático (cPanel sem Node.js)
  output: 'export',
  distDir: 'out',
  
  // Configurações de imagem para export estático
  images: { 
    unoptimized: true,
    loader: 'custom'
  },
  
  // Adicionar trailing slash para melhor compatibilidade
  trailingSlash: true,
  
  // Configurações experimentais
  experimental: {
    outputFileTracingRoot: path.join(__dirname, '../'),
  },
  
  // Desabilitar otimizações que não funcionam em export estático
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Configurações de build para static export
  generateBuildId: async () => {
    // Usar timestamp para garantir builds únicos
    return Date.now().toString();
  },
  
  // Headers customizados (serão ignorados em export estático, mas mantidos para referência)
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS,DELETE,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range' },
        ],
      },
    ];
  },
  
  // Configurações de webpack para otimização
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Otimizações para build estático
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        default: false,
        vendors: false,
        vendor: {
          name: 'vendor',
          chunks: 'all',
          test: /node_modules/,
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
