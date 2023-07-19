import { useRouter } from 'next/router'
import {
  Query,
  ParseQuery,
  useAbstractQuery,
  Router,
  AbstractQuery,
  AbstractQueryOptions,
} from '../engine/query'
import {
  PaginationQuery,
  useAbstractQueryAndPagination,
} from '../engine/pagination'

const useNextRouter = (): Router => {
  const nextRouter = useRouter()

  return {
    getQuery: (defaultQuery) => {
      const query: Query = {}
      for (const [key, value] of Object.entries(nextRouter.query)) {
        if (value !== undefined) {
          query[key] = value
        }
      }
      return { ...defaultQuery, ...query }
    },
    setQuery: (query, defaultQuery) => {
      const newQuery = { ...nextRouter.query, ...query }
      for (const [key, value] of Object.entries(query)) {
        if (value === defaultQuery[key]) {
          delete newQuery[key]
        }
      }
      nextRouter.push({ query: newQuery }, undefined, { shallow: true })
    },
  }
}

export const useNextRouterQuery = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  options?: Partial<AbstractQueryOptions>
) => {
  const router = useNextRouter()
  return useAbstractQuery(defaultQuery, parseQuery, router, options)
}

export const useNextRouterQueryAndPagination = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  defaultPagination?: PaginationQuery
) => {
  const router = useNextRouter()
  return useAbstractQueryAndPagination(
    defaultQuery,
    parseQuery,
    router,
    defaultPagination
  )
}

export const useNextRouterPagination = (
  defaultPagination?: PaginationQuery
) => {
  const { page, size, setPage, setSize, setPagination, resetPagination } =
    useNextRouterQueryAndPagination({}, () => ({}), defaultPagination)
  return { page, size, setPage, setSize, setPagination, resetPagination }
}
