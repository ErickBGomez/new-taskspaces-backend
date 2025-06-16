import chalk from 'chalk';
import dotenv from 'dotenv';
import { runCommand } from './script-functions.js'; // Removed askQuestion and rl
import prisma from '../utils/prisma.js';

dotenv.config();

const displayHeader = () => {
  console.log(chalk.blue.bold('🚀 DATABASE SETUP SCRIPT 🚀'));
  console.log(
    chalk.gray(
      'This script will set up your PostgreSQL database using Prisma ORM.\n'
    )
  );

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    try {
      const url = new URL(dbUrl);
      console.log(chalk.cyan('Database Configuration:'));
      console.log(chalk.gray(`  Host: ${url.hostname}`));
      console.log(chalk.gray(`  Port: ${url.port || 5432}`));
      console.log(chalk.gray(`  Database: ${url.pathname.slice(1)}`));
      console.log(chalk.gray(`  User: ${url.username}\n`));
    } catch (error) {
      console.log(chalk.yellow('⚠ DATABASE_URL format appears invalid\n'));
    }
  } else {
    console.log(
      chalk.yellow('⚠ DATABASE_URL not found in environment variables\n')
    );
  }
};

const checkAndPopulateTable = async (tableName, valuesArray) => {
  console.log(chalk.gray(`  • Checking table: ${chalk.white(tableName)}...`));
  const model = prisma[tableName];
  if (!model)
    throw new Error(`Model "${tableName}" does not exist in Prisma client.`);

  const valueList = valuesArray.map((item) => item.value);
  const existing = await model.findMany({
    where: { value: { in: valueList } },
    select: { value: true },
  });

  const existingValues = new Set(existing.map((item) => item.value));
  const missing = valuesArray.filter((item) => !existingValues.has(item.value));

  if (missing.length === 0) {
    console.log(
      chalk.green(
        `    ✓ All values already exist in "${chalk.white(tableName)}"`
      )
    );
  } else {
    await model.createMany({ data: missing });
    console.log(
      chalk.green(
        `    ✓ Created ${missing.length} missing values in "${chalk.white(tableName)}": `
      ) + chalk.cyan(missing.map((i) => i.value).join(', '))
    );
  }
};

const runPrismaDbPush = async () => {
  console.log(chalk.blue('📤 Running "npx prisma db push"...'));
  try {
    const output = await runCommand('npx prisma db push');
    console.log(chalk.green('✅ Database schema push completed successfully!'));

    if (output && output.trim()) {
      const lines = output.trim().split('\n');
      const importantLines = lines.filter(
        (line) =>
          line.includes('Created') ||
          line.includes('Changed') ||
          line.includes('Deleted') ||
          line.includes('Warning')
      );
      if (importantLines.length > 0) {
        console.log(chalk.gray('   Summary:'));
        importantLines.forEach((line) => {
          console.log(chalk.gray(`   ${line.trim()}`));
        });
      }
    }
  } catch (error) {
    console.log(chalk.red('❌ Failed to push database schema'));
    throw error;
  }
};

const runPrismaGenerate = async () => {
  console.log(chalk.blue('⚙️  Running "npx prisma generate"...'));
  try {
    await runCommand('npx prisma generate');
    console.log(chalk.green('✅ Prisma client generated successfully!'));
  } catch (error) {
    console.log(chalk.red('❌ Failed to generate Prisma client'));
    throw error;
  }
};

const populateTables = async () => {
  console.log(chalk.blue.bold('📋 Populating catalog tables...'));
  console.log(chalk.gray('   Adding initial data to reference tables\n'));

  const tables = [
    { name: 'role', data: [{ value: 'USER' }, { value: 'SYSADMIN' }] },
    {
      name: 'member_role',
      data: [
        { value: 'READER' },
        { value: 'COLLABORATOR' },
        { value: 'ADMIN' },
      ],
    },
    {
      name: 'task_status',
      data: [{ value: 'PENDING' }, { value: 'DOING' }, { value: 'DONE' }],
    },
  ];

  for (const table of tables) {
    try {
      await checkAndPopulateTable(table.name, table.data);
    } catch (error) {
      console.log(
        chalk.red(`    ❌ Failed to populate "${table.name}": ${error.message}`)
      );
      throw error;
    }
  }

  console.log(
    chalk.green.bold('\n✅ All catalog tables populated successfully!')
  );
};

const showCompletionSummary = () => {
  console.log(chalk.magenta('\n' + '='.repeat(60)));
  console.log(chalk.green.bold('🎉 DATABASE SETUP COMPLETED SUCCESSFULLY! 🎉'));
  console.log(chalk.magenta('='.repeat(60)));

  console.log(chalk.cyan('\nWhat was accomplished:'));
  console.log(chalk.white('  ✓ Database schema pushed to PostgreSQL'));
  console.log(chalk.white('  ✓ Prisma client generated/updated'));
  console.log(chalk.white('  ✓ Catalog tables populated with initial data'));

  console.log(chalk.yellow('\nNext steps:'));
  console.log(chalk.gray('  • Your database is ready for use'));
  console.log(chalk.gray('  • You can now run your application'));
  console.log(chalk.gray('  • Use Prisma Studio: npx prisma studio'));

  console.log(chalk.magenta('='.repeat(60) + '\n'));
};

const main = async () => {
  displayHeader();

  try {
    await runPrismaDbPush();
    console.log('');
    await runPrismaGenerate();
    console.log('');
    await populateTables();
    showCompletionSummary();
    process.exit(0); // ✅ Exit cleanly after success
  } catch (err) {
    console.error(chalk.red.bold('\n💥 Setup failed with error:'));
    console.error(chalk.red(`   ${err.message || err}`));

    console.log(chalk.yellow('\n🔧 Troubleshooting tips:'));
    console.log(
      chalk.gray('   1. Ensure PostgreSQL is running and accessible')
    );
    console.log(chalk.gray('   2. Check your DATABASE_URL in .env file'));
    console.log(
      chalk.gray('   3. Verify database credentials and permissions')
    );
    console.log(chalk.gray('   4. Make sure your Prisma schema is valid'));
    console.log(
      chalk.gray('   5. Check if the database exists and you can connect to it')
    );

    console.log(chalk.blue('\n📖 Useful commands:'));
    console.log(chalk.gray('   • Test connection: npx prisma db pull'));
    console.log(chalk.gray('   • View schema: npx prisma studio'));
    console.log(
      chalk.gray('   • Reset database: npx prisma db push --force-reset')
    );

    process.exit(1); // ❌ Exit with failure code
  }
};

process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\n⏹️  Setup cancelled by user.'));
  console.log(chalk.gray('No changes were made to your database.'));
  process.exit(0);
});

main();
