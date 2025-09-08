import { EntityManager } from '@mikro-orm/core';
import { Injectable, NotFoundException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { WebhookSubscription } from 'src/entities/webhook-subscription.entity';
import { User } from 'src/entities/user.entity';
import { WebhookDeliveryAttempt } from 'src/entities/webhook-delivery-attempt.entity';

@Injectable()
export class WebhooksService {
  constructor(private readonly em: EntityManager) {}

  async register(
    userId: number,
    payload: {
      url: string;
      event: WebhookSubscription['event'];
      secret: string;
    },
  ): Promise<{ id: number; message: string }> {
    const sub = new WebhookSubscription();
    // Minimal secret handling (in real app, encrypt before storing)
    sub.url = payload.url;
    sub.event = payload.event;
    // store as-is; encryption layer could be added
    sub.secretEncrypted = payload.secret;
    // assign user via reference
    sub.user = this.em.getReference(User, userId);
    await this.em.persistAndFlush(sub);
    return { id: sub.id, message: 'Webhook registered' };
  }

  async list(userId: number): Promise<WebhookSubscription[]> {
    return this.em.find(WebhookSubscription, { user: { id: userId } });
  }

  async remove(
    userId: number,
    webhookId: number,
  ): Promise<{ message: string }> {
    const sub = await this.em.findOne(
      WebhookSubscription,
      { id: webhookId },
      { populate: ['user'] },
    );
    if (!sub || sub.user.id !== userId) {
      throw new NotFoundException('Webhook not found');
    }
    await this.em.removeAndFlush(sub);
    return { message: 'Webhook deleted' };
  }

  async listDeliveries(
    userId: number,
    webhookId: number,
    opts?: { page: number; limit: number },
  ) {
    const sub = await this.em.findOne(
      WebhookSubscription,
      { id: webhookId },
      { populate: ['user'] },
    );
    if (!sub || sub.user.id !== userId) {
      throw new NotFoundException('Webhook not found');
    }
    const page = opts?.page ?? 1;
    const limit = opts?.limit ?? 20;
    const offset = (page - 1) * limit;
    const [items, total] = await this.em.findAndCount(
      WebhookDeliveryAttempt,
      { subscription: { id: webhookId } },
      { orderBy: { createdAt: 'DESC' }, limit, offset },
    );
    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit) || 1,
      },
    } as const;
  }

  // Internal helper to notify subscribers of an event.
  async emitInternal(
    event: WebhookSubscription['event'],
    payload: Record<string, unknown>,
  ): Promise<void> {
    // Fetch subscribers (system-wide for now)
    const subs = await this.em.find(WebhookSubscription, {
      event,
      active: true,
    });
    // Deliver to each subscriber asynchronously with retry/backoff
    await Promise.all(
      subs.map((s) =>
        this.deliverWithRetry(s.url, s.secretEncrypted, event, payload),
      ),
    );
  }

  private async deliverWithRetry(
    url: string,
    secret: string,
    event: WebhookSubscription['event'],
    payload: Record<string, unknown>,
  ): Promise<void> {
    const body = JSON.stringify(payload);
    const signature =
      'sha256=' + createHmac('sha256', secret).update(body).digest('hex');
    const headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'YSHAI/1.0 webhook',
      'X-YSHAI-Event': event,
      'X-YSHAI-Signature': signature,
    } as const;

    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const started = Date.now();
        const res = await fetch(url, {
          method: 'POST',
          headers,
          body,
        });
        const durationMs = Date.now() - started;
        if (!res.ok) {
          await this.recordAttempt({
            url,
            event,
            attemptNumber: attempt,
            status: 'failed',
            responseCode: res.status,
            errorMessage: `HTTP ${res.status}`,
            durationMs,
            payload,
            secret,
          });
          throw new Error(`HTTP ${res.status}`);
        }
        await this.recordAttempt({
          url,
          event,
          attemptNumber: attempt,
          status: 'delivered',
          responseCode: res.status,
          durationMs,
          payload,
          secret,
        });
        return;
      } catch (err) {
        if (attempt === maxAttempts) throw err as Error;
        const backoffMs = 500 * 2 ** (attempt - 1);
        await new Promise((r) => setTimeout(r, backoffMs));
      }
    }
  }

  private async recordAttempt(input: {
    url: string;
    event: WebhookSubscription['event'];
    attemptNumber: number;
    status: 'delivered' | 'failed';
    responseCode?: number;
    errorMessage?: string;
    durationMs?: number;
    payload: Record<string, unknown>;
    secret: string;
  }): Promise<void> {
    const subs = await this.em.find(
      WebhookSubscription,
      { url: input.url, event: input.event },
      { limit: 1 },
    );
    const subscription = subs[0];
    if (!subscription) return;

    const attempt = this.em.create(WebhookDeliveryAttempt, {
      subscription,
      url: input.url,
      event: input.event,
      attemptNumber: input.attemptNumber,
      status: input.status,
      responseCode: input.responseCode,
      errorMessage: input.errorMessage,
      durationMs: input.durationMs,
      payloadHash:
        'sha256=' +
        createHmac('sha256', input.secret)
          .update(JSON.stringify(input.payload))
          .digest('hex'),
      createdAt: new Date(),
    });
    await this.em.persistAndFlush(attempt);
  }
}
