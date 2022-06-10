# oais-web

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The CERN Digital Memory platform web interface, allowing access to most of the features exposed by the OAIS platform API, visualize long-term preservation processes, trigger new jobs, have a comprehensive view on all the archived records, the status of their archival pipeline and access their related assets (e.g. submission, archival and dissemination packages).

Developed in React with semantic-ui.

## Run

Install dependencies

```sh
npm install --force
```

Force is needed because of https://gitlab.cern.ch/digitalmemory/oais-web/-/issues/65.

Produce a build in `build/`

```sh
npm run build
```

Node version 14.19.3 or newer is required for this (use `node -v` to check the current version).

Serve with hot reload on `localhost:3000/`

```sh
npm run serve
```


## Development

OAIS Web expects the OAIS Platform API on `/api/` (you can change the endpoint in `api.js`, setting `API_URL`), served from the same host/port (or the cookie exchange won't work).

Check [the OAIS-platform documentation](https://gitlab.cern.ch/digitalmemory/oais-platform) to quickly deploy a development instance of the whole stack with hot reload on both the backend and the frontend.

Code is linted with ESLint and formatted with Prettier.
