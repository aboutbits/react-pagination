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
  TDefaultQuery extends Partial<TQuery>,
>(
  schemaQuery: TSchema,
  defaultQuery?: TDefaultQuery,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) =>
  useQueryVanilla<TQuery, TDefaultQuery>(
    zodParser(schemaQuery),
    defaultQuery,
    options,
  )

export const useQueryAndPagination = <
  TSchema extends z.ZodTypeAny,
  TQuery extends z.output<TSchema>,
  TDefaultQuery extends Partial<TQuery>,
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
