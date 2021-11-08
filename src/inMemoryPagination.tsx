import { useCallback, useMemo, useState } from 'react'
import { IndexType, IUseQueryAndPagination, QueryParameters } from './types'

export const useQueryAndPagination: IUseQueryAndPagination = function (config) {
  const { indexType = IndexType.ZERO_BASED, pageSize = 15 } = config || {}
  const firstPage = indexType === IndexType.ZERO_BASED ? 0 : 1
  const initialState = useMemo(
    () => ({
      page: firstPage,
      size: pageSize,
      queryParameters: config?.defaultQueryParameters || {},
    }),
    []
  )

  const [state, setState] = useState(initialState)

  const updateQuery = useCallback((queryParameters: QueryParameters) => {
    setState((currentState) => {
      const updatedQueryParameters = {
        ...currentState.queryParameters,
        ...queryParameters,
      }

      for (const parameter in queryParameters) {
        if (
          !!config?.defaultQueryParameters &&
          (config.defaultQueryParameters[parameter] === undefined ||
            config.defaultQueryParameters[parameter] ===
              queryParameters[parameter])
        ) {
          delete updatedQueryParameters[parameter]
        }
      }

      return {
        ...currentState,
        page: 0,
        queryParameters: updatedQueryParameters,
      }
    })
  }, [])

  const clear = useCallback(() => {
    setState(() => {
      return initialState
    })
  }, [initialState])

  const setPage = useCallback((page: number) => {
    setState((currentState) => {
      return {
        ...currentState,
        page,
      }
    })
  }, [])

  return {
    queryParameters: {
      ...(config?.defaultQueryParameters ? config.defaultQueryParameters : {}),
      ...state.queryParameters,
    },
    actions: {
      updateQuery,
      clear,
      setPage,
    },
    page: state.page,
    size: state.size,
  }
}
