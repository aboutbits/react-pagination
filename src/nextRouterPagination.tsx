import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { IndexType, IUseSearchAndPagination } from './types'
import { convert } from './utils'

function getSingleParameterValue(
  parameter: string | string[] | undefined
): string | undefined {
  return Array.isArray(parameter) ? parameter[0] : parameter
}

export const useSearchAndPagination: IUseSearchAndPagination = function (
  config
) {
  const { indexType = IndexType.ZERO_BASED, pageSize = 15 } = config || {}
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

  const search = useCallback(
    (query: string) => {
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
    [router]
  )

  const clear = useCallback(() => {
    const params = {
      ...router.query,
    }

    delete params['search']
    delete params['page']
    delete params['size']

    router.push({
      query: params,
    })
  }, [router])

  return {
    search: getSingleParameterValue(router.query.search) || '',
    page: convert(
      getSingleParameterValue(router.query.page) || null,
      indexType === IndexType.ZERO_BASED ? 0 : 1
    ),
    size: convert(getSingleParameterValue(router.query.size) || null, pageSize),
    actions: {
      search,
      clear,
      setPage,
    },
  }
}
