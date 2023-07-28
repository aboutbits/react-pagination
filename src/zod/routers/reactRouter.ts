import { ZodType, ZodTypeDef } from 'zod'
import {
  PaginationQuery,
  AbstractQuery,
  AbstractQueryOptions,
} from '../../engine'
import {
  useReactRouterQuery,
  useReactRouterQueryAndPagination,
} from '../../routers/reactRouter'
import { zodParser } from '../util'
import { NonNullableRecord } from '../../utils'
import { RouterWithHistoryOptions } from '../../routers/shared'

export const useZodReactRouterQuery = <
  TQuery extends NonNullableRecord<TSchemaOutput>,
  TSchemaOutput extends Partial<AbstractQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput,
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => useReactRouterQuery(defaultQuery, zodParser(schemaQuery), options)

export const useZodReactRouterQueryAndPagination = <
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
  useReactRouterQueryAndPagination(
    defaultQuery,
    zodParser(schemaQuery),
    defaultPagination,
    options,
  )
