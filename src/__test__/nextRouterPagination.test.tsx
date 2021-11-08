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
    result.current.actions.query({ search: 'Max' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(router.query.search).toBe('Max')
})

test('clear pagination should reset search and page', () => {
  const { result } = renderHook(() =>
    useQueryAndPagination({ defaultQueryParameters: { search: '' } })
  )

  act(() => {
    result.current.actions.query({ search: 'Max' })
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
    result.current.actions.query({ search: 'Max' })
  })

  expect(result.current.queryParameters.search).toBe('Max')
  expect(result.current.page).toBe(0)
  expect(router.query.search).toBe('Max')
  expect(router.query.page).toBeUndefined()
})
