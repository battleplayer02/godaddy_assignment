# GoDaddy GitHub Repositories

A fantastic React application that displays GoDaddy's open source repositories from GitHub. Built with Vite and React, featuring a modern UI with pagination, repository details, and error handling.

## Features

- 🚀 **Fast & Modern**: Built with Vite and React 19
- 📱 **Responsive Design**: Works perfectly on all devices
- 🔍 **Repository Browsing**: Browse through GoDaddy's GitHub repositories
- 📄 **Pagination**: Navigate through multiple pages of repositories
- 🎯 **Repository Details**: Click on any repository to see detailed information
- ⚠️ **Error Handling**: Beautiful error portal for API issues
- 🎨 **Modern UI**: Clean, accessible design with smooth animations

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd godaddy
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with UI
- `npm run test:run` - Run tests once

## Testing

This project uses **Vitest** for testing with **React Testing Library** for component testing. The testing setup includes:

### Test Structure

```
src/
├── __tests__/
│   └── App.test.jsx          # Main App component tests
├── components/
│   └── __tests__/
│       ├── Header.test.jsx    # Header component tests
│       ├── Repo.test.jsx      # Repository card tests
│       ├── RepoPortal.test.jsx # Repository modal tests
│       └── ErrorPortal.test.jsx # Error modal tests
└── utils/
    └── __tests__/
        └── pagination.test.js # Utility function tests
```

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run
```

### Test Coverage

The test suite covers:

- ✅ **Component Rendering**: All components render correctly
- ✅ **User Interactions**: Click handlers and user events
- ✅ **API Integration**: Mocked API calls and error handling
- ✅ **State Management**: Component state changes
- ✅ **Error Scenarios**: Network errors and API failures
- ✅ **Accessibility**: Proper ARIA roles and structure
- ✅ **Edge Cases**: Empty data, missing properties

### Testing Technologies

- **Vitest**: Fast unit testing framework
- **React Testing Library**: Component testing utilities
- **jsdom**: DOM environment for testing
- **@testing-library/jest-dom**: Custom matchers for DOM testing

## Project Structure

```
src/
├── components/
│   ├── Header.jsx           # Application header
│   ├── Repo.jsx            # Repository card component
│   ├── RepoPortal.jsx      # Repository details modal
│   └── ErrorPortal.jsx     # Error display modal
├── style/
│   ├── App.css             # Main application styles
│   ├── Header.css          # Header component styles
│   ├── ErrorPortal.css     # Error modal styles
│   └── index.css           # Global styles
├── __tests__/              # Test files
├── utils/                   # Utility functions
└── main.jsx               # Application entry point
```

## API Integration

The application fetches data from the GitHub API:
- **Endpoint**: `https://api.github.com/orgs/godaddy/repos`
- **Pagination**: Supports page-based navigation
- **Error Handling**: Graceful handling of API errors and rate limits
