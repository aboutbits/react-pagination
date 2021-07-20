export function convert(parameter: string | null, fallback: number): number {
  if (parameter !== null) {
    const converted = parseInt(parameter)

    if (Number.isInteger(converted) && converted > 0) {
      return converted
    }
  }

  return fallback
}
