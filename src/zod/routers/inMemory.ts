import { ZodType, ZodTypeDef } from 'zod'
import { PaginationQuery, AbstractQuery } from '../../engine'
import {
  useInMemoryQuery as useInMemoryQueryVanilla,
  useInMemoryPagination as useInMemoryPaginationVanilla,
  useInMemoryQueryAndPagination as useInMemoryQueryAndPaginationVanilla,
} from '../../routers/inMemory'
import { zodParser } from '../util'

export const useInMemoryQuery = <
  TQuery extends AbstractQuery,
  // TODO: `TSchemaOutput` should not just extend `Partial<TQuery>`, but be exactly `Partial<TQuery>`, with not additional keys
  TSchemaOutput extends Partial<TQuery> = Partial<TQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>
) => useInMemoryQueryVanilla(defaultQuery, zodParser(schemaQuery))

export const useInMemoryQueryAndPagination = <
  TQuery extends AbstractQuery,
  TSchemaOutput extends Partial<TQuery> = Partial<TQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  defaultPagination?: PaginationQuery
) =>
  useInMemoryQueryAndPaginationVanilla(
    defaultQuery,
    zodParser(schemaQuery),
    defaultPagination
  )

export const useInMemoryPagination = (defaultPagination?: PaginationQuery) =>
  useInMemoryPaginationVanilla(defaultPagination)
