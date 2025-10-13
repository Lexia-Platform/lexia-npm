# Contributing to @lexia/sdk

Thank you for your interest in contributing to the Lexia SDK! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue on GitHub with:
- A clear description of the problem
- Steps to reproduce
- Expected behavior
- Actual behavior
- Your environment (Node version, OS, etc.)

### Suggesting Features

Feature suggestions are welcome! Please create an issue with:
- A clear description of the feature
- Use cases and benefits
- Possible implementation approach

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature-name`
3. **Make your changes**
4. **Test your changes**: Ensure all tests pass
5. **Commit your changes**: Use clear, descriptive commit messages
6. **Push to your fork**: `git push origin feature/your-feature-name`
7. **Submit a pull request**

### Code Style

- Use consistent indentation (2 spaces)
- Follow JavaScript Standard Style
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful variable names

### Testing

- Write tests for new features
- Ensure all existing tests pass
- Test both dev mode and production mode
- Test with and without optional dependencies

### Documentation

- Update README.md for new features
- Add JSDoc comments to functions
- Update CHANGELOG.md
- Include code examples

## Development Setup

```bash
# Clone the repository
git clone https://github.com/Xalantico/lexia-npm.git
cd lexia-npm

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## Project Structure

```
@lexia/sdk/
├── src/              # Source code
│   ├── index.js      # Main entry point
│   ├── models.js     # Data models
│   ├── *.js          # Other modules
│   └── web/          # Express integration
├── test/             # Test files
├── package.json      # Package configuration
└── README.md         # Documentation
```

## Commit Message Guidelines

Use clear, descriptive commit messages:

- `feat: Add new feature`
- `fix: Fix bug in handler`
- `docs: Update README`
- `test: Add tests for utils`
- `refactor: Improve code structure`
- `style: Format code`
- `chore: Update dependencies`

## Questions?

If you have questions, feel free to:
- Open an issue on GitHub
- Contact the maintainers
- Check existing documentation

Thank you for contributing! 🎉




