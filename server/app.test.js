/** @vitest-environment node */

const request = require('supertest');
const { createApp } = require('./app');

describe('server api', () => {
  it('returns health payload', async () => {
    const app = createApp();
    const res = await request(app).get('/api/health');

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('rejects invalid chat payload', async () => {
    const app = createApp();
    const res = await request(app).post('/api/v1/tour-guide/chat').send({ message: '' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid payload/i);
  });

  it('returns 503 for chat when OpenAI is not configured', async () => {
    const app = createApp({ openaiClient: null });
    const res = await request(app).post('/api/v1/tour-guide/chat').send({ message: 'Hello' });

    expect(res.status).toBe(503);
    expect(res.body.error).toMatch(/not configured/i);
  });

  it('creates payment intent when stripe client is available', async () => {
    const stripeMock = {
      paymentIntents: {
        create: vi.fn(async () => ({ id: 'pi_123', client_secret: 'pi_123_secret_abc' }))
      }
    };

    const app = createApp({ stripeClient: stripeMock });
    const res = await request(app).post('/api/v1/payments/create-intent').send({
      amount: 500,
      currency: 'usd',
      purpose: 'donation'
    });

    expect(res.status).toBe(200);
    expect(res.body.clientSecret).toBe('pi_123_secret_abc');
    expect(stripeMock.paymentIntents.create).toHaveBeenCalledTimes(1);
  });
});
