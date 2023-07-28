import { ZodType, ZodTypeDef } from 'zod'
import { AbstractQuery, ParseQuery } from '../engine/query'

export const zodParser =
  <
    Output extends AbstractQuery,
    TSchemaOutput extends ReturnType<ParseQuery<Output>>,
    TSchemaDef extends ZodTypeDef,
    TSchemaInput,
  >(
    schema: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  ): ParseQuery<Output> =>
  (q) =>
    schema.parse(q)
