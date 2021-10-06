# Vaccine Passport

It's a WebAPK where you can "upload" an image (to Chrome storage, not to a
server) and then it'll have an icon for it directly on your homescreen, even
when offline. Inspired by http://g/mwi-team-core/CWXjMbjy7bk.

## Goals / Requirements

* very good lighthouse score
* works 100% offline
* dependency-free (as much as possible)
  * it should be feasible for a single SWE to audit our code and confirm that
    we're not uploading your data anywhere
* installable WebAPK (obviously)
* looks nice (or at least _okay_)
* static (can be hosted on github or locally with `python3 -m http.server`)
* open-source (eventually)
* maskable icons
* description, screenshots -> rich install

## Possibilities and future enhancements

* dark mode
* beforeinstallprompt customization
* websharetarget?? Potentially confusing and misusable
* typescript? such a pain to set up, though
* add name for image -> serve dynamic manifestURL, startURL, ShortName, etc, so
  you can have multiple instances of the app (ie, make it a generic "host image
  on your home screen" app rather than necessarily vaccine-related)
  * I'm not aware of any WebAPK that intentionally allows the user to install
    multiple customized instances of itself - could be interesting WebAPK
    use-case in general
* TWA? Doesn't fit as well into the "multiple instances of the app" model

## Non-goals

* works on every browser everywhere
  * I know I'm a bad WebPlatform person now, but I'm ok if this only works on
    reasonably modern browsers. No huge complex polyfills should be necessary.
