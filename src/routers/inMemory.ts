import { useState } from 'react'
import {
  AbstractQuery,
  AbstractQueryOptions,
  PaginationQuery,
  ParseQuery,
  Query,
  Router,
  useAbstractQuery,
  useAbstractQueryAndPagination,
} from '../engine'

const useInMemoryRouter = (): Router => {
  const [inMemoryQuery, setInMemoryQuery] = useState<Query>({})

  return {
    getQuery: (defaultQuery) => {
      return { ...defaultQuery, ...inMemoryQuery }
    },
    setQuery: (query) => {
      const sanitizedQuery: Query = {}
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          sanitizedQuery[key] = value
        }
      }
      setInMemoryQuery({ ...inMemoryQuery, ...sanitizedQuery })
    },
  }
}

export const useInMemoryQuery = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  options?: Partial<AbstractQueryOptions>,
) => {
  const router = useInMemoryRouter()
  return useAbstractQuery(defaultQuery, parseQuery, router, options)
}

export const useInMemoryQueryAndPagination = <T extends AbstractQuery>(
  defaultQuery: T,
  parseQuery: ParseQuery<T>,
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions>,
) => {
  const router = useInMemoryRouter()
  return useAbstractQueryAndPagination(
    defaultQuery,
    parseQuery,
    router,
    defaultPagination,
    options,
  )
}

export const useInMemoryPagination = (
  defaultPagination?: PaginationQuery,
  options?: Partial<AbstractQueryOptions>,
) => {
  const { page, size, setPage, setSize, setPagination, resetPagination } =
    useInMemoryQueryAndPagination({}, () => ({}), defaultPagination, options)
  return { page, size, setPage, setSize, setPagination, resetPagination }
}
