# Contributing
If you find a bug or think about enhancement, feel free to contribute and submit an issue or a pull request.

## Requirements
You will need [Node.js](https://nodejs.org/en) 20.10 or above, [pnpm](https://pnpm.io/) 10, and a POSIX-like shell. If
you are on Windows, you can obtain a POSIX-like shell by installing Git Bash with
[Git](https://git-scm.com/install/windows).

## Setup
Run `pnpm install`.

## Build Source
Run `./rolldown.config.js`.

## Build NPM Package
Run `scripts/npm.sh`.

## Testing
In a different project you can run `pnpm add ~/path/to/rolldown-plugin-prettier/dist` to install the locally built version
of this package so you can run the Rolldown plugin like you normally would any other Rolldown plugin.
