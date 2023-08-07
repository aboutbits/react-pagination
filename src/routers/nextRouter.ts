import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
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
  const [nextRouterQuery, setNextRouterQuery] = useState<
    typeof nextRouter.query
  >({})

  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_NEXT_ROUTER_OPTIONS, ...options }),
    [options],
  )

  useEffect(() => {
    if (nextRouter.isReady) {
      setNextRouterQuery(nextRouter.query)
    }
  }, [nextRouter.isReady, nextRouter.query])

  return {
    getQuery: (defaultQuery) => {
      const query: Query = {}
      for (const [key, value] of Object.entries(nextRouterQuery)) {
        if (value !== undefined) {
          query[key] = value
        }
      }
      return { ...defaultQuery, ...query }
    },
    setQuery: (query, defaultQuery) => {
      const newQuery = { ...nextRouterQuery, ...query }
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

export const useQuery = <TQuery extends AbstractQuery>(
  parseQuery: ParseQuery<TQuery>,
  defaultQuery: Partial<TQuery> = {},
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const router = useNextRouter(options)
  return useAbstractQuery(router, parseQuery, defaultQuery, options)
}

export const useQueryAndPagination = <TQuery extends AbstractQuery>(
  parseQuery: ParseQuery<TQuery>,
  defaultQuery: Partial<TQuery> = {},
  defaultPagination?: Partial<PaginationQuery>,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const router = useNextRouter(options)
  return useAbstractQueryAndPagination(
    router,
    parseQuery,
    defaultQuery,
    defaultPagination,
    options,
  )
}

export const usePagination = (
  defaultPagination?: Partial<PaginationQuery>,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const { page, size, setPage, setSize, setPagination, resetPagination } =
    useQueryAndPagination(() => ({}), {}, defaultPagination, options)
  return { page, size, setPage, setSize, setPagination, resetPagination }
}
