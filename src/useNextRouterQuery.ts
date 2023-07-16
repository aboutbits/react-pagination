import { useRouter } from 'next/router'
import { Query, ParseQuery, useQuery } from './useQuery'

export const useNextRouterQuery = <T extends Query>(
  defaultQuery: T,
  parse: ParseQuery<T>
) => {
  const nextRouter = useRouter()

  return useQuery(defaultQuery, parse, {
    getQuery: () => {
      const query: Query = {}
      for (const [key, value] of Object.entries(nextRouter.query)) {
        if (value !== undefined) {
          query[key] = value
        }
      }
      return { ...defaultQuery, ...query }
    },
    setQuery: (query) => {
      const newQuery = { ...nextRouter.query, ...query }
      for (const [key, value] of Object.entries(query)) {
        if (value === defaultQuery[key]) {
          delete newQuery[key]
        }
      }
      nextRouter.push({ query: newQuery })
    },
  })
}
