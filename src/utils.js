const fs = require('fs');
const chalk = require('chalk');

const csuccess = (message, substitution = []) =>
  console.log(chalk.green(`${message}\n`), ...substitution);

const cerror = (message, substitution = []) =>
  console.log(chalk.red(`${message}\n`), ...substitution);

const cinfo = (message, substitution = []) =>
  console.log(chalk.cyanBright(`${message}\n`), ...substitution);

const fileExisted = target => fs.existsSync(target);

module.exports = {
  csuccess,
  cerror,
  cinfo,
  fileExisted
};
