import readline from 'readline';
import { exec } from 'child_process';
import chalk from 'chalk';
import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Enhanced question function with colored prompts
const askQuestion = (query, options = {}) => {
  const { color = 'yellow', critical = false } = options;
  const styledQuery = critical ? chalk.red.bold(query) : chalk[color](query);

  return new Promise((resolve) =>
    rl.question(styledQuery, (ans) => resolve(ans.trim().toLowerCase()))
  );
};

const runCommand = (command) => {
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

// Parse DATABASE_URL to extract connection details
const parseDatabaseUrl = (databaseUrl) => {
  try {
    const url = new URL(databaseUrl);
    return {
      host: url.hostname,
      port: url.port || 5432,
      username: url.username,
      password: url.password,
      database: url.pathname.slice(1), // Remove leading '/'
    };
  } catch (error) {
    throw new Error('Invalid DATABASE_URL format');
  }
};

// Get database URL from environment variables (loaded by dotenv)
const getDatabaseUrl = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL not found in environment variables. Make sure your .env file exists and contains DATABASE_URL.'
    );
  }
  return process.env.DATABASE_URL;
};

const checkDatabaseConnection = async (dbConfig) => {
  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await client.connect();

    // Check if target database exists
    const result = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbConfig.database]
    );

    await client.end();
    return result.rows.length > 0;
  } catch (error) {
    await client.end();
    throw new Error(`Failed to connect to PostgreSQL: ${error.message}`);
  }
};

const dropDatabase = async (dbConfig) => {
  const client = new Client({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.username,
    password: dbConfig.password,
    database: 'postgres', // Connect to default postgres database
  });

  try {
    await client.connect();

    // Terminate all connections to the target database
    console.log(chalk.yellow('Terminating existing connections...'));
    await client.query(
      `
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = $1 AND pid <> pg_backend_pid()
    `,
      [dbConfig.database]
    );

    // Drop the database
    console.log(chalk.blue('Dropping database...'));
    await client.query(`DROP DATABASE IF EXISTS "${dbConfig.database}"`);

    await client.end();
    console.log(
      chalk.green.bold(
        `✓ Database "${dbConfig.database}" has been dropped successfully!`
      )
    );
  } catch (error) {
    await client.end();
    throw new Error(`Failed to drop database: ${error.message}`);
  }
};

const regeneratePrismaSchema = async () => {
  try {
    console.log(chalk.blue('Regenerating Prisma client...'));
    await runCommand('npx prisma generate');
    console.log(chalk.green('✓ Prisma client regenerated successfully.'));
  } catch (error) {
    console.log(
      chalk.yellow('⚠ Warning: Failed to regenerate Prisma client.')
    );
    console.log(chalk.gray(`Error: ${error}`));
  }
};

const main = async () => {
  console.log(chalk.red.bold('🚨 DATABASE DROP SCRIPT 🚨'));
  console.log(
    chalk.yellow(
      'This script will permanently delete your PostgreSQL database.\n'
    )
  );

  try {
    // Get database configuration
    const databaseUrl = getDatabaseUrl();
    const dbConfig = parseDatabaseUrl(databaseUrl);

    console.log(chalk.cyan('Database Configuration:'));
    console.log(chalk.gray(`  Host: ${dbConfig.host}`));
    console.log(chalk.gray(`  Port: ${dbConfig.port}`));
    console.log(chalk.gray(`  Database: ${dbConfig.database}`));
    console.log(chalk.gray(`  User: ${dbConfig.username}\n`));

    // Check if database exists
    const databaseExists = await checkDatabaseConnection(dbConfig);
    if (!databaseExists) {
      console.log(
        chalk.yellow(`Database "${dbConfig.database}" does not exist.`)
      );
      rl.close();
      return;
    }

    console.log(chalk.green(`✓ Connected to PostgreSQL server successfully.`));
    console.log(chalk.yellow(`Database "${dbConfig.database}" found.\n`));

    // First confirmation
    const firstConfirm = await askQuestion(
      `Are you sure you want to drop the database "${dbConfig.database}"? This action is IRREVERSIBLE! (type 'yes' to continue): `,
      { critical: true }
    );

    if (firstConfirm !== 'yes') {
      console.log(chalk.green('Operation cancelled. Database is safe.'));
      rl.close();
      return;
    }

    // Second confirmation with database name
    const secondConfirm = await askQuestion(
      `FINAL CONFIRMATION: Type the database name "${dbConfig.database}" to proceed with deletion: `,
      { critical: true }
    );

    if (secondConfirm !== dbConfig.database.toLowerCase()) {
      console.log(
        chalk.green('Database name mismatch. Operation cancelled for safety.')
      );
      rl.close();
      return;
    }

    // Third confirmation - just to be extra safe
    const finalConfirm = await askQuestion(
      'Last chance! Type "DELETE" to permanently drop the database: ',
      { critical: true }
    );

    if (finalConfirm !== 'delete') {
      console.log(chalk.green('Operation cancelled. Your database is safe.'));
      rl.close();
      return;
    }

    rl.close();

    console.log(chalk.red.bold('\n⚠ PROCEEDING WITH DATABASE DELETION ⚠\n'));

    // Drop the database
    await dropDatabase(dbConfig);

    // Ask if user wants to regenerate Prisma client
    const regenRL = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const regenAnswer = await new Promise((resolve) =>
      regenRL.question(
        chalk.cyan('Do you want to regenerate the Prisma client? (y/n): '),
        (ans) => resolve(ans.trim().toLowerCase())
      )
    );

    regenRL.close();

    if (regenAnswer === 'y' || regenAnswer === 'yes') {
      await regeneratePrismaSchema();
    }

    console.log(chalk.magenta('\n' + '='.repeat(50)));
    console.log(
      chalk.green.bold('✅ Database drop operation completed successfully!')
    );
    console.log(
      chalk.yellow('Remember to recreate your database schema if needed.')
    );
    console.log(chalk.magenta('='.repeat(50)));
  } catch (err) {
    rl.close();
    console.error(chalk.red.bold('\n❌ Error occurred:'));
    console.error(chalk.red(err.message));

    console.log(chalk.yellow('\nTroubleshooting:'));
    console.log(chalk.gray('1. Ensure PostgreSQL is running'));
    console.log(chalk.gray('2. Check your DATABASE_URL in .env file'));
    console.log(chalk.gray('3. Verify database credentials'));
    console.log(chalk.gray('4. Make sure you have DROP privileges'));

    process.exit(1);
  }
};

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n\nOperation cancelled by user.'));
  console.log(chalk.green('Your database is safe.'));
  rl.close();
  process.exit(0);
});

main();
