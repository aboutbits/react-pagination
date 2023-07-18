import { Query } from './useQuery'

export type NonNullableRecord<
  T extends Record<string | number | symbol, unknown>
> = {
  [Key in keyof T]-?: NonNullable<T[Key]>
}

export const queryValueToIntOrUndefined = (
  value: Query[keyof Query] | undefined
): number | undefined => {
  if (value === undefined || Array.isArray(value)) {
    return undefined
  }
  const parsed = parseInt(value)
  if (isNaN(parsed)) {
    return undefined
  }
  return parsed
}
