export type UseSearchQuery = {
  search: string
  searchActions: { search: (query: string) => void; clear: () => void }
}

export type UsePagination = {
  page: number
  size: number
} & PaginationActions

export type PaginationActions = {
  paginationActions: { setPage: (page: number) => void }
}

export type UseSearchAndPagination = UseSearchQuery & UsePagination
