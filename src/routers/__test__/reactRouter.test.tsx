import { act, renderHook } from '@testing-library/react'
import { z } from 'zod'
import { BrowserRouter } from 'react-router-dom'
import { NonNullableRecord } from '../../utils'
import {
  useZodReactRouterQuery,
  useZodReactRouterQueryAndPagination,
} from '../../zod/routers/reactRouter'
import { useReactRouterPagination } from '../reactRouter'

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
    defaultQuery: NonNullableRecord<z.infer<typeof searchSchema>>,
  ) => useZodReactRouterQuery(defaultQuery, searchSchema)

  test('should set default page and size', () => {
    const page = 0
    const size = 15
    const { result } = renderHookWithContext(() =>
      useReactRouterPagination({ page, size }),
    )

    expect(result.current.page).toBe(page)
    expect(result.current.size).toBe(size)
  })

  test('should change page', () => {
    const page = 2

    const { result } = renderHookWithContext(() => useReactRouterPagination())

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.page).toBe(page)
    expect(window.location.search).toBe(`?page=${page}`)
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
      useZodReactRouterQueryAndPagination({ search: '' }, searchSchema),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    act(() => {
      result.current.setPage(page)
    })

    expect(window.location.search).toBe(`?search=${search}&page=${page}`)

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
      useReactRouterPagination({ page, size }),
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
      useZodReactRouterQueryAndPagination(
        { search: defaultSearch },
        searchSchema,
      ),
    )

    act(() => {
      result.current.setQuery({ search: search1 })
    })

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.query.search).toBe(search1)
    expect(result.current.page).toBe(page)
    expect(window.location.search).toBe(`?search=${search1}&page=${page}`)

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
      useZodReactRouterQueryAndPagination(
        { search: defaultSearch },
        searchSchema,
      ),
    )

    act(() => {
      result.current.setPage(page)
    })

    expect(result.current.page).toBe(page)
    expect(window.location.search).toBe(`?page=${page}`)

    act(() => {
      result.current.setQuery({ search }, { resetPage: false })
    })

    expect(result.current.query.search).toBe(search)
    expect(result.current.page).toBe(page)
    expect(window.location.search).toBe(`?page=${page}&search=${search}`)

    act(() => {
      result.current.resetQuery({ resetPage: false })
    })

    expect(result.current.query.search).toBe(defaultSearch)
    expect(result.current.page).toBe(page)
    expect(window.location.search).toBe(`?page=${page}`)
  })

  test('setting a query key should not overwrite other query keys', () => {
    const search = 'Max'
    const department = 'IT'

    const schema = z.object({
      search: z.string().optional().catch(undefined),
      department: z.string().optional().catch(undefined),
    })

    const { result } = renderHookWithContext(() =>
      useZodReactRouterQuery({ search: '', department: '' }, schema),
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
      useZodReactRouterQuery({ search: '' }, searchSchema),
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
      useZodReactRouterQuery({ search: defaultSearch }, searchSchema),
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
      useZodReactRouterQuery({ search: 'Default search' }, searchSchema),
    )

    act(() => {
      result.current.setQuery({ search })
    })

    expect(result.current.query.search).toBe(search)
    expect(window.location.search).toBe(`?search=`)
  })
})
