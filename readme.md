# React Pagination

[![npm package](https://badge.fury.io/js/%40aboutbits%2Freact-pagination.svg)](https://badge.fury.io/js/%40aboutbits%2Freact-pagination)
[![license](https://img.shields.io/github/license/aboutbits/react-pagination)](https://github.com/aboutbits/react-pagination/blob/main/license.md)

Query hooks for React with first-class support for TypeScript! Writing and reading the query, attached to the browser URL or in-memory, made easy!

## Table of content

- [Usage](#usage)
  - [Example usage with Next.js](#example-usage-with-nextjs)
  - [Example usage with React Router and zod](#example-usage-with-react-router-and-zod)
- [Build & Publish](#build--publish)
- [About](#about)

## Usage

Install the package:

```sh
npm install @aboutbits/react-pagination
```

There are a variety of entry points from which to import the hooks `useQuery`, `usePagination` and `useQueryAndPagination`:

- For the [Next.js](https://nextjs.org/) router:
  - `@aboutbits/react-pagination/next-router`
  - `@aboutbits/react-pagination/next-router/zod`
- For [React Router](https://reactrouter.com):
  - `@aboutbits/react-pagination/react-router`
  - `@aboutbits/react-pagination/react-router/zod`
- For an in-memory router that does not modify the browser history:
  - `@aboutbits/react-pagination/in-memory`
  - `@aboutbits/react-pagination/in-memory/zod`

The hooks exported from `@aboutbits/react-pagination/*/zod` are more convenient when using [zod](https://github.com/colinhacks/zod) for the validation of the query.

`useQueryAndPagination` merges the functionality of `useQuery` and `usePagination`. Changing the query resets the page, but changing the page does not reset the query.

Some examples follow, but we recommend having a look at the type definitions for more details about the API.

### Example usage with Next.js

```tsx
import { Query } from '@aboutbits/react-pagination/dist/engine'
import { useQueryAndPagination } from '@aboutbits/react-pagination/dist/routers/nextRouter'

const users = ['Alex', 'Simon', 'Natan', 'Nadia', 'Moritz', 'Marie']

const parseSearch = (query: Query) => {
  for (const [key, value] of Object.entries(query)) {
    if (key === 'search' && !Array.isArray(value)) {
      return { search: value }
    }
  }
  return {}
}

export function UserList() {
  const { page, size, query, setQuery, setPage, resetQuery } =
    useQueryAndPagination({ search: '' }, parseSearch)

  return (
    <div>
      <input
        value={query.search}
        onChange={(event) => setQuery({ search: event.target.value })}
      />
      <button onClick={() => resetQuery()}>Clear Input</button>
      <select
        value={page}
        onChange={(event) => setPage(parseInt(event.target.value))}
      >
        <option value="0">First Page</option>
        <option value="1">Second Page</option>
      </select>
      <ul>
        {users
          .filter((user) =>
            user.toLowerCase().startsWith(query.search.toLowerCase()),
          )
          .slice(page * size, (page + 1) * size)
          .map((user) => (
            <li key={user}>{user}</li>
          ))}
      </ul>
    </div>
  )
}
```

### Example usage with React Router and zod

```tsx
import { useQueryAndPagination } from '@aboutbits/react-pagination/dist/zod/routers/reactRouter'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string(),
  // The input to the parser is going to be a string.
  // We try to convert it to a number and default to undefined if the parsing fails.
  // This continues the parsing of the remaining query.
  // Another possibility would be to not catch errors, which would cancel the entire parsing
  // if "age" cannot be converted to a number.
  age: z.string().pipe(z.coerce.number().optional()).catch(undefined),
})

const users = [
  { name: 'Alex', age: 10 },
  { name: 'Simon', age: 24 },
  { name: 'Natan', age: 88 },
  { name: 'Nadia', age: 42 },
  { name: 'Moritz', age: 35 },
  { name: 'Marie', age: 17 },
]

export function UserList() {
  const { page, size, query, setQuery, setPage, resetQuery } =
    useQueryAndPagination({ name: '', age: 0 }, userSchema, {
      page: 0,
      size: 4,
    })

  return (
    <div>
      <div>
        Name:
        <input
          value={query.name}
          onChange={(event) => setQuery({ name: event.target.value })}
        />
      </div>
      <div>
        Minimum age:
        <input
          value={query.age}
          onChange={(event) => {
            const value = event.target.value
            const parsed = parseInt(value)
            if (!isNaN(parsed)) {
              setQuery({ age: parsed })
            }
          }}
        />
      </div>
      <button onClick={() => resetQuery()}>Clear Input</button>
      <select
        value={page}
        onChange={(event) => setPage(parseInt(event.target.value))}
      >
        <option value="0">First Page</option>
        <option value="1">Second Page</option>
      </select>
      <ul>
        {users
          .filter(
            (user) =>
              user.name.toLowerCase().startsWith(query.name.toLowerCase()) &&
              user.age >= query.age,
          )
          .slice(page * size, (page + 1) * size)
          .map((user) => (
            <li key={user.name}>{user.name}</li>
          ))}
      </ul>
    </div>
  )
}
```

## Build & Publish

To publish the package commit all changes and push them to main. Then run one of the following commands locally:

```sh
npm version patch
npm version minor
npm version major
```

## Information

AboutBits is a company based in South Tyrol, Italy. You can find more information about us
on [our website](https://aboutbits.it).

### Support

For support, please contact [info@aboutbits.it](mailto:info@aboutbits.it).

### Credits

- [All Contributors](../../contributors)

### License

The MIT License (MIT). Please see the [license file](license.md) for more information.
