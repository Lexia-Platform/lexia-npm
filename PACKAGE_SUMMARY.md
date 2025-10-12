# @lexia/sdk Package Summary

## Package Overview

**Name:** `@lexia/sdk`  
**Version:** 1.0.0 (first release)  
**License:** MIT  
**Language:** JavaScript (Node.js)  
**Port of:** `lexia` Python package (Python package is at v1.2.5)

## What This Package Does

The `@lexia/sdk` package provides a clean, minimal interface for Node.js AI agents to integrate with the Lexia platform. It handles:

- Real-time message streaming via Centrifugo
- Backend API communication with Lexia servers
- Request/response formatting for Lexia compatibility
- User memory and environment variable management
- Dev mode for local development
- Optional Express.js web framework integration

## Package Structure

```
@lexia/sdk/
├── src/
│   ├── index.js                    # Main entry point
│   ├── index.d.ts                  # TypeScript definitions
│   ├── models.js                   # Data models (ChatMessage, ChatResponse, etc.)
│   ├── api-client.js               # HTTP client for API calls
│   ├── centrifugo-client.js        # Real-time messaging client
│   ├── dev-stream-client.js        # Dev mode streaming
│   ├── response-handler.js         # Response formatting utilities
│   ├── unified-handler.js          # Main LexiaHandler class
│   ├── utils.js                    # Helper utilities and classes
│   └── web/                        # Express.js integration (optional)
│       ├── index.js
│       ├── app-factory.js
│       └── endpoints.js
├── package.json                    # Package configuration
├── README.md                       # Complete documentation
├── QUICKSTART.md                   # Quick start guide
├── CHANGELOG.md                    # Version history
├── CONTRIBUTING.md                 # Contribution guidelines
├── LICENSE                         # MIT license
├── Makefile                        # Build/test automation
├── tsconfig.json                   # TypeScript configuration
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc.json                # Prettier configuration
├── .gitignore                      # Git ignore rules
├── .npmignore                      # npm ignore rules
├── test-package.js                 # Test suite
├── example.js                      # Usage examples
├── PYTHON_TO_JS_MAPPING.md        # Python-to-JS migration guide
└── VERSION_1.2.5_NOTES.md         # Release notes
```

## Core Exports

### Main Classes
- `LexiaHandler` - Main interface for Lexia communication
- `ChatMessage` - Request message model
- `ChatResponse` - Response message model
- `Variable` - Environment variable model
- `Memory` - User memory model

### Helper Classes
- `Variables` - Easy variable access
- `MemoryHelper` - Easy memory access
- `APIClient` - HTTP client
- `CentrifugoClient` - Real-time messaging
- `DevStreamClient` - Dev mode streaming

### Utility Functions
- `createSuccessResponse()` - Create success response
- `getVariableValue()` - Get variable by name
- `getOpenAIApiKey()` - Get OpenAI API key
- `setEnvVariables()` - Set environment variables
- `formatSystemPrompt()` - Format system prompts
- `formatMessagesForAI()` - Format messages for AI APIs

### Web Functions (Optional)
- `createLexiaApp()` - Create Express app
- `addStandardEndpoints()` - Add Lexia endpoints

## Usage Patterns

### 1. Basic Usage
```javascript
const { LexiaHandler } = require('@lexia/sdk');
const lexia = new LexiaHandler();
await lexia.completeResponse(data, response);
```

### 2. With Variables
```javascript
const { Variables } = require('@lexia/sdk');
const vars = new Variables(data.variables);
const apiKey = vars.get('OPENAI_API_KEY');
```

### 3. With Memory
```javascript
const { MemoryHelper } = require('@lexia/sdk');
const memory = new MemoryHelper(data.memory);
const userName = memory.getName();
```

### 4. With Express
```javascript
const { createLexiaApp, addStandardEndpoints } = require('@lexia/sdk');
const app = createLexiaApp({ title: 'My Agent' });
addStandardEndpoints(app, { lexiaHandler, processMessageFunc });
```

## Installation Methods

### From npm (Recommended)
```bash
npm install @lexia/sdk
```

### With Express
```bash
npm install @lexia/sdk express
```

### From Source
```bash
git clone https://github.com/Xalantico/lexia-npm.git
cd lexia-npm
npm install
npm link
```

## Testing & Development

### Run Tests
```bash
node test-package.js
# or
make test
```

### Run Examples
```bash
node example.js
# or
make example
```

### Build Package
```bash
npm run build
# or
make build
```

### Create Distribution
```bash
npm pack
# or
make pack
```

## Publishing

### Dry Run
```bash
npm publish --dry-run
# or
make publish-test
```

### Publish to npm
```bash
npm publish --access public
# or
make publish
```

## Dependencies

### Production
- `axios` (^1.6.0) - HTTP client

### Peer Dependencies (Optional)
- `express` (^4.18.0) - Web framework

### Dev Dependencies
- `typescript` (^5.2.0) - Type definitions
- `eslint` (^8.50.0) - Code linting
- `prettier` (^3.0.0) - Code formatting
- `jest` (^29.7.0) - Testing framework
- `@types/node` (^20.0.0) - Node.js types
- `@types/express` (^4.17.21) - Express types

## Key Features

✅ **Complete Feature Parity** with Python `lexia` v1.2.5
✅ **Minimal Dependencies** - Only axios required
✅ **Optional Express Integration** - Graceful fallback
✅ **TypeScript Definitions** - Full type safety
✅ **Dev Mode Support** - Local development friendly
✅ **Comprehensive Documentation** - README, examples, guides
✅ **Test Suite Included** - Verify functionality
✅ **Production Ready** - Used in real applications

## Compatibility

- **Node.js:** >= 14.0.0
- **Module System:** CommonJS
- **Python Equivalent:** `lexia` v1.2.5
- **Lexia Platform:** Compatible with current version

## Links

- **npm Package:** https://www.npmjs.com/package/@lexia/sdk
- **GitHub Repository:** https://github.com/Xalantico/lexia-npm
- **Issue Tracker:** https://github.com/Xalantico/lexia-npm/issues
- **Documentation:** https://github.com/Xalantico/lexia-npm#readme

## License

MIT License - Free to use in commercial and open-source projects

## Support

- 📚 Read the [README.md](README.md)
- 🚀 Check the [QUICKSTART.md](QUICKSTART.md)
- 💡 See [example.js](example.js)
- 🔄 Review [PYTHON_TO_JS_MAPPING.md](PYTHON_TO_JS_MAPPING.md)
- 🐛 Report issues on GitHub
- 🤝 Contribute via pull requests

---

**Status:** ✅ Complete and ready for use  
**Last Updated:** October 12, 2024  
**Maintainer:** Lexia Team

