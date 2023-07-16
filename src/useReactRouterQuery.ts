import { useLocation, useNavigate } from 'react-router-dom'
import { Query, ParseQuery, useQuery } from './useQuery'

export const useReactRouterQuery = <T extends Query>(
  defaultQuery: T,
  parse: ParseQuery<T>
) => {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  return useQuery(defaultQuery, parse, {
    getQuery: () => {
      const query: Query = {}
      for (const [key, value] of new URLSearchParams(search).entries()) {
        const decodedValues = value.split(',').map((v) => decodeURIComponent(v))
        query[key] =
          decodedValues.length === 1
            ? (decodedValues[0] as string)
            : decodedValues
      }
      return { ...defaultQuery, ...query }
    },
    setQuery: (query) => {
      const urlSearchParams = new URLSearchParams(search)
      for (const [key, value] of Object.entries(query)) {
        if (value === defaultQuery[key]) {
          urlSearchParams.delete(key)
        } else {
          let values: string[]
          if (Array.isArray(value)) {
            values = value
          } else {
            values = [value]
          }
          const encodedValues = values
            .map((v) => encodeURIComponent(v))
            .join(',')
          urlSearchParams.set(key, encodedValues)
        }
      }
      navigate({ pathname, search: urlSearchParams.toString() })
    },
  })
}
