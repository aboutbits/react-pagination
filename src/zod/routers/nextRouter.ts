import { ZodType, ZodTypeDef } from 'zod'
import {
  PaginationQuery,
  AbstractQuery,
  AbstractQueryOptions,
} from '../../engine'
import {
  useQuery as useQueryVanilla,
  usePagination as usePaginationVanilla,
  useQueryAndPagination as useQueryAndPaginationVanilla,
} from '../../routers/nextRouter'
import { zodParser } from '../util'
import { NonNullableRecord } from '../../utils'
import { RouterWithHistoryOptions } from '../../routers/shared'

export const useQuery = <
  TQuery extends NonNullableRecord<TSchemaOutput>,
  TSchemaOutput extends Partial<AbstractQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>
) => useQueryVanilla(defaultQuery, zodParser(schemaQuery), options)

export const useQueryAndPagination = <
  TQuery extends NonNullableRecord<TSchemaOutput>,
  TSchemaOutput extends Partial<AbstractQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>
) =>
  useQueryAndPaginationVanilla(
    defaultQuery,
    zodParser(schemaQuery),
    defaultPagination,
    options
  )

export const usePagination = (
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>
) => usePaginationVanilla(defaultPagination, options)
