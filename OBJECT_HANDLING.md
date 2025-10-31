# How the Logger Handles Objects

## TL;DR

**Pino's standard syntax:**
```javascript
logger.info(objectWithData, messageString)
```

- The **object** contains structured data (merged into the log entry)
- The **message** is the human-readable description

---

## Examples with Output

### Example 1: Object + Message

**Code:**
```javascript
logger.info(
  { userId: '123', action: 'login' },
  'User logged in'
);
```

**Production Output (JSON, one line):**
```json
{"level":"info","time":1730383245123,"environment":"production","version":"1.0.0","userId":"123","action":"login","msg":"User logged in"}
```

**Development Output (pretty-printed):**
```
[2025-10-31 13:45:23] INFO: User logged in
    {
      "userId": "123",
      "action": "login"
    }
```

---

### Example 2: Complex Nested Object

**Code:**
```javascript
logger.info(
  {
    user: { id: '456', name: 'John Doe' },
    order: {
      id: 'order-789',
      items: ['product-1', 'product-2'],
      total: 99.99
    },
    metadata: { ip: '1.2.3.4', userAgent: 'Mozilla/5.0' }
  },
  'Order completed'
);
```

**Production Output:**
```json
{"level":"info","time":1730383245456,"environment":"production","version":"1.0.0","user":{"id":"456","name":"John Doe"},"order":{"id":"order-789","items":["product-1","product-2"],"total":99.99},"metadata":{"ip":"1.2.3.4","userAgent":"Mozilla/5.0"},"msg":"Order completed"}
```

**Development Output:**
```
[2025-10-31 13:45:23] INFO: Order completed
    {
      "user": {
        "id": "456",
        "name": "John Doe"
      },
      "order": {
        "id": "order-789",
        "items": [
          "product-1",
          "product-2"
        ],
        "total": 99.99
      },
      "metadata": {
        "ip": "1.2.3.4",
        "userAgent": "Mozilla/5.0"
      }
    }
```

---

### Example 3: Error Object

**Code:**
```javascript
try {
  await processPayment(order);
} catch (error) {
  logger.error(
    {
      err: error,  // Pino auto-serializes errors
      orderId: 'order-456',
      userId: '123'
    },
    'Payment processing failed'
  );
}
```

**Production Output:**
```json
{"level":"error","time":1730383245789,"environment":"production","version":"1.0.0","err":{"type":"Error","message":"Insufficient funds","stack":"Error: Insufficient funds\n    at processPayment (/app/payment.js:45:11)"},"orderId":"order-456","userId":"123","msg":"Payment processing failed"}
```

**Development Output:**
```
[2025-10-31 13:45:23] ERROR: Payment processing failed
    {
      "err": {
        "type": "Error",
        "message": "Insufficient funds",
        "stack": "Error: Insufficient funds\n    at processPayment (/app/payment.js:45:11)"
      },
      "orderId": "order-456",
      "userId": "123"
    }
```

---

### Example 4: Just an Object (No Message)

**Code:**
```javascript
logger.info({ event: 'healthcheck', status: 'ok', uptime: 12345 });
```

**Production Output:**
```json
{"level":"info","time":1730383246123,"environment":"production","version":"1.0.0","event":"healthcheck","status":"ok","uptime":12345}
```

**Development Output:**
```
[2025-10-31 13:45:24] INFO:
    {
      "event": "healthcheck",
      "status": "ok",
      "uptime": 12345
    }
```

---

### Example 5: Child Logger (Context Inheritance)

**Code:**
```javascript
// Create child logger with persistent context
const requestLogger = logger.child({
  requestId: 'req-abc-123',
  userId: '789'
});

// All logs from this child include the context
requestLogger.info({ route: '/api/orders', method: 'GET' }, 'API call started');
requestLogger.info({ duration: 145, statusCode: 200 }, 'API call completed');

// Nested child loggers
const dbLogger = requestLogger.child({ database: 'postgres' });
dbLogger.debug({ query: 'SELECT * FROM orders', duration: 23 }, 'Query executed');
```

**Production Output:**
```json
{"level":"info","time":1730383246456,"environment":"production","version":"1.0.0","requestId":"req-abc-123","userId":"789","route":"/api/orders","method":"GET","msg":"API call started"}
{"level":"info","time":1730383246601,"environment":"production","version":"1.0.0","requestId":"req-abc-123","userId":"789","duration":145,"statusCode":200,"msg":"API call completed"}
{"level":"debug","time":1730383246624,"environment":"production","version":"1.0.0","requestId":"req-abc-123","userId":"789","database":"postgres","query":"SELECT * FROM orders","duration":23,"msg":"Query executed"}
```

**Development Output:**
```
[2025-10-31 13:45:24] INFO: API call started
    {
      "requestId": "req-abc-123",
      "userId": "789",
      "route": "/api/orders",
      "method": "GET"
    }

[2025-10-31 13:45:24] INFO: API call completed
    {
      "requestId": "req-abc-123",
      "userId": "789",
      "duration": 145,
      "statusCode": 200
    }

[2025-10-31 13:45:24] DEBUG: Query executed
    {
      "requestId": "req-abc-123",
      "userId": "789",
      "database": "postgres",
      "query": "SELECT * FROM orders",
      "duration": 23
    }
```

**Notice:** The context (`requestId`, `userId`) is **automatically included** in all child logs!

---

## Key Behaviors

### 1. Object Merging
All properties from the object are merged into the log entry at the root level:

```javascript
logger.info({ a: 1, b: 2 }, 'Test');
// Produces: { level: "info", time: ..., a: 1, b: 2, msg: "Test" }
```

### 2. Error Serialization
Pino automatically serializes Error objects with stack traces:

```javascript
logger.error({ err: new Error('Oops') }, 'Failed');
// The error is serialized with type, message, and stack
```

### 3. Child Context Accumulation
Child loggers inherit and accumulate context:

```javascript
const logger1 = logger.child({ a: 1 });
const logger2 = logger1.child({ b: 2 });
logger2.info('Test');
// Produces: { level: "info", time: ..., a: 1, b: 2, msg: "Test" }
```

### 4. Performance
In production, there's **zero overhead** for log formatting:
- No colors
- No pretty-printing
- Just fast JSON serialization
- PM2 handles everything else

---

## Production Benefits (PM2 + Loki/Grafana)

### Searchability
Every field in the object becomes searchable:

```logql
# Find all orders by user 123
{job="nextjs-app"} | json | userId="123" and msg=~"Order.*"

# Find slow API calls (>1000ms)
{job="nextjs-app"} | json | duration > 1000

# Count errors by type
sum by (err_type) (count_over_time({job="nextjs-app"} | json | level="error" [1h]))
```

### Filtering
Filter logs by any structured field:
- User ID
- Request ID
- Error type
- Status code
- Duration
- etc.

### Alerting
Set up alerts based on structured data:
```yaml
# Alert on payment failures
- alert: HighPaymentFailureRate
  expr: |
    sum(rate({job="nextjs-app"} | json | msg=~"Payment.*failed" [5m])) > 0.1
```

---

## Run the Demo

To see the actual output in both modes:

```bash
# Run the demonstration
./run-demo.sh

# Or manually test:
NODE_ENV=production node examples/object-logging-demo.js
NODE_ENV=development node examples/object-logging-demo.js
```

---

## Best Practices

### ✅ DO: Use structured objects

```javascript
logger.info(
  { userId, action, timestamp, metadata },
  'User action performed'
);
```

### ❌ DON'T: Use string interpolation

```javascript
// Bad - not searchable, not structured
logger.info(`User ${userId} performed ${action} at ${timestamp}`);
```

### ✅ DO: Use child loggers for context

```javascript
const reqLogger = logger.child({ requestId, userId });
reqLogger.info('Processing request');
reqLogger.error('Request failed');
// Both logs include requestId and userId automatically
```

### ❌ DON'T: Repeat context in every log

```javascript
// Bad - repetitive
logger.info({ requestId, userId }, 'Processing request');
logger.error({ requestId, userId }, 'Request failed');
```

### ✅ DO: Use appropriate log levels

```javascript
logger.info({ userId }, 'User logged in');      // Normal operation
logger.warn({ memory: '450MB' }, 'High memory'); // Potential issue
logger.error({ err }, 'Payment failed');         // Actual error
logger.debug({ query }, 'DB query');             // Debugging info
```

---

## Summary

| Aspect | Production | Development |
|--------|-----------|-------------|
| **Format** | Single-line JSON | Pretty-printed multi-line |
| **Object handling** | Merged at root level | Indented JSON display |
| **Colors** | None | Yes (by level) |
| **Timestamp** | Unix milliseconds | Human-readable |
| **Performance** | Fast (no formatting) | Slower (formatting overhead) |
| **Use case** | PM2/Loki/Grafana | Terminal debugging |
| **Searchable** | Yes (all fields) | Visual only |

**Bottom line:** In production, all your object properties become searchable fields in Loki/Grafana. In development, they're displayed in an easy-to-read format. Best of both worlds! 🎉
