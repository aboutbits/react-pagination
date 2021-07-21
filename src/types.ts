export type UseSearchAndPagination = {
  search: string
  page: number
  size: number
  actions: {
    search: (query: string) => void
    clear: () => void
    setPage: (page: number) => void
  }
}
