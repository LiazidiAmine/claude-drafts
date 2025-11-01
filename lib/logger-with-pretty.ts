import pino from 'pino';
// Only import pino-pretty on the server, never on the client
// This is safe because we check typeof window first
let pretty: any = null;
if (typeof window === 'undefined') {
  // Dynamic import to avoid webpack bundling issues
  try {
    pretty = require('pino-pretty');
  } catch (e) {
    // pino-pretty not installed, fall back to JSON
    console.warn('pino-pretty not found, using JSON output in development');
  }
}

/**
 * Next.js Logger with PM2-friendly output (Alternative with pino-pretty)
 *
 * Production (PM2): Outputs structured JSON logs for Loki/Grafana
 * Development: Pretty-printed logs if pino-pretty is installed
 *
 * This version uses conditional imports to avoid webpack bundling issues.
 * If pino-pretty fails to load, it falls back to JSON output.
 */

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
      formatters: {
        level: (label) => ({ level: label }),
      },
    });
  }

  // Development: Try to use pino-pretty if available
  if (pretty) {
    try {
      const prettyStream = pretty({
        colorize: true,
        translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname',
        singleLine: false,
        messageFormat: '{msg}',
      });

      return pino(
        {
          level: process.env.LOG_LEVEL || 'debug',
          base: baseConfig,
        },
        prettyStream
      );
    } catch (e) {
      console.warn('Failed to initialize pino-pretty, falling back to JSON');
    }
  }

  // Fallback to JSON output
  return pino({
    level: process.env.LOG_LEVEL || 'debug',
    base: baseConfig,
    formatters: {
      level: (label) => ({ level: label }),
    },
  });
};

// Export the appropriate logger
export const logger =
  typeof window !== 'undefined' ? createBrowserLogger() : createServerLogger();
