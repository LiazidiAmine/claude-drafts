# Next.js HMR Fix: "Worker Has Exited" Error

## The Problem

When using the logger in Next.js development mode, you may encounter this error:

```
⨯ uncaughtException: Error: the worker has exited
    at ThreadStream.write (webpack-internal:///(rsc)/./node_modules/thread-stream/index.js:238:19)
    at Pino.write (webpack-internal:///(rsc)/./node_modules/pino/lib/proto.js:243:10)
```

## Why This Happens

The error occurs because:

1. **pino-pretty with `pino.transport()`** spawns worker threads for formatting
2. **Next.js Hot Module Replacement (HMR)** kills these threads during development reloads
3. The logger tries to write to dead worker threads → crash

This is a known issue with `pino.transport()` in Next.js development environments.

## The Solution

**Use pino-pretty as a destination stream instead of a transport.**

### ❌ Before (Causes Worker Errors)

```typescript
// DON'T: This uses worker threads
return pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',  // Creates worker threads
    options: { ... }
  }
});
```

### ✅ After (Next.js Compatible)

```typescript
import pino from 'pino';
import pretty from 'pino-pretty';

// DO: Use as a destination stream (no worker threads)
const prettyStream = pretty({
  colorize: true,
  translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
  ignore: 'pid,hostname',
});

return pino({ level: 'debug' }, prettyStream);
```

## Key Differences

| Approach | Worker Threads | Next.js Compatible | Performance |
|----------|---------------|-------------------|-------------|
| `pino.transport()` | Yes | ❌ No (HMR crashes) | Async |
| `pretty()` stream | No | ✅ Yes | Synchronous |
| Production JSON | No | ✅ Yes | Fast |

## Updated Logger

The logger has been fixed to use the stream approach in development:

```typescript
const createServerLogger = () => {
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    // Production: Raw JSON for PM2
    return pino({ level: 'info', ... });
  }

  // Development: Pretty stream (no worker threads)
  const prettyStream = pretty({
    colorize: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname',
    singleLine: false,
  });

  return pino({ level: 'debug', ... }, prettyStream);
};
```

## Testing the Fix

```bash
# Start your Next.js dev server
npm run dev

# The logger should now work without "worker has exited" errors
# Try making changes and hot-reloading - no crashes!
```

## Production Unaffected

Production mode already used raw JSON output (no pino-pretty at all), so:
- ✅ No worker threads in production
- ✅ Clean JSON for PM2/Loki/Grafana
- ✅ Maximum performance

## Alternative: JSON in Development

If you still have issues, you can disable pretty-printing entirely in development:

```typescript
const createServerLogger = () => {
  return pino({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    // No transport, no pretty - just JSON everywhere
  });
};
```

Then pipe the output through pino-pretty externally:

```bash
npm run dev | npx pino-pretty
```

## References

- [Pino Pretty Documentation](https://github.com/pinojs/pino-pretty)
- [Next.js + Pino Issues](https://github.com/pinojs/pino/issues?q=nextjs)
- [Thread Stream Issues](https://github.com/pinojs/thread-stream/issues)

## Summary

**The fix:** Use `pretty()` as a destination stream, not `pino.transport()`, to avoid worker thread issues in Next.js development mode. Production mode is unaffected and continues to output clean JSON for PM2.
