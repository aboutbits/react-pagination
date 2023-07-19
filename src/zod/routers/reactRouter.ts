import { ZodType, ZodTypeDef } from 'zod'
import { PaginationQuery, AbstractQuery } from '../../engine'
import {
  useReactRouterQuery as useReactRouterQueryVanilla,
  useReactRouterPagination as useReactRouterPaginationVanilla,
  useReactRouterQueryAndPagination as useReactRouterQueryAndPaginationVanilla,
} from '../../routers/reactRouter'
import { zodParser } from '../util'

export const useReactRouterQuery = <
  TQuery extends AbstractQuery,
  // TODO: `TSchemaOutput` should not just extend `Partial<TQuery>`, but be exactly `Partial<TQuery>`, with not additional keys
  TSchemaOutput extends Partial<TQuery> = Partial<TQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>
) => useReactRouterQueryVanilla(defaultQuery, zodParser(schemaQuery))

export const useReactRouterQueryAndPagination = <
  TQuery extends AbstractQuery,
  TSchemaOutput extends Partial<TQuery> = Partial<TQuery>,
  TSchemaDef extends ZodTypeDef = ZodTypeDef,
  TSchemaInput = TSchemaOutput
>(
  defaultQuery: TQuery,
  schemaQuery: ZodType<TSchemaOutput, TSchemaDef, TSchemaInput>,
  defaultPagination?: PaginationQuery
) =>
  useReactRouterQueryAndPaginationVanilla(
    defaultQuery,
    zodParser(schemaQuery),
    defaultPagination
  )

export const useReactRouterPagination = (defaultPagination?: PaginationQuery) =>
  useReactRouterPaginationVanilla(defaultPagination)
