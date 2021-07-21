import { useCallback, useMemo, useState } from 'react'
import { IndexType, IUseSearchAndPagination } from './types'

export const useSearchAndPagination: IUseSearchAndPagination = function (
  config
) {
  const { indexType = IndexType.ZERO_BASED, pageSize = 15 } = config || {}
  const firstPage = indexType === IndexType.ZERO_BASED ? 0 : 1
  const initialState = useMemo(
    () => ({
      page: firstPage,
      size: pageSize,
      searchQuery: '',
    }),
    []
  )

  const [state, setState] = useState(initialState)

  const search = useCallback((query: string) => {
    setState((currentState) => {
      return {
        ...currentState,
        page: 0,
        searchQuery: query,
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
    search: state.searchQuery,
    actions: {
      search,
      clear,
      setPage,
    },
    page: state.page,
    size: state.size,
  }
}
