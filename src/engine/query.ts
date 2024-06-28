import { useCallback, useMemo } from 'react'

export type Query = Record<string, string | string[]>

export type AbstractQueryValueElement =
  | string
  | number
  | boolean
  | Date
  | bigint

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
   * @returns The current query. If a property is undefined by the current query, the corresponding property of the default query is taken, which might be undefined too.
   */
  getQuery: (defaultQuery: Query) => Query

  /**
   * Updates the query by merging the given query with the current query. If a property is undefined by the given query and the current query, the corresponding default query is taken, which might be undefined too.
   */
  setQuery: (query: Partial<Query>, defaultQuery: Query) => void
}

export const useQuery = (router: Router, defaultQuery: Query) => {
  const query = router.getQuery(defaultQuery)

  const setQuery = useCallback(
    (query: Query) => {
      router.setQuery(query, defaultQuery)
    },
    [router, defaultQuery],
  )

  const resetQuery = useCallback(() => {
    router.setQuery(defaultQuery, defaultQuery)
  }, [router, defaultQuery])

  return {
    query,
    setQuery,
    resetQuery,
  }
}

export type AbstractQueryOptions = {
  /**
   * How the abstract query is converted to an actual query.
   *
   * @default Each value that is not undefined is converted to a string by calling `.toString()`.
   */
  convertToQuery: (abstractQuery: Partial<AbstractQuery>) => Query
}

const DEFAULT_ABSTRACT_QUERY_OPTIONS: AbstractQueryOptions = {
  convertToQuery: (abstractQuery) => {
    const query: Query = {}
    for (const [key, value] of Object.entries(abstractQuery)) {
      if (Array.isArray(value)) {
        query[key] = value.map((v) => v.toString())
      } else {
        if (value !== undefined) {
          query[key] = value.toString()
        }
      }
    }
    return query
  },
}

export const useAbstractQuery = <
  TQuery extends AbstractQuery,
  TDefaultQuery extends Partial<TQuery>,
>(
  router: Router,
  parseQuery: ParseQuery<TQuery>,
  defaultQuery: TDefaultQuery = {} as TDefaultQuery,
  options?: Partial<AbstractQueryOptions>,
) => {
  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_ABSTRACT_QUERY_OPTIONS, ...options }),
    [options],
  )

  const convertedDefaultQuery = useMemo(
    () => mergedOptions.convertToQuery(defaultQuery),
    [mergedOptions, defaultQuery],
  )

  const { query, setQuery, resetQuery } = useQuery(
    router,
    convertedDefaultQuery,
  )

  const parsedQuery = useMemo(() => {
    let parsed: Partial<TQuery>
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
    (query: Partial<TQuery>) => {
      setQuery(mergedOptions.convertToQuery(query))
    },
    [setQuery, mergedOptions],
  )

  return {
    query: parsedQuery,
    setQuery: setAbstractQuery,
    resetQuery,
  }
}
