import { useCallback, useMemo } from 'react'
import { queryValueToIntOrUndefined } from '../utils'
import {
  Query,
  AbstractQuery,
  ParseQuery,
  useAbstractQuery,
  Router,
  AbstractQueryOptions,
} from './query'

export type PaginationQuery = {
  /**
   * The page index.
   *
   * @default 0
   */
  page: number
  /**
   * The size of one page.
   *
   * @default 15
   */
  size: number
}

const DEFAULT_PAGINATION: PaginationQuery = {
  page: 0,
  size: 15,
}

export type ChangeQueryOptions = {
  /**
   * Whether the page should be reset to its default value when the query is changed.
   *
   * @default true
   */
  resetPage: boolean
}

const DEFAULT_CHANGE_QUERY_OPTIONS: ChangeQueryOptions = { resetPage: true }

const parsePagination = (query: Query): Partial<PaginationQuery> => {
  return {
    page: queryValueToIntOrUndefined(query.page),
    size: queryValueToIntOrUndefined(query.size),
  }
}

export const useAbstractQueryAndPagination = <
  TQuery extends AbstractQuery,
  TDefaultQuery extends Partial<TQuery>,
>(
  router: Router,
  parseQuery: ParseQuery<TQuery> = () => ({}) ,
  defaultQuery: TDefaultQuery = {} as TDefaultQuery,
  defaultPagination?: Partial<PaginationQuery>,
  options?: Partial<AbstractQueryOptions>,
) => {
  const mergedDefaultPagination = useMemo(
    () => ({
      ...DEFAULT_PAGINATION,
      ...defaultPagination,
    }),
    [defaultPagination],
  )

  const mergedDefaultQueryAndPagination = useMemo(
    () => ({
      ...defaultQuery,
      ...mergedDefaultPagination,
    }),
    [defaultQuery, mergedDefaultPagination],
  )

  const { query, setQuery } = useAbstractQuery(
    router,
    parseQuery,
    mergedDefaultQueryAndPagination,
    options,
  )

  const {
    query: pagination,
    setQuery: setPagination,
    resetQuery: resetPagination,
  } = useAbstractQuery(
    router,
    parsePagination,
    mergedDefaultPagination,
    options,
  )

  const setQueryWithoutPagination = useCallback(
    (query: Partial<TQuery>, options?: Partial<ChangeQueryOptions>) => {
      const mergedOptions = { ...DEFAULT_CHANGE_QUERY_OPTIONS, ...options }
      setQuery({
        ...query,
        page: mergedOptions.resetPage
          ? mergedDefaultPagination.page
          : undefined,
      })
    },
    [setQuery, mergedDefaultPagination.page],
  )

  const resetQuery = useCallback(
    (options?: Partial<ChangeQueryOptions>) => {
      const mergedOptions = { ...DEFAULT_CHANGE_QUERY_OPTIONS, ...options }
      setQuery({
        ...defaultQuery,
        page: mergedOptions.resetPage
          ? mergedDefaultPagination.page
          : undefined,
      })
    },
    [defaultQuery, mergedDefaultPagination.page, setQuery],
  )

  const setPage = useCallback(
    (page: PaginationQuery['page']) => {
      setPagination({ page })
    },
    [setPagination],
  )

  const setSize = useCallback(
    (size: PaginationQuery['size']) => {
      setPagination({ size })
    },
    [setPagination],
  )

  const resetQueryAndPagination = useCallback(() => {
    setQuery(mergedDefaultQueryAndPagination)
  }, [setQuery, mergedDefaultQueryAndPagination])

  return {
    query,
    setQuery: setQueryWithoutPagination,
    resetQuery,
    page: pagination.page,
    size: pagination.size,
    setPage,
    setSize,
    setPagination,
    resetPagination,
    resetQueryAndPagination,
  }
}
