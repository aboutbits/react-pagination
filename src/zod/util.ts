import { ZodType, ZodTypeDef } from 'zod'
import { AbstractQuery, ParseQuery } from '../engine/query'

export const zodParser =
  <
    TQuery extends AbstractQuery,
    Output extends Partial<TQuery>,
    Def extends ZodTypeDef,
    Input
  >(
    schema: ZodType<Output, Def, Input>
  ): ParseQuery<TQuery> =>
  (q) =>
    schema.parse(q)
