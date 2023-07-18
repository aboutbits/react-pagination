import { useCallback, useMemo } from 'react'

export type Query = Record<string, string | string[]>

export type AbstractQueryValue = string | number | boolean

export type AbstractQuery = Record<
  string,
  AbstractQueryValue | AbstractQueryValue[]
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

  /**
   * Completely clears the query.
   */
  clearQuery: () => void
}

export const useQuery = <T extends Query>(defaultQuery: T, router: Router) => {
  const resetQuery = useCallback(
    () => router.setQuery(defaultQuery),
    [router, defaultQuery]
  )

  const clearQuery = useCallback(() => router.clearQuery(), [router])

  const query = useMemo(() => router.getQuery(), [router])

  return {
    query,
    setQuery: (query: Partial<T>) => router.setQuery(query),
    resetQuery,
    clearQuery,
  }
}

const abstractQueryToQuery = <T extends Partial<AbstractQuery>>(
  abstractQuery: T
) => {
  const query: Query = {}
  for (const [key, value] of Object.entries(abstractQuery)) {
    if (value !== undefined) {
      query[key] = value.toString()
    }
  }
  return query
}

export const useAbstractQuery = <T extends AbstractQuery>(
  defaultQuery: T,
  router: Router,
  parse: ParseQuery<T>
) => {
  const convertedDefaultQuery = useMemo(
    () => abstractQueryToQuery(defaultQuery),
    [defaultQuery]
  )

  const { query, setQuery, resetQuery, clearQuery } = useQuery(
    convertedDefaultQuery,
    router
  )

  const parsedQuery = useMemo(() => {
    let parsed: Partial<T>
    try {
      parsed = parse(query)
    } catch (e) {
      parsed = {}
    }
    return {
      ...defaultQuery,
      ...parsed,
    }
  }, [defaultQuery, parse, query])

  const setAbstractQuery = useCallback(
    (query: Partial<T>) => setQuery(abstractQueryToQuery(query)),
    [setQuery]
  )

  return {
    query: parsedQuery,
    setQuery: setAbstractQuery,
    resetQuery,
    clearQuery,
  }
}

export type PaginationQuery = { page: number; size: number }

export const usePagination = (
  defaultQuery: PaginationQuery,
  router: Router,
  parse: ParseQuery<PaginationQuery>
) => {
  const { query, setQuery, resetQuery, clearQuery } = useAbstractQuery(
    defaultQuery,
    router,
    parse
  )

  return {
    page: query.page,
    size: query.size,
    setSize: (size: PaginationQuery['size']) => setQuery({ size }),
    setPage: (page: PaginationQuery['page']) => setQuery({ page }),
    resetPagination: resetQuery,
    clearQuery,
  }
}
