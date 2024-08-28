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
  .description('Create a new project interactively')
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
      const { language } = await inquirer.prompt([
        {
          type: 'list',
          name: 'language',
          message: 'Would you like to use JavaScript or TypeScript?',
          choices: ['JavaScript', 'TypeScript'],
        },
      ]);

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
        const template = language === 'TypeScript' ? 'react-ts' : 'react';
        await execPromise(`npm create vite@latest ${projectName} -- --template ${template}`, { cwd: path.dirname(projectPath) });
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
            const tailwindConfig = `
          module.exports = {
            content: ["./src/**/*.{js,ts,jsx,tsx}"],
            theme: {
              extend: {},
            },
            plugins: [],
          };
            `;
            fs.writeFileSync(path.join(projectPath, 'tailwind.config.js'), tailwindConfig);
          
            const postcssConfig = `
          module.exports = {
            plugins: {
              tailwindcss: {},
              autoprefixer: {},
            },
          };
            `;
            fs.writeFileSync(path.join(projectPath, 'postcss.config.cjs'), postcssConfig);
          
            const indexCss = `
          @tailwind base;
          @tailwind components;
          @tailwind utilities;
            `;
            fs.writeFileSync(path.join(projectPath, 'src/index.css'), indexCss);
          
            spinner.succeed('Tailwind CSS configuration files created.');
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
  .description('Displays information about the CLI tool and developer')
  .action(() => {
    console.log(chalk.bold('Anodra CLI Tool'));
    console.log(chalk.blue('Version: 1.0.5'));
    console.log(chalk.blue('Description: A CLI tool for creating React and Next.js projects with UI library options.'));

    console.log(chalk.bold('\nDeveloper Information'));
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
