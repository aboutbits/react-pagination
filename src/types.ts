export enum IndexType {
  ZERO_BASED = 0,
  ONE_BASED = 1,
}

export type Config = {
  indexType?: IndexType
  pageSize?: number
}

export type Actions = {
  search: (query: string) => void
  clear: () => void
  setPage: (page: number) => void
}

export type UseSearchAndPagination = {
  search: string
  page: number
  size: number
  actions: Actions
}

export interface IUseSearchAndPagination {
  (config?: Config): UseSearchAndPagination
}
