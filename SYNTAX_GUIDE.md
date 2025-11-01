# Logger Syntax Guide

## TL;DR - Object + Message Syntax WORKS! ✅

```typescript
import { logger } from './lib/logger';

// ✅ This DOES work! (Recommended syntax)
logger.info({ userId: '123', action: 'login' }, 'User logged in');
```

The logger is a standard **Pino instance**, so it supports ALL Pino syntax patterns.

---

## All Supported Syntaxes

### 1. Object + Message (Recommended) ⭐

```typescript
logger.info({ userId: '123', action: 'login' }, 'User logged in');
```

**Output (JSON):**
```json
{
  "level": "info",
  "time": 1730383215000,
  "userId": "123",
  "action": "login",
  "msg": "User logged in"
}
```

**Why recommended:**
- Structured data for searching in Loki/Grafana
- Human-readable message for quick scanning
- Best of both worlds!

---

### 2. Just Message

```typescript
logger.info('Server started on port 3000');
```

**Output (JSON):**
```json
{
  "level": "info",
  "time": 1730383215000,
  "msg": "Server started on port 3000"
}
```

**Use when:** Simple logging with no additional context.

---

### 3. Just Object

```typescript
logger.info({ event: 'healthcheck', status: 'ok', uptime: 12345 });
```

**Output (JSON):**
```json
{
  "level": "info",
  "time": 1730383215000,
  "event": "healthcheck",
  "status": "ok",
  "uptime": 12345
}
```

**Use when:** Logging structured events without a message.

---

## Real-World Examples

### API Request Logging

```typescript
logger.info(
  {
    method: req.method,
    path: req.path,
    statusCode: res.statusCode,
    duration: Date.now() - startTime,
    userId: req.user?.id,
  },
  'API request completed'
);
```

### Error Logging

```typescript
try {
  await processPayment(order);
} catch (error) {
  logger.error(
    {
      err: error,              // Pino auto-serializes errors
      orderId: order.id,
      userId: user.id,
      amount: order.total,
    },
    'Payment processing failed'
  );
}
```

### User Actions

```typescript
logger.info(
  {
    userId: user.id,
    action: 'purchase',
    productId: product.id,
    amount: 99.99,
    currency: 'USD',
  },
  'User completed purchase'
);
```

### Nested Objects

```typescript
logger.info(
  {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    session: {
      id: session.id,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    },
  },
  'User session created'
);
```

---

## Child Logger Syntax

Child loggers also support ALL the same syntaxes:

```typescript
// Create child logger with context
const requestLogger = logger.child({
  requestId: req.id,
  userId: req.user?.id,
});

// All these work:
requestLogger.info('Processing request');
requestLogger.info({ route: req.route }, 'Route matched');
requestLogger.info({ duration: 145 }, 'Request completed');  // ✅ Works!
```

**Output includes parent context:**
```json
{
  "level": "info",
  "time": 1730383215000,
  "requestId": "req-123",
  "userId": "789",
  "duration": 145,
  "msg": "Request completed"
}
```

---

## All Log Levels

Every log level supports the same syntax:

```typescript
// Object + Message
logger.trace({ level: 'trace' }, 'Trace message');
logger.debug({ level: 'debug' }, 'Debug message');
logger.info({ level: 'info' }, 'Info message');
logger.warn({ level: 'warn' }, 'Warning message');
logger.error({ level: 'error' }, 'Error message');
logger.fatal({ level: 'fatal' }, 'Fatal message');

// Just message
logger.info('Simple info');
logger.error('Simple error');

// Just object
logger.info({ event: 'test' });
logger.error({ code: 'ERR_001' });
```

---

## TypeScript Support

The logger has full TypeScript support:

```typescript
import { logger } from './lib/logger';

// ✅ All these are type-safe
logger.info('message');
logger.info({ data: 'value' });
logger.info({ data: 'value' }, 'message');

// ✅ TypeScript infers types
interface UserAction {
  userId: string;
  action: string;
  timestamp: number;
}

const action: UserAction = {
  userId: '123',
  action: 'login',
  timestamp: Date.now(),
};

logger.info(action, 'User action logged');  // ✅ Type-safe
```

### If you want explicit types:

Use `lib/logger-typed.ts` instead, which has explicit type definitions:

```typescript
import { logger, type Logger, type LogFn } from './lib/logger-typed';

// Now TypeScript has explicit signatures
logger.info({ data }, 'message');  // ✅ Fully typed
```

---

## Common Patterns

### Wrapper Functions

```typescript
function logApiCall(
  method: string,
  path: string,
  statusCode: number,
  duration: number
) {
  logger.info(
    {
      method,
      path,
      statusCode,
      duration,
      type: 'api_call',
    },
    `${method} ${path} - ${statusCode} (${duration}ms)`
  );
}

logApiCall('POST', '/api/users', 201, 145);
```

### Conditional Fields

```typescript
logger.info(
  {
    userId: user.id,
    action: 'login',
    // Only include in development
    ...(process.env.NODE_ENV === 'development' && {
      debug: true,
      stack: new Error().stack,
    }),
  },
  'User logged in'
);
```

### Error Context

```typescript
function logErrorWithContext(
  error: Error,
  context: Record<string, unknown>
) {
  logger.error(
    {
      err: error,
      ...context,
    },
    error.message
  );
}

logErrorWithContext(new Error('Database timeout'), {
  database: 'postgres',
  query: 'SELECT ...',
  retries: 3,
});
```

---

## What DOESN'T Work

### ❌ More than 2 arguments

```typescript
// ❌ This doesn't work (Pino doesn't support this)
logger.info('message', { data }, 'another message');

// ✅ Do this instead
logger.info({ data }, 'message');
```

### ❌ Message before object

```typescript
// ❌ This doesn't work (arguments in wrong order)
logger.info('message', { data });

// ✅ Do this instead
logger.info({ data }, 'message');
```

---

## Debugging TypeScript Issues

If TypeScript complains about the syntax:

### 1. Check your import

```typescript
// ✅ Correct
import { logger } from './lib/logger';

// ❌ Wrong
import logger from './lib/logger';  // No default export!
```

### 2. Check Pino version

```bash
npm list pino
# Should be ^8.16.0 or higher
```

### 3. Check TypeScript version

```bash
npx tsc --version
# Should be ^5.0.0 or higher
```

### 4. Try explicit types

Use `lib/logger-typed.ts` for explicit type definitions:

```typescript
import { logger } from './lib/logger-typed';

// Now TypeScript understands all syntaxes
logger.info({ data }, 'message');
```

### 5. Check tsconfig.json

Make sure you have:

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

---

## Testing the Syntax

Run the included test to verify all syntaxes work:

```bash
# Test all syntax patterns
node test/test-object-message-syntax.js

# See TypeScript examples
cat test/syntax-examples.ts
```

---

## Summary

| Syntax | Works? | Use Case |
|--------|--------|----------|
| `logger.info({ data }, 'msg')` | ✅ Yes | **Recommended** - Structured data + readable message |
| `logger.info('msg')` | ✅ Yes | Simple logging |
| `logger.info({ data })` | ✅ Yes | Structured events |
| `logger.info('msg', { data })` | ❌ No | Wrong argument order |
| `logger.info({ data }, 'msg', extra)` | ❌ No | Too many arguments |

**The logger DOES support object + message syntax!** ✅

It's a standard Pino instance, so it supports ALL Pino syntax patterns out of the box.

---

## Need Help?

If you're still having issues:

1. Check [Pino documentation](https://getpino.io/#/docs/api?id=logger)
2. See `test/syntax-examples.ts` for working examples
3. Try `lib/logger-typed.ts` for explicit TypeScript types
4. Make sure you're using the correct import

**Example that definitely works:**

```typescript
import { logger } from './lib/logger';

logger.info(
  { userId: '123', action: 'test' },
  'This works!'
);
```

If this doesn't work, please share:
- Your TypeScript version
- Your exact code
- The error message you're getting
