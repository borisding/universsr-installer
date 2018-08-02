#!/usr/bin/env node

const sade = require('sade');
const setup = require('./setup');
const pkg = require('../package.json');

const program = sade('universsr');

program
  .version(pkg.version)
  .describe(
    'Installing new universsr starter boilerplate into project directory'
  )
  .command('new <project>')
  .option(
    '-c, --clone',
    'Install universsr boilerplate by cloning the master repository'
  )
  .option(
    '-f, --force',
    'Force fresh install by removing existing project directory before installation starts'
  )
  .option(
    '-r, --release <version>',
    'Specify version of release to download. (default: master)'
  )
  .example('new my-project -c')
  .example('new my-project -cf')
  .example('new my-project -f')
  .example('new my-project -r v2.0.0')
  .action(setup);

program.parse(process.argv);
