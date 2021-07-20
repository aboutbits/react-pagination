import { useCallback, useMemo } from 'react'
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom'

import { UseSearchQuery, UsePagination, UseSearchAndPagination } from './types'
import { convert } from './utils'

export function useSearchQueryUrlParameters(): UseSearchQuery {
  const routerHistory = useHistory()
  const { url: routerUrl } = useRouteMatch()
  const { search: routeQuery } = useLocation()

  const params = useMemo(() => new URLSearchParams(routeQuery), [routeQuery])

  return {
    search: params.get('search') || '',
    searchActions: {
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
    },
  }
}

export function usePaginationQueryUrlParameters(): UsePagination {
  const routerHistory = useHistory()
  const { search: routeQuery } = useLocation()
  const { url: routerUrl } = useRouteMatch()

  const params = useMemo(() => new URLSearchParams(routeQuery), [routeQuery])

  const setPage = useCallback(
    (page: number) => {
      params.set('page', page.toString())
      routerHistory.push({
        pathname: routerUrl,
        search: params.toString(),
      })
    },
    [params, routerHistory, routerUrl]
  )

  return {
    page: convert(params.get('page'), 0),
    size: convert(params.get('size'), 15),
    paginationActions: {
      setPage,
    },
  }
}

export function useSearchAndPaginationQueryUrlParameters(): UseSearchAndPagination {
  const searchParameters = useSearchQueryUrlParameters()
  const paginationParameters = usePaginationQueryUrlParameters()

  return {
    ...searchParameters,
    ...paginationParameters,
  }
}
