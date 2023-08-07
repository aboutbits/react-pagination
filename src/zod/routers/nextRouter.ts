import { z } from 'zod'
import { PaginationQuery, AbstractQueryOptions } from '../../engine'
import {
  useQuery as useQueryVanilla,
  useQueryAndPagination as useQueryAndPaginationVanilla,
} from '../../routers/nextRouter'
import { zodParser } from '../util'
import { RouterWithHistoryOptions } from '../../routers/shared'

export const useQuery = <
  TSchema extends z.ZodTypeAny,
  TQuery extends z.output<TSchema>,
>(
  schemaQuery: TSchema,
  defaultQuery: Partial<TQuery> = {},
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => useQueryVanilla(zodParser(schemaQuery), defaultQuery, options)

export const useQueryAndPagination = <
  TSchema extends z.ZodTypeAny,
  TQuery extends z.output<TSchema>,
>(
  schemaQuery: TSchema,
  defaultQuery: Partial<TQuery> = {},
  defaultPagination?: Partial<PaginationQuery>,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) =>
  useQueryAndPaginationVanilla(
    zodParser(schemaQuery),
    defaultQuery,
    defaultPagination,
    options,
  )
