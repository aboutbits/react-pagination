React Pagination
=============

This package includes pagination hooks for React. The hooks support saving the search and pagination values in local state or in the browser URL.

## Table of content

- [Usage](#usage)
  - [useSearch](#usesearch)
  - [usePagination](#usepagination)
  - [useSearchAndPagination](#usesearchandpagination)
- [Supported Implementations](#supported-implementations)  
  - [In Memory Pagination](#in-memory-pagination)
  - [React-Router based pagination](#router-based-pagination)
  - [NextJS Router based pagination](#nextjs-router-based-pagination)
- [Build & Publish](#build--publish)
- [Information](#information)

## Usage

First, you have to install the package:

```bash
npm install @aboutbits/react-pagination
```

Second, you can make use of the different hooks.

- [useSearch](#usesearch)
- [usePagination](#usepagination)
- [useSearchAndPagination](#usesearchandpagination)

### useSearch

This hook saves the value of your search input and lets you change it or clear it.

```tsx

import { useSearch } from '@aboutbits/react-pagination/nextRouterPagination'

const users = [
    'Alex', 'Nadia', 'Natan', 'Marie', 'Moritz'
]

function UserList() {
    const { search, searchActions } = useSearch()
  
    return (
        <div>
          <input onChange={searchActions.search} />
          
          <ul>
          {users
                  .filter(user => user.startsWith(search))
                  .map(user => <li>{user}</li>)}
          </ul>
        </div>
    )
}
```

### usePagination

This hook saves the value of your current page and lets you change it or clear it.

```tsx

import { usePagination } from '@aboutbits/react-pagination/nextRouterPagination"

const users = [
  ['Alex', 'Nadia'], 
  ['Natan', 'Marie'], 
  ['Moritz', 'Franz']
]

function UserList() {
    const { page, size, paginationActions } = usePagination()
  
    return (
        <div>
          <select onSelect={paginationActions.setPage}>
            <option value={0}>First Page</option>
            <option value={1}>Second Page</option>
            <option value={2}>Third Page</option>
          </select>
          
          <ul>
          {users[page]
                  .map(user => <li>{user}</li>)}
          </ul>
        </div>
    )
}
```

### useSearchAndPagination

This hook supports the combination of a search value and pagination.
The `clear` function clears the search value and resets the page to the first page.

```tsx
import { useSearchAndPagination } from '@aboutbits/react-pagination/nextRouterPagination'

const users = [
  'Alex', 'Simon', 'Natan', 'Nadia', 'Moritz', 'Marie'
]

function UserList() {
  const { page, size, search, searchActions, paginationActions } = useSearchAndPagination()

  return (
          <div>
            <input onChange={searchActions.search} />
            <button onClick={searchActions.clear}>Clear Input</button>
            <select onSelect={paginationActions.setPage}>
              <option value={0}>First Page</option>
              <option value={1}>Second Page</option>
            </select>
            
            <ul>
              {users.filter(user => user.startsWith(search))
                      .slice(page, page + size)
                      .map(user => <li>{user}</li>)}
            </ul>
          </div>
  )
}
```

## Supported implementations

This package includes 3 different implementations of the above hooks.
- [In Memory](#in-memory-pagination)
- [React Router](#react-router-based-pagination)
- [NextJS Router](#nextjs-router-based-pagination)

### In Memory Pagination

Use this pagination hook if you want to keep track of the pagination in memory. 
This is very handy for dialogs.

```tsx
import { useSearchAndPaginationInMemory } from '@aboutbits/react-pagination'
```

### React-Router based pagination

These are specific hooks for applications that use [React Router](https://reactrouter.com/) for routing.

```tsx
import { useSearchAndPagination } from '@aboutbits/react-pagination/reactRouterPagination'
```

### NextJS Router based pagination

These are specific hooks for applications that use [NextJS Router](https://nextjs.org/docs/api-reference/next/router) for routing.

```tsx
import { useSearchAndPagination } from '@aboutbits/react-pagination/nextRouterPagination'
```

## Build & Publish

To publish the package commit all changes and push them to main. Then run one of the following commands locally:

```bash
npm version patch
npm version minor
npm version major
```

## Information

About Bits is a company based in South Tyrol, Italy. You can find more information about us on [our website](https://aboutbits.it).

### Support

For support, please contact [info@aboutbits.it](mailto:info@aboutbits.it).

### Credits

- [Martin Malfertheiner](https://github.com/mmalfertheiner)
- [Alex Lanz](https://github.com/alexlanz)
- [All Contributors](../../contributors)

### License

The MIT License (MIT). Please see the [license file](license.md) for more information.
