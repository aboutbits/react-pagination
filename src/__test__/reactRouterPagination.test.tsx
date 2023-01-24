import React, { ReactNode } from 'react'
import { act, renderHook } from '@testing-library/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { useQueryAndPagination } from '../reactRouterPagination'
import { IndexType } from '../types'

function Wrapper({ children }: { children?: ReactNode }) {
  return <Router>{children}</Router>
}

beforeEach(() => {
  window.history.pushState({}, '', '/')
})

test('should initialize pagination', () => {
  const { result } = renderHook(() => useQueryAndPagination(), {
    wrapper: Wrapper,
  })

  expect(result.current.page).toBe(0)
  expect(result.current.size).toBe(15)
})

test('should change page', () => {
  const { result } = renderHook(() => useQueryAndPagination(), {
    wrapper: Wrapper,
  })

  act(() => {
    result.current.actions.setPage(2)
  })

  expect(result.current.page).toBe(2)
  expect(window.location.search).toBe('?page=2')
})

test('should change search', () => {
  const { result } = renderHook(
    () => useQueryAndPagination({ defaultQueryParameters: { search: '' } }),
    { wrapper: Wrapper }
  )

  act(() => {
    result.current.actions.updateQuery({ search: 'Max' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(window.location.search).toBe('?search=Max')
})

test('clear pagination should reset search and page', () => {
  const { result } = renderHook(
    () => useQueryAndPagination({ defaultQueryParameters: { search: '' } }),
    { wrapper: Wrapper }
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
  expect(window.location.search).toBe('')
})

test('change default parameters', () => {
  const { result } = renderHook(
    () =>
      useQueryAndPagination({ indexType: IndexType.ONE_BASED, pageSize: 10 }),
    { wrapper: Wrapper }
  )

  expect(result.current.page).toBe(1)
  expect(result.current.size).toBe(10)
})

test('query multiple different properties, should keep them all', () => {
  const { result } = renderHook(
    () =>
      useQueryAndPagination({
        defaultQueryParameters: { search: '', department: '' },
      }),
    { wrapper: Wrapper }
  )

  act(() => {
    result.current.actions.updateQuery({ search: 'Max' })
    result.current.actions.updateQuery({ department: 'IT' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(result.current.queryParameters.department).toBe('IT')
})

test('query a property that is not configured, should do nothing', () => {
  const { result } = renderHook(
    () =>
      useQueryAndPagination({
        defaultQueryParameters: { search: '' },
      }),
    { wrapper: Wrapper }
  )

  act(() => {
    result.current.actions.updateQuery({ department: 'IT' })
  })

  expect(result.current.queryParameters.search).toBe('')
  expect(result.current.queryParameters.department).toBeUndefined()
})

test('properties in the URL, that are not part of the configuration should be left untouched', () => {
  window.history.pushState({}, '', '/?greeting=hello')

  const { result } = renderHook(
    () =>
      useQueryAndPagination({
        defaultQueryParameters: { search: '' },
      }),
    { wrapper: Wrapper }
  )

  act(() => {
    result.current.actions.updateQuery({ search: 'Max' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(result.current.queryParameters.greeting).toBeUndefined()
  expect(window.location.search).toBe('?greeting=hello&search=Max')
})

test('query property with default value, should remove it from url', () => {
  window.history.pushState({}, '', '/?search=Anton')

  const { result } = renderHook(
    () =>
      useQueryAndPagination({
        defaultQueryParameters: { search: '' },
      }),
    { wrapper: Wrapper }
  )

  act(() => {
    result.current.actions.updateQuery({ search: '' })
  })

  expect(result.current.queryParameters.search).toBe('')
  expect(window.location.search).toBe('')
})

test('query property with empty value and different default value', () => {
  const { result } = renderHook(
    () =>
      useQueryAndPagination({
        defaultQueryParameters: { search: 'Default search' },
      }),
    { wrapper: Wrapper }
  )

  act(() => {
    result.current.actions.updateQuery({ search: '' })
  })

  expect(result.current.queryParameters.search).toBe('')
  expect(window.location.search).toBe('?search=')
})
