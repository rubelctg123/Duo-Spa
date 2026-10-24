import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import dotenv from 'dotenv';

// Load local server-only environment variables for the development API middleware.
// Vite does not expose non-VITE_ variables to client code, keeping secrets strictly on the server.
dotenv.config({ path: '.env.local' });
dotenv.config();

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api')) {
          return next();
        }
        const pathname = req.url.split('?')[0];
        try {
          // Public APIs
          if (pathname === '/api/services') {
            const { default: handler } = await import('./api/services.js');
            return handler(req as any, res as any);
          }
          if (pathname === '/api/availability') {
            const { default: handler } = await import('./api/availability.js');
            return handler(req as any, res as any);
          }
          if (pathname === '/api/bookings') {
            const { default: handler } = await import('./api/bookings.js');
            return handler(req as any, res as any);
          }

          // Auth APIs
          if (pathname === '/api/auth/login') {
            const { default: handler } = await import('./api/auth/login.js');
            return handler(req as any, res as any);
          }
          if (pathname === '/api/auth/logout') {
            const { default: handler } = await import('./api/auth/logout.js');
            return handler(req as any, res as any);
          }
          if (pathname === '/api/auth/me') {
            const { default: handler } = await import('./api/auth/me.js');
            return handler(req as any, res as any);
          }

          // Protected Admin APIs
          if (pathname === '/api/admin/stats') {
            const { default: handler } = await import('./api/admin/stats.js');
            return handler(req as any, res as any);
          }
          if (pathname === '/api/admin/bookings') {
            const { default: handler } = await import('./api/admin/bookings.js');
            return handler(req as any, res as any);
          }
          if (pathname === '/api/admin/services') {
            const { default: handler } = await import('./api/admin/services.js');
            return handler(req as any, res as any);
          }
          if (pathname === '/api/admin/therapists') {
            const { default: handler } = await import('./api/admin/therapists.js');
            return handler(req as any, res as any);
          }
          if (pathname === '/api/admin/rooms') {
            const { default: handler } = await import('./api/admin/rooms.js');
            return handler(req as any, res as any);
          }
        } catch (err) {
          console.error('API dev server error:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ success: false, error: 'Internal server error in dev API' }));
          return;
        }
        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), apiDevPlugin()],
});
