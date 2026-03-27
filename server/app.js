const express = require('express');
const OpenAI = require('openai');
const Stripe = require('stripe');
const { randomUUID } = require('node:crypto');
const { z } = require('zod');

function createApp(config = {}) {
  const app = express();
  const openai = config.openaiClient || (process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null);
  const stripe = config.stripeClient || (process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null);
  const openAiModel = config.openAiModel || process.env.TOUR_GUIDE_MODEL || 'gpt-4.1-mini';
  const maxChatPerWindow = Number(config.maxChatPerWindow || process.env.CHAT_RATE_LIMIT_MAX || 15);
  const rateLimitWindowMs = Number(config.rateLimitWindowMs || process.env.CHAT_RATE_LIMIT_WINDOW_MS || 60_000);
  const webhookSecret = config.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET;
  const ipBuckets = new Map();

  const chatSchema = z.object({
    message: z.string().min(1).max(1200),
    sessionId: z.string().max(128).optional(),
    context: z.object({
      route: z.string().max(120).optional(),
      selectedFeature: z.object({
        name: z.string().max(120).optional(),
        type: z.enum(['historic_site', 'beach', 'transport_hub', 'other']).optional(),
        lat: z.number().min(-90).max(90).optional(),
        lng: z.number().min(-180).max(180).optional(),
        description: z.string().max(2000).optional()
      }).strict().optional()
    }).strict().optional()
  }).strict();

  const paymentIntentSchema = z.object({
    amount: z.number().int().min(500).max(500000),
    currency: z.string().regex(/^[a-z]{3}$/),
    purpose: z.enum(['donation', 'ride', 'ticket', 'other']),
    metadata: z.record(z.string().max(200)).optional()
  }).strict();

  app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    if (!stripe || !webhookSecret) {
      return res.status(503).json({ error: 'Stripe webhook is not configured.' });
    }

    const signature = req.headers['stripe-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'Missing Stripe signature header.' });
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error) {
      return res.status(400).json({ error: `Invalid webhook signature: ${error.message}` });
    }

    if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
      console.log('stripe_webhook_event', { eventId: event.id, type: event.type, paymentIntentId: event.data.object.id });
    }

    return res.json({ received: true });
  });

  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'usvi-explorer-api' });
  });

  app.post('/api/v1/tour-guide/chat', async (req, res) => {
    const requestId = randomUUID();
    const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').toString().split(',')[0].trim();

    const now = Date.now();
    const bucket = ipBuckets.get(ip);
    if (!bucket || now - bucket.windowStart > rateLimitWindowMs) {
      ipBuckets.set(ip, { windowStart: now, count: 1 });
    } else {
      bucket.count += 1;
      if (bucket.count > maxChatPerWindow) {
        return res.status(429).json({ error: 'Rate limit exceeded.', requestId });
      }
    }

    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload.', details: parsed.error.flatten(), requestId });
    }

    if (!openai) {
      return res.status(503).json({ error: 'Tour guide service is not configured.', requestId });
    }

    const started = Date.now();
    try {
      const { message, context } = parsed.data;
      const contextText = context ? `Context: ${JSON.stringify(context)}` : 'Context: none';
      const result = await openai.responses.create({
        model: openAiModel,
        input: [
          { role: 'system', content: 'You are a friendly USVI local guide. Be concise, practical, and safety-aware.' },
          { role: 'user', content: `${contextText}\n\nUser question: ${message}` }
        ]
      });

      const reply = result.output_text?.trim() || 'I could not generate a response just now.';
      const latencyMs = Date.now() - started;
      return res.json({ reply, requestId, latencyMs });
    } catch (error) {
      return res.status(500).json({ error: 'Tour guide request failed.', requestId });
    }
  });

  app.post('/api/v1/payments/create-intent', async (req, res) => {
    const requestId = randomUUID();
    const parsed = paymentIntentSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid payload.', details: parsed.error.flatten(), requestId });
    }

    if (!stripe) {
      return res.status(503).json({ error: 'Stripe service is not configured.', requestId });
    }

    const { amount, currency, purpose, metadata } = parsed.data;

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        metadata: { purpose, ...(metadata || {}) },
        automatic_payment_methods: { enabled: true }
      }, { idempotencyKey: requestId });

      return res.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        requestId
      });
    } catch (error) {
      return res.status(500).json({ error: 'Payment intent creation failed.', requestId });
    }
  });

  return app;
}

module.exports = { createApp };
