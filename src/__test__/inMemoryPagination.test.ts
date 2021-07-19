import { act, renderHook } from '@testing-library/react-hooks'
import { useSearchAndPaginationInMemory } from '../inMemoryPagination'

test('should initialize pagination', () => {
  const { result } = renderHook(() => useSearchAndPaginationInMemory())

  expect(result.current.page).toBe(0)
  expect(result.current.search).toBe('')
  expect(result.current.size).toBe(15)
})

test('should change page', () => {
  const { result } = renderHook(() => useSearchAndPaginationInMemory())

  act(() => {
    result.current.paginationActions.setPage(2)
  })

  expect(result.current.page).toBe(2)
})

test('should change search', () => {
  const { result } = renderHook(() => useSearchAndPaginationInMemory())

  act(() => {
    result.current.searchActions.search('Max')
  })

  expect(result.current.search).toBe('Max')
})

test('on search change -> page should be reset', () => {
  const { result } = renderHook(() => useSearchAndPaginationInMemory())

  act(() => {
    result.current.paginationActions.setPage(2)
  })

  expect(result.current.page).toBe(2)

  act(() => {
    result.current.searchActions.search('Max')
  })

  expect(result.current.search).toBe('Max')
  expect(result.current.page).toBe(0)
})

test('clear pagination should reset search and page', () => {
  const { result } = renderHook(() => useSearchAndPaginationInMemory())

  act(() => {
    result.current.searchActions.search('Max')
  })

  act(() => {
    result.current.paginationActions.setPage(2)
  })

  expect(result.current.search).toBe('Max')
  expect(result.current.page).toBe(2)

  act(() => {
    result.current.searchActions.clear()
  })

  expect(result.current.search).toBe('')
  expect(result.current.page).toBe(0)
})
