import { useState, useCallback, useMemo } from 'react'
import { UseSearchAndPagination } from './types'

const useSearchAndPaginationInMemory = (): UseSearchAndPagination => {
  const initialState = useMemo(
    () => ({
      page: 0,
      size: 15,
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
    searchActions: {
      search,
      clear,
    },
    page: state.page,
    size: state.size,
    paginationActions: { setPage },
  }
}

export { useSearchAndPaginationInMemory }
