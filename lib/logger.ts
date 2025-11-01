import pino from 'pino';

/**
 * Next.js Logger with PM2-friendly output
 *
 * Production (PM2): Outputs structured JSON logs for Loki/Grafana
 * Development: JSON output (pipe through pino-pretty if needed)
 *
 * IMPORTANT: This logger outputs JSON in both dev and prod.
 * For pretty logs in development, pipe the output:
 *   npm run dev | npx pino-pretty
 *
 * Why JSON in dev too?
 * - Avoids Next.js webpack bundling issues (pino-pretty has Node.js deps)
 * - Prevents "worker_threads" errors on client-side
 * - Simple, reliable, no bundling complexity
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
export const logger =
  typeof window !== 'undefined' ? createBrowserLogger() : createServerLogger();

