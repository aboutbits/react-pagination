import { z } from 'zod'
import { AbstractQuery, ParseQuery } from '../engine/query'

export const zodParser =
  <TSchema extends z.ZodType<AbstractQuery>>(
    schema: TSchema,
  ): ParseQuery<z.output<TSchema>> =>
  (q) =>
    schema.parse(q)
