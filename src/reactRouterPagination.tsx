import { useCallback, useMemo } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'

import { IndexType, IUseQueryAndPagination, QueryParameters } from './types'
import { convert } from './utils'

function extractCurrentQueryParameters(
  query: URLSearchParams,
  defaultQueryParameters?: QueryParameters
) {
  if (!defaultQueryParameters) {
    return {}
  }

  const result: QueryParameters = { ...defaultQueryParameters }

  for (const parameter in defaultQueryParameters) {
    if (query.get(parameter)) {
      result[parameter] = query.get(parameter) as string
    }
  }

  return result
}

export const useQueryAndPagination: IUseQueryAndPagination = function (config) {
  const { indexType = IndexType.ZERO_BASED, pageSize = 15 } = config || {}
  const routerHistory = useHistory()
  const { url: routerUrl } = useRouteMatch()
  const { search: routeQuery } = useLocation()

  const params = useMemo(() => new URLSearchParams(routeQuery), [routeQuery])

  const updateQuery = useCallback(
    (queryParameters: QueryParameters) => {
      for (const parameter in queryParameters) {
        if (
          config?.defaultQueryParameters &&
          config.defaultQueryParameters[parameter] ===
            queryParameters[parameter]
        ) {
          params.delete(parameter)
        } else {
          params.set(parameter, queryParameters[parameter].toString())
        }
      }

      params.delete('page')
      params.delete('size')

      routerHistory.push({
        pathname: routerUrl,
        search: params.toString(),
      })
    },
    [routerHistory, params]
  )

  const clear = useCallback(() => {
    for (const parameter in config?.defaultQueryParameters) {
      params.delete(parameter)
    }

    params.delete('page')
    params.delete('size')

    routerHistory.push({
      pathname: routerUrl,
      search: params.toString(),
    })
  }, [routerHistory, params])

  const setPage = useCallback(
    (page: number) => {
      params.set('page', page.toString())
      routerHistory.push({
        pathname: routerUrl,
        search: params.toString(),
      })
    },
    [routerHistory, params]
  )

  return {
    queryParameters: extractCurrentQueryParameters(
      params,
      config?.defaultQueryParameters
    ),
    page: convert(
      params.get('page'),
      indexType === IndexType.ZERO_BASED ? 0 : 1
    ),
    size: convert(params.get('size'), pageSize),
    actions: {
      updateQuery,
      clear,
      setPage,
    },
  }
}
