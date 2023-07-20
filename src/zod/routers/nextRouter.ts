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
  NextRouterOptions,
} from '../../routers/nextRouter'
import { zodParser } from '../util'
import { NonNullableRecord } from '../../utils'

export const useQuery = <
  TQuery extends NonNullableRecord<TSchemaOutput>,
  TSchemaOutput extends Partial<AbstractQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  options?: Partial<AbstractQueryOptions & NextRouterOptions>
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
  options?: Partial<AbstractQueryOptions & NextRouterOptions>
) =>
  useQueryAndPaginationVanilla(
    defaultQuery,
    zodParser(schemaQuery),
    defaultPagination,
    options
  )

export const usePagination = (
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions & NextRouterOptions>
) => usePaginationVanilla(defaultPagination, options)
