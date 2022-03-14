# oais-web

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

The CERN Digital Memory web interface, allowing access to most of the features exposed by the OAIS platform API, visualize long-term preservation processes, trigger new jobs, have a comprehensive view on all the archived records, the status of their archival pipeline and access their related assets (e.g. submission, archival and dissemination packages).

Developed in React with semantic-ui. Uses [react-searchkit](https://inveniosoftware.github.io/react-searchkit/) for the "internal" search view.

## Run

Install dependencies

```sh
npm install --force
```

Force is needed because of https://gitlab.cern.ch/digitalmemory/oais-web/-/issues/20.

Produce a build in `build/`

```sh
npm run build
```

Serve with hot reload on `localhost:3000/`

```sh
npm run serve
```

## Development

OAIS Web expects the OAIS Platform API on `/api/` (you can change the endpoint in `api.js`, setting `API_URL`), served from the same host (or the cookie exchange won't work).

Check [the OAIS-platform documentation](https://gitlab.cern.ch/digitalmemory/oais-platform) to quickly deploy a development instance of the whole stack with hot reload on both the backend and the frontend.

Code is linted with ESLint and formatted with Prettier.
