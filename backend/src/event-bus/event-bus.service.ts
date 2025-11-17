import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { EventName, EventPayloadMap } from './events.types';

export type Version = `v${number}`;

export interface EventMeta<E extends EventName = EventName> {
  version: Version;
  name: E;
}

type EventHandler<E extends EventName> = (
  payload: EventPayloadMap[E],
  meta: EventMeta<E>,
) => Promise<void> | void;

@Injectable()
export class EventBusService implements OnModuleDestroy {
  private readonly log = new Logger(EventBusService.name);

  // Map of base event names → handlers
  private readonly listeners = new Map<EventName, EventHandler<any>[]>();

  /**
   * Subscribe to a base event name, e.g. "post.published".
   */
  on<E extends EventName>(event: E, handler: EventHandler<E>): void {
    const arr = this.listeners.get(event) || [];
    arr.push(handler);
    this.listeners.set(event, arr);
    this.log.debug(
      `Registered handler for event "${event}" (total: ${arr.length})`,
    );
  }

  /**
   * Unsubscribe a specific handler from a base event.
   */
  off<E extends EventName>(event: E, handler: EventHandler<E>): void {
    const arr = this.listeners.get(event);
    if (!arr) return;
    this.listeners.set(
      event,
      arr.filter((h) => h !== handler),
    );
  }

  /**
   * Emit a base event with a typed payload and an optional version.
   *
   * Example:
   *   await events.emit('post.published', payload)            // defaults to v1
   *   await events.emit('post.published', payload, 'v2')      // explicit version
   */
  async emit<E extends EventName>(
    event: E,
    payload: EventPayloadMap[E],
    version: Version = 'v1',
  ): Promise<void> {
    const handlers = this.listeners.get(event) || [];
    if (handlers.length === 0) return;

    this.log.debug(
      `Emitting "${event}" (version: ${version}) → ${handlers.length} handler(s)`,
    );

    const meta: EventMeta<E> = { version, name: event };

    await Promise.allSettled(
      handlers.map(async (handler) => {
        try {
          await handler(payload, meta);
        } catch (err) {
          const e = err as Error;
          this.log.error(
            `Handler for "${event}" failed: ${e.message}`,
            e.stack,
          );
        }
      }),
    );
  }
  onModuleDestroy(): void {
    this.listeners.clear();
  }
}
