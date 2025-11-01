# Quick Start for Next.js

This guide gets you up and running with the logger in your Next.js app in 5 minutes.

## Step 1: Install Dependencies

```bash
npm install pino
npm install -D pino-pretty  # For development pretty-printing
```

## Step 2: Copy the Logger

Copy `lib/logger.ts` to your Next.js project:

```typescript
// src/lib/logger.ts or lib/logger.ts
import pino from 'pino';

const createBrowserLogger = () => ({
  info: () => {},
  error: () => {},
  warn: () => {},
  debug: () => {},
  trace: () => {},
  fatal: () => {},
  child: () => createBrowserLogger(),
});

const createServerLogger = () => {
  const isDev = process.env.NODE_ENV === 'development';

  return pino({
    level: isDev ? 'debug' : 'info',
    base: {
      environment: process.env.NODE_ENV || 'unknown',
      version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
    },
    formatters: {
      level: (label) => ({ level: label }),
    },
  });
};

export const logger =
  typeof window !== 'undefined' ? createBrowserLogger() : createServerLogger();
```

## Step 3: Update package.json Scripts

Add the `dev:pretty` script:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:pretty": "next dev 2>&1 | pino-pretty",
    "build": "next build",
    "start": "next start"
  }
}
```

## Step 4: Use the Logger

```typescript
// In any server component or API route
import { logger } from '@/lib/logger';

// Simple logging
logger.info('Server started');

// Structured logging (recommended)
logger.info(
  { userId: user.id, action: 'login' },
  'User logged in'
);

// Error logging
try {
  await someOperation();
} catch (error) {
  logger.error(
    { err: error, context: 'operation' },
    'Operation failed'
  );
}

// Child logger with context
const requestLogger = logger.child({
  requestId: headers().get('x-request-id'),
});

requestLogger.info('Processing request');
```

## Step 5: Run Your App

### Development (Pretty Logs)

```bash
npm run dev:pretty
```

Output:
```
[2025-10-31 14:30:15] INFO: User logged in
    {
      "userId": "123",
      "action": "login"
    }
```

### Development (JSON Logs)

```bash
npm run dev
```

Output:
```json
{"level":"info","time":1730383215000,"environment":"development","userId":"123","action":"login","msg":"User logged in"}
```

### Production

```bash
npm run build
npm run start
```

Output: JSON logs ready for PM2/Loki/Grafana

## Common Use Cases

### API Routes (App Router)

```typescript
// app/api/users/route.ts
import { logger } from '@/lib/logger';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestLogger = logger.child({
    path: request.nextUrl.pathname,
    method: request.method,
  });

  requestLogger.info('API request received');

  try {
    const users = await fetchUsers();
    requestLogger.info({ count: users.length }, 'Users fetched');
    return NextResponse.json(users);
  } catch (error) {
    requestLogger.error({ err: error }, 'Failed to fetch users');
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
```

### Server Components

```typescript
// app/dashboard/page.tsx
import { logger } from '@/lib/logger';

export default async function DashboardPage() {
  logger.info('Rendering dashboard');

  try {
    const data = await fetchDashboardData();
    logger.debug({ dataPoints: data.length }, 'Dashboard data loaded');

    return <Dashboard data={data} />;
  } catch (error) {
    logger.error({ err: error }, 'Dashboard fetch failed');
    return <ErrorPage />;
  }
}
```

### Server Actions

```typescript
// app/actions.ts
'use server';

import { logger } from '@/lib/logger';

export async function updateProfile(formData: FormData) {
  const userId = formData.get('userId');

  logger.info({ userId }, 'Updating user profile');

  try {
    await saveProfile(formData);
    logger.info({ userId }, 'Profile updated successfully');
    return { success: true };
  } catch (error) {
    logger.error({ err: error, userId }, 'Profile update failed');
    return { success: false, error: 'Update failed' };
  }
}
```

### Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/lib/logger';

export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID();

  logger.info(
    {
      requestId,
      path: request.nextUrl.pathname,
      method: request.method,
    },
    'Request received'
  );

  const response = NextResponse.next();
  response.headers.set('x-request-id', requestId);

  return response;
}
```

## PM2 Deployment

### Step 1: Create ecosystem.config.js

```javascript
module.exports = {
  apps: [
    {
      name: 'nextjs-app',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
```

### Step 2: Update package.json

```json
{
  "scripts": {
    "pm2:start": "pm2 start ecosystem.config.js",
    "pm2:logs": "pm2 logs",
    "pm2:logs:pretty": "pm2 logs --raw | pino-pretty",
    "pm2:stop": "pm2 stop ecosystem.config.js"
  }
}
```

### Step 3: Deploy

```bash
# Build
npm run build

# Start with PM2
npm run pm2:start

# View logs
npm run pm2:logs:pretty
```

## Environment Variables

```bash
# .env.local (development)
NODE_ENV=development
LOG_LEVEL=debug
NEXT_PUBLIC_APP_VERSION=1.0.0

# .env.production (production)
NODE_ENV=production
LOG_LEVEL=info
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## TypeScript Support

The logger is fully typed. For better type inference, you can create a typed wrapper:

```typescript
// lib/logger.ts
import pino from 'pino';

type LogData = Record<string, unknown>;

export interface Logger {
  info(msg: string): void;
  info(data: LogData, msg: string): void;
  error(msg: string): void;
  error(data: LogData, msg: string): void;
  warn(msg: string): void;
  warn(data: LogData, msg: string): void;
  debug(msg: string): void;
  debug(data: LogData, msg: string): void;
  child(bindings: LogData): Logger;
}

// ... rest of logger implementation
```

## Next Steps

- Read [LOGGER_USAGE.md](./LOGGER_USAGE.md) for advanced usage
- See [OBJECT_HANDLING.md](./OBJECT_HANDLING.md) for object logging examples
- Check [NEXTJS_WEBPACK_FIX.md](./NEXTJS_WEBPACK_FIX.md) if you encounter bundling issues
- Set up Loki/Grafana integration (see LOGGER_USAGE.md)

## Troubleshooting

### Issue: "Can't resolve 'worker_threads'"

**Cause:** You're importing `pino-pretty` at the top level.

**Fix:** Use the default logger (JSON output) and pipe through pino-pretty:
```bash
npm run dev:pretty
```

### Issue: Logs not showing in development

**Cause:** Running `npm run dev` outputs JSON, which is hard to read.

**Fix:** Use `npm run dev:pretty` instead.

### Issue: Want to see logs in production PM2

**Cause:** PM2 logs are in JSON format by default.

**Fix:** Use `npm run pm2:logs:pretty` to view formatted logs.

## Summary

1. ✅ Install `pino` and `pino-pretty`
2. ✅ Copy `lib/logger.ts` to your project
3. ✅ Add `dev:pretty` script to package.json
4. ✅ Import and use: `import { logger } from '@/lib/logger'`
5. ✅ Run: `npm run dev:pretty` for development
6. ✅ Deploy with PM2 for production

That's it! You now have production-ready logging in your Next.js app. 🎉
