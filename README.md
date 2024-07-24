# Anodra

`anodra` is a command-line interface tool designed to simplify the creation and management of projects. It supports setting up new projects with React or Next.js and installing popular UI libraries. Additionally, it provides information about the developer.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
  - [Commands](#commands)
  - [Options](#options)
- [Developer Information](#developer-information)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install `anodra`, follow these steps:

**Install global:**
   ```sh
   npm install -g anodra 
   ```

## Usage

You can use the `anodra` tool by running commands in your terminal.

### Commands

`welcome` - Displays a welcome message.

```sh
    anodra welcome
```
`create <projectName>` - Creates a new project interactively. You will be prompted to choose the type of project and additional configurations.

```sh
    anodra create <projectName>
```

#### Options

- `<projectName>` : The name of the project you want to create.

#### Interactive Prompts:
#### 1. Type of Project:
 - `react`
 - `next`

#### 2. If react is selected:
 - `UI library`
    - `MUI Design`
    - `Bootstrap`
    - `Ant Design`
    - `None`

`info` - Displays information about the developer.

```sh
    anodra info
```

#### Output:
```sh
Developer Information
Name: Dinmuhammad Yagafarov
Email: dinmuhammadyagafarov@gmail.com
GitHub: https://github.com/yagafarov
Telegram: https://t.me/codewithdin
Bio: Full-stack developer with experience in React, Node.js, and more.
```

`help` - For more information on how to use `anodra`, you can always run:

```sh
    anodra --help
```


### Explanation:

- **Installation**: Provides instructions on how to install the CLI tool globally.
- **Usage**: Details how to use the CLI, including descriptions of available commands and their usage.
- **Commands**: Lists and explains the commands available in your CLI tool.
- **Help**: Provides a way to access help information from within the CLI.

You can adjust the content based on your CLI tool’s features and the specific details of your project.


