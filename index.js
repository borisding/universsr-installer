#!/usr/bin/env node

require('shelljs/global');

const fs = require('fs');
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
    if (!which('git')) {
      cerror('Cannot proceed. This installer requires git installed on your machine.');
      exit(1);
    }

    const projectDir = slash(`${process.cwd()}/${project}`);

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

    cinfo('|> Installing all dependencies from package.json in project...');

    if (cd(projectDir) && exec('npm install').code !== 0) {
      cerror('Failed to install universsr boilerplate dependencies.');
      exit(1);
    }

    csuccess('Dependencies installed in [%s]!\n', [projectDir]);
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
  .description('Installing new universsr boilerplate into project directory.')
  .usage('new [options] <project>')
  .command('new <project>')
  .option('-c, --clean', 're-install all dependencies without cloning universsr repository.')
  .option('-d, --dev', 'start project application in development environment after installation is done.')
  .option('-f, --force', 'force create new project by clearing project directory before installation starts.')
  .action(create);

program.on('--help', () => {
  console.log();
  console.log('  Examples of options usage for new `my-project`:');
  console.log();
  console.log('  Force install: \t%s\t%s', 'universsr new -f my-project', '(remove all and install new copy)');
  console.log('  Clean install: \t%s\t%s', 'universsr new -c my-project', '(remove all dependencies and reinstall)');
  console.log('  Run dev install: \t%s\t%s', 'universsr new -d my-project', '(run in development after installation)');
  console.log(
    '  Clean & run dev: \t%s\t%s',
    'universsr new -cd my-project',
    '(clean and run in development after installation)'
  );
  console.log();
});

program.parse(process.argv);
