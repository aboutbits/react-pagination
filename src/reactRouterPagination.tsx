import { useCallback, useMemo } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'

import { UseSearchAndPagination } from './types'
import { convert } from './utils'

export function useSearchAndPagination(): UseSearchAndPagination {
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
    page: convert(params.get('page'), 0),
    size: convert(params.get('size'), 15),
    actions: {
      search,
      clear,
      setPage,
    },
  }
}
