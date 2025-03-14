# CLAUDE.md - Guide for Agentic Coding

## Build & Development Commands
- Build: `npm run build`
- Development: `npm run watch`
- Clean: `npm run clean`
- Test: `npm test`
- Test single file: `npx jest path/to/test.ts`
- Lint & format code: `npm run lint`
- Type check: `npm run typecheck`
- Create zip file: `npm run zip`

## Code Style Guidelines
- TypeScript with strict mode enabled
- React functional components with hooks for UI
- ES6 module imports/exports
- Strong typing - use explicit type annotations
- Naming: PascalCase for components, camelCase for variables/functions
- Arrow functions preferred
- JSX for React components
- Error handling via try/catch blocks
- Non-null assertions with ! operator only when necessary
- Code formatting handled by Biome
- Use template literals for string interpolation

## Project Structure
This is a Chrome extension built with TypeScript and React, using Jest for testing and Webpack for bundling.