import { useRouter } from 'next/router'
import { useMemo } from 'react'
import {
  Query,
  ParseQuery,
  useAbstractQuery,
  AbstractQuery,
  AbstractQueryOptions,
  RouterSSR,
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
): RouterSSR => {
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
    isQueryReady: nextRouter.isReady,
  }
}

export const useQuery = <
  TQuery extends AbstractQuery,
  TDefaultQuery extends Partial<TQuery>,
>(
  parseQuery: ParseQuery<TQuery>,
  defaultQuery?: TDefaultQuery,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const router = useNextRouter(options)
  const result = useAbstractQuery(router, parseQuery, defaultQuery, options)
  return { ...result, isQueryReady: router.isQueryReady }
}

export const useQueryAndPagination = <
  TQuery extends AbstractQuery,
  TDefaultQuery extends Partial<TQuery>,
>(
  parseQuery: ParseQuery<TQuery>,
  defaultQuery?: TDefaultQuery,
  defaultPagination?: Partial<PaginationQuery>,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const router = useNextRouter(options)
  const result = useAbstractQueryAndPagination(
    router,
    parseQuery,
    defaultQuery,
    defaultPagination,
    options,
  )
  return { ...result, isQueryReady: router.isQueryReady }
}

export const usePagination = (
  defaultPagination?: Partial<PaginationQuery>,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const {
    page,
    size,
    setPage,
    setSize,
    setPagination,
    resetPagination,
    isQueryReady,
  } = useQueryAndPagination(() => ({}), {}, defaultPagination, options)
  return {
    page,
    size,
    setPage,
    setSize,
    setPagination,
    resetPagination,
    isQueryReady,
  }
}
