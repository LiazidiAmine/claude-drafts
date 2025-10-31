/**
 * Simplified Next.js Logger with PM2-friendly output
 * JavaScript version for easy testing
 */

const pino = require('pino');

// Browser logger (no-op client-side)
const createBrowserLogger = () => ({
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: () => {},
  trace: () => {},
  fatal: () => {},
  child: () => createBrowserLogger(),
});

// Server logger with environment-specific configuration
const createServerLogger = () => {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';

  // Base configuration with app metadata
  const baseConfig = {
    environment: process.env.NODE_ENV || 'unknown',
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
  };

  // Production: Simple JSON output for PM2/Loki/Grafana
  if (isProd) {
    return pino({
      level: process.env.LOG_LEVEL || 'info',
      base: baseConfig,
      // Clean JSON output - PM2 handles the rest
      formatters: {
        level: (label) => ({ level: label }),
      },
    });
  }

  // Development: Pretty output for terminal
  return pino({
    level: process.env.LOG_LEVEL || 'debug',
    base: baseConfig,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
        singleLine: false,
        messageFormat: '{msg}',
      },
    },
  });
};

// Export the appropriate logger
const logger =
  typeof window !== 'undefined' ? createBrowserLogger() : createServerLogger();

module.exports = { logger };
