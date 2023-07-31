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

export const useAbstractQueryAndPagination = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  router: Router,
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions>,
) => {
  const mergedDefaultPagination = {
    ...DEFAULT_PAGINATION,
    ...defaultPagination,
  }
  const mergedDefaultQueryAndPagination = {
    ...defaultQuery,
    ...mergedDefaultPagination,
  }

  const { query, setQuery } = useAbstractQuery(
    mergedDefaultQueryAndPagination,
    parseQuery,
    router,
    options,
  )

  const {
    query: pagination,
    setQuery: setPagination,
    resetQuery: resetPagination,
  } = useAbstractQuery(
    mergedDefaultPagination,
    parsePagination,
    router,
    options,
  )

  return {
    query,
    setQuery: (query: Partial<T>, options?: Partial<ChangeQueryOptions>) => {
      const mergedOptions = { ...DEFAULT_CHANGE_QUERY_OPTIONS, ...options }
      setQuery({
        ...query,
        page: mergedOptions.resetPage
          ? mergedDefaultPagination.page
          : undefined,
      })
    },
    resetQuery: (options?: Partial<ChangeQueryOptions>) => {
      const mergedOptions = { ...DEFAULT_CHANGE_QUERY_OPTIONS, ...options }
      setQuery({
        ...defaultQuery,
        page: mergedOptions.resetPage
          ? mergedDefaultPagination.page
          : undefined,
      })
    },
    page: pagination.page,
    size: pagination.size,
    setPage: (page: PaginationQuery['page']) => {
      setPagination({ page })
    },
    setSize: (size: PaginationQuery['size']) => {
      setPagination({ size })
    },
    setPagination,
    resetPagination,
    resetQueryAndPagination: () => {
      setQuery(mergedDefaultQueryAndPagination)
    },
  }
}
