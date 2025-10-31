/**
 * Demonstration of how the logger handles objects
 *
 * Pino's standard syntax: logger.info(object, message)
 * - The object contains structured data (merged into the log entry)
 * - The message is the human-readable description
 */

console.log(`
${'='.repeat(70)}
OBJECT LOGGING DEMONSTRATION
Environment: ${process.env.NODE_ENV}
${'='.repeat(70)}
`);

// Import logger (will use current NODE_ENV)
const { logger } = require('../lib/logger');

console.log('\n1. Simple message (no object):');
console.log('   Code: logger.info("Server started")');
console.log('   Output:\n');
logger.info('Server started');

console.log('\n\n2. Object + Message (recommended way):');
console.log('   Code: logger.info({ userId: "123", action: "login" }, "User logged in")');
console.log('   Output:\n');
logger.info({ userId: '123', action: 'login' }, 'User logged in');

console.log('\n\n3. Complex nested object:');
console.log('   Code: logger.info({ user: { id: "456", name: "John" }, metadata: { ip: "1.2.3.4" } }, "Request processed")');
console.log('   Output:\n');
logger.info(
  {
    user: { id: '456', name: 'John' },
    metadata: { ip: '1.2.3.4', userAgent: 'Mozilla/5.0' },
  },
  'Request processed',
);

console.log('\n\n4. Error object:');
console.log('   Code: logger.error({ err: error, userId: "789" }, "Payment failed")');
console.log('   Output:\n');
try {
  throw new Error('Insufficient funds');
} catch (error) {
  logger.error(
    {
      err: error, // Pino automatically serializes Error objects
      userId: '789',
      amount: 99.99,
      currency: 'USD',
    },
    'Payment failed',
  );
}

console.log('\n\n5. Just an object (no message):');
console.log('   Code: logger.info({ event: "healthcheck", status: "ok" })');
console.log('   Output:\n');
logger.info({ event: 'healthcheck', status: 'ok', uptime: 12345 });

console.log('\n\n6. Array in object:');
console.log('   Code: logger.info({ items: ["item1", "item2"], count: 2 }, "Order created")');
console.log('   Output:\n');
logger.info(
  {
    items: ['item1', 'item2', 'item3'],
    count: 3,
    total: 299.97,
  },
  'Order created',
);

console.log('\n\n7. Child logger with context:');
console.log('   Code: const reqLogger = logger.child({ requestId: "req-123" })');
console.log('         reqLogger.info({ route: "/api/users" }, "API call")');
console.log('   Output:\n');
const requestLogger = logger.child({ requestId: 'req-abc-123', method: 'POST' });
requestLogger.info({ route: '/api/users', duration: 145 }, 'API call completed');

console.log('\n\n8. Multiple child contexts:');
console.log('   Code: const userLogger = reqLogger.child({ userId: "user-456" })');
console.log('         userLogger.debug({ action: "update_profile" }, "User action")');
console.log('   Output:\n');
const userLogger = requestLogger.child({ userId: 'user-456', sessionId: 'sess-789' });
userLogger.debug({ action: 'update_profile', fields: ['name', 'email'] }, 'User action');

console.log('\n\n' + '='.repeat(70));
console.log('KEY OBSERVATIONS:');
console.log('='.repeat(70));
console.log(`
PRODUCTION MODE (NODE_ENV=production):
  - All data is output as flat JSON, one line per log
  - Objects are merged into the log entry
  - Perfect for log aggregation and searching in Loki/Grafana
  - No colors, no formatting - just structured data

DEVELOPMENT MODE (NODE_ENV=development):
  - Pretty-printed with colors and indentation
  - Timestamp is human-readable
  - Objects are displayed in formatted JSON blocks
  - Easy to read in terminal

CHILD LOGGERS:
  - Context (requestId, userId) is included in ALL child logs
  - Great for tracing requests across multiple log entries
  - Context accumulates (child of child includes both contexts)
`);
