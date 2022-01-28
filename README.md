# Badness Log

This branch is dedicated to archiving all the web pain points we've run into as
part of Llaminator development, sorted reverse-chronologically.

To expand all:

```javascript
document.querySelectorAll('article details').forEach((e) => e.setAttribute('open', ''))
```

### 2022-01-28 - Lit doesn't always work in intuitive ways

https://github.com/GoogleChromeLabs/llaminator/pull/86

<details>
  <summary>more</summary>

  > A couple of unintuitive things I ran into with Lit:
  > * updating an array that is bound to the custom element's
  >   html template doesn't seem to trigger an update (unless
  >   I was doing it wrong somehow)
  > * calling an element's `render()` function doesn't actually
  >   render anything. Especially confusing given that Lit's
  >   [other render function](https://github.com/GoogleChromeLabs/llaminator/commit/98a31481959cf1b15702aae3d62bae99f9c51548#diff-fdd4d1941d86cf4fd26f29614c10f2b6b6baccb1d46b6eaa4e357768ef555fadR86)
  >   does actually trigger rendering.
  >
  > Admittedly these are both probably "RTFM" issues, but still
  > seem quite unintuitive to me.
</details>

### 2022-01-17 - file input `onchange` event doesn't fire if you pick the same image multiple times

Reported in
https://github.com/GoogleChromeLabs/llaminator/pull/80#pullrequestreview-854278792
and tracked further in https://github.com/GoogleChromeLabs/llaminator/issues/81

<details>
  <summary>more</summary>

  > Thank you, also for the demo page!
  >
  > There is one new issue that I'm observing (but we can address separately):
  > add `foo.jpg`, delete it, then add `foo.jpg` again. It refuses to add the
  > image, with no warnings/messages/anything. Interestingly, adding `bar.jpg`
  > after the delete works fine.

  > It looks like deleting isn't necessary - if you try to upload the same
  > image twice, it does nothing the second time. That may (or may not) be
  > _desired_ behaviour, but it's not _intended_ at the moment.
  >
  > I strongly suspect (but haven't verified) that
  > [this](https://github.com/GoogleChromeLabs/llaminator/blob/main/src/components/llama-select-fab.ts#L45)
  > event isn't firing, since the selected image hasn't "changed".
</details>

### 2022-01-16 - lit rendering doesn't refresh as expected

https://github.com/GoogleChromeLabs/llaminator/pull/80

<details>
  <summary>more</summary>

  > I tried letting the `llama-item` remove itself from the DOM
  > (`this.parentElement.remove(this)`, or something like that).
  >
  > This worked as expected in that moment, but then upon uploading a new
  > image, the UI wouldn't update (despite `render()` being called with the
  > proper elements in response to an upload).
  >
  > I did confirm that the image was uploaded and the db instance was
  > up-to-date, and that `render()` was in fact getting called, but the
  > newly-uploaded images wouldn't be visible until I refreshed the page.
  >
  > Even more confusingly, everything did actually update properly if I stepped
  > through the code with devtools....
  >
  > If I uploaded a new image normally, then used devtools when uploading
  > _another_ new image, then only the image uploaded while devtools was
  > running ended up being displayed (until page refresh).
  >
  > No idea what's going on there - I'm sure it's something about `lit` trying
  > to be clever about which elements changed and what exactly needs to be
  > re-rendered, but wow is that prone to subtle unexpected undebuggable bugs.
</details>

### 2022-01-16 - so many vulnerabilities

https://github.com/GoogleChromeLabs/llaminator/pull/67

### 2021-12-21 - too many meta-languages

https://github.com/GoogleChromeLabs/llaminator/pull/47/files#r773364100

### 2021-12-12 - material web components are huge

* https://github.com/GoogleChromeLabs/llaminator/issues/39
* https://github.com/GoogleChromeLabs/llaminator/pull/37
* https://github.com/GoogleChromeLabs/llaminator/pull/38
* https://github.com/GoogleChromeLabs/llaminator/pull/50
* https://github.com/GoogleChromeLabs/llaminator/pull/51
* https://github.com/GoogleChromeLabs/llaminator/pull/47

<details>
  <summary>more</summary>

  > Lit is great, and definitely worth it. We've used
  > [material-web](https://github.com/material-components/material-web) on top
  > of that, but I'm actually really disappointed about how massively it
  > impacts our bundle size. We're still <90 KiB uncompressed, but it's
  > probably way overkill for our use-case. To illustrate, ~15 KiB of that are
  > for the ripple effects, which are cool, but we don't need to support every
  > edge-case that's significant for a generic library.

  > This re-implements the file selection fab without relying on MWC. Our
  > uncompressed JavaScript bundle size decreases by a massive 49KiB, whereas
  > our CSS file grows by 7KiB. Appearance remains identical, although we now
  > have the ability to add ripple styles to the fab ourselves. (Hover styles
  > are already enabled.)
  >
  > Live on https://llaminator.peter.sh/
</details>

### 2021-12-01 - Node and NPM move very fast and are not backwards-compatible

* https://github.com/GoogleChromeLabs/llaminator/pull/26
* https://github.com/GoogleChromeLabs/llaminator/pull/44
* https://github.com/GoogleChromeLabs/llaminator/issues/56
* https://github.com/GoogleChromeLabs/llaminator/pull/57

<details>
  <summary>more</summary>

  > These are the notes I took, at the beginning of the year 2022, documenting
  > my first impressions of getting the project up and running, for someone
  > (like myself) who has no knowledge of the project, and perhaps wants to
  > contribute. Consider it a stress test on the installation procedure.
  >
  > Maybe none of the stuff mentioned below would be classified as bugs, maybe
  > some would. But this documents the process I went through and what I
  > discovered along the way. Maybe it provides some insight.
  >
  > First thing I discovered was I didn't have npn installed
  > `sudo apt install npm` fixed that.
  >
  > I then downloaded the zip from github and placed the code into my code
  > directory.
  >
  > ```
  > ~/code$ node -v
  > v10.19.0
  > ~/code$ npm -v
  > 6.14.4
  > ```
  >
  > So far so good, I guess. Let's try...
  >
  > `~/code/llaminator-main$ npm install`
  >
  > However, the first message is a conflict message. Not the start I was
  > hoping for. Can we git rid of that?
  >
  > ```
  > npm WARN conflict A git conflict was detected in package-lock.json. Attempting to auto-resolve.
  > npm WARN conflict To make this happen automatically on git rebase/merge, consider using the npm-merge-driver:
  > npm WARN conflict $ npx npm-merge-driver install -g
  > npm WARN read-shrinkwrap This version of npm is compatible with lockfileVersion@1, but package-lock.json was generated for lockfileVersion@2. I'll try to do my best with it!
  > ```
  >
  > Next, according to the instructions is to serve the site from an http
  > server, by doing...
  >
  > ```
  > ~/code/llaminator-main$ npm run-script serve
  >
  > > llaminator@0.0.1 serve /home/finnur/code/llaminator-main
  > > webpack serve --open --mode=development
  >
  > sh: 1: webpack: not found
  > npm ERR! code ELIFECYCLE
  > npm ERR! syscall spawn
  > npm ERR! file sh
  > npm ERR! errno ENOENT
  > npm ERR! llaminator@0.0.1 serve: `webpack serve --open --mode=development`
  > npm ERR! spawn ENOENT
  > npm ERR!
  > npm ERR! Failed at the llaminator@0.0.1 serve script.
  > npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
  >
  > npm ERR! A complete log of this run can be found in:
  > npm ERR!     /home/finnur/.npm/_logs/2022-01-05T17_16_53_308Z-debug.log
  > ```
  >
  > Should webpack be listed as a pre-requisite in the instructions?
  >
  > `~/code/llaminator-main$ npm install webpack` succeeds. Let's try again...
  >
  > ```
  > ~/code/llaminator-main$ npm run-script serve
  >
  > > llaminator@0.0.1 serve /home/finnur/code/llaminator-main
  > > webpack serve --open --mode=development
  >
  > [webpack-cli] /home/finnur/code/llaminator-main/node_modules/webpack-dev-server/lib/servers/WebsocketServer.js:10
  >   static heartbeatInterval = 1000;
  >                            ^
  > SyntaxError: Unexpected token =
  >     at Module._compile (internal/modules/cjs/loader.js:723:23)
  >     at Object.Module._extensions..js (internal/modules/cjs/loader.js:789:10)
  >     at Module.load (internal/modules/cjs/loader.js:653:32)
  >     at tryModuleLoad (internal/modules/cjs/loader.js:593:12)
  >     at Function.Module._load (internal/modules/cjs/loader.js:585:3)
  >     at Module.require (internal/modules/cjs/loader.js:692:17)
  >     at require (internal/modules/cjs/helpers.js:25:18)
  >     at Server.getServerTransport (/home/finnur/code/llaminator-main/node_modules/webpack-dev-server/lib/Server.js:1191:28)
  >     at Server.createWebSocketServer (/home/finnur/code/llaminator-main/node_modules/webpack-dev-server/lib/Server.js:1757:38)
  >     at Server.start (/home/finnur/code/llaminator-main/node_modules/webpack-dev-server/lib/Server.js:2305:12)
  > npm ERR! code ELIFECYCLE
  > npm ERR! errno 2
  > npm ERR! llaminator@0.0.1 serve: `webpack serve --open --mode=development`
  > npm ERR! Exit status 2
  > npm ERR!
  > npm ERR! Failed at the llaminator@0.0.1 serve script.
  > npm ERR! This is probably not a problem with npm. There is likely additional logging output above.
  >
  > npm ERR! A complete log of this run can be found in:
  > npm ERR!     /home/finnur/.npm/_logs/2022-01-05T17_32_58_219Z-debug.log
  > ```
  >
  > I'm guessing this is not expected? :)
</details>

### 2021-11-28 - TypeScript, workers, imports, build systems, Node, and even WorkBox are very complex to set up, and only work together in specific build configurations

It's basically infeasible to just start writing javascript that the browser
will run directly and end up with a rich modern web app.

* https://github.com/GoogleChromeLabs/llaminator/pull/17
* https://github.com/GoogleChromeLabs/llaminator/pull/18
* https://github.com/GoogleChromeLabs/llaminator/pull/29
* https://github.com/GoogleChromeLabs/llaminator/pull/32
* https://github.com/GoogleChromeLabs/llaminator/pull/33
* https://github.com/GoogleChromeLabs/llaminator/pull/35
* https://github.com/GoogleChromeLabs/llaminator/pull/36
* https://github.com/GoogleChromeLabs/llaminator/issues/19
* https://github.com/GoogleChromeLabs/llaminator/issues/24
* https://github.com/GoogleChromeLabs/llaminator/issues/34

<details>
  <summary>more</summary>

  > I've noticed that the following PRs have been trying to deal with just
  > getting a build system actually fully working with typescript and service
  > workers (0 new actual functionality in the app):
  >
  > * https://github.com/GoogleChromeLabs/llaminator/pull/13
  > * https://github.com/GoogleChromeLabs/llaminator/pull/14
  > * https://github.com/GoogleChromeLabs/llaminator/pull/17
  > * https://github.com/GoogleChromeLabs/llaminator/pull/18
  > * https://github.com/GoogleChromeLabs/llaminator/pull/22
  > * https://github.com/GoogleChromeLabs/llaminator/pull/26
  > * https://github.com/GoogleChromeLabs/llaminator/pull/29
  > * https://github.com/GoogleChromeLabs/llaminator/pull/32
  > * https://github.com/GoogleChromeLabs/llaminator/pull/33
  > * another one I'm currently working on to fix Workbox as part of
  >   https://github.com/GoogleChromeLabs/llaminator/issues/19
  >
  > What in the world is going on with this ecosystem?
  >
  > I *think* this is a (roughly) exhaustive description of our ideal state:
  >
  > * dev server that can auto-reload when there are changes to the filesystem
  > * a way to "export" a copy of the post-build codebase, suitable for hosting
  >   elsewhere (including static file servers)
  > * typescript for both main site code and service worker code, enforcing
  >   strict type checks
  > * some amount of code-sharing ability between the main site code and
  >   service worker code (WebShareTarget, as a concrete example, is a place
  >   where code sharing would make a lot of sense)
  > * ability to use 3rd party packages (ideally via npm) in both main site and
  >   service worker
  > * (feel free to add more to this list)
  >
  > Here's a summary of issues we've encountered along the way (I will probably
  > forget some):
  >
  > * [Workbox](https://developers.google.com/web/tools/workbox) requires
  >   either bundling, [Service Worker
  >   modules](https://web.dev/es-modules-in-sw/), or an `importScripts()` from
  >   a CDN
  >   * Service Worker modules have compatibility issues
  >     * `Uncaught SyntaxError: Cannot use import statement outside a module`
  >       is such an unhelpful error message at sw installation time
  >   * bundling is generally the ideal option (failing Service Worker modules)
  >     for both Workbox and other npm packages, but
  >     [@web/dev-server](https://www.npmjs.com/package/@web/dev-server) can't
  >     auto-reload bundles
  >   * the CDN doesn't come with types built-in by default, and
  >     [@types/workbox-sw](https://www.npmjs.com/package/@types/workbox-sw)
  >     isn't working for me
  > * @web/dev-server serves files with their original extensions (like `*.ts`)
  >   rather than their "compiled" extensions (`*.js`). But when doing a static
  >   build, browsers (or maybe just Chrome?) can't seem to figure out that
  >   ".ts" isn't 'video/mp2t'
  >   (https://github.com/GoogleChromeLabs/llaminator/issues/24)
  > * different servers have different root directories - maybe there's a way
  >   to make all the paths properly relative, but so far we've ended up with a
  >   hack as part of the build process
  > * I'm not entirely convinced that @web/dev-server (and maybe even the
  >   rollup config) is actually using our tsconfig.json. Maybe it's
  >   [ESBuild](https://esbuild.github.io/)'s fault? No idea.
  >   * we also may need(?) to mess around with our filesystem and configs like
  >     https://github.com/jakearchibald/typescript-worker-example to get the
  >     tsconfig.json to work properly for both "normal" code and service
  >     worker
  > * package-lock.json
  > * it's not entirely clear which type of storage we should be using
  >   (https://github.com/GoogleChromeLabs/llaminator/issues/20,
  >   https://github.com/GoogleChromeLabs/llaminator/issues/21)
  > * at first it seemed like `declare var self: ServiceWorkerGlobalScope` was
  >   required to make `self` work properly in typescript in the service
  >   worker. Now, for some reason, it's telling me I can't redeclare `self`
  >   (currently its type is `WorkerGlobalScope & typeof globalThis` as set by
  >   the `webworker` lib)
  > * code sharing between main code and sw is difficult and complicated. sw,
  >   generally, doesn't support modules, which is what we should be using for
  >   the main code. sw modules have compatibility issues. Some sort of
  >   bundling build system may(?) be able to mitigate this (see note about
  >   @web/dev-server not playing nice with that) but then it's still tricky to
  >   figure out which parts are sharable - for example, what type is `self`?
  >   Could change depending on the context. "main" code and sw code are
  >   generally built with different libs.

  > (depends on https://github.com/GoogleChromeLabs/llaminator/pull/14)
  >
  > `npx tsc --lib webworker src/sw.ts` builds this without error (although
  > `npx tsc src/sw.ts` does not, which makes me question what exactly the
  > `tsconfig.json` does).
  >
  > But I get this extremely helpful runtime error when using `npm run-script
  > serve`:
  >
  > ```
  > Uncaught SyntaxError: Cannot use import statement outside a module
  > Uncaught (in promise) TypeError: Failed to register a ServiceWorker for scope ('http://localhost:4629/src/') with script ('http://localhost:4629/src/sw.ts'): ServiceWorker script evaluation failed
  > ```
  >
  > Any ideas? Shouldn't ESBuild be taking care of this?
  >
  > (This is what I mean when I say that setting up typescript and a build
  > system is a massive mess)

  > Fixes:
  >
  > ```
  > Uncaught ReferenceError: process is not defined at node_modules/workbox-core/models/messages/messageGenerator.js:24
  > ```

  > See https://github.com/GoogleChromeLabs/llaminator/pull/22
  >
  > The error message says that index.ts's "MIME type ('video/mp2t') is not
  > executable."
  >
  > I'm guessing that's because we're trying to include a ".ts" file as a
  > script, and .ts is being misinterpreted.

  > This PR implements a decent build system that satisfies the "ideal state"
  > as described in #34.
  >
  > Instead of ESBuild, we now use WebPack with a configuration file allowing
  > for both development (w/ watch) serving, as well as building for production
  > with additional optimizations. Service worker support has been moved to its
  > own directory so that it's easier to (conceptually) separate from the
  > regular client source and fully supports TypeScript. Code sharing works
  > naturally, although we may want to have a "common" directory of sorts if
  > and when we start using that.
  >
  > Generated assets (i.e. the bundled JavaScript) will now have hashed
  > filenames, with the service worker automatically precaching such content.
  > This allows for more aggressive caching strategies, useful when we have a
  > more coherent offline strategy.
  >
  > There's still some optimizations we can make regarding specializing
  > `tsconfig.json`, which can follow. In addition, `package-lock.json` is here
  > to stay, I'm told that's the best practice.
  >
  > I've verified this locally using `serve`, and pushed the production build
  > to https://llaminator.peter.sh/, where it also works as expected.
  >
  > Fixes: #19, #24, #34
</details>

### 2021-11-28 - the storage story on the web isn't straightforward, and by default things can be arbitrarily removed by the browser, without the user or web developer's knowledge or permission

https://github.com/GoogleChromeLabs/llaminator/issues/23

### 2021-11-20 - files are downloaded as .txt by default

This one is not so bad... But browsers are absolutely capable of detecting
well-known file types like PNG or JPEG.

* https://github.com/GoogleChromeLabs/llaminator/pull/11
* https://github.com/GoogleChromeLabs/llaminator/pull/10
* https://github.com/GoogleChromeLabs/llaminator/issues/9

<details>
  <summary>more</summary>

  > The blob URL doesn't have a filename or type information, so it saves as a
  > "text file"
  >
  > https://user-images.githubusercontent.com/570079/142743702-543c55d8-aba4-45cf-8695-e320bdc9bd79.mp4

  > Fixes #9
  >
  > 👋 @glennhartmann
  >
  > To avoid the image results saving as `.txt` files, we can specify a MIME
  > type during blob instantiation by providing the
  > [`Blob`](https://developer.mozilla.org/en-US/docs/Web/API/Blob) constructor
  > a second param which is an object with key `type` representing
  > [blob.type](https://developer.mozilla.org/en-US/docs/Web/API/Blob/type).
  > This way the image results save as their specific MIME type.
  >
  > ```js
  > const b = new Blob([await f.arrayBuffer()], { type: f.type }); // f.type would be image/png, image/jpeg, application/pdf etc
  > ```
  >
  >
  >
  >
  > https://user-images.githubusercontent.com/48612525/142803906-1c0dd0c7-6103-4d8c-8f98-b65d1cadc087.mov
</details>
