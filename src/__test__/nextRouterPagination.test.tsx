// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import router from 'next/router'

import { useSearchAndPagination } from '../nextRouterPagination'
import { IndexType } from '../types'

jest.mock('next/router', () => require('next-router-mock'))

test('should initialize pagination', () => {
  const { result } = renderHook(() => useSearchAndPagination())

  expect(result.current.page).toBe(0)
  expect(result.current.search).toBe('')
  expect(result.current.size).toBe(15)
})

test('should change page', () => {
  const { result } = renderHook(() => useSearchAndPagination())

  act(() => {
    result.current.actions.setPage(2)
  })

  expect(result.current.page).toBe(2)
  expect(router.query.page).toBe('2')
})

test('should change search', () => {
  const { result } = renderHook(() => useSearchAndPagination())

  act(() => {
    result.current.actions.search('Max')
  })

  expect(result.current.search).toBe('Max')
  expect(router.query.search).toBe('Max')
})

test('on search change -> page should be reset', () => {
  const { result } = renderHook(() => useSearchAndPagination())

  act(() => {
    result.current.actions.setPage(2)
  })

  expect(result.current.page).toBe(2)
  expect(router.query.page).toBe('2')

  act(() => {
    result.current.actions.search('Max')
  })

  expect(result.current.search).toBe('Max')
  expect(result.current.page).toBe(0)
  expect(router.query.search).toBe('Max')
  expect(router.query.page).toBeUndefined()
})

test('clear pagination should reset search and page', () => {
  const { result } = renderHook(() => useSearchAndPagination())

  act(() => {
    result.current.actions.search('Max')
  })

  act(() => {
    result.current.actions.setPage(2)
  })

  expect(router.query.search).toBe('Max')
  expect(router.query.page).toBe('2')

  act(() => {
    result.current.actions.clear()
  })

  expect(result.current.search).toBe('')
  expect(result.current.page).toBe(0)
  expect(router.query.search).toBeUndefined()
  expect(router.query.page).toBeUndefined()
})

test('change default parameters', () => {
  const { result } = renderHook(() =>
    useSearchAndPagination({ indexType: IndexType.ONE_BASED, pageSize: 10 })
  )

  expect(result.current.page).toBe(1)
  expect(result.current.size).toBe(10)
})
