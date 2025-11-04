# Lexia Platform Integration Package

A clean, minimal Node.js package for seamless integration with the Lexia platform. This package provides essential components for AI agents to communicate with Lexia while maintaining platform-agnostic design.

## 🚀 Quick Start

### Install from npm (Recommended)
```bash
npm install @lexia/sdk
```

### Install with Express dependencies
```bash
npm install @lexia/sdk express
```

### Install from source
```bash
git clone https://github.com/Xalantico/lexia-npm.git
cd lexia-npm
npm install
npm link
```

## 📦 Package Information

- **Package Name**: `@lexia/sdk`
- **Version**: 1.2.9
- **Node**: >=14.0.0
- **License**: MIT
- **Dependencies**: axios, express
- **Optional**: express (for web framework integration)

## 📖 Full Documentation

- **[LEXIA_USAGE_GUIDE.md](./LEXIA_USAGE_GUIDE.md)** - Complete API reference with examples
- **[CHANGELOG.md](./CHANGELOG.md)** - Version history and release notes

## 🎯 Purpose

This package provides a clean interface for AI agents to communicate with the Lexia platform. It handles all Lexia-specific communication while keeping your AI agent completely platform-agnostic.

## 🚀 Core Features

- **Real-time streaming** via Centrifugo
- **Backend communication** with Lexia API
- **Response formatting** for Lexia compatibility
- **Data validation** with class models
- **Error handling** and logging
- **Express integration** with standard endpoints (optional)
- **Dynamic configuration** from request data
- **Header forwarding** (x-tenant, etc.) to Lexia API
- **Easy variable access** with Variables helper class
- **User memory handling** with MemoryHelper for personalized responses
- **Force tools helper** ⭐ NEW in v1.2.9
- **Progressive tracing API** ⭐ NEW in v1.2.9
- **Base64 file handling** ⭐ NEW in v1.2.9
- **Dev mode** with in-memory streaming for local development
- **Automatic file upload handling** in dev mode ⭐ NEW in v1.2.9
- **Full TypeScript support** with comprehensive type definitions
- **Graceful fallback** when web dependencies aren't available

## 📁 Package Structure

```
@lexia/sdk/
├── src/
│   ├── index.js               # Package exports with optional web imports
│   ├── models.js              # Lexia data models (ChatMessage, ChatResponse, Variable)
│   ├── response-handler.js    # Response creation utilities
│   ├── unified-handler.js     # Main communication interface
│   ├── api-client.js          # HTTP communication with Lexia backend
│   ├── centrifugo-client.js   # Real-time updates via Centrifugo
│   ├── dev-stream-client.js   # Dev mode streaming
│   ├── utils.js               # Platform utilities
│   └── web/                   # Express web framework utilities (optional)
│       ├── index.js
│       ├── app-factory.js
│       └── endpoints.js
├── package.json
├── README.md
└── LICENSE
```

**Note**: The `web/` module is optional and will gracefully fall back if Express dependencies aren't available.

## 🚀 Usage Examples

### Basic Usage (New Session API - Recommended)
```javascript
const { LexiaHandler } = require('@lexia/sdk');

// Initialize the handler (dev mode)
const lexia = new LexiaHandler(true);

// Use in your AI agent
async function processMessage(data) {
  const session = lexia.begin(data);
  
  // Stream your AI response
  await session.stream("Hello ");
  await session.stream("from your ");
  await session.stream("AI agent!");
  
  // Complete the response
  await session.close();
}
```

### Classic Usage (Still Supported)
```javascript
const { LexiaHandler, ChatMessage } = require('@lexia/sdk');

// Initialize the handler
const lexia = new LexiaHandler();

// Use in your AI agent
async function processMessage(data) {
  // Your AI logic here...
  const response = "Hello from your AI agent!";
  await lexia.completeResponse(data, response);
}
```

### Express Integration
```javascript
const express = require('express');
const { 
  createLexiaApp, 
  addStandardEndpoints, 
  LexiaHandler 
} = require('@lexia/sdk');

// Create Express app
const app = createLexiaApp({
  title: 'My AI Agent',
  version: '1.0.0'
});

// Initialize Lexia handler
const lexia = new LexiaHandler();

// Add standard endpoints
addStandardEndpoints(app, {
  lexiaHandler: lexia,
  processMessageFunc: yourAIFunction
});

// Start server
app.listen(8000, () => {
  console.log('Server running on port 8000');
});
```

## 🔧 Core Components

### LexiaHandler (Main Interface)
Single, clean interface for all Lexia communication:

```javascript
const { LexiaHandler } = require('@lexia/sdk');

// Initialize with optional dev mode
const lexia = new LexiaHandler();  // Auto-detects from LEXIA_DEV_MODE env var
// OR
const lexia = new LexiaHandler(true);  // Explicitly enable dev mode

// Stream AI response chunks
await lexia.streamChunk(data, content);

// Complete AI response (handles all Lexia communication)
await lexia.completeResponse(data, fullResponse);

// Send error messages (with optional trace/exception for logging)
await lexia.sendError(data, errorMessage);
// Or with exception for detailed logging:
await lexia.sendError(data, errorMessage, null, error);

// Update Centrifugo configuration dynamically
lexia.updateCentrifugoConfig(streamUrl, streamToken);

// Headers (like x-tenant) are automatically forwarded to Lexia API
// No additional configuration needed - just include headers in your request
```

### Data Models
Lexia's expected data formats:

```javascript
const { ChatMessage, ChatResponse, Variable, Memory } = require('@lexia/sdk');

// ChatMessage - Lexia's request format with all required fields
// ChatResponse - Lexia's expected response format  
// Variable - Environment variables from Lexia request
// Memory - User memory data from Lexia request

// New in v1.2.9: ChatMessage now includes:
// - file_base64: Base64 encoded file data
// - file_name: Original filename
// - force_tools: Array of forced tool names (replaced force_search/force_code)
// - sleep_time: Optional sleep time parameter
```

### Variables Helper
Easy access to environment variables from Lexia requests:

```javascript
const { Variables } = require('@lexia/sdk');

// Create variables helper from request data
const vars = new Variables(data.variables);

// Get any variable by name
const openaiKey = vars.get('OPENAI_API_KEY');
const anthropicKey = vars.get('ANTHROPIC_API_KEY');
const customVar = vars.get('CUSTOM_VAR');

// Check if variable exists
if (vars.has('OPENAI_API_KEY')) {
  const key = vars.get('OPENAI_API_KEY');
}

// Get all variable names
const allNames = vars.listNames();  // ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", ...]

// Convert to plain object
const varsDict = vars.toDict();  // {"OPENAI_API_KEY": "sk-...", ...}
```

### Memory Helper
Easy access to user memory data from Lexia requests:

```javascript
const { MemoryHelper } = require('@lexia/sdk');

// Create memory helper from request data
const memory = new MemoryHelper(data.memory);

// Get user information
const userName = memory.getName();
const userGoals = memory.getGoals();
const userLocation = memory.getLocation();
const userInterests = memory.getInterests();
const userPreferences = memory.getPreferences();
const userExperiences = memory.getPastExperiences();

// Check if memory data exists
if (memory.hasName()) {
  console.log(`User: ${memory.getName()}`);
}
if (memory.hasGoals()) {
  console.log(`Goals: ${memory.getGoals()}`);
}
if (memory.hasLocation()) {
  console.log(`Location: ${memory.getLocation()}`);
}

// Convert to plain object
const memoryDict = memory.toDict();

// Check if memory is empty
if (!memory.isEmpty()) {
  // Process user memory data
}
```

**Supported Memory Formats:**
- `"memory": []` - Empty array (treated as empty memory)
- `"memory": {}` - Empty object (treated as empty memory)  
- `"memory": {"name": "John", "goals": [...]}` - Structured memory
- `"memory": null` - Null value (treated as empty memory)

### Force Tools Helper ⭐ NEW in v1.2.9
Check which tools are forced by the user:

```javascript
const { ForceToolsHelper } = require('@lexia/sdk');

// Create helper from request data
const tools = new ForceToolsHelper(data.force_tools);

// Check if specific tool is forced
if (tools.has("search")) {
  // Perform search
}
if (tools.has("code")) {
  // Use code tool
}

// Get all forced tools
const allTools = tools.getAll();  // ["search", "code", ...]

// Check if any tools are forced
if (!tools.isEmpty()) {
  console.log(`${tools.count()} tools forced`);
}
```

### File Utilities ⭐ NEW in v1.2.9
Decode base64-encoded files:

```javascript
const { decodeBase64File } = require('@lexia/sdk');
const fs = require('fs');

// Decode base64 file to temporary file
const { filePath, isTempFile } = decodeBase64File(
  data.file_base64,
  data.file_name
);

// Use the file
const content = fs.readFileSync(filePath);

// Clean up if temporary
if (isTempFile) {
  fs.unlinkSync(filePath);
}
```

### Session API ⭐ NEW in v1.2.9
The new session-based API provides a cleaner interface:

```javascript
const session = lexia.begin(data);

// Stream content
await session.stream("Hello ");
await session.stream("World!");

// Show loading indicators
await session.start_loading("thinking");
await session.end_loading("thinking");

// Display images
await session.image("https://example.com/image.png");

// Add tracing for debugging
await session.tracing("Processing step 1", "all");
await session.tracing("Internal debug info", "admin");

// Progressive tracing (builds a single trace incrementally)
session.tracing_begin("Processing items:");
session.tracing_append("\n  - Item 1 ✓");
session.tracing_append("\n  - Item 2 ✓");
await session.tracing_end("\n✅ Complete!");

// Handle errors
await session.error("Something went wrong", error);

// Complete the response
const fullText = await session.close(usageInfo);
```

### Response Handler
Create Lexia-compatible responses:

```javascript
const { createSuccessResponse } = require('@lexia/sdk');
const { createCompleteResponse } = require('@lexia/sdk/src/response-handler');

// Create immediate success response
const response = createSuccessResponse('uuid123', 'thread456');

// Create complete response with usage info (used internally by LexiaHandler)
const completeResponse = createCompleteResponse(
  'uuid123',
  'thread456',
  'Full AI response',
  { prompt_tokens: 10, completion_tokens: 50 }
);
```

## 💡 Complete Example: AI Agent with Express (v1.2.9)

```javascript
const express = require('express');
const {
  LexiaHandler,
  Variables,
  MemoryHelper,
  ForceToolsHelper,
  createLexiaApp,
  addStandardEndpoints
} = require('@lexia/sdk');

// Initialize services
const lexia = new LexiaHandler();

// Create Express app
const app = createLexiaApp({
  title: 'My AI Agent',
  version: '1.0.0',
  description: 'Custom AI agent with Lexia integration'
});

// Define your AI logic using the new Session API
async function processMessage(data) {
  const session = lexia.begin(data);
  
  try {
    // Easy access to environment variables
    const vars = new Variables(data.variables);
    
    // Easy access to user memory
    const memory = new MemoryHelper(data.memory);
    
    // Check forced tools (NEW in v1.2.9)
    const tools = new ForceToolsHelper(data.force_tools);
    
    // Get API keys
    const openaiKey = vars.get('OPENAI_API_KEY');
    
    // Get user information for personalized responses
    const userName = memory.getName();
    const userGoals = memory.getGoals();
    
    // Check if required variables exist
    if (!openaiKey) {
      await session.error('No AI API key provided');
      return;
    }
    
    // Show loading indicator
    await session.start_loading("thinking");
    
    // Add tracing for debugging (NEW in v1.2.9)
    await session.tracing(`User: ${userName || 'Anonymous'}`, "admin");
    
    // Create personalized response based on user memory
    let response;
    if (memory.hasName()) {
      response = `Hello ${userName}! `;
    } else {
      response = `Hello! `;
    }
    
    // Stream response word by word
    await session.end_loading("thinking");
    await session.stream(response);
    
    // Add user-specific context if available
    if (memory.hasGoals()) {
      await session.stream(`\n\nI see your goals include: ${userGoals.join(', ')}`);
    }
    
    // Check if search is forced (NEW in v1.2.9)
    if (tools.has('search')) {
      await session.stream('\n\n[Performing search as requested...]');
    }
    
    // Complete the response
    await session.close({
      prompt_tokens: 10,
      completion_tokens: 50,
      total_tokens: 60
    });
    
  } catch (error) {
    // Handle errors appropriately with trace logging
    await session.error(`Error processing message: ${error.message}`, error);
  }
}

// Add all standard Lexia endpoints
addStandardEndpoints(app, {
  conversationManager: null,
  lexiaHandler: lexia,
  processMessageFunc: processMessage
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## 🔄 Integration Flow

```
Your AI Agent → LexiaHandler → Lexia Platform
     ↓              ↓              ↓
  AI/LLM Logic   Communication   Real-time + Backend
```

Your AI agent focuses on AI logic, this package handles all Lexia communication complexity behind a clean interface.

## 🧪 Testing

```javascript
const { LexiaHandler } = require('@lexia/sdk');

// Test basic functionality
const handler = new LexiaHandler();

// Create test data
const testData = {
  thread_id: 'test123',
  model: 'gpt-4',
  message: 'Hello',
  conversation_id: 1,
  response_uuid: 'uuid123',
  message_uuid: 'msg123',
  channel: 'test',
  variables: [],
  url: 'http://test.com'
};

// Test that handler can be created
console.assert(handler !== null);
console.assert(typeof handler.streamChunk === 'function');
console.assert(typeof handler.completeResponse === 'function');
console.assert(typeof handler.sendError === 'function');
console.assert(typeof handler.updateCentrifugoConfig === 'function');
```

## 🚨 Common Issues and Solutions

### Import Error
```
Error: Cannot find module '@lexia/sdk'
```
**Solution**: Ensure the package is installed: `npm install @lexia/sdk`

### Missing Dependencies
```
Error: Cannot find module 'express'
```
**Solution**: Install express if using web features: `npm install express`

### Lexia Communication Fails
**Solution**: Verify that your environment variables and API keys are properly configured in the Lexia request variables.

## 📦 Publishing

### Test npm
```bash
npm pack
# Test the package locally
npm install ./lexia-sdk-1.2.9.tgz
```

### Production npm
```bash
npm login
npm publish --access public
```

## 🎯 Design Principles

1. **Single Responsibility**: Each component has one clear purpose
2. **Clean Interface**: Simple, intuitive methods
3. **Platform Agnostic**: Your AI agent doesn't know about Lexia internals
4. **Minimal Dependencies**: Only what's absolutely necessary
5. **Easy Testing**: Simple, focused components
6. **Dynamic Configuration**: Adapts to request-specific settings

## 🚀 Benefits

- **Clean separation** between your AI agent and Lexia
- **Easy to maintain** - all Lexia logic in one place
- **Easy to replace** - switch platforms by replacing this package
- **Professional structure** - clean, organized code
- **Fast development** - no complex integrations to manage
- **Drop-in replacement** - install and start using immediately
- **Dynamic configuration** - adapts to different Lexia environments

## 📞 Support

This package is designed to be a drop-in solution - just `npm install @lexia/sdk` and start building your AI agent! All Lexia communication is handled automatically, standard endpoints are provided out-of-the-box, and your AI agent remains completely platform-agnostic.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Documentation

- **[LEXIA_USAGE_GUIDE.md](./LEXIA_USAGE_GUIDE.md)** - Complete API reference with all methods and examples
- **[CHANGELOG.md](./CHANGELOG.md)** - Full version history and release notes
- Inline code comments in all source files
- TypeScript definitions for IDE autocomplete

## 🔗 Links

- [GitHub Repository](https://github.com/Xalantico/lexia-npm)
- [npm Package](https://www.npmjs.com/package/@lexia/sdk)
- [Issue Tracker](https://github.com/Xalantico/lexia-npm/issues)

