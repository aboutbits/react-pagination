export const QUERY_ARRAY_SEPARATOR = ','

export type RouterWithHistoryOptions = {
  /**
   * Whether the router should push a new URL to the browser history or replace the current URL.
   *
   * @default 'replace'
   */
  setQueryMethod: 'replace' | 'push'
}
