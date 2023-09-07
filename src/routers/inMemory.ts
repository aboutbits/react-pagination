import { useCallback, useMemo, useState } from 'react'
import {
  AbstractQuery,
  AbstractQueryOptions,
  PaginationQuery,
  ParseQuery,
  Query,
  Router,
  useAbstractQuery,
  useAbstractQueryAndPagination,
} from '../engine'

const useInMemoryRouter = (): Router => {
  const [inMemoryQuery, setInMemoryQuery] = useState<Query>({})

  const getQuery = useCallback(
    (defaultQuery: Query) => {
      return { ...defaultQuery, ...inMemoryQuery }
    },
    [inMemoryQuery],
  )

  const setQuery = useCallback(
    (query: Partial<Query>) => {
      const sanitizedQuery: Query = {}
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          sanitizedQuery[key] = value
        }
      }
      setInMemoryQuery({ ...inMemoryQuery, ...sanitizedQuery })
    },
    [inMemoryQuery],
  )

  return useMemo(
    () => ({
      getQuery,
      setQuery,
    }),
    [getQuery, setQuery],
  )
}

export const useQuery = <
  TQuery extends AbstractQuery,
  TDefaultQuery extends Partial<TQuery>,
>(
  parseQuery: ParseQuery<TQuery>,
  defaultQuery?: TDefaultQuery,
  options?: Partial<AbstractQueryOptions>,
) => {
  const router = useInMemoryRouter()
  return useAbstractQuery(router, parseQuery, defaultQuery, options)
}

export const useQueryAndPagination = <
  TQuery extends AbstractQuery,
  TDefaultQuery extends Partial<TQuery>,
>(
  parseQuery: ParseQuery<TQuery>,
  defaultQuery?: TDefaultQuery,
  defaultPagination?: Partial<PaginationQuery>,
  options?: Partial<AbstractQueryOptions>,
) => {
  const router = useInMemoryRouter()
  return useAbstractQueryAndPagination(
    router,
    parseQuery,
    defaultQuery,
    defaultPagination,
    options,
  )
}

export const usePagination = (
  defaultPagination?: Partial<PaginationQuery>,
  options?: Partial<AbstractQueryOptions>,
) => {
  const { page, size, setPage, setSize, setPagination, resetPagination } =
    useQueryAndPagination(() => ({}), {}, defaultPagination, options)
  return { page, size, setPage, setSize, setPagination, resetPagination }
}
