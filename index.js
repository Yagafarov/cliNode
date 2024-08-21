#!/usr/bin/env node

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import ora from 'ora';

const execPromise = promisify(exec);

const program = new Command();

program
  .version('1.0.0')
  .description('Welcome to ' + chalk.bold.green('anodra-cli'));

program
  .command('welcome')
  .description('Displays a welcome message')
  .action(() => {
    console.log('Welcome to anodra!');
  });

program
  .command('create <projectName>')
  .description('Create a new item interactively')
  .action(async (projectName) => {
    const projectPath = path.resolve(projectName);

    if (fs.existsSync(projectPath)) {
      return console.error('Directory already exists.');
    }

    console.log(`Project name: ${projectName}`);

    const { type } = await inquirer.prompt([
      {
        type: 'list',
        name: 'type',
        message: 'What would you like to create?',
        choices: ['react', 'next'],
      },
    ]);

    if (type === 'react') {
      const { uiLibrary } = await inquirer.prompt([
        {
          type: 'list',
          name: 'uiLibrary',
          message: 'Which UI library would you like to use?',
          choices: ['MUI Design', 'Bootstrap', 'Ant Design', 'Tailwind CSS', 'None'],
        },
      ]);

      const spinner = ora(`Creating a new React project: ${projectName}...`).start();

      try {
        await execPromise(`npm create vite@latest ${projectName} -- --template react`, { cwd: path.dirname(projectPath) });
        spinner.succeed('React project created successfully.');

        process.chdir(projectPath);

        spinner.start('Installing dependencies...');
        await execPromise('npm install');
        spinner.succeed('Dependencies installed successfully.');

        if (uiLibrary !== 'None') {
          let installCommand;
          switch (uiLibrary) {
            case 'MUI Design':
              installCommand = 'npm install @mui/material @emotion/react @emotion/styled';
              break;
            case 'Bootstrap':
              installCommand = 'npm install react-bootstrap bootstrap';
              break;
            case 'Ant Design':
              installCommand = 'npm install antd';
              break;
            case 'Tailwind CSS':
              installCommand = 'npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init';
              break;
          }

          spinner.start(`Installing ${uiLibrary}...`);
          await execPromise(installCommand);
          spinner.succeed(`${uiLibrary} installed successfully.`);

          if (uiLibrary === 'Tailwind CSS') {
            // Add Tailwind CSS configuration
            const tailwindConfig = `
            /** @type {import('tailwindcss').Config} */
            module.exports = {
              content: [
                "./index.html",
                "./src/**/*.{js,ts,jsx,tsx}",
              ],
              theme: {
                extend: {},
              },
              plugins: [],
            };
            `;
            fs.writeFileSync('tailwind.config.js', tailwindConfig);

            // Update CSS file to include Tailwind imports
            fs.writeFileSync(
              'src/index.css',
              `@tailwind base;\n@tailwind components;\n@tailwind utilities;`
            );
          }
        }

        spinner.start('Opening project in VS Code...');
        await execPromise('code .');
        spinner.succeed('Project opened in VS Code.');

        spinner.start('Starting the development server...');
        await execPromise('npm run dev');
        spinner.succeed('Development server started.');
      } catch (error) {
        spinner.fail('Error creating project.');
        console.error(error);
      }
    } else if (type === 'next') {
      console.log(`This section is under processing`);
    }
  });

program
  .command('info')
  .description('Displays information about the CLI tool and the developer')
  .action(() => {
    console.log(chalk.bold('CLI Information'));
    console.log(chalk.green('Name: anodra-cli'));
    console.log(chalk.green('Version: 1.0.0'));
    console.log(chalk.green('Description: A command-line tool to create and manage projects interactively.'));
    console.log();

    
    console.log(chalk.bold('Developer Information'));
    console.log(chalk.blue('Name: Dinmuhammad Yagafarov'));
    console.log(chalk.blue('Email: dinmuhammadyagafarov@gmail.com'));
    console.log(chalk.blue('GitHub: https://github.com/yagafarov'));
    console.log(chalk.blue('Telegram: https://t.me/codewithdin'));
    console.log(chalk.blue('Bio: Full-stack developer with experience in React, Node.js, and more.'));
  });

// Help command
program
  .option('-h, --help', 'Show help information')
  .action(() => {
    program.help();
  });

program.parse(process.argv);
