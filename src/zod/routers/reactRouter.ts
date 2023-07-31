import { z } from 'zod'
import { PaginationQuery, AbstractQueryOptions } from '../../engine'
import {
  useQuery as useQueryVanilla,
  useQueryAndPagination as useQueryAndPaginationVanilla,
} from '../../routers/reactRouter'
import { zodParser } from '../util'
import { RouterWithHistoryOptions } from '../../routers/shared'
import { NonNullableRecord } from '../../utils'

export const useQuery = <TSchema extends z.ZodTypeAny>(
  defaultQuery: NonNullableRecord<z.output<TSchema>>,
  schemaQuery: TSchema,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => useQueryVanilla(defaultQuery, zodParser(schemaQuery), options)

export const useQueryAndPagination = <TSchema extends z.ZodTypeAny>(
  defaultQuery: NonNullableRecord<z.output<TSchema>>,
  schemaQuery: TSchema,
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) =>
  useQueryAndPaginationVanilla(
    defaultQuery,
    zodParser(schemaQuery),
    defaultPagination,
    options,
  )
