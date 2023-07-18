export type NonNullableRecord<
  T extends Record<string | number | symbol, unknown>
> = {
    [Key in keyof T]-?: NonNullable<T[Key]>
  }
