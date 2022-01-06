# Llaminator

Llaminator is an installable, fully offline-enabled PWA that helps you
conveniently store and easily access images directly from your browser, desktop,
or home screen.

## Features

* Small: barely any storage space or network traffic required.
* Convenient: installable and accessible directly from your desktop or home
  screen.
* Offline: after the initial visit, Llaminator works without any mobile or
  internet connection.
* Easy: no complicated configuration or confusing interface. Just open
  Llaminator and view your image.

## Installing and building Llaminator

NPM v8 and Node v17 are used by Llaminator for dependency management, and have
to be available on the host operating system. The recommended way to install
these is to first [install
NVM](https://github.com/nvm-sh/nvm#installing-and-updating), then use NVM to
install the latest NPM+Node by running:

```
nvm install node
```

Then check out this repository and initialize your environment by running:

```
npm install
```

## Running Llaminator

Llaminator is currently made of entirely static code, so there's no complicated
server setup necessary. You can use any http server to host the files.

For example, you could run the following and then access Llaminator at
`http://localhost:4629`:

```
npm run-script serve
```

## Exporting Llaminator as a static site

To compile the typescript, resolve node dependencies, etc, and
dump the output into `dist/`, you can run:

```
npm run-script build
```

Note: this probably won't be part of our typical development workflow,
so expect it to break from time to time.

## Contributing

See [CONTRIBUTING](./CONTRIBUTING.md) for more.

## License

See [LICENSE](./LICENSE) for more.
