# Gommitjs

`gommitjs` is a lightweight Git commit message enforcer that wraps [gommit](https://github.com/antham/gommit).

## Setup

First create your project

    mkdir my-project
    cd my-project
    git init

Then setup `gommitjs`

    npm install gommitjs
    ./node_modules/.bin/gommitjs init

The above commands will install the `gommitjs` NPM module and download the
`gommit` binary for your OS and save it under `./tools`. Then we initialize
our project by creating a `.gommit.toml` config file if one doesn't exist and
create a `.git/hooks/commit-msg` commit hook if one doesn't exist.

NOTE: If you already have a `commit-msg` hook then you'll have to maintain this
hook yourself, using the `gommit` binary to check messages:

    %gommit_path% check message "$(cat "$1")";

The `gommit` binary path can be obtained by calling:

    ./node_modules/.bin/gommitjs gommit-path

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
