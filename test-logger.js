/**
 * Simple test file to verify logger functionality
 * Run with: node test-logger.js
 */

// Simulate different environments
const testEnvironments = ['development', 'production'];

async function testLogger(env) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing logger in ${env.toUpperCase()} mode`);
  console.log('='.repeat(60) + '\n');

  // Set environment
  process.env.NODE_ENV = env;
  process.env.NEXT_PUBLIC_APP_VERSION = '1.0.0-test';

  // Clear require cache to reload logger with new env
  delete require.cache[require.resolve('./lib/logger')];
  const { logger } = require('./lib/logger');

  // Test different log levels
  logger.info('Application started');
  logger.debug({ config: { port: 3000, env } }, 'Configuration loaded');
  logger.warn({ memory: '450MB', threshold: '500MB' }, 'Memory usage high');

  // Test error logging
  try {
    throw new Error('Test error');
  } catch (err) {
    logger.error({ error: err.message, stack: err.stack }, 'Error occurred');
  }

  // Test child logger
  const requestLogger = logger.child({ requestId: 'req-123', userId: 'user-456' });
  requestLogger.info('Processing request');
  requestLogger.debug({ route: '/api/users', method: 'GET' }, 'Route details');

  // Test structured data
  logger.info(
    {
      event: 'user_action',
      userId: 'user-789',
      action: 'purchase',
      amount: 99.99,
      currency: 'USD',
    },
    'User completed purchase',
  );

  console.log('\n');
}

async function runTests() {
  for (const env of testEnvironments) {
    await testLogger(env);
    // Wait a bit between tests
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  console.log('✅ Logger tests completed!\n');
  console.log('Key observations:');
  console.log('- Development: Pretty-printed, colored output');
  console.log('- Production: JSON format for PM2/Loki/Grafana');
  console.log('\nTo use with PM2:');
  console.log('  npm run pm2:start');
  console.log('  npm run pm2:logs');
}

runTests().catch(console.error);
