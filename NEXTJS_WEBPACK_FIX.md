# Next.js Webpack Bundling Fix

## The Problem

When using the logger in Next.js, you may encounter this error:

```
⨯ ./node_modules/pino-abstract-transport/index.js:6:34
Module not found: Can't resolve 'worker_threads'

Import trace for requested module:
./node_modules/pino-pretty/index.js
./src/lib/utils/logger.ts
```

## Why This Happens

The error occurs because:

1. **Next.js webpack analyzes all imports** - Even if code is server-only, webpack analyzes the import statements
2. **pino-pretty imports Node.js modules** - `worker_threads`, `fs`, `os`, etc.
3. **These modules don't exist in browsers** - Webpack can't resolve them for client bundles
4. **Build fails** - Even though the logger is never used client-side

This is a fundamental webpack/Next.js bundling issue, not a runtime issue.

## Solutions

There are **two solutions** depending on your preference:

### Solution 1: JSON Output (Recommended)

**Use JSON in both dev and prod, pipe through pino-pretty externally.**

#### ✅ Pros
- Simple, no bundling issues
- Works everywhere (Next.js, Remix, etc.)
- Reliable and predictable
- Same output format in dev/prod (easier testing)

#### ❌ Cons
- Need to pipe output for pretty logs in dev
- Extra command to run

#### Implementation

Use `lib/logger.ts` (default):

```typescript
import pino from 'pino';

// No pino-pretty import = no bundling issues
const createServerLogger = () => {
  return pino({
    level: process.env.LOG_LEVEL || 'debug',
  });
};

export const logger =
  typeof window !== 'undefined'
    ? { info: () => {}, error: () => {} }
    : createServerLogger();
```

#### Usage

```bash
# Development with pretty logs
npm run dev:pretty

# Or manually:
npm run dev 2>&1 | npx pino-pretty

# Production with PM2 (JSON)
npm run pm2:start

# View PM2 logs with pretty formatting
npm run pm2:logs:pretty
```

---

### Solution 2: Conditional Import (Alternative)

**Use dynamic require to avoid webpack analyzing pino-pretty.**

#### ✅ Pros
- Pretty logs directly in terminal (no piping)
- Automatic fallback if pino-pretty fails

#### ❌ Cons
- More complex code
- Still might have webpack warnings
- May need Next.js config tweaks

#### Implementation

Use `lib/logger-with-pretty.ts`:

```typescript
import pino from 'pino';

// Conditional import - only loaded server-side at runtime
let pretty: any = null;
if (typeof window === 'undefined') {
  try {
    pretty = require('pino-pretty');
  } catch (e) {
    console.warn('pino-pretty not found, using JSON');
  }
}

const createServerLogger = () => {
  // Use pretty if available, otherwise JSON
  if (pretty && process.env.NODE_ENV === 'development') {
    const prettyStream = pretty({ colorize: true });
    return pino({ level: 'debug' }, prettyStream);
  }

  return pino({ level: 'debug' });
};

export const logger =
  typeof window !== 'undefined'
    ? { info: () => {}, error: () => {} }
    : createServerLogger();
```

#### Optional: Update next.config.js

Add this to completely ignore pino-pretty in client bundles:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle these Node.js modules on the client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        worker_threads: false,
      };

      // Completely ignore pino-pretty on client
      config.externals = config.externals || [];
      config.externals.push({
        'pino-pretty': 'commonjs pino-pretty',
      });
    }
    return config;
  },
};

module.exports = nextConfig;
```

---

## Comparison Table

| Aspect | Solution 1: JSON Only | Solution 2: Conditional Import |
|--------|----------------------|-------------------------------|
| **Complexity** | Simple | Medium |
| **Bundling Issues** | None | Rare |
| **Dev Experience** | Need to pipe output | Pretty logs directly |
| **Production** | JSON (PM2-ready) | JSON (PM2-ready) |
| **Reliability** | Very high | High |
| **Next.js Config** | Not needed | Optional |

## Recommended Approach

**Use Solution 1 (JSON Only)** because:

1. ✅ **Zero bundling issues** - No webpack errors ever
2. ✅ **Simple code** - Easy to understand and maintain
3. ✅ **Universal** - Works with any framework (Next.js, Remix, etc.)
4. ✅ **Production-ready** - Same format in dev/prod
5. ✅ **PM2-friendly** - Already outputs JSON for PM2

The only trade-off is running `npm run dev:pretty` instead of `npm run dev`, which is minor.

## Migration Guide

### From Old Logger to New Logger

**Old (causes errors):**
```typescript
import pino from 'pino';
import pretty from 'pino-pretty';  // ❌ Webpack analyzes this

const prettyStream = pretty({ ... });
export const logger = pino({}, prettyStream);
```

**New (Solution 1 - Recommended):**
```typescript
import pino from 'pino';  // ✅ No problematic imports

export const logger = typeof window !== 'undefined'
  ? { info: () => {}, error: () => {} }
  : pino({ level: 'debug' });
```

**Usage in Dev:**
```bash
# Instead of:
npm run dev

# Run:
npm run dev:pretty
# or
npm run dev 2>&1 | npx pino-pretty
```

### Update package.json

Add these scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "dev:pretty": "next dev 2>&1 | pino-pretty",
    "pm2:logs:pretty": "pm2 logs --raw | pino-pretty"
  }
}
```

## Testing

After implementing the fix:

```bash
# 1. Clean Next.js cache
rm -rf .next

# 2. Install dependencies
npm install

# 3. Test development mode
npm run dev:pretty

# 4. Build should work without errors
npm run build

# 5. Production with PM2
npm run pm2:start
npm run pm2:logs
```

## Additional Resources

- [Next.js Webpack Config](https://nextjs.org/docs/api-reference/next.config.js/custom-webpack-config)
- [Pino Documentation](https://getpino.io/)
- [Pino Pretty](https://github.com/pinojs/pino-pretty)

## Summary

**The root cause:** Webpack analyzes all imports, even server-only code.

**The fix:** Don't import `pino-pretty` at the module level. Either:
1. Output JSON and pipe through pino-pretty externally ⭐ **Recommended**
2. Use conditional `require()` to avoid webpack analysis

Both solutions work. Solution 1 is simpler and more reliable.
