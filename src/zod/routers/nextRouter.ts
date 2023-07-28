import { ZodType, ZodTypeDef } from 'zod'
import {
  PaginationQuery,
  AbstractQuery,
  AbstractQueryOptions,
} from '../../engine'
import {
  useNextRouterQuery,
  useNextRouterQueryAndPagination,
} from '../../routers/nextRouter'
import { zodParser } from '../util'
import { NonNullableRecord } from '../../utils'
import { RouterWithHistoryOptions } from '../../routers/shared'

export const useZodNextRouterQuery = <
  TQuery extends NonNullableRecord<TSchemaOutput>,
  TSchemaOutput extends Partial<AbstractQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput,
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => useNextRouterQuery(defaultQuery, zodParser(schemaQuery), options)

export const useZodNextRouterQueryAndPagination = <
  TQuery extends NonNullableRecord<TSchemaOutput>,
  TSchemaOutput extends Partial<AbstractQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput,
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) =>
  useNextRouterQueryAndPagination(
    defaultQuery,
    zodParser(schemaQuery),
    defaultPagination,
    options,
  )
