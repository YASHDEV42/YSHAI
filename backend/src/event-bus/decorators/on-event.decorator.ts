import 'reflect-metadata';

export const EVENT_HANDLER_METADATA = 'event_handler_metadata';

export interface EventHandlerMetadata {
  event: string;
}

export function OnEvent(event: string): MethodDecorator {
  return (target, propertyKey, descriptor) => {
    const handlers: EventHandlerMetadata[] =
      Reflect.getMetadata(EVENT_HANDLER_METADATA, target.constructor) || [];

    handlers.push({
      event,
    });

    Reflect.defineMetadata(
      EVENT_HANDLER_METADATA,
      handlers,
      target.constructor,
    );
    return descriptor;
  };
}
