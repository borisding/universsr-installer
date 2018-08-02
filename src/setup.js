const chalk = require('chalk');
const slash = require('slash');
const ora = require('ora');
const download = require('download');
const { cd, exec, exit, rm, which } = require('shelljs');
const { csuccess, cerror, cinfo, fileExisted } = require('./utils');

const GITHUB_URL = 'https://github.com/borisding/universsr';
let projectDestination;

// setup action handler
function setup(project, options) {
  try {
    projectDestination = slash(`${process.cwd()}/${project}`);

    if (!fileExisted(projectDestination)) {
      return installProject(options);
    }

    if (!options.force) {
      cerror(
        'Cannot proceed. Project directory already existed. Provide `--force` option to force install.'
      );
      exit(1);
    }

    cinfo('|> Removing `%s` directory including files.', [project]);

    if (rm('-rf', projectDestination).code !== 0) {
      cerror('Exit. Failed to remove all files.');
      exit(1);
    }

    return installProject(options);
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
  const url = `${GITHUB_URL}/archive/${release}.zip`;
  const options = {
    headers: { accept: 'application/zip' },
    mode: '755',
    strip: 1,
    extract: true
  };

  cinfo('|> Downloading zip format archive from [%s].', [url]);

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
    `git clone --depth=1 ${GITHUB_URL}.git ${projectDestination}`
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
    spawnProcess({
      cmd: 'npm install',
      init: 'Installing required dependencies. It may take a while.',
      error: 'Failed to install required dependencies.',
      success: 'Done! Installed dependencies.',
      wrapup: () => {
        console.log();
        cinfo('|> For quick start: `cd %s` and execute `npm run dev`', [
          projectDestination.split('/').pop()
        ]);
        cinfo('|> Read more on: %s', [GITHUB_URL]);
      }
    })
  );
}

// spawn process callback for async process
function spawnProcess({ cmd, init, error, success, wrapup }) {
  const spinner = ora(init).start();

  return exec(cmd, { silent: true }, (code, stdout, stderr) => {
    if (code) {
      spinner.fail(chalk.red(error));
      cerror(stderr);
      exit(1);
    }

    spinner.succeed(chalk.green(success));
    wrapup && wrapup();
    exit(0);
  });
}

module.exports = setup;
