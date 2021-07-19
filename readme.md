React Pagination
=============

This package includes pagination hooks for React.

## Table of content

- [Usage](#usage)
  - [In Memory Pagination](#in-memory-pagination)
  - [Router based pagination](#router-based-pagination)
- [Build & Publish](#build--publish)
- [Information](#information)

## Usage

First, you have to install the package:

```bash
npm install @aboutbits/react-pagination
```

Second, you can make use of the different hooks.

### In Memory Pagination

Use this pagination hook if you want to keep track of the pagination in memory. This is very handy for dialogs.

```tsx
import { ReactElement } from "react";
import { useSearchAndPaginationInMemory } from '@aboutbits/react-pagination'

function UsersDialog(): ReactElement {

  const {
    page,
    size,
    search,
    searchActions,
    paginationActions,
  } = useSearchAndPaginationInMemory()

  return (
          <Dialog>
            <DialogSelectHeader
                    title="Users"
                    search={search}
                    searchActions={searchActions}
            />
            <AsyncView
                    {...useSearchUsers({
                      page: page,
                      size: size,
                      query: search,
                    })}
                    renderSuccess={(data) => (
                            <DisplayData
                                    data={data}
                                    paginationActions={paginationActions}
                            />
                    )}
                    renderLoading={<LoadingList />}
                    renderError={(error) => (
                            <Error error={error} />
                    )}
            />
          </Dialog>
  )

}
```

### Router based pagination

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
