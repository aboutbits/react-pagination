import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { UseSearchQuery, UsePagination, UseSearchAndPagination } from './types'
import { convert } from './utils'

function getSingleParameterValue(
  parameter: string | string[] | undefined
): string | undefined {
  return Array.isArray(parameter) ? parameter[0] : parameter
}

export function useSearch(): UseSearchQuery {
  const router = useRouter()

  return {
    search: getSingleParameterValue(router.query.search) || '',
    searchActions: {
      search: (query: string) => {
        const params: { page?: string; size?: string; search?: string } = {
          ...router.query,
          search: query === '' ? undefined : query,
        }

        delete params['page']
        delete params['size']

        router.push({
          query: params,
        })
      },
      clear: () => {
        const params = {
          ...router.query,
        }

        delete params['search']
        delete params['page']
        delete params['size']

        router.push({
          query: params,
        })
      },
    },
  }
}

export function usePagination(): UsePagination {
  const router = useRouter()

  const setPage = useCallback(
    (page: number) => {
      const params = {
        ...router.query,
        page: page.toString(),
      }

      router.push({
        query: params,
      })
    },
    [router]
  )

  return {
    page: convert(getSingleParameterValue(router.query.page) || null, 0),
    size: convert(getSingleParameterValue(router.query.size) || null, 15),
    paginationActions: {
      setPage,
    },
  }
}

export function useSearchAndPagination(): UseSearchAndPagination {
  const searchParameters = useSearch()
  const paginationParameters = usePagination()

  return {
    ...searchParameters,
    ...paginationParameters,
  }
}
