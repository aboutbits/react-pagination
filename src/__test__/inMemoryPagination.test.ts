import { act, renderHook } from '@testing-library/react-hooks'
import { useQueryAndPagination } from '../inMemoryPagination'
import { IndexType } from '../types'

test('should initialize pagination', () => {
  const { result } = renderHook(() => useQueryAndPagination())

  expect(result.current.page).toBe(0)
  expect(result.current.size).toBe(15)
})

test('should change page', () => {
  const { result } = renderHook(() => useQueryAndPagination())

  act(() => {
    result.current.actions.setPage(2)
  })

  expect(result.current.page).toBe(2)
})

test('should change search', () => {
  const { result } = renderHook(() =>
    useQueryAndPagination({ defaultQueryParameters: { search: '' } })
  )

  act(() => {
    result.current.actions.updateQuery({ search: 'Max' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
})

test('on search change -> page should be reset', () => {
  const { result } = renderHook(() =>
    useQueryAndPagination({ defaultQueryParameters: { search: '' } })
  )

  act(() => {
    result.current.actions.setPage(2)
  })

  expect(result.current.page).toBe(2)

  act(() => {
    result.current.actions.updateQuery({ search: 'Max' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(result.current.page).toBe(0)
})

test('clear pagination should reset search and page', () => {
  const { result } = renderHook(() =>
    useQueryAndPagination({ defaultQueryParameters: { search: '' } })
  )

  act(() => {
    result.current.actions.updateQuery({ search: 'Max' })
  })

  act(() => {
    result.current.actions.setPage(2)
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(result.current.page).toBe(2)

  act(() => {
    result.current.actions.clear()
  })

  expect(result.current.queryParameters.search).toBe('')
  expect(result.current.page).toBe(0)
})

test('change default parameters', () => {
  const { result } = renderHook(() =>
    useQueryAndPagination({ indexType: IndexType.ONE_BASED, pageSize: 10 })
  )

  expect(result.current.page).toBe(1)
  expect(result.current.size).toBe(10)
})

test('query multiple different properties, should keep them all', () => {
  const { result } = renderHook(() =>
    useQueryAndPagination({
      defaultQueryParameters: { search: '', department: '' },
    })
  )

  act(() => {
    result.current.actions.updateQuery({ search: 'Max' })
    result.current.actions.updateQuery({ department: 'IT' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(result.current.queryParameters.department).toBe('IT')
})

test('query a property that is not configured, should do nothing', () => {
  const { result } = renderHook(() =>
    useQueryAndPagination({
      defaultQueryParameters: { search: '' },
    })
  )

  act(() => {
    result.current.actions.updateQuery({ department: 'IT' })
  })

  expect(result.current.queryParameters.search).toBe('')
  expect(result.current.queryParameters.department).toBeUndefined()
})
