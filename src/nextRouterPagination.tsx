import { ParsedUrlQuery } from 'querystring'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { IndexType, IUseQueryAndPagination, QueryParameters } from './types'
import { convert } from './utils'

function getSingleParameterValue(
  parameter: string | string[] | undefined
): string | undefined {
  return Array.isArray(parameter) ? parameter[0] : parameter
}

function extractCurrentQueryParameters(
  query: ParsedUrlQuery,
  defaultQueryParameters?: QueryParameters
) {
  if (!defaultQueryParameters) {
    return {}
  }

  const result: QueryParameters = defaultQueryParameters

  for (const parameter in defaultQueryParameters) {
    if (
      query[parameter] &&
      getSingleParameterValue(query[parameter]) !== undefined
    ) {
      result[parameter] = getSingleParameterValue(query[parameter]) as string
    }
  }

  return result
}

export const useQueryAndPagination: IUseQueryAndPagination = function (config) {
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

  const query = useCallback(
    (queryParameters: QueryParameters) => {
      const params = {
        ...router.query,
      }

      for (const parameter in queryParameters) {
        if (
          config?.defaultQueryParameters &&
          config.defaultQueryParameters[parameter] ===
            queryParameters[parameter]
        ) {
          delete params[parameter]
        } else {
          params[parameter] = queryParameters[parameter].toString()
        }
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

    delete params['page']
    delete params['size']

    for (const parameter in config?.defaultQueryParameters) {
      delete params[parameter]
    }

    router.push({
      query: params,
    })
  }, [router])

  return {
    queryParameters: extractCurrentQueryParameters(
      router.query,
      config?.defaultQueryParameters
    ),
    page: convert(
      getSingleParameterValue(router.query.page) || null,
      indexType === IndexType.ZERO_BASED ? 0 : 1
    ),
    size: convert(getSingleParameterValue(router.query.size) || null, pageSize),
    actions: {
      query,
      clear,
      setPage,
    },
  }
}
