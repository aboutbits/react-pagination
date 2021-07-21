React Pagination
=============

This package includes pagination hooks for React. The hooks support saving the search and pagination values in local
state or in the browser URL.

## Table of content

- [Usage](#usage)
    - [useSearchAndPagination](#usesearchandpagination)
- [Supported Implementations](#supported-implementations)
    - [In Memory Pagination](#in-memory-pagination)
    - [React-Router based pagination](#react-router-based-pagination)
    - [NextJS Router based pagination](#nextjs-router-based-pagination)
- [Build & Publish](#build--publish)
- [Information](#information)

## Usage

First, you have to install the package:

```bash
npm install @aboutbits/react-pagination
```

Second, you can make use of the `useSearchAndPagination` hook. This package implements 3 versions of this hook:

- [In Memory](#in-memory-pagination): Use this hook where you don't want to modify browser history. e.g. Dialogs
- [React Router](#react-router-based-pagination): Use this hook if you want to keep track of the state in the URL and
  your project is using React Router.
- [NextJS Router](#nextjs-router-based-pagination): Use this hook if you want to keep track of the state in the URL and
  your project is using NextJS.

### useSearchAndPagination

This hook supports the combination of a search value and pagination and manages the state of the search value, and the
pagination values.

#### The hook supports following configuration parameter object:

|value|type|default|description|
|---|---|---|---|
|indexType|IndexType|IndexType.ZERO_BASED|It defines whether the pagination is zero or one based.|
|pageSize|number|15|Page size of the pagination.|

#### The hook returns the following object:

|value|type|description|
|---|---|---|
|search|string|value of your search parameter|
|page|number|value of the current page|
|size|number|max elements in a single page|
|actions|object|object with 3 functions: search, setPage, clear|

#### Example usage with NextJS

```tsx
import { useSearchAndPagination } from '@aboutbits/react-pagination/dist/nextRouterPagination'

const users = [
    'Alex', 'Simon', 'Natan', 'Nadia', 'Moritz', 'Marie'
]

function UserList() {
    const { page, size, search, actions } = useSearchAndPagination({pageSize: 2})

    return (
        <div>
            <input onChange={(value) => actions.search(value)}/>
            <button onClick={() => actions.clear()}>Clear Input</button>
            <select onSelect={(value) => actions.setPage(value)}>
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

This package includes 3 different implementations of the above hook.

- [In Memory](#in-memory-pagination)
- [React Router](#react-router-based-pagination)
- [NextJS Router](#nextjs-router-based-pagination)

### In Memory Pagination

Use this pagination hook if you want to keep track of the pagination in memory. This is very handy for dialogs.

```tsx
import { useSearchAndPagination } from '@aboutbits/react-pagination/dist/inMemoryPagination'
```

### React-Router based pagination

These are specific hooks for applications that use [React Router](https://reactrouter.com/) for routing.

```tsx
import { useSearchAndPagination } from '@aboutbits/react-pagination/dist/reactRouterPagination'
```

### NextJS Router based pagination

These are specific hooks for applications that use [NextJS Router](https://nextjs.org/docs/api-reference/next/router)
for routing.

```tsx
import { useSearchAndPagination } from '@aboutbits/react-pagination/dist/nextRouterPagination'
```

## Build & Publish

To publish the package commit all changes and push them to main. Then run one of the following commands locally:

```bash
npm version patch
npm version minor
npm version major
```

## Information

About Bits is a company based in South Tyrol, Italy. You can find more information about us
on [our website](https://aboutbits.it).

### Support

For support, please contact [info@aboutbits.it](mailto:info@aboutbits.it).

### Credits

- [All Contributors](../../contributors)

### License

The MIT License (MIT). Please see the [license file](license.md) for more information.
