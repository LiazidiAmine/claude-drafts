import pino from 'pino';

/**
 * Next.js Logger with explicit TypeScript types
 *
 * This version has explicit type definitions to help TypeScript
 * understand that the logger supports object + message syntax.
 */

// Type definitions for better IDE autocomplete
type LogFn = {
  (msg: string): void;
  (obj: object, msg: string): void;
  (obj: object): void;
};

interface Logger {
  trace: LogFn;
  debug: LogFn;
  info: LogFn;
  warn: LogFn;
  error: LogFn;
  fatal: LogFn;
  child: (bindings: pino.Bindings) => Logger;
}

// Browser logger (no-op client-side)
const createBrowserLogger = (): Logger => ({
  trace: () => {},
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  fatal: () => {},
  child: () => createBrowserLogger(),
});

// Server logger - JSON output in all environments
const createServerLogger = (): Logger => {
  const isDev = process.env.NODE_ENV === 'development';

  const baseConfig = {
    environment: process.env.NODE_ENV || 'unknown',
    version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
  };

  const pinoLogger = pino({
    level: isDev ? (process.env.LOG_LEVEL || 'debug') : (process.env.LOG_LEVEL || 'info'),
    base: baseConfig,
    formatters: {
      level: (label) => ({ level: label }),
    },
  });

  // Return the Pino logger (which already has the correct types)
  // We just cast it to our Logger interface for clarity
  return pinoLogger as unknown as Logger;
};

// Export the appropriate logger
export const logger: Logger =
  typeof window !== 'undefined' ? createBrowserLogger() : createServerLogger();

// Export types for consumers
export type { Logger, LogFn };
