import { useMemo } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'

import { UseSearchAndPagination } from './types'
import { convert } from './utils'

export function useSearchAndPagination(): UseSearchAndPagination {
  const routerHistory = useHistory()
  const { url: routerUrl } = useRouteMatch()
  const { search: routeQuery } = useLocation()

  const params = useMemo(() => new URLSearchParams(routeQuery), [routeQuery])

  return {
    search: params.get('search') || '',
    page: convert(params.get('page'), 0),
    size: convert(params.get('size'), 15),
    actions: {
      search: (query: string) => {
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
      clear: () => {
        params.delete('search')
        params.delete('page')
        params.delete('size')

        routerHistory.push({
          pathname: routerUrl,
          search: params.toString(),
        })
      },
      setPage: (page: number) => {
        params.set('page', page.toString())
        routerHistory.push({
          pathname: routerUrl,
          search: params.toString(),
        })
      },
    },
  }
}
