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
