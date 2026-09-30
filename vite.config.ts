import { defineConfig, loadEnv } from 'vite';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import url from 'node:url';

function apiDevServerPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname || '';
        const endpoint = pathname.replace(/^\/api\//, '').replace(/\/$/, '');

        let body: any = {};
        if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH' || req.method === 'DELETE') {
          const buffers: Buffer[] = [];
          for await (const chunk of req) {
            buffers.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          }
          const rawBody = Buffer.concat(buffers).toString();
          if (rawBody) {
            try {
              body = JSON.parse(rawBody);
            } catch {
              body = rawBody;
            }
          }
        }

        const mockReq: any = {
          method: req.method,
          url: req.url,
          query: parsedUrl.query,
          body,
          headers: req.headers,
        };

        const mockRes: any = {
          statusCode: 200,
          setHeader(name: string, value: string) {
            res.setHeader(name, value);
            return mockRes;
          },
          status(code: number) {
            mockRes.statusCode = code;
            res.statusCode = code;
            return mockRes;
          },
          json(data: any) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
          },
          end(content?: any) {
            res.end(content);
          },
        };

        try {
          if (endpoint === 'menu-items' || endpoint === 'menu-items.js') {
            // @ts-ignore
            const mod = await import('./api/menu-items.js');
            return await mod.default(mockReq, mockRes);
          } else if (endpoint === 'reviews' || endpoint === 'reviews.js') {
            // @ts-ignore
            const mod = await import('./api/reviews.js');
            return await mod.default(mockReq, mockRes);
          } else if (endpoint === 'reservations' || endpoint === 'reservations.js') {
            // @ts-ignore
            const mod = await import('./api/reservations.js');
            return await mod.default(mockReq, mockRes);
          } else if (endpoint === 'newsletter' || endpoint === 'newsletter.js') {
            // @ts-ignore
            const mod = await import('./api/newsletter.js');
            return await mod.default(mockReq, mockRes);
          }
          next();
        } catch (err: any) {
          console.error('Error handling API route:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react(), tailwindcss(), apiDevServerPlugin()];
  try {
    // @ts-ignore
    const m = await import('./.vite-source-tags.js');
    plugins.push(m.sourceTags());
  } catch {}

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
    server: {
      port: 5173,
      host: true,
    },
  };
});
