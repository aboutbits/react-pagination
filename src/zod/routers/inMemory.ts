import { z } from 'zod'
import { PaginationQuery, AbstractQueryOptions } from '../../engine'
import {
  useQuery as useQueryVanilla,
  useQueryAndPagination as useQueryAndPaginationVanilla,
} from '../../routers/inMemory'
import { NonNullableRecord } from '../../utils'
import { zodParser } from '../util'

export const useQuery = <TSchema extends z.ZodTypeAny>(
  defaultQuery: NonNullableRecord<z.output<TSchema>>,
  schemaQuery: TSchema,
  options?: Partial<AbstractQueryOptions>,
) => useQueryVanilla(defaultQuery, zodParser(schemaQuery), options)

export const useQueryAndPagination = <TSchema extends z.ZodTypeAny>(
  defaultQuery: NonNullableRecord<z.output<TSchema>>,
  schemaQuery: TSchema,
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions>,
) =>
  useQueryAndPaginationVanilla(
    defaultQuery,
    zodParser(schemaQuery),
    defaultPagination,
    options,
  )
