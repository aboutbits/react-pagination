import { z } from 'zod'
import {
  AbstractQuery,
  AbstractQueryOptions,
  PaginationQuery,
} from '../../engine'
import {
  useQuery as useQueryVanilla,
  useQueryAndPagination as useQueryAndPaginationVanilla,
} from '../../routers/nextRouter'
import { RouterWithHistoryOptions } from '../../routers/shared'
import { zodParser } from '../util'

export const useQuery = <
  TSchema extends z.ZodType<AbstractQuery>,
  TDefaultQuery extends Partial<z.output<TSchema>>,
>(
  schemaQuery: TSchema,
  defaultQuery?: TDefaultQuery,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => useQueryVanilla(zodParser(schemaQuery), defaultQuery, options)

export const useQueryAndPagination = <
  TSchema extends z.ZodType<AbstractQuery>,
  TDefaultQuery extends Partial<z.output<TSchema>>,
>(
  schemaQuery: TSchema,
  defaultQuery?: TDefaultQuery,
  defaultPagination?: Partial<PaginationQuery>,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) =>
  useQueryAndPaginationVanilla(
    zodParser(schemaQuery),
    defaultQuery,
    defaultPagination,
    options,
  )
