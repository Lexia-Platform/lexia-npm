# Quick Start Guide - @lexia/sdk

Get started with the Lexia SDK in minutes!

## Installation

```bash
npm install @lexia/sdk
```

For Express integration:
```bash
npm install @lexia/sdk express
```

## Basic Example

```javascript
const { LexiaHandler } = require('@lexia/sdk');

// Initialize handler
const lexia = new LexiaHandler();

// Process a message
async function handleMessage(data) {
  try {
    // Your AI logic here
    const response = "Hello from AI!";
    
    // Send response to Lexia
    await lexia.completeResponse(data, response);
  } catch (error) {
    await lexia.sendError(data, error.message);
  }
}
```

## With Express

```javascript
const { createLexiaApp, addStandardEndpoints, LexiaHandler } = require('@lexia/sdk');

// Create app
const app = createLexiaApp({ title: 'My AI Agent' });
const lexia = new LexiaHandler();

// Define message handler
async function processMessage(data) {
  const response = `You said: ${data.message}`;
  await lexia.completeResponse(data, response);
}

// Add endpoints
addStandardEndpoints(app, {
  lexiaHandler: lexia,
  processMessageFunc: processMessage
});

// Start server
app.listen(8000, () => console.log('Server running on port 8000'));
```

## Using Variables & Memory

```javascript
const { Variables, MemoryHelper } = require('@lexia/sdk');

async function processMessage(data) {
  // Access environment variables
  const vars = new Variables(data.variables);
  const apiKey = vars.get('OPENAI_API_KEY');
  
  // Access user memory
  const memory = new MemoryHelper(data.memory);
  const userName = memory.getName();
  const userGoals = memory.getGoals();
  
  // Create personalized response
  let response = `Hello ${userName}!`;
  if (memory.hasGoals()) {
    response += ` I see you want to ${userGoals.join(', ')}`;
  }
  
  await lexia.completeResponse(data, response);
}
```

## Streaming Responses

```javascript
async function processMessage(data) {
  const words = 'Hello from streaming AI!'.split(' ');
  
  // Stream each word
  for (const word of words) {
    await lexia.streamChunk(data, word + ' ');
    await new Promise(r => setTimeout(r, 100));
  }
  
  // Complete the response
  await lexia.completeResponse(data, 'Hello from streaming AI!');
}
```

## Development Mode

Set the environment variable for local development:

```bash
export LEXIA_DEV_MODE=true
```

Or initialize directly:

```javascript
const lexia = new LexiaHandler(true); // Dev mode
```

## Next Steps

- Check out the full [README.md](README.md) for detailed documentation
- See [example.js](example.js) for more examples
- Run `node test-package.js` to test the installation

## Need Help?

- 📚 [Full Documentation](README.md)
- 🐛 [Report Issues](https://github.com/Xalantico/lexia-npm/issues)
- 💬 [Ask Questions](https://github.com/Xalantico/lexia-npm/discussions)




