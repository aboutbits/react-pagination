import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import {
  Query,
  ParseQuery,
  useAbstractQuery,
  AbstractQuery,
  AbstractQueryOptions,
  Router,
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

  const getQuery = useCallback(
    (defaultQuery: Query) => {
      const query: Query = {}
      for (const [key, value] of Object.entries(nextRouter.query)) {
        if (value !== undefined) {
          query[key] = value
        }
      }
      return { ...defaultQuery, ...query }
    },
    [nextRouter.query],
  )

  const setQuery = useCallback(
    (query: Partial<Query>, defaultQuery: Query) => {
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
    [nextRouter, mergedOptions],
  )

  return useMemo(
    () => ({
      getQuery,
      setQuery,
    }),
    [getQuery, setQuery],
  )
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
  return useAbstractQuery(router, parseQuery, defaultQuery, options)
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
  const router = useNextRouter(options)
  const { page, size, setPage, setSize, setPagination, resetPagination } =  useAbstractQueryAndPagination(
    router,
    undefined,
    undefined,
    defaultPagination,
    options,
  )
  return { page, size, setPage, setSize, setPagination, resetPagination }
}

