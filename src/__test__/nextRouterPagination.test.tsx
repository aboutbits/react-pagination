// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import router from 'next/router'

import { useQueryAndPagination } from '../nextRouterPagination'
import { IndexType } from '../types'

jest.mock('next/router', () => require('next-router-mock'))

beforeEach(() => {
  router.query = {}
})

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
  expect(router.query.page).toBe('2')
})

test('should change search', () => {
  const { result } = renderHook(() =>
    useQueryAndPagination({ defaultQueryParameters: { search: '' } })
  )

  act(() => {
    result.current.actions.updateQuery({ search: 'Max' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(router.query.search).toBe('Max')
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

  expect(router.query.search).toBe('Max')
  expect(router.query.page).toBe('2')

  act(() => {
    result.current.actions.clear()
  })

  expect(result.current.queryParameters.search).toBe('')
  expect(result.current.page).toBe(0)
  expect(router.query.search).toBeUndefined()
  expect(router.query.page).toBeUndefined()
})

test('change default parameters', () => {
  const { result } = renderHook(() =>
    useQueryAndPagination({ indexType: IndexType.ONE_BASED, pageSize: 10 })
  )

  expect(result.current.page).toBe(1)
  expect(result.current.size).toBe(10)
})

test('on search change -> page should be reset', () => {
  const { result } = renderHook(() =>
    useQueryAndPagination({ defaultQueryParameters: { search: '' } })
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
    useQueryAndPagination({
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

test('properties in the URL, that are not part of the configuration should be left untouched', () => {
  router.query = { greeting: 'hello' }

  const { result } = renderHook(() =>
    useQueryAndPagination({
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
    useQueryAndPagination({
      defaultQueryParameters: { search: '' },
    })
  )

  act(() => {
    result.current.actions.updateQuery({ search: '' })
  })

  expect(result.current.queryParameters.search).toBe('')
  expect(router.query.search).toBeUndefined()
})
