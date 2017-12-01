#!/usr/bin/env node

require('shelljs/global');

const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const slash = require('slash');
const program = require('commander');
const pkg = require('./package.json');

const csuccess = (message, substitution = []) => console.log(chalk.green(`${message}\n`), ...substitution);
const cerror = (message, substitution = []) => console.log(chalk.red(`${message}\n`), ...substitution);
const cinfo = (message, substitution = []) => console.log(chalk.cyanBright(`${message}\n`), ...substitution);
const fileExisted = project => fs.existsSync(project);

function create(project, options) {
  try {
    const projectDir = slash(`${process.cwd()}/${project}`);
    const spinner = ora();

    if (!which('git')) {
      cerror('Cannot proceed. This installer requires git installed on your machine.');
      exit(1);
    }

    if (!options.clean && fileExisted(projectDir)) {
      if (options.force) {
        cinfo('|> Removing all files from existing project directory...');

        if (rm('-rf', projectDir).code !== 0) {
          cerror('Exit. Failed to remove all files from existing project directory.');
          exit(1);
        }
      } else {
        cerror('Cannot proceed. Project directory already existed.');
        exit(1);
      }
    }

    if (options.clean) {
      if (!fileExisted(projectDir)) {
        cerror('Project directory does not exist.');
        exit(1);
      } else {
        cinfo('|> Removing all existing dependencies...');
        rm('-rf', slash(`${projectDir}/node_modules`));
      }
    } else if (exec(`git clone --depth=1 https://github.com/borisding/universsr.git ${projectDir}`).code !== 0) {
      cerror('Failed to clone universsr boilerplate.');
      exit(1);
    }

    spinner.start('Start installing dependencies...');

    if (cd(projectDir) && exec('npm install').code !== 0) {
      spinner.stop();
      cerror('Failed to install universsr boilerplate dependencies.');
      exit(1);
    }

    spinner.succeed(chalk.green(`Dependencies installed in [${projectDir}]!\n`));
    cinfo(`|> Start building & running application in [${options.dev ? 'development' : 'production'}] environment.`);

    if (options.dev) {
      exec('npm run start:dev');
    } else {
      exec('npm start');
    }

    exit(0);
  } catch (err) {
    cerror(err.stack);
    exit(1);
  }
}

program
  .version(pkg.version)
  .arguments('<project>')
  .description('Create new project by installing universsr boilerplate.')
  .option('-c, --clean', 're-install all dependencies without cloning universsr repository.')
  .option('-d, --dev', 'start project application in development environment.')
  .option('-f, --force', 'force create new project by clearing directory before installation.')
  .action(create)
  .parse(process.argv);
