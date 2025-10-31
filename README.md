# Next.js Logger with PM2 Integration

A simplified, production-ready logger for Next.js applications that works seamlessly with PM2, Loki, and Grafana.

## Features

✅ **PM2-friendly** - Outputs structured JSON in production
✅ **Next.js compatible** - No worker thread issues with HMR
✅ **Development-friendly** - Pretty-printed colored logs
✅ **Loki/Grafana ready** - Structured logs for easy querying
✅ **TypeScript support** - Fully typed
✅ **Lightweight** - ~60 lines of code

## Quick Start

### Installation

```bash
npm install pino pino-pretty
```

### Usage

```typescript
import { logger } from './lib/logger';

// Simple logging
logger.info('Server started');
logger.error('Something went wrong');

// Structured logging (recommended)
logger.info(
  { userId: '123', action: 'login' },
  'User logged in'
);

// Error logging
try {
  await processPayment();
} catch (error) {
  logger.error(
    { err: error, orderId: 'order-456' },
    'Payment failed'
  );
}

// Child loggers with context
const requestLogger = logger.child({ requestId: req.id });
requestLogger.info('Processing request');
requestLogger.debug({ route: req.path }, 'Route details');
```

## Output Examples

### Development Mode

```
[2025-10-31 13:45:23] INFO: User logged in
    {
      "userId": "123",
      "action": "login"
    }
```

### Production Mode (PM2)

```json
{"level":"info","time":1730383245123,"environment":"production","version":"1.0.0","userId":"123","action":"login","msg":"User logged in"}
```

## PM2 Deployment

### Start with PM2

```bash
# Install PM2
npm install -g pm2

# Start the app
npm run pm2:start

# View logs
npm run pm2:logs

# Monitor
npm run pm2:monit
```

### PM2 Configuration

The included `ecosystem.config.js` provides:
- Cluster mode with auto-scaling
- Log rotation
- Graceful shutdown
- Auto-restart on crashes

## Loki/Grafana Integration

### Option 1: Promtail (Recommended)

Install Promtail to tail PM2 logs and ship to Loki:

```yaml
# promtail-config.yml
scrape_configs:
  - job_name: nextjs
    static_configs:
      - targets:
          - localhost
        labels:
          job: nextjs-app
          __path__: /path/to/logs/*.log
    pipeline_stages:
      - json:
          expressions:
            level: level
            msg: msg
      - labels:
          level:
```

Then query in Grafana:

```logql
# Find all user logins
{job="nextjs-app"} | json | action="login"

# Find errors
{job="nextjs-app"} | json | level="error"

# Count by user
sum by (userId) (count_over_time({job="nextjs-app"} [5m]))
```

### Option 2: PM2 Plus

```bash
pm2 link <secret_key> <public_key>
```

## Troubleshooting

### "Worker has exited" Error

If you see this error in Next.js development:

```
⨯ uncaughtException: Error: the worker has exited
```

**Solution:** The logger has been updated to avoid worker threads. Make sure you're using the latest version that uses `pretty()` as a destination stream, not `pino.transport()`.

See [NEXTJS_HMR_FIX.md](./NEXTJS_HMR_FIX.md) for details.

## Documentation

- **[LOGGER_USAGE.md](./LOGGER_USAGE.md)** - Complete usage guide and PM2 integration
- **[OBJECT_HANDLING.md](./OBJECT_HANDLING.md)** - How objects are logged with examples
- **[NEXTJS_HMR_FIX.md](./NEXTJS_HMR_FIX.md)** - Fix for "worker has exited" error
- **[examples/output-comparison.md](./examples/output-comparison.md)** - Output format comparison

## Demo

Run the included demo to see both development and production output:

```bash
npm run demo        # Run both modes
npm run demo:dev    # Development mode only
npm run demo:prod   # Production mode only
```

## Environment Variables

```bash
# Log level (trace, debug, info, warn, error, fatal)
LOG_LEVEL=info

# App version (included in logs)
NEXT_PUBLIC_APP_VERSION=1.2.3

# Environment
NODE_ENV=production
```

## Why This Logger?

### Compared to console.log

- ✅ Structured data for searching
- ✅ Log levels for filtering
- ✅ Automatic timestamps
- ✅ Child loggers for context
- ✅ JSON output for log aggregation

### Compared to Winston

- ✅ Faster (pino is 5x+ faster)
- ✅ Simpler API
- ✅ Better JSON handling
- ✅ Built for Node.js

### Compared to Complex Loggers

- ✅ No custom transports needed
- ✅ PM2 handles rotation/aggregation
- ✅ 60 lines vs 200+ lines
- ✅ Zero configuration

## Best Practices

1. **Always use structured data**
   ```typescript
   // ✅ Good
   logger.info({ userId, action }, 'User action');

   // ❌ Bad
   logger.info(`User ${userId} did ${action}`);
   ```

2. **Use child loggers for context**
   ```typescript
   const reqLogger = logger.child({ requestId: req.id });
   reqLogger.info('Processing');
   ```

3. **Log appropriate levels**
   - `debug` - Debugging information
   - `info` - Normal operations
   - `warn` - Potential issues
   - `error` - Actual errors
   - `fatal` - Critical errors

4. **Never log sensitive data**
   - No passwords
   - No tokens
   - No credit cards

## License

MIT

## Contributing

Issues and PRs welcome!
