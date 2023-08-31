import { act, renderHook } from '@testing-library/react'
import router from 'next/router'
import { z } from 'zod'
import { expectTypeOf, vi } from 'vitest'
import { useQuery, useQueryAndPagination } from '../../zod/routers/nextRouter'
import { usePagination } from '../nextRouter'

vi.mock('next/router', async () => await import('next-router-mock'))

describe('NextRouter', () => {
  beforeEach(() => {
    router.query = {}
  })

  const searchSchema = z.object({
    search: z.string().optional().catch(undefined),
  })

  const useNextRouterQueryWithSearch = (
    defaultQuery: Partial<z.infer<typeof searchSchema>> = {},
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
    expect(router.query.page).toBe(page.toString())
  })

  test('should change search', () => {
    const search = 'Max'

    const { result } = renderHook(() =>
      useNextRouterQueryWithSearch({ search: '' }),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    expect(result.current.query.search).toBe(search)
    expect(router.query.search).toBe(search)
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

    expect(router.query.search).toBe(search)
    expect(router.query.page).toBe(page.toString())

    act(() => {
      result.current.resetPagination()
    })

    expect(result.current.query.search).toBe(search)
    expectTypeOf(result.current.query.search).toEqualTypeOf<string>()
    expect(router.query.search).toBe(search)
    expect(result.current.page).toBe(0)
    expect(router.query.page).toBeUndefined()
  })

  test('passing no default query should return query values that are possibly undefined', () => {
    const { result: resultQueryAndPagination } = renderHook(() =>
      useQueryAndPagination(searchSchema),
    )
    expectTypeOf(resultQueryAndPagination.current.query.search).toEqualTypeOf<
      string | undefined
    >()

    const { result: resultQuery } = renderHook(() => useQuery(searchSchema))
    expectTypeOf(resultQuery.current.query.search).toEqualTypeOf<
      string | undefined
    >()
  })

  test('passing a default query should return query values that are not undefined', () => {
    const { result: resultQueryAndPagination } = renderHook(() =>
      useQueryAndPagination(searchSchema, { search: '' }),
    )
    expectTypeOf(
      resultQueryAndPagination.current.query.search,
    ).toEqualTypeOf<string>()

    const { result: resultQuery } = renderHook(() =>
      useQuery(searchSchema, { search: '' }),
    )
    expectTypeOf(resultQuery.current.query.search).toEqualTypeOf<string>()

    const { result: resultPagination } = renderHook(() => usePagination())
    expectTypeOf(resultPagination.current.page).toEqualTypeOf<number>()
  })

  test('passing a partial default query should return the default query values as not undefined and the remaining query values as possibly undefined', () => {
    const querySchema = z.object({
      role: z.string(),
      name: z.string(),
    })

    const { result: resultQueryAndPagination } = renderHook(() =>
      useQueryAndPagination(querySchema, { role: '' }),
    )
    expectTypeOf(
      resultQueryAndPagination.current.query.role,
    ).toEqualTypeOf<string>()
    expectTypeOf(resultQueryAndPagination.current.query.name).toEqualTypeOf<
      string | undefined
    >()

    const { result: resultQuery } = renderHook(() =>
      useQuery(querySchema, { name: '' }),
    )
    expectTypeOf(resultQuery.current.query.role).toEqualTypeOf<
      string | undefined
    >()
    expectTypeOf(resultQuery.current.query.name).toEqualTypeOf<string>()
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
      useQueryAndPagination(searchSchema, { search: defaultSearch }),
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
    const defaultDarkMode = true as boolean

    const schema = z.object({
      search: z.string().optional().catch(undefined),
      department: z.string().optional().catch(undefined),
      age: z.string().pipe(z.coerce.number().optional()).catch(undefined),
      birthDate: z.string().pipe(z.coerce.date().optional()).catch(undefined),
      netWorth: z.string().pipe(z.coerce.bigint().optional()).catch(undefined),
      darkMode: z.string().pipe(z.coerce.boolean().optional()).catch(undefined),
    })

    const { result } = renderHook(() =>
      useQuery(schema, {
        search: '',
        department: '',
        age: defaultAge,
        birthDate: defaultBirthDate,
        netWorth: defaultNetWorth,
        darkMode: defaultDarkMode,
      }),
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

    const { result } = renderHook(() => useQuery(searchSchema, { search: '' }))

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
      useQuery(searchSchema, { search: defaultSearch }),
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
      useQuery(searchSchema, { search: 'Default search' }),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    expect(result.current.query.search).toBe(search)
    expectTypeOf(result.current.query.search).toEqualTypeOf<string>()
    expect(router.query.search).toBe(search)
  })

  test('passing no default query should return undefined for a property that is not in the query', () => {
    const { result } = renderHook(() =>
      useQuery(z.object({ department: z.string() })),
    )

    expect(result.current.query.department).toBeUndefined()
    expectTypeOf(result.current.query.department).toEqualTypeOf<
      string | undefined
    >()
  })

  test('the query should be a merge of the default query and the current query', () => {
    const defaultRole = 'ADMIN'

    const { result } = renderHook(() =>
      useQuery(z.object({ department: z.string(), role: z.string() }), {
        role: defaultRole,
      }),
    )

    expect(result.current.query.department).toBeUndefined()
    expect(result.current.query.role).toBe(defaultRole)
  })
})
