/**
 * Examples showing CORRECT vs INCORRECT syntax
 * Pino always expects: logger.level(OBJECT, MESSAGE)
 */

import { logger } from '../lib/logger';

// ============================================================================
// ❌ INCORRECT SYNTAX (Common mistake)
// ============================================================================

// ❌ DON'T DO THIS - Message before object
// logger.error('Configuration validation failed', {
//   errors: error.issues.map(err => ({
//     path: err.path.join('.'),
//     message: err.message,
//   })),
// });

// ❌ DON'T DO THIS - Multiple objects
// logger.info('User action', { userId: '123' }, { action: 'login' });

// ❌ DON'T DO THIS - Object after message
// logger.info('Order created', { orderId: '456' });

// ============================================================================
// ✅ CORRECT SYNTAX
// ============================================================================

// ✅ Validation error example
interface ValidationError {
  path: string;
  message: string;
  code: string;
  received: unknown;
}

const mockError = {
  issues: [
    {
      path: ['config', 'port'],
      message: 'Expected number, received string',
      code: 'invalid_type',
      input: 'abc',
    },
    {
      path: ['config', 'host'],
      message: 'Required',
      code: 'required',
      input: undefined,
    },
  ],
};

// ✅ CORRECT: Object first, message second
logger.error(
  {
    errors: mockError.issues.map((err) => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
      received: err.input,
    })),
  },
  'Configuration validation failed'
);

// ============================================================================
// More Correct Examples
// ============================================================================

// ✅ API error
logger.error(
  {
    statusCode: 500,
    path: '/api/users',
    method: 'POST',
    error: 'Database connection failed',
  },
  'API request failed'
);

// ✅ User action
logger.info(
  {
    userId: '123',
    action: 'login',
    ip: '1.2.3.4',
    timestamp: Date.now(),
  },
  'User logged in'
);

// ✅ Database query
logger.debug(
  {
    query: 'SELECT * FROM users WHERE id = $1',
    params: ['123'],
    duration: 23,
  },
  'Database query executed'
);

// ✅ Payment processing
logger.info(
  {
    orderId: 'order-456',
    userId: '789',
    amount: 99.99,
    currency: 'USD',
    status: 'completed',
  },
  'Payment processed successfully'
);

// ============================================================================
// Child Logger Examples
// ============================================================================

const requestLogger = logger.child({
  requestId: 'req-abc-123',
  userId: '789',
});

// ✅ Child logger also: OBJECT first, MESSAGE second
requestLogger.info(
  {
    route: '/api/orders',
    method: 'POST',
    duration: 145,
  },
  'Request completed'
);

// ============================================================================
// Quick Reference
// ============================================================================

/*
 * PINO SYNTAX RULE:
 *
 * ✅ logger.level(OBJECT, MESSAGE)
 * ✅ logger.level(MESSAGE)
 * ✅ logger.level(OBJECT)
 *
 * ❌ logger.level(MESSAGE, OBJECT)  ← Common mistake!
 *
 * Remember: OBJECT FIRST, MESSAGE SECOND!
 */

// ============================================================================
// Real-world Validation Error Example
// ============================================================================

// Simulate a Zod validation error
class ZodError extends Error {
  issues: Array<{
    path: string[];
    message: string;
    code: string;
    input?: unknown;
  }>;

  constructor() {
    super('Validation failed');
    this.name = 'ZodError';
    this.issues = [
      {
        path: ['email'],
        message: 'Invalid email format',
        code: 'invalid_string',
        input: 'not-an-email',
      },
      {
        path: ['age'],
        message: 'Number must be greater than 0',
        code: 'too_small',
        input: -5,
      },
    ];
  }
}

// ✅ CORRECT way to log Zod validation errors
try {
  throw new ZodError();
} catch (error) {
  if (error instanceof ZodError) {
    logger.error(
      {
        validationErrors: error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
          receivedValue: issue.input,
        })),
        errorType: 'validation_error',
      },
      'Configuration validation failed'
    );
  }
}

// ✅ More concise version
try {
  throw new ZodError();
} catch (error) {
  if (error instanceof ZodError) {
    logger.error(
      {
        err: error, // Pino auto-serializes errors
        issueCount: error.issues.length,
        fields: error.issues.map((i) => i.path.join('.')),
      },
      'Validation failed'
    );
  }
}

export {};
