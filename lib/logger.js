/**
 * Next.js Logger with PM2-friendly output
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

// Server logger - JSON output in all environments
const createServerLogger = () => {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';

  // Base configuration with app metadata
  const baseConfig = {
    environment: process.env.NODE_ENV || 'unknown',
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
  };

  return pino({
    level: isDev ? (process.env.LOG_LEVEL || 'debug') : (process.env.LOG_LEVEL || 'info'),
    base: baseConfig,
    formatters: {
      level: (label) => ({ level: label }),
    },
  });
};

// Export the appropriate logger
const logger =
  typeof window !== 'undefined' ? createBrowserLogger() : createServerLogger();

module.exports = { logger };
