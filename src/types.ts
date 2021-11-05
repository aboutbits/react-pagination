export enum IndexType {
  ZERO_BASED = 0,
  ONE_BASED = 1,
}

export type QueryParameters = Record<string, string>

export type Config = {
  indexType?: IndexType
  pageSize?: number
  defaultQueryParameters?: QueryParameters
}

export type Actions = {
  query: (query: QueryParameters) => void
  clear: () => void
  setPage: (page: number) => void
}

export type UseQueryAndPagination = {
  queryParameters: QueryParameters
  page: number
  size: number
  actions: Actions
}

export interface IUseQueryAndPagination {
  (config?: Config): UseQueryAndPagination
}
