# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BOQApp Frontend - A React application for Bill of Quantities (construction cost estimation). Currently being developed alongside a component library.

## Commands

```bash
pnpm dev       # Start Vite development server
pnpm install   # Install dependencies
```

## Tech Stack

- **React 19** with React Compiler enabled (babel-plugin-react-compiler)
- **Vite 7** for bundling and dev server
- **MUI v7** + **MUI X DataGrid v8** for UI components
- **Emotion** for CSS-in-JS styling
- **pnpm** as package manager

## Architecture

### Theming
- Theme defined in `src/utils/palettes/DefaultPalette.js`
- Custom palette colors include `cancel` (grey) in addition to standard MUI colors
- Custom button roles via MUI variants: `role="confirm"` (green) and `role="cancel"` (grey)
- Global component overrides for MuiButton, MuiInputBase, MuiOutlinedInput, MuiDataGrid

### Component Library
- Components are imported from `../components-lib/` (sibling directory outside this repo)
- This repo consumes the component library; see `src/demo-page.jsx` for usage examples
- Available components: Button, FlexContainer, TextField, DataGrid, Card

### Entry Points
- `index.html` → `src/main.jsx` → `src/App.jsx`
- App wraps all content in MUI `ThemeProvider`
