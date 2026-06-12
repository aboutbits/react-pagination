import { z } from 'zod'
import { AbstractQuery, ParseQuery } from '../engine/query'

export const zodParser =
  <
    Output extends AbstractQuery,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
    TSchema extends z.ZodType<Output>,
  >(
    schema: TSchema,
  ): ParseQuery<Output> =>
  (q) =>
    schema.parse(q)
