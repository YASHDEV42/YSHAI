/**
 * Wrapper type used to avoid SWC circular dependency issues
 * by preventing reflection metadata from storing the real type.
 */

export type WrapperType<T> = T;
