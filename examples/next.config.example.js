/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optional: If you want to use lib/logger-with-pretty.ts
  // This configuration prevents webpack from trying to bundle
  // Node.js-specific modules on the client side

  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle these Node.js modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        worker_threads: false,
        perf_hooks: false,
        os: false,
        path: false,
        stream: false,
        util: false,
        events: false,
        buffer: false,
        string_decoder: false,
      };

      // Prevent bundling pino internals on the client
      config.externals = config.externals || [];
      config.externals.push({
        'pino-pretty': 'commonjs pino-pretty',
        'thread-stream': 'commonjs thread-stream',
        'pino-abstract-transport': 'commonjs pino-abstract-transport',
      });
    }

    return config;
  },
};

module.exports = nextConfig;
