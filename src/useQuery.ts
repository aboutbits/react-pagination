import { useCallback, useMemo } from 'react'
import { queryValueToIntOrUndefined } from './utils'

export type Query = Record<string, string | string[]>

export type AbstractQueryValueElement = string | number | boolean

export type AbstractQuery = Record<
  string,
  AbstractQueryValueElement | AbstractQueryValueElement[]
>

/**
 * Parses the query.
 *
 * @returns The parameters that could be parsed. An empty record if no parameter could be parsed.
 * @throws If the parsing failed.
 */
export type ParseQuery<T> = (query: Query) => Partial<T>

export type Router = {
  /**
   * @returns The current query.
   */
  getQuery: () => Query

  /**
   * Updates the query by merging the given query with the current query.
   * If the query is bound to the URL, the router navigates to the new URL.
   */
  setQuery: (query: Partial<Query>) => void
}

export const useQuery = <T extends Query>(defaultQuery: T, router: Router) => {
  const resetQuery = useCallback(
    () => router.setQuery(defaultQuery),
    [router, defaultQuery]
  )

  const query = useMemo(() => router.getQuery(), [router])

  return {
    query,
    setQuery: (query: Partial<T>) => router.setQuery(query),
    resetQuery,
  }
}

type AbstractQueryOptions = {
  convertToQuery: <T extends Partial<AbstractQuery>>(abstractQuery: T) => Query
}

const DEFAULT_ABSTRACT_QUERY_OPTIONS: AbstractQueryOptions = {
  convertToQuery: (abstractQuery) => {
    const query: Query = {}
    for (const [key, value] of Object.entries(abstractQuery)) {
      if (value !== undefined) {
        query[key] = value.toString()
      }
    }
    return query
  },
}

export const useAbstractQuery = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  router: Router,
  options?: Partial<AbstractQueryOptions>
) => {
  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_ABSTRACT_QUERY_OPTIONS, ...options }),
    [options]
  )

  const convertedDefaultQuery = useMemo(
    () => mergedOptions.convertToQuery(defaultQuery),
    [mergedOptions, defaultQuery]
  )

  const { query, setQuery, resetQuery } = useQuery(
    convertedDefaultQuery,
    router
  )

  const parsedQuery: T = useMemo(() => {
    let parsed: Partial<T>
    try {
      parsed = parseQuery(query)
    } catch (e) {
      parsed = {}
    }
    return {
      ...defaultQuery,
      ...parsed,
    }
  }, [defaultQuery, parseQuery, query])

  const setAbstractQuery = useCallback(
    (query: Partial<T>) => setQuery(mergedOptions.convertToQuery(query)),
    [setQuery, mergedOptions]
  )

  return {
    query: parsedQuery,
    setQuery: setAbstractQuery,
    resetQuery,
  }
}

export type PaginationQuery = { page: number; size: number }

const parsePagination = (query: Query): Partial<PaginationQuery> => {
  return {
    page: queryValueToIntOrUndefined(query.page),
    size: queryValueToIntOrUndefined(query.size),
  }
}

export const useQueryAndPagination = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  defaultPagination: PaginationQuery,
  router: Router
) => {
  const { query, setQuery, resetQuery } = useAbstractQuery(
    defaultQuery,
    parseQuery,
    router
  )

  const {
    query: pagination,
    setQuery: setPagination,
    resetQuery: resetPagination,
  } = useAbstractQuery(defaultPagination, parsePagination, router)

  return {
    query,
    setQuery,
    resetQuery,
    page: pagination.page,
    size: pagination.size,
    setPage: (page: PaginationQuery['page']) => setPagination({ page }),
    setSize: (size: PaginationQuery['size']) => setPagination({ size }),
    setPagination,
    resetPagination,
    resetQueryAndPagination: () =>
      setQuery({ ...defaultQuery, ...defaultPagination }),
  }
}
