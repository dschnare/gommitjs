# Gommitjs

`gommitjs` is a lightweight Git commit message enforcer that wraps [gommit](https://github.com/antham/gommit).

## Setup

First create your project

    mkdir my-project
    cd my-project
    git init

Then setup `gommitjs`

    npm install gommitjs --save-dev
    ./node_modules/.bin/gommitjs init

The above commands will install the `gommitjs` NPM module and download the
`gommit` binary for your OS and save it under the
`./node_modules/gommitjs/tools` folder. Then we initialize our project by
creating a `.gommit.toml` config file if one doesn't exist and create a
`.git/hooks/commit-msg` commit hook if one doesn't exist.

NOTE: If you already have a `commit-msg` hook then you'll have to maintain this
hook yourself, using the `gommit` binary to check messages:

    %gommit_path% check message "$(cat "$1")";

The `gommit` binary path can be obtained by calling:

    ./node_modules/.bin/gommitjs gommit-path

NOTE: If you prefer to install the `gommit` binary somewhere else then you can
run the following.

    ./node_modules/.bin/gommitjs update --prefix tools

This will install the binary in the `./tools` folder.

## Usage

    Ensure your commit messages are consistent

    Usage:
      gommitjs [command]

    Available Commands:
      init        Create the gommit config and commit-msg hook files
      update      Update the gommit binary
      gommit-path Get the path to the gommit binary
      check       Check ensure a message follows defined patterns
      version     App version

    Flags:
          --config string    (default ".gommit.toml")
      -h, --help            help for gommit

    Use "gommitjs [command] --help" for more information about a command.

## Practical Usage

For details on how to use `gommit` with continuous integration servers see
the [gommit docs](https://github.com/antham/gommit#practical-usage).

## Versioning

This project will not have the same version as the `gommit` binary since any
version of `gommit` should work with this wrapper.

## API

**installGommit(tag = 'latest', { prefix } = {}): Promise**

Install the gommit binary for the current OS.

Example:

    const gommitjs = require('gommitjs')
    gommitjs.installGommit('v2.0.0').then(result => {
      console.log(`gommit ${result.tag} saved at ${result.path}`)
    }).catch(error => {
      console.error(error)
    })

    // Or to install the gommit binary to a different location.
    gommitjs.installGommit('v2.0.0', { prefix: 'tools' }).then(result => {
      console.log(`gommit ${result.tag} saved at ${result.path}`)
    }).catch(error => {
      console.error(error)
    })

**getGommitBinaryPath({ url, prefix } = {}): Promise**

Retrieves the path to the installed gommit binary.

Example:

    const gommitjs = require('gommitjs')
    gommitjs.getGommitBinaryPath().then(gommitPath => {
      console.log(`gommit installed at ${gommitPath}`)
    })

**gommit(args: []sring, { cwd }): Promise**

Call gommit with the specified arguments.

Example:

   const { gommit } = require('gommitjs')
   gommit([ 'version' ])
    .then(version => console.log(version))
    .catch(error => console.error(error.toString()))

**gommit.version(): Promise**

Retrieves the gommit version tag.

Example:

    const { gommit } = require('gommitjs')
    gommit.version()
      .then(version => console.log(version))
      .catch(error => console.error(error.toString()))

**gommit.checkCommit(commitHash): Promise**

Check one comit from its commit ID (must be full commit ID).

Example:

    const { gommit } = require('gommitjs')
    gommit.checkCommit('aeb603ba83614fae682337bdce9ee1bad1da6d6e')
      .then(() => console.log('commit is properly formatted!')
      .catch(error => console.error(error.toString()))

**gommit.checkMessage(message): Promise**

Check a commit message.

Example:

    const { gommit } = require('gommitjs')
    gommit.checkMessage('Hello')
      .then(() => console.log('message is properly formatted!')
      .catch(error => console.error(error.toString()))

**gommit.checkRange(refStart, refEnd): Promise**

Check a commit range. Ranges can be any of the following values:

- with relative references : `master~2^`, `master`
- with asbolute references : `dev`, `test`
- with commit ids : `7bbb37ade3ff36e362d7e20bf34a1325a15b`, `09f25db7971c100a8c0cfc2b22ab7f872ff0c18d`

Example:

    const { gommit } = require('gommitjs')
    gommit.checkRange('master~2^', 'master')
      .then(() => console.log('all commits are properly formatted!')
      .catch(error => console.error(error.toString()))
