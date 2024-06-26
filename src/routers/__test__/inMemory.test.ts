import { act, renderHook } from '@testing-library/react'
import { z } from 'zod'
import { useQuery, useQueryAndPagination } from '../../zod/routers/inMemory'
import { usePagination } from '../inMemory'

describe('InMemory', () => {
  const searchSchema = z.object({
    search: z.string().optional().catch(undefined),
  })

  const useInMemoryQueryWithSearch = (
    defaultQuery: Partial<z.output<typeof searchSchema>> = {},
  ) => useQuery(searchSchema, defaultQuery)

  test('should set default page and size', () => {
    const page = 0
    const size = 15
    const { result } = renderHook(() => usePagination({ page, size }))

    expect(result.current.page).toBe(page)
    expect(result.current.size).toBe(size)
  })

  test('should change page', () => {
    const page = 2

    const { result } = renderHook(() => usePagination())

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.page).toBe(page)
  })

  test('should change search', () => {
    const search = 'Max'

    const { result } = renderHook(() =>
      useInMemoryQueryWithSearch({ search: '' }),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    expect(result.current.query.search).toBe(search)
  })

  test('changing pagination should not reset the remaining query', () => {
    const search = 'Max'
    const page = 2

    const { result } = renderHook(() =>
      useQueryAndPagination(searchSchema, { search: '' }),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.query.search).toBe(search)

    act(() => {
      result.current.resetPagination()
    })

    expect(result.current.query.search).toBe(search)
    expect(result.current.page).toBe(0)
  })

  test('change default parameters', () => {
    const page = 1
    const size = 10
    const { result } = renderHook(() => usePagination({ page, size }))

    expect(result.current.page).toBe(page)
    expect(result.current.size).toBe(size)
  })

  test('changing the remaining query should reset the page', () => {
    const defaultSearch = ''
    const search1 = 'Max'
    const search2 = 'Peter'
    const page = 2

    const { result } = renderHook(() =>
      useQueryAndPagination(searchSchema, { search: defaultSearch }),
    )

    act(() => {
      result.current.setQuery({ search: search1 })
    })

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.query.search).toBe(search1)
    expect(result.current.page).toBe(page)

    act(() => {
      result.current.setQuery({ search: search2 })
    })

    expect(result.current.query.search).toBe(search2)
    expect(result.current.page).toBe(0)

    act(() => {
      result.current.resetQuery()
    })

    expect(result.current.query.search).toBe(defaultSearch)
    expect(result.current.page).toBe(0)
  })

  test('changing the remaining query with resetPage set to false should not reset the page', () => {
    const defaultSearch = ''
    const search = 'Max'
    const page = 2

    const { result } = renderHook(() =>
      useQueryAndPagination(searchSchema, { search: defaultSearch }),
    )

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.page).toBe(page)

    act(() => {
      result.current.setQuery({ search }, { resetPage: false })
    })

    expect(result.current.query.search).toBe(search)
    expect(result.current.page).toBe(page)

    act(() => {
      result.current.resetQuery({ resetPage: false })
    })

    expect(result.current.query.search).toBe(defaultSearch)
    expect(result.current.page).toBe(page)
  })

  test('setting a query key should not overwrite other query keys', () => {
    const search = 'Max'
    const department = 'IT'

    const schema = z.object({
      search: z.string().optional().catch(undefined),
      department: z.string().optional().catch(undefined),
    })

    const { result } = renderHook(() =>
      useQuery(schema, { search: '', department: '' }),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    act(() => {
      result.current.setQuery({ department })
    })

    expect(result.current.query.search).toBe(search)
    expect(result.current.query.department).toBe(department)
  })

  test('default query value should not need to be an empty string', () => {
    const search = ''

    const { result } = renderHook(() =>
      useQuery(searchSchema, { search: 'Default search' }),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    expect(result.current.query.search).toBe(search)
  })

  test('should handle array query parameters with single and multiple options', () => {
    const optionsSchema = z.object({
      options: z.array(z.string()),
    })

    const { result } = renderHook(() =>
      useQuery(optionsSchema, { options: [] }),
    )

    act(() => {
      result.current.setQuery({ options: ['A'] })
    })

    expect(result.current.query.options).toStrictEqual(['A'])

    act(() => {
      result.current.setQuery({ options: ['A', 'B'] })
    })

    expect(result.current.query.options).toStrictEqual(['A', 'B'])
  })
})
