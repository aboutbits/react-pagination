import { ZodType, ZodTypeDef } from 'zod'
import {
  PaginationQuery,
  AbstractQuery,
  AbstractQueryOptions,
} from '../../engine'
import {
  useInMemoryQuery,
  useInMemoryQueryAndPagination,
} from '../../routers/inMemory'
import { zodParser } from '../util'
import { NonNullableRecord } from '../../utils'

export const useZodInMemoryQuery = <
  TQuery extends NonNullableRecord<TSchemaOutput>,
  TSchemaOutput extends Partial<AbstractQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput,
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  options?: Partial<AbstractQueryOptions>,
) => useInMemoryQuery(defaultQuery, zodParser(schemaQuery), options)

export const useZodInMemoryQueryAndPagination = <
  TQuery extends NonNullableRecord<TSchemaOutput>,
  TSchemaOutput extends Partial<AbstractQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput,
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions>,
) =>
  useInMemoryQueryAndPagination(
    defaultQuery,
    zodParser(schemaQuery),
    defaultPagination,
    options,
  )
