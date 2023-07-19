import { ZodType, ZodTypeDef } from 'zod'
import { PaginationQuery, AbstractQuery } from '../../engine'
import {
  useNextRouterQuery as useNextRouterQueryVanilla,
  useNextRouterPagination as useNextRouterPaginationVanilla,
  useNextRouterQueryAndPagination as useNextRouterQueryAndPaginationVanilla,
} from '../../routers/nextRouter'
import { zodParser } from '../util'

export const useNextRouterQuery = <
  TQuery extends AbstractQuery,
  // TODO: `TSchemaOutput` should not just extend `Partial<TQuery>`, but be exactly `Partial<TQuery>`, with not additional keys
  TSchemaOutput extends Partial<TQuery> = Partial<TQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>
) => useNextRouterQueryVanilla(defaultQuery, zodParser(schemaQuery))

export const useNextRouterQueryAndPagination = <
  TQuery extends AbstractQuery,
  TSchemaOutput extends Partial<TQuery> = Partial<TQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  defaultPagination?: PaginationQuery
) =>
  useNextRouterQueryAndPaginationVanilla(
    defaultQuery,
    zodParser(schemaQuery),
    defaultPagination
  )

export const useNextRouterPagination = (defaultPagination?: PaginationQuery) =>
  useNextRouterPaginationVanilla(defaultPagination)
