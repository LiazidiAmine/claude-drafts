/**
 * Examples showing that the logger DOES support object + message syntax
 * This file demonstrates all valid Pino syntax patterns
 */

import { logger } from '../lib/logger';

// ============================================================================
// BASIC SYNTAX - All of these work!
// ============================================================================

// ✅ 1. Object + Message (RECOMMENDED - this works!)
logger.info({ userId: '123', action: 'login' }, 'User logged in');

// ✅ 2. Just message
logger.info('Simple message');

// ✅ 3. Just object
logger.info({ event: 'healthcheck', status: 'ok' });

// ============================================================================
// REAL-WORLD EXAMPLES
// ============================================================================

// ✅ API Request logging
logger.info(
  {
    method: 'POST',
    path: '/api/users',
    statusCode: 200,
    duration: 145,
  },
  'API request completed'
);

// ✅ Error logging with context
try {
  throw new Error('Database connection failed');
} catch (error) {
  logger.error(
    {
      err: error,
      database: 'postgres',
      host: 'localhost',
      retries: 3,
    },
    'Failed to connect to database'
  );
}

// ✅ User action logging
logger.info(
  {
    userId: '123',
    action: 'purchase',
    amount: 99.99,
    currency: 'USD',
    items: ['product-1', 'product-2'],
  },
  'User completed purchase'
);

// ✅ Nested objects
logger.info(
  {
    user: {
      id: '456',
      email: 'user@example.com',
      role: 'admin',
    },
    session: {
      id: 'sess-789',
      ip: '1.2.3.4',
      userAgent: 'Mozilla/5.0',
    },
  },
  'User session created'
);

// ============================================================================
// CHILD LOGGER EXAMPLES
// ============================================================================

// ✅ Create child logger with context
const requestLogger = logger.child({
  requestId: 'req-abc-123',
  userId: '789',
});

// ✅ Child logger also supports object + message
requestLogger.info({ route: '/api/orders', method: 'GET' }, 'Processing request');
requestLogger.info({ duration: 250, statusCode: 200 }, 'Request completed');

// ✅ Nested child loggers
const dbLogger = requestLogger.child({ component: 'database' });
dbLogger.debug({ query: 'SELECT * FROM users', duration: 23 }, 'Query executed');

// ============================================================================
// ALL LOG LEVELS
// ============================================================================

logger.trace({ level: 'trace' }, 'Trace message');
logger.debug({ level: 'debug' }, 'Debug message');
logger.info({ level: 'info' }, 'Info message');
logger.warn({ level: 'warn' }, 'Warn message');
logger.error({ level: 'error' }, 'Error message');
logger.fatal({ level: 'fatal' }, 'Fatal message');

// ============================================================================
// TYPESCRIPT EXAMPLES - Type-safe usage
// ============================================================================

interface UserAction {
  userId: string;
  action: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

const action: UserAction = {
  userId: '123',
  action: 'login',
  timestamp: Date.now(),
  metadata: {
    ip: '1.2.3.4',
    browser: 'Chrome',
  },
};

// ✅ TypeScript: Object + Message
logger.info(action, 'User action logged');

// ✅ TypeScript: Type-safe error logging
interface ErrorContext {
  err: Error;
  userId?: string;
  requestId?: string;
}

function logError(error: Error, userId?: string) {
  const context: ErrorContext = {
    err: error,
    userId,
    requestId: 'req-123',
  };

  logger.error(context, 'Operation failed');
}

// ============================================================================
// COMMON PATTERNS
// ============================================================================

// ✅ Function wrapper pattern
function logApiCall(method: string, path: string, duration: number, statusCode: number) {
  logger.info(
    {
      method,
      path,
      duration,
      statusCode,
      type: 'api_call',
    },
    `${method} ${path} ${statusCode} ${duration}ms`
  );
}

logApiCall('POST', '/api/users', 145, 201);

// ✅ Conditional logging
const isError = true;
if (isError) {
  logger.error({ code: 'ERR_001', severity: 'high' }, 'Critical error occurred');
}

// ✅ Dynamic object construction
const logData = {
  userId: '123',
  ...(process.env.NODE_ENV === 'development' && { debug: true }),
};

logger.info(logData, 'Dynamic log data');

// ============================================================================
// SUMMARY
// ============================================================================

/*
 * ALL OF THESE SYNTAXES WORK! ✅
 *
 * 1. logger.info({ data }, 'message')  ← RECOMMENDED
 * 2. logger.info('message')
 * 3. logger.info({ data })
 *
 * The logger is a standard Pino instance, so it supports ALL Pino syntax.
 *
 * If you're getting TypeScript errors, make sure you're using:
 *   import { logger } from './lib/logger';
 *
 * And NOT trying to call it with more than 2 arguments.
 */

export { logger };
