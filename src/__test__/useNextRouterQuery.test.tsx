import { act, renderHook } from '@testing-library/react'
import router from 'next/router'
import { z } from 'zod'
import { useNextRouterPagination, useNextRouterQuery } from '../index'
import { NonNullableRecord } from '../utils'

jest.mock('next/router', () => require('next-router-mock'))

beforeEach(() => {
  router.query = {}
})

const paginationSchema = z.object({
  page: z.string().pipe(z.coerce.number().optional()).catch(undefined),
  size: z.string().pipe(z.coerce.number().optional()).catch(undefined),
})

const useConfiguredNextRouterPagination = (
  defaultQuery: NonNullableRecord<z.infer<typeof paginationSchema>>
) => {
  return useNextRouterPagination(defaultQuery, (q) => paginationSchema.parse(q))
}

const searchSchema = z.object({
  search: z.string().optional().catch(undefined),
})

const useNextRouterQueryWithSearch = (
  defaultQuery: NonNullableRecord<z.infer<typeof searchSchema>>
) => useNextRouterQuery(defaultQuery, (q) => searchSchema.parse(q))

test('should initialize pagination', () => {
  const page = 0
  const size = 15
  const { result } = renderHook(() =>
    useConfiguredNextRouterPagination({ page, size })
  )

  expect(result.current.page).toBe(page)
  expect(result.current.size).toBe(size)
})

test('should change page', () => {
  const page = 2

  const { result } = renderHook(() =>
    useConfiguredNextRouterPagination({ page: 0, size: 15 })
  )

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

test('resetting search should not reset pagination', () => {
  const defaultSearch = ''
  const search = 'Max'
  const page = 2

  const { result: resultSearch } = renderHook(() =>
    useNextRouterQueryWithSearch({ search: defaultSearch })
  )
  const { result: resultPagination } = renderHook(() =>
    useConfiguredNextRouterPagination({ page: 0, size: 15 })
  )

  act(() => {
    resultSearch.current.setQuery({ search })
  })

  act(() => {
    resultPagination.current.setPage(page)
  })

  expect(router.query.search).toBe(search)
  expect(router.query.page).toBe(page.toString())

  act(() => {
    resultSearch.current.resetQuery()
  })

  expect(resultSearch.current.query.search).toBe(defaultSearch)
  expect(resultPagination.current.page).toBe(page)
  expect(router.query.search).toBeUndefined()
  expect(router.query.page).toBeDefined()
})

test('resetting pagination should not reset search', () => {
  const search = 'Max'
  const defaultPage = 0
  const page = 2

  const { result: resultSearch } = renderHook(() =>
    useNextRouterQueryWithSearch({ search: '' })
  )
  const { result: resultPagination } = renderHook(() =>
    useConfiguredNextRouterPagination({ page: defaultPage, size: 15 })
  )

  act(() => {
    resultSearch.current.setQuery({ search })
  })

  act(() => {
    resultPagination.current.setPage(page)
  })

  expect(router.query.search).toBe(search)
  expect(router.query.page).toBe(page.toString())

  act(() => {
    resultPagination.current.resetPagination()
  })

  expect(resultSearch.current.query.search).toBe(search)
  expect(resultPagination.current.page).toBe(defaultPage)
  expect(router.query.search).toBeDefined()
  expect(router.query.page).toBeUndefined()
})

test('change default parameters', () => {
  const page = 1
  const size = 10
  const { result } = renderHook(() =>
    useNextRouterPagination({ page, size }, paginationParser)
  )

  expect(result.current.page).toBe(page)
  expect(result.current.size).toBe(size)
})

test('on search change -> page should be reset', () => {
  const { result } = renderHook(() =>
    useNextRouterQuery({ defaultQueryParameters: { search: '' } })
  )

  act(() => {
    result.current.actions.setPage(2)
  })

  expect(result.current.page).toBe(2)
  expect(router.query.page).toBe('2')

  act(() => {
    result.current.actions.updateQuery({ search: 'Max' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(result.current.page).toBe(0)
  expect(router.query.search).toBe('Max')
  expect(router.query.page).toBeUndefined()
})

test('query multiple different properties, should keep them all', () => {
  const { result } = renderHook(() =>
    useNextRouterQuery({
      defaultQueryParameters: { search: '', department: '' },
    })
  )

  act(() => {
    result.current.actions.updateQuery({ search: 'Max' })
  })

  act(() => {
    result.current.actions.updateQuery({ department: 'IT' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(result.current.queryParameters.department).toBe('IT')
})

test('query a property that is not configured, should do nothing', () => {
  const { result } = renderHook(() =>
    useNextRouterQuery({
      defaultQueryParameters: { search: '' },
    })
  )

  act(() => {
    result.current.actions.updateQuery({ department: 'IT' })
  })

  expect(result.current.queryParameters.search).toBe('')
  expect(result.current.queryParameters.department).toBeUndefined()
})

test('properties in the URL, that are not part of the configuration should be left untouched', () => {
  router.query = { greeting: 'hello' }

  const { result } = renderHook(() =>
    useNextRouterQuery({
      defaultQueryParameters: { search: '' },
    })
  )

  act(() => {
    result.current.actions.updateQuery({ search: 'Max' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(result.current.queryParameters.greeting).toBeUndefined()
  expect(router.query.greeting).toBe('hello')
})

test('query property with default value, should remove it from url', () => {
  router.query = { search: 'Max' }

  const { result } = renderHook(() =>
    useNextRouterQuery({
      defaultQueryParameters: { search: '' },
    })
  )

  act(() => {
    result.current.actions.updateQuery({ search: '' })
  })

  expect(result.current.queryParameters.search).toBe('')
  expect(router.query.search).toBeUndefined()
})

test('query property with empty value and different default value', () => {
  const { result } = renderHook(() =>
    useNextRouterQuery({
      defaultQueryParameters: { search: 'Default search' },
    })
  )

  act(() => {
    result.current.actions.updateQuery({ search: '' })
  })

  expect(result.current.queryParameters.search).toBe('')
  expect(router.query.search).toBe('')
})
