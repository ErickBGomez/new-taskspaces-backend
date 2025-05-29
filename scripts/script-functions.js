import { exec } from 'child_process';
import chalk from 'chalk';
import readline from 'readline';

export const askQuestion = (query, options = {}) => {
  const { color = 'yellow', critical = false } = options;
  const styledQuery = critical ? chalk.red.bold(query) : chalk[color](query);

  return new Promise((resolve) =>
    rl.question(styledQuery, (ans) => resolve(ans.trim().toLowerCase()))
  );
};

export const runCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
};

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
