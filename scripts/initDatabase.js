import readline from 'readline';
import { exec } from 'child_process';
import chalk from 'chalk';
import prisma from '../utils/prisma.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(query) {
  return new Promise((resolve) =>
    rl.question(chalk.yellow(query), (ans) => resolve(ans.trim().toLowerCase()))
  );
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function checkAndPopulateTable(tableName, valuesArray) {
  console.log(chalk.gray(`  - Populating table: ${tableName}...`));

  // Get the Prisma model accessor dynamically
  const model = prisma[tableName];
  if (!model) {
    throw new Error(`Model "${tableName}" does not exist in Prisma client.`);
  }

  // Extract the 'value' fields from the valuesArray
  const valueList = valuesArray.map((item) => item.value);

  // Find existing records with those values
  const existing = await model.findMany({
    where: { value: { in: valueList } },
    select: { value: true },
  });

  // Determine which values are missing
  const existingValues = new Set(existing.map((item) => item.value));
  const missing = valuesArray.filter((item) => !existingValues.has(item.value));

  if (missing.length === 0) {
    console.log(
      chalk.green(`[✓] All values already exist in table "${tableName}".`)
    );
  } else {
    await model.createMany({ data: missing });
    console.log(
      chalk.green(`[+] Created missing values in table "${tableName}": `) +
        chalk.cyan(missing.map((i) => i.value).join(', '))
    );
  }
}

async function main() {
  try {
    const pushAns = await askQuestion(
      'Do you want to run "npx prisma db push"? (y/n): '
    );
    if (pushAns === 'y') {
      console.log(chalk.blue('Running "npx prisma db push"...'));
      await runCommand('npx prisma db push');
      console.log(chalk.green('"npx prisma db push" completed.'));
    }

    const genAns = await askQuestion(
      'Do you want to run "npx prisma generate"? (y/n): '
    );
    if (genAns === 'y') {
      console.log(chalk.blue('Running "npx prisma generate"...'));
      await runCommand('npx prisma generate');
      console.log(chalk.green('"npx prisma generate" completed.'));
    }

    rl.close();

    console.log(chalk.magenta('\n--------------------\n'));

    console.log(chalk.cyan.bold('Populating catalog tables...'));

    await checkAndPopulateTable('role', [
      { value: 'USER' },
      { value: 'SYSADMIN' },
    ]);

    await checkAndPopulateTable('member_role', [
      { value: 'READER' },
      { value: 'COLLABORATOR' },
      { value: 'ADMIN' },
    ]);

    await checkAndPopulateTable('task_status', [
      { value: 'PENDING' },
      { value: 'DOING' },
      { value: 'DONE' },
    ]);

    console.log(chalk.green.bold('Catalog tables populated successfully.'));
  } catch (err) {
    rl.close();
    console.error(chalk.red.bold('Error:'), chalk.red(err));
    process.exit(1);
  }
}

main();
