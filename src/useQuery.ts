import { useMemo } from 'react'

export type Query = Record<string, string | string[]>

/**
 * @throws On failed parsing.
 */
export type ParseQuery<T> = (query: Query) => T

export type Router = {
  getQuery: () => Query
  /**
   * Updates the query by merging the given query with the current query.
   * If the query is bound to the URL, the user is navigated to the new URL.
   */
  setQuery: (query: Query) => void
}

export const useQuery = <T extends Query>(
  defaultQuery: T,
  parse: ParseQuery<T>,
  router: Router
) => {
  const resetQuery = () => router.setQuery(defaultQuery)

  const parsedQuery = useMemo(() => {
    const query = router.getQuery()
    try {
      return parse(query)
    } catch (e) {
      return undefined
    }
  }, [parse, router])

  return {
    query: parsedQuery,
    setQuery: (query: T) => router.setQuery(query),
    resetQuery,
  }
}

// type PaginationQuery = {
//   page: number
//   size: number
// }

// export const usePagination = (
//   defaultQuery: PaginationQuery,
//   router: Router<PaginationQuery>
// ) => {
//   const { setQuery, query, resetQuery } = useQuery(defaultQuery, router)

//   return {
//     setPagination: setQuery,
//     resetPagination: resetQuery,
//     ...query,
//   }
// }
