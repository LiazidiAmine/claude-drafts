# Pino Argument Order: Object First, Message Second

## The Rule

```typescript
// ✅ CORRECT: Object first, message second
logger.info({ data }, 'message');

// ❌ WRONG: Message first, object second
logger.info('message', { data });
```

---

## Why This Matters

Pino's signature is:

```typescript
logger.info(obj: object, msg?: string): void
logger.info(msg: string): void
```

So:
- **First argument** = Object with structured data (optional)
- **Second argument** = Human-readable message (optional)

But NOT the other way around!

---

## Your Specific Case

### ❌ What you wrote (doesn't work):

```typescript
log.error('Configuration validation failed', {
  errors: error.issues.map(err => ({
    path: err.path.join('.'),
    message: err.message,
    code: err.code,
    received: err.input,
  })),
});
```

**Problem:** Message is first argument, object is second. Pino will ignore the object!

### ✅ Correct version:

```typescript
logger.error(
  {
    errors: error.issues.map(err => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
      received: err.input,
    })),
  },
  'Configuration validation failed'
);
```

**Result:** Both the object and message are logged correctly!

---

## Visual Comparison

### ❌ Wrong Order

```typescript
logger.error('Payment failed', { orderId: '123', userId: '456' });
         //  ^^^^^^^^^^^^        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
         //  Argument 1          Argument 2 (IGNORED!)
```

**Output:**
```json
{
  "level": "error",
  "msg": "Payment failed"
  // ❌ orderId and userId are NOT in the output!
}
```

### ✅ Correct Order

```typescript
logger.error({ orderId: '123', userId: '456' }, 'Payment failed');
         //  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^        ^^^^^^^^^^^^
         //  Argument 1                          Argument 2
```

**Output:**
```json
{
  "level": "error",
  "orderId": "123",
  "userId": "456",
  "msg": "Payment failed"
  // ✅ All data is in the output!
}
```

---

## Common Patterns (Corrected)

### Validation Errors (Zod, Yup, etc.)

```typescript
// ❌ Wrong
logger.error('Validation failed', {
  errors: validationErrors,
  field: 'email',
});

// ✅ Correct
logger.error(
  {
    errors: validationErrors,
    field: 'email',
  },
  'Validation failed'
);
```

### API Errors

```typescript
// ❌ Wrong
logger.error('API request failed', {
  statusCode: 500,
  path: '/api/users',
});

// ✅ Correct
logger.error(
  {
    statusCode: 500,
    path: '/api/users',
  },
  'API request failed'
);
```

### Database Errors

```typescript
// ❌ Wrong
logger.error('Database query failed', {
  query: 'SELECT ...',
  error: err.message,
});

// ✅ Correct
logger.error(
  {
    query: 'SELECT ...',
    err: err,  // Pino auto-serializes errors
  },
  'Database query failed'
);
```

### User Actions

```typescript
// ❌ Wrong
logger.info('User logged in', {
  userId: user.id,
  email: user.email,
});

// ✅ Correct
logger.info(
  {
    userId: user.id,
    email: user.email,
  },
  'User logged in'
);
```

---

## Migration Guide

If you have existing code with wrong argument order, here's how to fix it:

### Find and Replace Pattern

**Search for:**
```
logger\.(info|error|warn|debug)\('([^']+)',\s*\{
```

**Replace with:**
```
logger.$1({
```

Then manually move the message string to the second argument.

### Example Migration

**Before:**
```typescript
logger.error('Operation failed', { userId, operation });
logger.info('Request processed', { requestId, duration });
logger.warn('High memory usage', { memory, threshold });
```

**After:**
```typescript
logger.error({ userId, operation }, 'Operation failed');
logger.info({ requestId, duration }, 'Request processed');
logger.warn({ memory, threshold }, 'High memory usage');
```

---

## Why This Order?

Pino's design philosophy:

1. **Structured data first** - This is what gets indexed and searched in Loki/Grafana
2. **Message second** - This is for human readability

The structured data (object) is more important for log aggregation and querying, so it comes first.

---

## Alternative Syntaxes

If you only need one or the other:

### Just Message (No Structured Data)

```typescript
logger.info('Server started on port 3000');
```

**Use when:** Simple logging with no context to add.

### Just Object (No Message)

```typescript
logger.info({ event: 'healthcheck', status: 'ok' });
```

**Use when:** Logging structured events where the data speaks for itself.

---

## TypeScript Help

If TypeScript is not catching this error, you can use explicit types:

```typescript
// lib/logger-typed.ts has explicit type signatures
import { logger } from './lib/logger-typed';

// Now TypeScript will error on wrong order
logger.info('message', { data });  // ❌ TypeScript error!
logger.info({ data }, 'message');  // ✅ TypeScript happy!
```

---

## Quick Reference Card

```typescript
// ═══════════════════════════════════════════════════════════
//  PINO LOGGER SYNTAX
// ═══════════════════════════════════════════════════════════

// ✅ Correct (object first, message second)
logger.info({ data }, 'message')

// ✅ Correct (just message)
logger.info('message')

// ✅ Correct (just object)
logger.info({ data })

// ❌ Wrong (message first, object second)
logger.info('message', { data })

// ❌ Wrong (too many arguments)
logger.info({ data }, 'message', extra)

// ═══════════════════════════════════════════════════════════
//  REMEMBER: OBJECT FIRST, MESSAGE SECOND!
// ═══════════════════════════════════════════════════════════
```

---

## Testing

Run this to verify the correct syntax:

```typescript
import { logger } from './lib/logger';

// This will output BOTH the object and message
logger.info(
  { userId: '123', test: true },
  'Testing correct syntax'
);

// Check the output - you should see:
// {
//   "level": "info",
//   "userId": "123",
//   "test": true,
//   "msg": "Testing correct syntax"
// }
```

If you don't see `userId` and `test` in the output, your arguments are in the wrong order!

---

## Summary

| Your Code | Issue | Fix |
|-----------|-------|-----|
| `logger.error('msg', {obj})` | ❌ Wrong order | `logger.error({obj}, 'msg')` |
| `logger.info('msg', {obj})` | ❌ Wrong order | `logger.info({obj}, 'msg')` |
| `logger.warn('msg', {obj})` | ❌ Wrong order | `logger.warn({obj}, 'msg')` |
| `logger.debug('msg', {obj})` | ❌ Wrong order | `logger.debug({obj}, 'msg')` |

**The fix is always the same: Swap the arguments!**

---

## Still Confused?

Think of it like this:

```typescript
// Pino signature:
function log(data?: object, description?: string) {
  // ...
}

// So you call it like:
log({ userId: '123' }, 'User logged in');
//  ^^^^^^^^^^^^^^^^    ^^^^^^^^^^^^^^^
//  data                description
```

NOT:

```typescript
log('User logged in', { userId: '123' });
//  ^^^^^^^^^^^^^^^    ^^^^^^^^^^^^^^^^
//  This is the description, not the data!
//  Pino will treat this as a simple string log
```

---

## Real Example From Your Code

**Your code (❌ wrong):**
```typescript
log.error('Configuration validation failed', {
  errors: error.issues.map(err => ({
    path: err.path.join('.'),
    message: err.message,
    code: err.code,
    received: err.input,
  })),
});
```

**Fixed (✅ correct):**
```typescript
logger.error(
  {
    errors: error.issues.map(err => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
      received: err.input,
    })),
  },
  'Configuration validation failed'
);
```

**What changes:**
1. Object moves from 2nd argument to 1st argument
2. Message moves from 1st argument to 2nd argument
3. That's it!

Now the output will include all your error details in the JSON log. 🎉
