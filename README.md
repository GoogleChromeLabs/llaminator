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

[Node](https://nodejs.org/) v16 or v17 (with [NPM](https://www.npmjs.com/) v7 or
v8, respectively) are used by Llaminator for dependency management, and have to
be available on the host operating system. The recommended way to install these
is to first [install
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

## Coding Style

The source of truth is `npm run-script lint`, which is configured by
[.eslintrc.json](.eslintrc.json). To automatically fix as many lint errors as
possible, rather than just printing them out, you can instead run `npm
run-script fix`.

This project expects LF line endings, not CRLF (and this is enforced by
eslint). That means that Windows users may want to configure their local
`.git/config` as follows:

```gitconfig
[core]
  autocrlf = input
```

(See https://git-scm.com/book/en/v2/Customizing-Git-Git-Configuration for
documentation about this option).

If you choose to do the above, remember to also configure your text editor to
read and write using LF rather than CRLF. For convenience, this project contains a
[.editorconfig](.editorconfig) file capable of setting this up in many popular
editors, though some may need plugins. See https://editorconfig.org/ for more
details and plugin installation instructions.

## Contributing

See [CONTRIBUTING](./CONTRIBUTING.md) for more.

## License

See [LICENSE](./LICENSE) for more.
