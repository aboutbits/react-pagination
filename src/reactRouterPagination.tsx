import { useCallback, useMemo } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'

import { IndexType, IUseQueryAndPagination } from './types'
import { convert } from './utils'

export const useSearchAndPagination: IUseQueryAndPagination = function (
  config
) {
  const { indexType = IndexType.ZERO_BASED, pageSize = 15 } = config || {}
  const routerHistory = useHistory()
  const { url: routerUrl } = useRouteMatch()
  const { search: routeQuery } = useLocation()

  const params = useMemo(() => new URLSearchParams(routeQuery), [routeQuery])

  const search = useCallback(
    (query: string) => {
      if (query === '') {
        params.delete('search')
      } else {
        params.set('search', query)
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
    params.delete('search')
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
    search: params.get('search') || '',
    page: convert(
      params.get('page'),
      indexType === IndexType.ZERO_BASED ? 0 : 1
    ),
    size: convert(params.get('size'), pageSize),
    actions: {
      search,
      clear,
      setPage,
    },
  }
}
