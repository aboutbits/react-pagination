import { ZodType, ZodTypeDef } from 'zod'
import { PaginationQuery, AbstractQuery } from '../../engine'
import {
  useQuery as useQueryVanilla,
  usePagination as usePaginationVanilla,
  useQueryAndPagination as useQueryAndPaginationVanilla,
} from '../../routers/reactRouter'
import { zodParser } from '../util'

export const useQuery = <
  TQuery extends AbstractQuery,
  // TODO: `TSchemaOutput` should not just extend `Partial<TQuery>`, but be exactly `Partial<TQuery>`, with not additional keys
  TSchemaOutput extends Partial<TQuery> = Partial<TQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>
) => useQueryVanilla(defaultQuery, zodParser(schemaQuery))

export const useQueryAndPagination = <
  TQuery extends AbstractQuery,
  TSchemaOutput extends Partial<TQuery> = Partial<TQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  defaultPagination?: PaginationQuery
) =>
  useQueryAndPaginationVanilla(
    defaultQuery,
    zodParser(schemaQuery),
    defaultPagination
  )

export const usePagination = (defaultPagination?: PaginationQuery) =>
  usePaginationVanilla(defaultPagination)
