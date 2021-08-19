# OAIS Web Interface

## Run

Install dependencies
```sh
npm install
```

Produce a build in `public/`
```sh
npm run build
```

Serve with hot reload on `localhost:8080/`
```sh
npm run serve
```

## Development

OAIS Web expects the OAIS Platform API on `/api/` (you can change the endpoint in `api.js`, setting `API_URL`), served from the same host (or the cookie exchange won't work).

You can use a reverse proxy such as NGINX or (during development) uncomment the last line of oais-platform/oais_platform/urls.py to serve the files in the `static` folder, then symlink this folder to the build of this repository. I.e.:

```sh
# in oais-platform:
ln -s ../oais-web/public static
# (supposing ../oais-web/public points to the build folder of oais-web)
# in oais-web:
npm run build
```

Web app will then be available at :8000/ and the api at :8000/api/
