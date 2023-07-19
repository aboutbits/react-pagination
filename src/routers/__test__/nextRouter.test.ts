import { act, renderHook } from '@testing-library/react'
import router from 'next/router'
import { z } from 'zod'
import { vi } from 'vitest'
import { NonNullableRecord } from '../../utils'
import {
  useNextRouterQuery,
  useNextRouterPagination,
  useNextRouterQueryAndPagination,
} from '../../zod'

vi.mock('next/router', () => require('next-router-mock'))

describe('NextRouter', () => {
  beforeEach(() => {
    router.query = {}
  })

  const searchSchema = z.object({
    search: z.string().optional().catch(undefined),
  })

  const useNextRouterQueryWithSearch = (
    defaultQuery: NonNullableRecord<z.infer<typeof searchSchema>>
  ) => useNextRouterQuery(defaultQuery, searchSchema)

  test('should set default page and size', () => {
    const page = 0
    const size = 15
    const { result } = renderHook(() => useNextRouterPagination({ page, size }))

    expect(result.current.page).toBe(page)
    expect(result.current.size).toBe(size)
  })

  test('should change page', () => {
    const page = 2

    const { result } = renderHook(() => useNextRouterPagination())

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.page).toBe(page)
    expect(router.query.page).toBe(page.toString())
  })

  test('should change search', () => {
    const search = 'Max'

    const { result } = renderHook(() =>
      useNextRouterQueryWithSearch({ search: '' })
    )

    act(() => {
      result.current.setQuery({ search })
    })

    expect(result.current.query?.search).toBe(search)
    expect(router.query.search).toBe(search)
  })

  test('changing pagination should not reset the remaining query', () => {
    const search = 'Max'
    const page = 2

    const { result } = renderHook(() =>
      useNextRouterQueryAndPagination({ search: '' }, searchSchema)
    )

    act(() => {
      result.current.setQuery({ search })
    })

    act(() => {
      result.current.setPage(page)
    })

    expect(router.query.search).toBe(search)
    expect(router.query.page).toBe(page.toString())

    act(() => {
      result.current.resetPagination()
    })

    expect(result.current.query.search).toBe(search)
    expect(router.query.search).toBe(search)
    expect(result.current.page).toBe(0)
    expect(router.query.page).toBeUndefined()
  })

  test('change default parameters', () => {
    const page = 1
    const size = 10
    const { result } = renderHook(() => useNextRouterPagination({ page, size }))

    expect(result.current.page).toBe(page)
    expect(result.current.size).toBe(size)
  })

  test('changing the remaining query should reset the page', () => {
    const defaultSearch = ''
    const search1 = 'Max'
    const search2 = 'Peter'
    const page = 2

    const { result } = renderHook(() =>
      useNextRouterQueryAndPagination({ search: defaultSearch }, searchSchema)
    )

    act(() => {
      result.current.setQuery({ search: search1 })
    })

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.query.search).toBe(search1)
    expect(router.query.search).toBe(search1)

    expect(result.current.page).toBe(page)
    expect(router.query.page).toBe(page.toString())

    act(() => {
      result.current.setQuery({ search: search2 })
    })

    expect(result.current.query.search).toBe(search2)
    expect(router.query.search).toBe(search2)
    expect(result.current.page).toBe(0)
    expect(router.query.page).toBeUndefined()

    act(() => {
      result.current.resetQuery()
    })

    expect(result.current.query.search).toBe(defaultSearch)
    expect(router.query.search).toBeUndefined()
    expect(result.current.page).toBe(0)
    expect(router.query.page).toBeUndefined()
  })

  test('changing the remaining query with resetPage set to false should not reset the page', () => {
    const defaultSearch = ''
    const search = 'Max'
    const page = 2

    const { result } = renderHook(() =>
      useNextRouterQueryAndPagination({ search: defaultSearch }, searchSchema)
    )

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.page).toBe(page)
    expect(router.query.page).toBe(page.toString())

    act(() => {
      result.current.setQuery({ search }, { resetPage: false })
    })

    expect(result.current.query.search).toBe(search)
    expect(router.query.search).toBe(search)
    expect(result.current.page).toBe(page)
    expect(router.query.page).toBe(page.toString())

    act(() => {
      result.current.resetQuery({ resetPage: false })
    })

    expect(result.current.query.search).toBe(defaultSearch)
    expect(router.query.search).toBeUndefined()
    expect(result.current.page).toBe(page)
    expect(router.query.page).toBe(page.toString())
  })

  test('setting a query key should not overwrite other query keys', () => {
    const search = 'Max'
    const department = 'IT'

    const schema = z.object({
      search: z.string().optional().catch(undefined),
      department: z.string().optional().catch(undefined),
    })

    const { result } = renderHook(() =>
      useNextRouterQuery({ search: '', department: '' }, schema)
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

  test('unspecified query keys should be left untouched', () => {
    const greeting = 'hello'
    router.query = { greeting }

    const { result } = renderHook(() =>
      useNextRouterQuery({ search: '' }, searchSchema)
    )

    act(() => {
      result.current.setQuery({ search: 'Max' })
    })

    expect(result.current.query.search).toBe('Max')
    expect(router.query.greeting).toBe(greeting)
  })

  test('query keys with default value should not be stored in the url', () => {
    const defaultSearch = ''

    router.query = { search: 'Max' }

    const { result } = renderHook(() =>
      useNextRouterQuery({ search: defaultSearch }, searchSchema)
    )

    act(() => {
      result.current.resetQuery()
    })

    expect(result.current.query.search).toBe(defaultSearch)
    expect(router.query.search).toBeUndefined()
  })

  test('default query value should not need to be an empty string', () => {
    const search = ''

    const { result } = renderHook(() =>
      useNextRouterQuery({ search: 'Default search' }, searchSchema)
    )

    act(() => {
      result.current.setQuery({ search })
    })

    expect(result.current.query.search).toBe(search)
    expect(router.query.search).toBe(search)
  })
})
