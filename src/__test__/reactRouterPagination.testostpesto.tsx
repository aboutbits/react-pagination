import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { BrowserRouter as Router } from 'react-router-dom'
import { useSearchAndPagination } from '../reactRouterPagination'
import { IndexType } from '../types'

const wrapper: React.FC = ({ children }) => <Router>{children}</Router>

test('should initialize pagination', () => {
  const { result } = renderHook(() => useSearchAndPagination(), { wrapper })

  expect(result.current.page).toBe(0)
  expect(result.current.query).toBe('')
  expect(result.current.size).toBe(15)
})

test('should change page', () => {
  const { result } = renderHook(() => useSearchAndPagination(), { wrapper })

  act(() => {
    result.current.actions.setPage(2)
  })

  expect(result.current.page).toBe(2)
  expect(window.location.search).toBe('?page=2')
})

test('should change search', () => {
  const { result } = renderHook(() => useSearchAndPagination(), { wrapper })

  act(() => {
    result.current.actions.query('Max')
  })

  expect(result.current.query).toBe('Max')
  expect(window.location.search).toBe('?search=Max')
})

test('on search change -> page should be reset', () => {
  const { result } = renderHook(() => useSearchAndPagination(), { wrapper })

  act(() => {
    result.current.actions.setPage(2)
  })

  expect(result.current.page).toBe(2)

  act(() => {
    result.current.actions.query('Max')
  })

  expect(result.current.query).toBe('Max')
  expect(result.current.page).toBe(0)
  expect(window.location.search).toBe('?search=Max')
})

test('clear pagination should reset search and page', () => {
  const { result } = renderHook(() => useSearchAndPagination(), { wrapper })

  act(() => {
    result.current.actions.query('Max')
  })

  act(() => {
    result.current.actions.setPage(2)
  })

  expect(result.current.query).toBe('Max')
  expect(result.current.page).toBe(2)

  act(() => {
    result.current.actions.clear()
  })

  expect(result.current.query).toBe('')
  expect(result.current.page).toBe(0)
  expect(window.location.search).toBe('')
})

test('change default parameters', () => {
  const { result } = renderHook(
    () =>
      useSearchAndPagination({ indexType: IndexType.ONE_BASED, pageSize: 10 }),
    { wrapper }
  )

  expect(result.current.page).toBe(1)
  expect(result.current.size).toBe(10)
})
