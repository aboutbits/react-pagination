import { useState } from 'react'
import { Query, ParseQuery, useQuery } from './useQuery'

export const useInMemoryRouterQuery = <T extends Query>(
  defaultQuery: T,
  parse: ParseQuery<T>
) => {
  const [query, setQuery] = useState<Query>(defaultQuery)

  return useQuery(defaultQuery, parse, {
    getQuery: () => query,
    setQuery: (query) => setQuery((prevQuery) => ({ ...prevQuery, ...query })),
  })
}
