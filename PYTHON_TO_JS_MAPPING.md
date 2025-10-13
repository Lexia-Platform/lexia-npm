# Python to JavaScript Mapping

This document shows the equivalence between the Python (`lexia-pip`) and JavaScript (`@lexia/sdk`) implementations.

## Package Structure

| Python (lexia-pip) | JavaScript (@lexia/sdk) |
|-------------------|------------------------|
| `lexia/__init__.py` | `src/index.js` |
| `lexia/models.py` | `src/models.js` |
| `lexia/api_client.py` | `src/api-client.js` |
| `lexia/centrifugo_client.py` | `src/centrifugo-client.js` |
| `lexia/dev_stream_client.py` | `src/dev-stream-client.js` |
| `lexia/response_handler.py` | `src/response-handler.js` |
| `lexia/unified_handler.py` | `src/unified-handler.js` |
| `lexia/utils.py` | `src/utils.js` |
| `lexia/web/` | `src/web/` |
| `setup.py` | `package.json` |
| `requirements.txt` | `dependencies` in package.json |

## Core Classes

### Models

**Python:**
```python
from lexia import ChatMessage, ChatResponse, Variable, Memory

message = ChatMessage(data)
response = ChatResponse("success", "Processing", uuid, thread_id)
variable = Variable("KEY", "value")
memory = Memory(name="John", goals=["AI"])
```

**JavaScript:**
```javascript
const { ChatMessage, ChatResponse, Variable, Memory } = require('@lexia/sdk');

const message = new ChatMessage(data);
const response = new ChatResponse("success", "Processing", uuid, threadId);
const variable = new Variable("KEY", "value");
const memory = new Memory({ name: "John", goals: ["AI"] });
```

### LexiaHandler

**Python:**
```python
from lexia import LexiaHandler

lexia = LexiaHandler(dev_mode=True)
lexia.stream_chunk(data, content)
lexia.complete_response(data, response)
lexia.send_error(data, error_message)
```

**JavaScript:**
```javascript
const { LexiaHandler } = require('@lexia/sdk');

const lexia = new LexiaHandler(true);
await lexia.streamChunk(data, content);
await lexia.completeResponse(data, response);
await lexia.sendError(data, errorMessage);
```

### Variables Helper

**Python:**
```python
from lexia import Variables

vars = Variables(data.variables)
api_key = vars.get("OPENAI_API_KEY")
has_key = vars.has("OPENAI_API_KEY")
all_names = vars.list_names()
vars_dict = vars.to_dict()
```

**JavaScript:**
```javascript
const { Variables } = require('@lexia/sdk');

const vars = new Variables(data.variables);
const apiKey = vars.get("OPENAI_API_KEY");
const hasKey = vars.has("OPENAI_API_KEY");
const allNames = vars.listNames();
const varsDict = vars.toDict();
```

### Memory Helper

**Python:**
```python
from lexia import MemoryHelper

memory = MemoryHelper(data.memory)
name = memory.get_name()
goals = memory.get_goals()
location = memory.get_location()
has_name = memory.has_name()
is_empty = memory.is_empty()
memory_dict = memory.to_dict()
```

**JavaScript:**
```javascript
const { MemoryHelper } = require('@lexia/sdk');

const memory = new MemoryHelper(data.memory);
const name = memory.getName();
const goals = memory.getGoals();
const location = memory.getLocation();
const hasName = memory.hasName();
const isEmpty = memory.isEmpty();
const memoryDict = memory.toDict();
```

## Web Framework Integration

### Python (FastAPI)

```python
from fastapi import FastAPI
from lexia import create_lexia_app, add_standard_endpoints, LexiaHandler

app = create_lexia_app(title="My AI Agent")
lexia = LexiaHandler()

async def process_message(data):
    response = "Hello!"
    lexia.complete_response(data, response)

add_standard_endpoints(
    app,
    lexia_handler=lexia,
    process_message_func=process_message
)

# Run with: uvicorn main:app
```

### JavaScript (Express)

```javascript
const express = require('express');
const { createLexiaApp, addStandardEndpoints, LexiaHandler } = require('@lexia/sdk');

const app = createLexiaApp({ title: "My AI Agent" });
const lexia = new LexiaHandler();

async function processMessage(data) {
  const response = "Hello!";
  await lexia.completeResponse(data, response);
}

addStandardEndpoints(app, {
  lexiaHandler: lexia,
  processMessageFunc: processMessage
});

// Run with: node server.js
app.listen(8000, () => console.log('Server running'));
```

## Naming Conventions

### Python Style (snake_case)
- `stream_chunk`
- `complete_response`
- `send_error`
- `get_name`
- `has_goals`
- `to_dict`

### JavaScript Style (camelCase)
- `streamChunk`
- `completeResponse`
- `sendError`
- `getName`
- `hasGoals`
- `toDict`

## Async/Await

**Python:**
- Uses `async def` for async functions
- Uses `await` for async calls
- FastAPI handles async automatically

**JavaScript:**
- Uses `async function` for async functions
- Uses `await` for async calls (Promises)
- Express requires manual async handling

## Dependencies

### Python
- `requests` → JavaScript: `axios`
- `pydantic` → JavaScript: Plain classes
- `fastapi` → JavaScript: `express` (optional peer dependency)
- `uvicorn` → JavaScript: Built into Node.js HTTP

### JavaScript
- Core: `axios` only
- Optional: `express` for web features
- Dev: TypeScript, ESLint, Prettier, Jest

## Installation

**Python:**
```bash
pip install lexia
pip install lexia[web]  # With FastAPI
```

**JavaScript:**
```bash
npm install @lexia/sdk
npm install @lexia/sdk express  # With Express
```

## Environment Variables

**Both:**
```bash
export LEXIA_DEV_MODE=true
export CENTRIFUGO_URL=http://centrifugo:8000
export CENTRIFUGO_API_KEY=my_api_key
```

## Testing

**Python:**
```bash
python test_package.py
pytest  # With pytest
```

**JavaScript:**
```bash
node test-package.js
npm test  # With Jest
```

## Publishing

**Python:**
```bash
python -m build
twine upload dist/*
```

**JavaScript:**
```bash
npm pack  # Test
npm publish --access public
```

## Key Differences

1. **Async/Await**: JavaScript requires explicit `await` for all async operations
2. **Naming**: Python uses snake_case, JavaScript uses camelCase
3. **Classes**: Python uses Pydantic models, JavaScript uses plain classes
4. **Type Safety**: Python has type hints, JavaScript has TypeScript definitions
5. **Package Manager**: Python uses pip, JavaScript uses npm
6. **Web Framework**: Python uses FastAPI, JavaScript uses Express

## Feature Parity

✅ Both implementations support:
- LexiaHandler with dev/production modes
- Real-time streaming via Centrifugo
- Dev mode in-memory streaming
- Variables and Memory helpers
- Response formatting
- Error handling
- Web framework integration
- Header forwarding
- Dynamic configuration

## Version Compatibility

- Python: `lexia` v1.2.5
- JavaScript: `@lexia/sdk` v1.2.5
- Both versions have identical API and features




