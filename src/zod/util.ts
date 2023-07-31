import { z } from 'zod'
import { AbstractQuery, ParseQuery } from '../engine/query'

export const zodParser =
  <Output extends AbstractQuery, TSchema extends z.ZodType<Output>>(
    schema: TSchema,
  ): ParseQuery<Output> =>
  (q) =>
    schema.parse(q)
