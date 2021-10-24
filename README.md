# ${APP_NAME}

${APP_NAME} is an installable, fully offline-enabled PWA that helps you
conveniently store and easily access images directly from your browser, desktop,
or home screen.

## Features

* Small: barely any storage space or network traffic required.
* Convenient: installable and accessible directly from your desktop or home
  screen.
* Offline: after the initial visit, ${APP_NAME} works without any mobile or
  internet connection.
* Easy: no complicated configuration or confusing interface. Just open
  ${APP_NAME} and view your image.

## Running ${APP_NAME}

${APP_NAME} is currently made of entirely static code, so there's no complicated
server setup necessary. You can use any http server to host the files.

For example, you could run the following and then access ${APP_NAME} at
`http://localhost:4629`:

```
python3 -m http.server 4629
```
