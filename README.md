## universsr-installer [![npm version](https://img.shields.io/npm/v/universsr-installer.svg?style=flat-square)](https://www.npmjs.com/package/universsr-installer)

Installer of [universsr](https://github.com/borisding/universsr.git) - Universal React + Redux starter boilerplate.

## Usage
> Node version: >= v8.0.0 (to align with starter's requirement)

Install program globally:

```
npm i -g universsr-installer
```

For example: to create new `my-project` at your current working directory:

```
universsr new my-project
```

universsr boilerplate will be downloaded and extracted into `my-project` project directory.

## Options & Commands

```
$ universsr --help

  Description
    Installing new universsr starter boilerplate into project directory

  Usage
    $ universsr <command> [options]

  Available Commands
    new

  For more info, run any command with the `--help` flag
    $ universsr new --help

  Options
    -v, --version    Displays current version
    -h, --help       Displays this message


$ universsr new --help

  Usage
    $ universsr new <project> [options]

  Options
    -c, --clone      Install universsr boilerplate by cloning the master repository
    -f, --force      Force fresh install by removing existing project directory before installation starts
    -r, --release    Specify version of release to download. (default: master)
    -h, --help       Displays this message

  Examples
    $ universsr new my-project -c
    $ universsr new my-project -cf
    $ universsr new my-project -f
    $ universsr new my-project -r v2.0.0
```
