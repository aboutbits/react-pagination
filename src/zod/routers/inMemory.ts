import { z } from 'zod'
import { PaginationQuery, AbstractQueryOptions } from '../../engine'
import {
  useQuery as useQueryVanilla,
  useQueryAndPagination as useQueryAndPaginationVanilla,
} from '../../routers/inMemory'
import { zodParser } from '../util'

export const useQuery = <
  TSchema extends z.ZodTypeAny,
  TQuery extends z.output<TSchema>,
  TDefaultQuery extends Partial<TQuery>,
>(
  schemaQuery: TSchema,
  defaultQuery?: TDefaultQuery,
  options?: Partial<AbstractQueryOptions>,
) =>
  useQueryVanilla(
    zodParser<TQuery, TSchema>(schemaQuery),
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
  options?: Partial<AbstractQueryOptions>,
) =>
  useQueryAndPaginationVanilla(
    zodParser<TQuery, TSchema>(schemaQuery),
    defaultQuery,
    defaultPagination,
    options,
  )
