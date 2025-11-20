import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  AbstractQuery,
  AbstractQueryOptions,
  PaginationQuery,
  ParseQuery,
  Query,
  Router,
  useAbstractQuery,
  useAbstractQueryAndPagination,
} from '../engine'
import { RouterWithHistoryOptions } from './shared'

const DEFAULT_REACT_ROUTER_OPTIONS: RouterWithHistoryOptions = {
  setQueryMethod: 'replace',
}

const useReactRouter = (
  options: undefined | Partial<RouterWithHistoryOptions>,
): Router => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  const mergedOptions = useMemo(
    () => ({ ...DEFAULT_REACT_ROUTER_OPTIONS, ...options }),
    [options],
  )

  const getQuery = useCallback(
    (defaultQuery: Query) => {
      const query: Query = {}
      const urlSearchParams = new URLSearchParams(search)
      for (const key of urlSearchParams.keys()) {
        const value = urlSearchParams.getAll(key)
        query[key] =
          value.length === 1 && value[0] !== undefined ? value[0] : value
      }
      return { ...defaultQuery, ...query }
    },
    [search],
  )

  const setQuery = useCallback(
    (query: Partial<Query>, defaultQuery: Query) => {
      const urlSearchParams = new URLSearchParams(search)
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          const defaultValue = defaultQuery[key]

          if (
            defaultValue !== undefined &&
            value.toString() === defaultValue.toString()
          ) {
            urlSearchParams.delete(key)
          } else {
            const [firstValue, ...restValues] = Array.isArray(value)
              ? value
              : [value]

            if (firstValue !== undefined) {
              urlSearchParams.set(key, firstValue)
            }

            for (const restValue of restValues) {
              urlSearchParams.append(key, restValue)
            }
          }
        }
      }
      navigate(
        { pathname, search: urlSearchParams.toString() },
        { replace: mergedOptions.setQueryMethod === 'replace' },
      )
    },
    [mergedOptions.setQueryMethod, navigate, pathname, search],
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
  const router = useReactRouter(options)
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
  const router = useReactRouter(options)
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
  const router = useReactRouter(options)
  const { page, size, setPage, setSize, setPagination, resetPagination } =
    useAbstractQueryAndPagination(
      router,
      undefined,
      undefined,
      defaultPagination,
      options,
    )
  return { page, size, setPage, setSize, setPagination, resetPagination }
}
