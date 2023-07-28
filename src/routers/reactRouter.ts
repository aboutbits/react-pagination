import { useLocation, useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import {
  Query,
  AbstractQuery,
  ParseQuery,
  AbstractQueryOptions,
  useAbstractQuery,
  PaginationQuery,
  useAbstractQueryAndPagination,
  Router,
} from '../engine'
import { QUERY_ARRAY_SEPARATOR, RouterWithHistoryOptions } from './shared'

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

  return {
    getQuery: (defaultQuery) => {
      const query: Query = {}
      for (const [key, value] of new URLSearchParams(search).entries()) {
        const decodedValues = value
          .split(QUERY_ARRAY_SEPARATOR)
          .map((v) => decodeURIComponent(v))
        query[key] =
          decodedValues.length === 1
            ? (decodedValues[0] as string)
            : decodedValues
      }
      return { ...defaultQuery, ...query }
    },
    setQuery: (query, defaultQuery) => {
      const urlSearchParams = new URLSearchParams(search)
      for (const [key, value] of Object.entries(query)) {
        if (value === defaultQuery[key]) {
          urlSearchParams.delete(key)
        } else if (value !== undefined) {
          let values: string[]
          if (Array.isArray(value)) {
            values = value
          } else {
            values = [value]
          }
          const encodedValues = values
            .map((v) => encodeURIComponent(v))
            .join(QUERY_ARRAY_SEPARATOR)
          urlSearchParams.set(key, encodedValues)
        }
      }
      navigate(
        { pathname, search: urlSearchParams.toString() },
        { replace: mergedOptions.setQueryMethod === 'replace' },
      )
    },
  }
}

export const useReactRouterQuery = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const router = useReactRouter(options)
  return useAbstractQuery(defaultQuery, parseQuery, router, options)
}

export const useReactRouterQueryAndPagination = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const router = useReactRouter(options)
  return useAbstractQueryAndPagination(
    defaultQuery,
    parseQuery,
    router,
    defaultPagination,
    options,
  )
}

export const useReactRouterPagination = (
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions & RouterWithHistoryOptions>,
) => {
  const { page, size, setPage, setSize, setPagination, resetPagination } =
    useReactRouterQueryAndPagination({}, () => ({}), defaultPagination, options)
  return { page, size, setPage, setSize, setPagination, resetPagination }
}
