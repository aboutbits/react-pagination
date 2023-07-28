import { useRouter } from 'next/router'
import { useMemo } from 'react'
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
import { RouterWithHistoryOptions } from './shared'

const DEFAULT_NEXT_ROUTER_OPTIONS: RouterWithHistoryOptions = {
  setQueryMethod: 'replace',
}

const useNextRouter = (
  options: undefined | Partial<RouterWithHistoryOptions>,
): Router => {
  const nextRouter = useRouter()

  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_NEXT_ROUTER_OPTIONS, ...options }),
    [options],
  )

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
      const newQueryWithoutDefaults = Object.fromEntries(
        Object.entries(newQuery).filter(
          ([key, value]) => value !== defaultQuery[key],
        ),
      )
      if (mergedOptions.setQueryMethod === 'push') {
        void nextRouter.push({ query: newQueryWithoutDefaults }, undefined, {
          shallow: true,
        })
      } else {
        void nextRouter.replace({ query: newQueryWithoutDefaults }, undefined, {
          shallow: true,
        })
      }
    },
  }
}

export const useNextRouterQuery = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const router = useNextRouter(options)
  return useAbstractQuery(defaultQuery, parseQuery, router, options)
}

export const useNextRouterQueryAndPagination = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const router = useNextRouter(options)
  return useAbstractQueryAndPagination(
    defaultQuery,
    parseQuery,
    router,
    defaultPagination,
    options,
  )
}

export const useNextRouterPagination = (
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const { page, size, setPage, setSize, setPagination, resetPagination } =
    useNextRouterQueryAndPagination({}, () => ({}), defaultPagination, options)
  return { page, size, setPage, setSize, setPagination, resetPagination }
}
