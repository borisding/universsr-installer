## universsr-installer

[![npm version](https://img.shields.io/npm/v/universsr-installer.svg?style=flat-square)](https://www.npmjs.com/package/universsr-installer)

* Installer of [universsr](https://github.com/borisding/universsr.git) - Universal React + Redux boilerplate.

## Usage

```
npm i universsr-installer -g
```

* Example: To create new `my-project` at your current working directory:

```
universsr new my-project
```

* universsr boilerplate source code will be installed into `my-project` project directory.

## Options & Usage

```
Usage: universsr new [options] <project>

  Installing new universsr boilerplate into project directory.


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    new [options] <project>

  Examples of options usage for new `my-project`:

  Force install: 	universsr new -f my-project	(remove all and install new copy)
  Clean install: 	universsr new -c my-project	(remove all dependencies and reinstall)
  Run dev install:   universsr new -d my-project	(run in development after installation)
  Clean & run dev:   universsr new -cd my-project   (clean and run in development after installation)
```
