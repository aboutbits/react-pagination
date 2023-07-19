import { queryValueToIntOrUndefined } from '../utils'
import {
  Query,
  AbstractQuery,
  ParseQuery,
  useAbstractQuery,
  Router,
  AbstractQueryOptions,
} from './query'

export type PaginationQuery = { page: number; size: number }

export type ChangeQueryOptions = { resetPage: boolean }

const DEFAULT_PAGINATION: PaginationQuery = {
  page: 0,
  size: 15,
}

const parsePagination = (query: Query): Partial<PaginationQuery> => {
  return {
    page: queryValueToIntOrUndefined(query.page),
    size: queryValueToIntOrUndefined(query.size),
  }
}

const DEFAULT_RESET_PAGE = true

export const useAbstractQueryAndPagination = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  router: Router,
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions>
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
    options
  )

  const {
    query: pagination,
    setQuery: setPagination,
    resetQuery: resetPagination,
  } = useAbstractQuery(
    mergedDefaultPagination,
    parsePagination,
    router,
    options
  )

  return {
    query,
    setQuery: (query: Partial<T>, options?: Partial<ChangeQueryOptions>) => {
      const resetPage =
        options?.resetPage === undefined
          ? DEFAULT_RESET_PAGE
          : options.resetPage
      setQuery({
        ...query,
        page: resetPage ? mergedDefaultPagination.page : undefined,
      })
    },
    resetQuery: (options?: Partial<ChangeQueryOptions>) => {
      const resetPage =
        options?.resetPage === undefined
          ? DEFAULT_RESET_PAGE
          : options.resetPage
      setQuery({
        ...defaultQuery,
        page: resetPage ? mergedDefaultPagination.page : undefined,
      })
    },
    page: pagination.page,
    size: pagination.size,
    setPage: (page: PaginationQuery['page']) => setPagination({ page }),
    setSize: (size: PaginationQuery['size']) => setPagination({ size }),
    setPagination,
    resetPagination,
    resetQueryAndPagination: () => setQuery(mergedDefaultQueryAndPagination),
  }
}
