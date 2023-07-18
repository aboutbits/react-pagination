import { useRouter } from 'next/router'
import {
  Query,
  ParseQuery,
  useAbstractQuery,
  usePagination,
  Router,
  AbstractQuery,
  PaginationQuery,
} from './useQuery'

const useNextRouter = <T extends AbstractQuery>(defaultQuery: T): Router => {
  const nextRouter = useRouter()

  return {
    getQuery: () => {
      const query: Query = {}
      for (const [key, value] of Object.entries(nextRouter.query)) {
        if (value !== undefined) {
          query[key] = value
        }
      }
      return { ...defaultQuery, ...query }
    },
    setQuery: (query) => {
      const newQuery = { ...nextRouter.query, ...query }
      for (const [key, value] of Object.entries(query)) {
        if (value === defaultQuery[key]) {
          delete newQuery[key]
        }
      }
      nextRouter.push({ query: newQuery }, undefined, { shallow: true })
    },
    clearQuery: () => {
      nextRouter.push({ query: {} }, undefined, { shallow: true })
    },
  }
}

export const useNextRouterQuery = <T extends AbstractQuery>(
  defaultQuery: T,
  parse: ParseQuery<T>
) => {
  const router = useNextRouter(defaultQuery)
  return useAbstractQuery(defaultQuery, router, parse)
}

export const useNextRouterPagination = (
  defaultQuery: PaginationQuery,
  parse: ParseQuery<PaginationQuery>
) => {
  const router = useNextRouter(defaultQuery)
  return usePagination(defaultQuery, router, parse)
}
