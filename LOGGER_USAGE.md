# Logger Usage Guide

## Overview

This logger is designed to work seamlessly with PM2 in production and provide readable output in development.

- **Production**: Outputs structured JSON logs that PM2 can aggregate and ship to Loki/Grafana
- **Development**: Pretty-printed colored logs for easy terminal reading

## Basic Usage

```typescript
import { logger } from './lib/logger';

// Simple messages
logger.info('Server started');
logger.error('Database connection failed');
logger.warn('High memory usage detected');
logger.debug('Processing user request');

// With structured data (recommended for production)
logger.info({ userId: '123', action: 'login' }, 'User logged in');
logger.error({ error: err.message, stack: err.stack }, 'Payment processing failed');

// Child loggers with context
const requestLogger = logger.child({ requestId: req.id, path: req.path });
requestLogger.info('Request received');
requestLogger.debug({ body: req.body }, 'Request body');
```

## PM2 Integration

### Starting with PM2

```bash
# Start the application
npm run pm2:start

# View logs in real-time
npm run pm2:logs

# Monitor application
npm run pm2:monit
```

### Log Rotation with PM2

Install PM2 log rotation module:

```bash
pm2 install pm2-logrotate

# Configure rotation (optional)
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## Shipping Logs to Loki/Grafana

### Option 1: Promtail (Recommended)

Install and configure Promtail to tail PM2 logs:

```yaml
# promtail-config.yml
server:
  http_listen_port: 9080

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

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
            timestamp: time
      - labels:
          level:
```

### Option 2: PM2 Plus (Cloud Monitoring)

```bash
# Link PM2 to PM2 Plus
pm2 link <secret_key> <public_key>

# Your logs will be available in PM2 Plus dashboard
```

### Option 3: Custom Log Shipper

Use PM2's programmatic API to stream logs:

```javascript
const pm2 = require('pm2');

pm2.launchBus((err, bus) => {
  bus.on('log:out', (packet) => {
    // Send to your logging service
    const log = JSON.parse(packet.data);
    // ship to Loki/Grafana...
  });
});
```

## Environment Variables

Control logging behavior:

```bash
# Set log level (trace, debug, info, warn, error, fatal)
LOG_LEVEL=info npm run pm2:start

# Add app version to logs
NEXT_PUBLIC_APP_VERSION=1.2.3 npm run pm2:start
```

## Log Levels

- **trace**: Very detailed debugging (rarely used)
- **debug**: Detailed debugging information (dev default)
- **info**: General information messages (prod default)
- **warn**: Warning messages
- **error**: Error messages
- **fatal**: Critical errors that cause shutdown

## Production Log Format

In production, logs are output as JSON:

```json
{
  "level": "info",
  "time": 1698765432000,
  "environment": "production",
  "version": "1.2.3",
  "msg": "User logged in",
  "userId": "123",
  "action": "login"
}
```

This format is perfect for:
- Structured querying in Loki/Grafana
- Log aggregation
- Alerting rules
- Time-series analysis

## Development Log Format

In development, logs are pretty-printed:

```
2025-10-31 13:45:23 INFO: User logged in
    {
      "userId": "123",
      "action": "login"
    }
```

## Best Practices

1. **Always include context**: Use child loggers or structured data
2. **Log at appropriate levels**: Don't overuse error for warnings
3. **Avoid logging sensitive data**: Never log passwords, tokens, etc.
4. **Use structured data**: Makes logs searchable in Grafana
5. **Keep messages concise**: Details go in structured fields

```typescript
// ❌ Bad
logger.info(`User ${userId} performed ${action} at ${timestamp}`);

// ✅ Good
logger.info({ userId, action, timestamp }, 'User action performed');
```
