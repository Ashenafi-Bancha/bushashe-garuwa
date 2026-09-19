/** Every key optional at every depth — used for translations that may be incomplete. */
export type DeepPartial<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? DeepPartial<U>[]
    : { [K in keyof T]?: DeepPartial<T[K]> };
