import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Plan } from 'src/entities/plan.entity';
import { Subscription } from 'src/entities/subscription.entity';
import { Invoice } from 'src/entities/invoice.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class BillingService {
  constructor(private readonly em: EntityManager) {}

  async listPlans(): Promise<Plan[]> {
    return this.em.find(Plan, {});
  }

  async subscribe(
    userId: number,
    planId: number,
    paymentMethod: string,
    couponCode?: string,
  ): Promise<{ subscription: Subscription; clientSecret?: string }> {
    const plan = await this.em.findOne(Plan, { id: planId });
    if (!plan) throw new NotFoundException('Plan not found');

    const active = await this.em.findOne(Subscription, {
      user: userId,
      status: 'active',
    });
    if (active) {
      active.status = 'canceled';
      active.canceledAt = new Date();
      await this.em.flush();
    }

    const now = new Date();
    const ends = new Date(now.getTime());
    ends.setMonth(ends.getMonth() + 1);

    const sub = this.em.create(Subscription, {
      user: this.em.getReference(User, userId),
      plan,
      status: 'active',
      periodStartsAt: now,
      periodEndsAt: ends,
      paymentGatewaySubscriptionId: `sim_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    });
    await this.em.persistAndFlush(sub);

    const inv = this.em.create(Invoice, {
      amount: plan.priceMonthly,
      currency: 'SAR',
      status: 'paid',
      paymentGatewayId: `sim_pi_${Date.now()}`,
      paymentMethod,
      issuedAt: now,
      paidAt: now,
      user: this.em.getReference(User, userId),
      subscription: sub,
      metadata: {
        periodStart: now.toISOString(),
        periodEnd: ends.toISOString(),
        planName: plan.name,
        aiCredits: plan.aiCreditsUnlimited ? -1 : (plan.aiCreditsLimit ?? 0),
      },
    });
    await this.em.persistAndFlush(inv);

    void couponCode;
    return { subscription: sub, clientSecret: undefined };
  }

  async cancel(userId: number): Promise<{ message: string }> {
    const sub = await this.em.findOne(Subscription, {
      user: userId,
      status: 'active',
    });
    if (!sub) throw new NotFoundException('No active subscription');
    sub.status = 'canceled';
    sub.canceledAt = new Date();
    await this.em.flush();
    return { message: 'Subscription canceled' } as const;
  }

  async invoices(userId: number): Promise<Invoice[]> {
    return this.em.find(
      Invoice,
      { user: userId },
      { orderBy: { issuedAt: 'DESC' } },
    );
  }

  handleCallback(payload: Record<string, unknown>): { ok: true } {
    void payload;
    return { ok: true } as const;
  }
}
