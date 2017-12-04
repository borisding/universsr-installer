## universsr-installer [![npm version](https://img.shields.io/npm/v/universsr-installer.svg?style=flat-square)](https://www.npmjs.com/package/universsr-installer)

* Installer of [universsr](https://github.com/borisding/universsr.git) - Universal React + Redux boilerplate.

## Usage

Install universsr installer globally

```
npm i universsr-installer -g
```

For example: to create new `my-project` at your current working directory:

```
universsr new my-project
```

universsr boilerplate will be downloaded and extracted into `my-project` project directory.

## Options & Commands

```
Usage: index new [options] <project>

 Installing new universsr boilerplate into project directory.


 Options:

   -V, --version  output the version number
   -h, --help     output usage information


 Commands:

   new [options] <project>

 Examples of options usage for new `my-project`:

 Clone install:                universsr new -c my-project (clone github repository with depth=1 and install)
 Force clone install:          universsr new -cf my-project (remove all and install new copy with git clone method)
 Force download install:       universsr new -f my-project (remove all and install new copy with download method)
 Download release install:     universsr new -r 'v2.0.0' my-project (download release version v2.0.0 and install)
 Force install release:        universsr new -fr 'v2.0.0' my-project (remove all and download release version v2.0.0 and install)
```
