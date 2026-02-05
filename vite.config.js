import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import OpenAI from 'openai';

function tourGuideApiPlugin() {
  return {
    name: 'tour-guide-api',
    configureServer(server) {
      server.middlewares.use('/api/v1/tour-guide/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: { code: 'METHOD_NOT_ALLOWED', message: 'Use POST' } }));
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            const payload = body ? JSON.parse(body) : {};
            const message = payload.message?.trim();
            if (!message) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  error: {
                    code: 'VALIDATION_ERROR',
                    message: 'message is required'
                  }
                })
              );
              return;
            }

            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  reply:
                    'Tour guide backend is running without an OPENAI_API_KEY. Set OPENAI_API_KEY in the server environment to enable AI responses.'
                })
              );
              return;
            }

            const openai = new OpenAI({ apiKey });
            const response = await openai.responses.create({
              model: 'gpt-4.1-mini',
              input: [
                {
                  role: 'system',
                  content:
                    'You are Sunny, a concise USVI local tour guide. Keep responses practical, friendly, and under 120 words.'
                },
                {
                  role: 'user',
                  content: `${payload.context || ''}\n\nUser asked: ${message}`
                }
              ]
            });

            const reply = response.output_text || 'I could not find an answer right now.';
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ reply }));
          } catch (error) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                error: {
                  code: 'INTERNAL_ERROR',
                  message: 'Unable to process tour guide request.'
                }
              })
            );
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), tourGuideApiPlugin()],
  test: {
    globals: true,
    environment: 'jsdom'
  }
});
