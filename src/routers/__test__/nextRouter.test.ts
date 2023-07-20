import { act, renderHook } from '@testing-library/react'
import router from 'next/router'
import { z } from 'zod'
import { vi } from 'vitest'
import { NonNullableRecord } from '../../utils'
import { useQuery, useQueryAndPagination } from '../../zod/routers/nextRouter'
import { usePagination } from '../nextRouter'

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
  ) => useQuery(defaultQuery, searchSchema)

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
      useQueryAndPagination({ search: '' }, searchSchema)
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
      useQueryAndPagination({ search: defaultSearch }, searchSchema)
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
      useQueryAndPagination({ search: defaultSearch }, searchSchema)
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
    const defaultAge = 42
    const defaultBirthDate = new Date()
    defaultBirthDate.setMilliseconds(0)
    const defaultNetWorth = BigInt(0xf8ffffffffffffffffffffffffff2fffn)
    const defaultDarkMode: boolean | undefined = true

    const schema = z.object({
      search: z.string().optional().catch(undefined),
      department: z.string().optional().catch(undefined),
      age: z.string().pipe(z.coerce.number().optional()).catch(undefined),
      birthDate: z.string().pipe(z.coerce.date().optional()).catch(undefined),
      netWorth: z.string().pipe(z.coerce.bigint().optional()).catch(undefined),
      darkMode: z.string().pipe(z.coerce.boolean().optional()).catch(undefined),
    })

    const { result } = renderHook(() =>
      useQuery(
        {
          search: '',
          department: '',
          age: defaultAge,
          birthDate: defaultBirthDate,
          netWorth: defaultNetWorth,
          darkMode: defaultDarkMode,
        },
        schema
      )
    )

    act(() => {
      result.current.setQuery({ search })
    })

    act(() => {
      result.current.setQuery({ department })
    })

    expect(result.current.query.search).toBe(search)
    expect(result.current.query.department).toBe(department)
    expect(result.current.query.age).toBe(defaultAge)
    expect(result.current.query.birthDate).toEqual(defaultBirthDate)
    expect(result.current.query.netWorth).toEqual(defaultNetWorth)
  })

  test('unspecified query keys should be left untouched', () => {
    const greeting = 'hello'
    router.query = { greeting }

    const { result } = renderHook(() => useQuery({ search: '' }, searchSchema))

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
      useQuery({ search: defaultSearch }, searchSchema)
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
      useQuery({ search: 'Default search' }, searchSchema)
    )

    act(() => {
      result.current.setQuery({ search })
    })

    expect(result.current.query.search).toBe(search)
    expect(router.query.search).toBe(search)
  })
})
