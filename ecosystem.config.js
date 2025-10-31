module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: process.env.PM2_INSTANCES || 'max',
      exec_mode: 'cluster',

      // Environment variables
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // PM2 Log Management
      // Let PM2 handle log rotation and aggregation
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',

      // Log rotation (prevents disk filling)
      max_memory_restart: '500M',

      // Auto-restart settings
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },
  ],

  // PM2+ Monitoring (optional)
  deploy: {
    production: {
      // Add your deployment config here
    },
  },
};
