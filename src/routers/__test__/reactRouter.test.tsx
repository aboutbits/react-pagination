import { act, renderHook } from '@testing-library/react'
import { z } from 'zod'
import { BrowserRouter } from 'react-router-dom'
import { useQuery, useQueryAndPagination } from '../../zod/routers/reactRouter'
import { usePagination } from '../reactRouter'

const renderHookWithContext = <Result, Props>(
  render: (initialProps: Props) => Result,
) =>
  renderHook(render, {
    wrapper: ({ children }) => {
      return <BrowserRouter>{children}</BrowserRouter>
    },
  })

describe('ReactRouter', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/')
  })

  const searchSchema = z.object({
    search: z.string().optional().catch(undefined),
  })

  const useReactRouterQueryWithSearch = (
    defaultQuery: Partial<z.infer<typeof searchSchema>> = {},
  ) => useQuery(searchSchema, defaultQuery)

  test('should set default page and size', () => {
    const page = 0
    const size = 15
    const { result } = renderHookWithContext(() =>
      usePagination({ page, size }),
    )

    expect(result.current.page).toBe(page)
    expect(result.current.size).toBe(size)
  })

  test('should change page', () => {
    const page = 2

    const { result } = renderHookWithContext(() => usePagination())

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.page).toBe(page)
    expect(window.location.search).toBe(`?page=${page.toString()}`)
  })

  test('should change search', () => {
    const search = 'Max'

    const { result } = renderHookWithContext(() =>
      useReactRouterQueryWithSearch({ search: '' }),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    expect(result.current.query.search).toBe(search)
    expect(window.location.search).toBe(`?search=${search}`)
  })

  test('changing pagination should not reset the remaining query', () => {
    const search = 'Max'
    const page = 2

    const { result } = renderHookWithContext(() =>
      useQueryAndPagination(searchSchema, { search: '' }),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    act(() => {
      result.current.setPage(page)
    })

    expect(window.location.search).toBe(
      `?search=${search}&page=${page.toString()}`,
    )

    act(() => {
      result.current.resetPagination()
    })

    expect(result.current.query.search).toBe(search)
    expect(result.current.page).toBe(0)
    expect(window.location.search).toBe(`?search=${search}`)
  })

  test('change default parameters', () => {
    const page = 1
    const size = 10
    const { result } = renderHookWithContext(() =>
      usePagination({ page, size }),
    )

    expect(result.current.page).toBe(page)
    expect(result.current.size).toBe(size)
  })

  test('changing the remaining query should reset the page', () => {
    const defaultSearch = ''
    const search1 = 'Max'
    const search2 = 'Peter'
    const page = 2

    const { result } = renderHookWithContext(() =>
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
    expect(window.location.search).toBe(
      `?search=${search1}&page=${page.toString()}`,
    )

    act(() => {
      result.current.setQuery({ search: search2 })
    })

    expect(result.current.query.search).toBe(search2)
    expect(result.current.page).toBe(0)
    expect(window.location.search).toBe(`?search=${search2}`)

    act(() => {
      result.current.resetQuery()
    })

    expect(result.current.query.search).toBe(defaultSearch)
    expect(result.current.page).toBe(0)
    expect(window.location.search).toBe('')
  })

  test('changing the remaining query with resetPage set to false should not reset the page', () => {
    const defaultSearch = ''
    const search = 'Max'
    const page = 2

    const { result } = renderHookWithContext(() =>
      useQueryAndPagination(searchSchema, { search: defaultSearch }),
    )

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.page).toBe(page)
    expect(window.location.search).toBe(`?page=${page.toString()}`)

    act(() => {
      result.current.setQuery({ search }, { resetPage: false })
    })

    expect(result.current.query.search).toBe(search)
    expect(result.current.page).toBe(page)
    expect(window.location.search).toBe(
      `?page=${page.toString()}&search=${search}`,
    )

    act(() => {
      result.current.resetQuery({ resetPage: false })
    })

    expect(result.current.query.search).toBe(defaultSearch)
    expect(result.current.page).toBe(page)
    expect(window.location.search).toBe(`?page=${page.toString()}`)
  })

  test('setting a query key should not overwrite other query keys', () => {
    const search = 'Max'
    const department = 'IT'

    const schema = z.object({
      search: z.string().optional().catch(undefined),
      department: z.string().optional().catch(undefined),
    })

    const { result } = renderHookWithContext(() =>
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

  test('unspecified query keys should be left untouched', () => {
    const greeting = 'hello'
    const search = 'Max'
    window.history.pushState({}, '', `/?greeting=${greeting}`)

    const { result } = renderHookWithContext(() =>
      useQuery(searchSchema, { search: '' }),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    expect(result.current.query.search).toBe(search)
    expect(window.location.search).toBe(
      `?greeting=${greeting}&search=${search}`,
    )
  })

  test('query keys with default value should not be stored in the url', () => {
    const defaultSearch = ''

    window.history.pushState({}, '', `/?search=Max`)

    const { result } = renderHookWithContext(() =>
      useQuery(searchSchema, { search: defaultSearch }),
    )

    act(() => {
      result.current.resetQuery()
    })

    expect(result.current.query.search).toBe(defaultSearch)
    expect(window.location.search).toBe('')
  })

  test('default query value should not need to be an empty string', () => {
    const search = ''

    const { result } = renderHookWithContext(() =>
      useQuery(searchSchema, { search: 'Default search' }),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    expect(result.current.query.search).toBe(search)
    expect(window.location.search).toBe(`?search=`)
  })

  test('should handle array query parameters with single and multiple options', () => {
    const optionsSchema = z.object({
      options: z.string().or(z.array(z.string())),
    })

    const { result } = renderHookWithContext(() =>
      useQuery(optionsSchema, { options: [] }),
    )

    act(() => {
      result.current.setQuery({ options: ['A'] })
    })

    expect(result.current.query.options).toStrictEqual('A')
    expect(window.location.search).toBe(`?options=A`)

    act(() => {
      result.current.setQuery({ options: ['A', 'B'] })
    })

    expect(result.current.query.options).toStrictEqual(['A', 'B'])
    expect(window.location.search).toBe(`?options=A&options=B`)
  })
})
