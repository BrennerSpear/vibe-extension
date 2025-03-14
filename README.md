# Vibe Extension

A Chrome extension that allows you to send the same prompt to multiple AI tools simultaneously.

## Features

- Write one prompt and distribute it to multiple AI websites at once
- Pre-configured support for popular AI tools:
  - Replit Ghostwriter
  - Bolt.new
  - AI Agent Sourcebook
- Add custom sites with CSS selectors for input fields and submit buttons
- Save your custom targets for future use

## Prerequisites

* [node + npm](https://nodejs.org/) (Current Version)

## Project Structure

* src: TypeScript source files
* dist: Chrome Extension directory
* dist/js: Generated JavaScript files

## Setup

```
npm install
```

## Build

```
npm run build
```

## Development

- Start development server with hot reload:
  ```
  npm run watch
  ```
- Run tests:
  ```
  npm test
  ```
- Lint and format code:
  ```
  npm run lint
  ```
- Type check:
  ```
  npm run typecheck
  ```

## Load extension to Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `dist` folder from this repository

## How to Use

1. Click the extension icon in your Chrome toolbar
2. Enter your prompt in the textarea
3. Select the AI tools you want to send the prompt to
4. Click "Distribute Prompt"
5. The extension will open tabs for each selected tool and input your prompt

## Adding Custom Targets

1. Click the "Add Custom Target" button
2. Fill in the following fields:
   - Name: A descriptive name for the AI tool
   - URL: The website address
   - Input Selector: CSS selector for the input field (e.g., `textarea.promptInput`)
   - Submit Button Selector: (Optional) CSS selector for the submit button

## Privacy

This extension does not collect or transmit any data outside of your browser. All configuration is stored locally in your browser's storage.

## Technology Stack

* TypeScript
* React
* Webpack
* Jest
* Biome (for linting and formatting)

## License

MIT
