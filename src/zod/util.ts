import { ZodType, ZodTypeDef } from 'zod'
import { AbstractQuery, ParseQuery } from '../engine/query'

export const zodParser =
  <Output extends Partial<AbstractQuery>, Def extends ZodTypeDef, Input>(
    schema: ZodType<Output, Def, Input>,
  ): ParseQuery<Output> =>
  (q) =>
    schema.parse(q)
