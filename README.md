# Toot - Web Page JSON fed Tutorials

The core idea of this utility is to easily take some json data representing tutorial steps
and compose a tutorial from it. This provides an easy way to reuse every step of a tutorial.

## State

Currently the core idea is executed as originally wanted.
It however lacks real-world application examples, so it is discouraged to use in
production at the moment.

Also, production use is discouraged because this project was born from a concept, not a
need. Which means that once it is actually used, pitfalls of the current approaches might
become apprent.

## How to use?

Read the wiki, use the `dist/browser` folder contents
(available once you execute `npm run package`).

## How to build?

Building can be done by executing `npm run build`.
This **will not** produce code that is garanteeed to work on a browser.
The compiled code will be available in `dist/tsc`.

To prepare the built code for browser use, execute `npm run package`.
This will *build*, *transpile* with babel & *prepare* the scripts for the browser.
The prepared modules will be available in `dist/browser`.

## How to test?

At the moment, there are 2 testing zones in the project.

1. `Testing Grounds` - a space meant for playing around with the tool. Start with
    `npm run test:start-server` (which simply starts an http-server at the root of the
    project) and go to the shown url `/tests/testing-grounds/test-page.html` in the
    browser of your choice.
2. `Unit tests` - a space meant for containing unit tests, made with `typescript` & `mocha`.
    The specs are located in `test/unit/`. Launch with `npm run test:unit`.

## Contribution

Any contrubution is welcome as long as it is properly justified and tested.

## License

Everything in this repository is under the [MIT lisence](./LICENSE.md).