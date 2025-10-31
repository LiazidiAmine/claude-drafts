# Logger Output Comparison

## Example Code

```javascript
logger.info(
  {
    userId: '123',
    action: 'purchase',
    amount: 99.99,
    currency: 'USD',
    items: ['product-1', 'product-2']
  },
  'User completed purchase'
);
```

---

## Production Output (NODE_ENV=production)

**Single line JSON - perfect for PM2/Loki/Grafana:**

```json
{"level":"info","time":1730383245123,"environment":"production","version":"1.0.0","userId":"123","action":"purchase","amount":99.99,"currency":"USD","items":["product-1","product-2"],"msg":"User completed purchase"}
```

### Why this is great for production:

✅ **Structured & Searchable**: Every field is a JSON key
✅ **Parseable**: Easy to ingest into Loki/Grafana
✅ **Filterable**: Can query by any field (userId, action, etc.)
✅ **Compact**: Single line per log entry
✅ **Machine-friendly**: No colors, no formatting overhead

### Example Loki Queries:

```logql
# Find all purchases by user 123
{job="nextjs-app"} | json | userId="123" and action="purchase"

# Find all purchases over $50
{job="nextjs-app"} | json | action="purchase" | amount > 50

# Count purchases per user
sum by (userId) (count_over_time({job="nextjs-app"} | json | action="purchase" [5m]))
```

---

## Development Output (NODE_ENV=development)

**Pretty-printed - easy to read in terminal:**

```
[2025-10-31 13:45:23] INFO: User completed purchase
    {
      "userId": "123",
      "action": "purchase",
      "amount": 99.99,
      "currency": "USD",
      "items": [
        "product-1",
        "product-2"
      ]
    }
```

### Features in development mode:

✅ **Colored output**: Level indicators are colored (INFO=green, ERROR=red, etc.)
✅ **Formatted timestamp**: Human-readable date/time
✅ **Indented JSON**: Easy to scan object structure
✅ **Multi-line**: Readable at a glance

---

## More Examples

### Error Logging

**Code:**
```javascript
try {
  await processPayment(order);
} catch (error) {
  logger.error(
    {
      err: error,
      orderId: 'order-456',
      userId: '123',
      amount: 99.99
    },
    'Payment processing failed'
  );
}
```

**Production Output (PM2 logs):**
```json
{"level":"error","time":1730383245456,"environment":"production","version":"1.0.0","err":{"type":"Error","message":"Connection timeout","stack":"Error: Connection timeout\n    at processPayment (/app/lib/payment.js:23:15)"},"orderId":"order-456","userId":"123","amount":99.99,"msg":"Payment processing failed"}
```

**Development Output (terminal):**
```
[2025-10-31 13:45:23] ERROR: Payment processing failed
    {
      "err": {
        "type": "Error",
        "message": "Connection timeout",
        "stack": "Error: Connection timeout\n    at processPayment (/app/lib/payment.js:23:15)"
      },
      "orderId": "order-456",
      "userId": "123",
      "amount": 99.99
    }
```

---

### Child Logger (Request Context)

**Code:**
```javascript
const requestLogger = logger.child({
  requestId: 'req-abc-123',
  userId: '789',
  path: '/api/orders'
});

requestLogger.info({ duration: 145, statusCode: 200 }, 'Request completed');
requestLogger.debug({ query: { page: 1 } }, 'Query parameters');
```

**Production Output:**
```json
{"level":"info","time":1730383245789,"environment":"production","version":"1.0.0","requestId":"req-abc-123","userId":"789","path":"/api/orders","duration":145,"statusCode":200,"msg":"Request completed"}
{"level":"debug","time":1730383245790,"environment":"production","version":"1.0.0","requestId":"req-abc-123","userId":"789","path":"/api/orders","query":{"page":1},"msg":"Query parameters"}
```

**Development Output:**
```
[2025-10-31 13:45:23] INFO: Request completed
    {
      "requestId": "req-abc-123",
      "userId": "789",
      "path": "/api/orders",
      "duration": 145,
      "statusCode": 200
    }

[2025-10-31 13:45:23] DEBUG: Query parameters
    {
      "requestId": "req-abc-123",
      "userId": "789",
      "path": "/api/orders",
      "query": {
        "page": 1
      }
    }
```

**Notice:** The child context (`requestId`, `userId`, `path`) is automatically included in every log! Perfect for tracing requests.

---

## PM2 Log Aggregation

When running with PM2, logs from all instances are aggregated:

```bash
$ pm2 logs

[TAILING] Tailing last 15 lines for [all] processes

nextjs-app-0 (out): {"level":"info","time":1730383245123,"environment":"production","version":"1.0.0","userId":"123","action":"purchase","msg":"User completed purchase"}
nextjs-app-1 (out): {"level":"info","time":1730383245156,"environment":"production","version":"1.0.0","userId":"456","action":"login","msg":"User logged in"}
nextjs-app-2 (out): {"level":"info","time":1730383245189,"environment":"production","version":"1.0.0","userId":"789","action":"logout","msg":"User logged out"}
```

All logs are structured JSON, making it easy to:
- Ship to Loki via Promtail
- Parse and analyze
- Create dashboards in Grafana
- Set up alerts on specific conditions

---

## Summary

| Feature | Production | Development |
|---------|-----------|-------------|
| Format | Single-line JSON | Pretty-printed multi-line |
| Colors | No | Yes |
| Timestamp | Unix milliseconds | Human-readable |
| Objects | Merged into JSON | Indented JSON blocks |
| Use case | PM2/Loki/Grafana | Terminal debugging |
| Performance | Fast | Slower (formatting overhead) |
