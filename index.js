#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const slash = require('slash');
const program = require('commander');
const download = require('download');
const ora = require('ora');
const pkg = require('./package.json');
const { cd, exec, exit, rm, which } = require('shelljs');

const csuccess = (message, substitution = []) =>
  console.log(chalk.green(`${message}\n`), ...substitution);
const cerror = (message, substitution = []) =>
  console.log(chalk.red(`${message}\n`), ...substitution);
const cinfo = (message, substitution = []) =>
  console.log(chalk.cyanBright(`${message}\n`), ...substitution);

const fileExisted = target => fs.existsSync(target);
const githubRepoUrl = 'https://github.com/borisding/universsr';
const silent = true;
let projectDestination;

// create action for installer
function create(project, options) {
  try {
    projectDestination = slash(`${process.cwd()}/${project}`);

    if (!fileExisted(projectDestination)) {
      return installProject(options);
    }

    if (options.force) {
      cinfo('|> Removing `%s` directory including files...', [project]);

      if (rm('-rf', projectDestination).code !== 0) {
        cerror('Exit. Failed to remove all files.');
        exit(1);
      }

      return installProject(options);
    } else {
      cerror('Cannot proceed. Project directory already existed.');
      exit(1);
    }
  } catch (err) {
    cerror(err.stack);
    exit(1);
  }
}

// start installing project with provided options
function installProject(options) {
  if (options.clone) {
    return installByCloning();
  }

  return installByDownloding(options);
}

// install by downloading archive approach (default to master)
function installByDownloding({ release = 'master' }) {
  const url = `${githubRepoUrl}/archive/${release}.zip`;
  const options = {
    headers: { accept: 'application/zip' },
    mode: '755',
    strip: 1,
    extract: true
  };

  cinfo('|> Downloading zip format archive from [%s]...', [url]);

  return download(url, projectDestination, options)
    .then(data => {
      csuccess('Extracted zip archive files into [%s]', [projectDestination]);
      data && installDependencies();
    })
    .catch(err => {
      cerror(err);
      exit(1);
    });
}

// install by using cloning method
function installByCloning() {
  if (!which('git')) {
    cerror('Cannot proceed. Git is not installed on your machine.');
    exit(1);
  }

  const cloneRepo = exec(
    `git clone --depth=1 ${githubRepoUrl}.git ${projectDestination}`
  );

  if (cloneRepo.code !== 0) {
    cerror('Failed to clone universsr boilerplate into [%s].', [
      projectDestination
    ]);
    exit(1);
  }

  console.log();
  csuccess('Cloned git repo into [%s]', [projectDestination]);

  return installDependencies();
}

// install project dependencies after either download or clone action is done
function installDependencies() {
  return (
    cd(projectDestination) &&
    exec(
      'npm install',
      { silent },
      spawnProcess({
        init: 'Installing required dependencies...',
        error: 'Failed to install required dependencies.',
        success: 'Done! Installed dependencies.',
        wrapup: () => {
          console.log();
          cinfo('|> For quick start: `cd %s` and execute `npm start`', [
            projectDestination.split('/').pop()
          ]);
        }
      })
    )
  );
}

// spawn process callback for async process
function spawnProcess({ init, error, success, wrapup = null }) {
  const spinner = ora(init).start();

  return (code, stdout, stderr) => {
    if (code) {
      spinner.fail(chalk.red(error));
      cerror(stderr);
      exit(1);
    }

    spinner.succeed(chalk.green(success));
    wrapup && wrapup();
    exit(0);
  };
}

program
  .version(pkg.version)
  .description('Installing new universsr boilerplate into project directory.')
  .usage('new [options] <project>')
  .command('new <project>')
  .option(
    '-c, --clone',
    'install universsr boilerplate by cloning the master repository.'
  )
  .option(
    '-f, --force',
    'force fresh install by removing existing project directory before installation starts.'
  )
  .option(
    '-r, --release <version>',
    'specify version of release to download. (default: master)'
  )
  .action(create);

program.on('--help', () => {
  console.log();
  console.log('  Examples of options usage for new `my-project`:');
  console.log();
  console.log(
    '  Clone install: \t\t%s',
    'universsr new -c my-project (clone github repository with depth=1 and install)'
  );
  console.log(
    '  Force clone install:\t\t%s',
    'universsr new -cf my-project (remove all and install new copy with git clone method)'
  );
  console.log(
    '  Force download install:\t%s',
    'universsr new -f my-project (remove all and install new copy with download method)'
  );
  console.log(
    '  Download release install: \t%s',
    "universsr new -r 'v2.0.0' my-project (download release version v2.0.0 and install)"
  );
  console.log(
    '  Force install release: \t%s',
    "universsr new -fr 'v2.0.0' my-project (remove all and download release version v2.0.0 and install)"
  );
  console.log();
});

program.parse(process.argv);
