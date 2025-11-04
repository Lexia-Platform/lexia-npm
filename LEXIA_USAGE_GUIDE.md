# Lexia SDK Functions Reference

## Installation

```bash
npm install @lexia/sdk
```

---

## Core Components

### 1. LexiaHandler

Main interface for all Lexia communication.

```javascript
const { LexiaHandler } = require('@lexia/sdk');

// Initialize
const lexia = new LexiaHandler(true);  // true for dev mode, false for production
```

#### Methods

**`begin(data) -> Session`**
- Start a streaming session (recommended API)
- Returns session object with streaming methods
```javascript
const session = lexia.begin(data);
await session.stream("Hello ");
await session.stream("World!");
const fullText = await session.close();
```

---

### 2. Session Object (from `begin()`)

Convenient wrapper for streaming within a single response.

```javascript
const session = lexia.begin(data);
```

#### Methods

**`stream(content: string): Promise<void>`**
- Stream a chunk
```javascript
await session.stream("Hello World");
```

**`close(usageInfo?: object, fileUrl?: string): Promise<string>`**
- Finalize and return full text
```javascript
const fullText = await session.close({ prompt_tokens: 10, completion_tokens: 50 });
```

**`error(errorMessage: string, exception?: Error, trace?: string): Promise<void>`**
- Send error
```javascript
await session.error("Something failed", error);
```

**`start_loading(kind: string = "thinking"): Promise<void>`**
- Show loading indicator
- Types: `"thinking"`, `"code"`, `"image"`, `"search"`
```javascript
await session.start_loading("code");
```

**`end_loading(kind: string = "thinking"): Promise<void>`**
- Hide loading indicator
```javascript
await session.end_loading("code");
```

**`image(url: string): Promise<void>`**
- Display image
```javascript
await session.image("https://example.com/image.png");
```

**`tracing(content: string, visibility: string = "all"): Promise<void>`**
- Send trace/debug info
- Visibility: `"all"` or `"admin"`
```javascript
await session.tracing("Debug: Processing step 1", "admin");
```

**`tracing_begin(message: string, visibility: string = "all"): void`**
- Start progressive trace block
```javascript
session.tracing_begin("Processing items:", "all");
```

**`tracing_append(message: string): void`**
- Append to progressive trace
```javascript
session.tracing_append("\n  - Item 1 done");
```

**`tracing_end(message?: string): Promise<void>`**
- Complete and send progressive trace
```javascript
await session.tracing_end("\n✅ Complete!");
```

---

### 3. Data Models

**ChatMessage** (Request from Lexia)
```javascript
const { ChatMessage } = require('@lexia/sdk');

// Received in your endpoint
const data = new ChatMessage(req.body);

// Key fields:
data.message           // User message
data.thread_id         // Thread identifier
data.response_uuid     // Unique response ID
data.conversation_id   // Conversation ID
data.channel           // Streaming channel
data.variables         // Environment variables
data.memory            // User memory data
data.force_tools       // Forced tools list
data.file_url          // File URL (if provided)
data.file_base64       // Base64 file (if provided)
data.file_name         // Original filename
data.system_message    // Custom system message
data.project_system_message  // Project system message
```

**ChatResponse** (Response to Lexia)
```javascript
const { createSuccessResponse } = require('@lexia/sdk');

const response = createSuccessResponse(
    data.response_uuid,
    data.thread_id,
    "Processing started"
);
```

---

### 4. Variables Helper

Easy access to environment variables.

```javascript
const { Variables } = require('@lexia/sdk');

const vars = new Variables(data.variables);

// Get any variable
const openaiKey = vars.get("OPENAI_API_KEY");
const customVar = vars.get("MY_CUSTOM_VAR");

// Check if exists
if (vars.has("OPENAI_API_KEY")) {
    const key = vars.get("OPENAI_API_KEY");
}

// List all variable names
const names = vars.listNames();  // ["OPENAI_API_KEY", "ANTHROPIC_API_KEY", ...]

// Convert to object
const varsDict = vars.toDict();  // {"OPENAI_API_KEY": "sk-...", ...}
```

---

### 5. Memory Helper

Access user memory data.

```javascript
const { MemoryHelper } = require('@lexia/sdk');

const memory = new MemoryHelper(data.memory);

// Get user information
const userName = memory.getName();
const userGoals = memory.getGoals();  // string[]
const userLocation = memory.getLocation();
const userInterests = memory.getInterests();  // string[]
const userPreferences = memory.getPreferences();  // string[]
const userExperiences = memory.getPastExperiences();  // string[]

// Check if data exists
if (memory.hasName()) {
    console.log(`User: ${memory.getName()}`);
}
if (memory.hasGoals()) {
    console.log(`Goals: ${memory.getGoals()}`);
}

// Convert to object
const memoryDict = memory.toDict();

// Check if empty
if (!memory.isEmpty()) {
    // Process memory
}
```

---

### 6. Force Tools Helper

Check which tools are forced by user.

```javascript
const { ForceToolsHelper } = require('@lexia/sdk');

const tools = new ForceToolsHelper(data.force_tools);

// Check if tool is forced
if (tools.has("search")) {
    // Perform search
}
if (tools.has("code")) {
    // Use code tool
}

// Get all forced tools
const allTools = tools.getAll();  // ["search", "code", ...]

// Check if empty
if (!tools.isEmpty()) {
    console.log(`${tools.count()} tools forced`);
}
```

---

### 7. File Utilities

Decode base64 files.

```javascript
const { decodeBase64File } = require('@lexia/sdk');
const fs = require('fs');

// Decode base64 file to temporary file
const { filePath, isTempFile } = decodeBase64File(data.file_base64, data.file_name);

// Use the file
const content = fs.readFileSync(filePath);

// Clean up if temporary
if (isTempFile) {
    fs.unlinkSync(filePath);
}
```

---

### 8. Express Integration

Add standard Lexia endpoints to your Express app.

```javascript
const { LexiaHandler, createLexiaApp, addStandardEndpoints } = require('@lexia/sdk');

// Create app
const app = createLexiaApp({
    title: "My AI Agent",
    version: "1.0.0",
    description: "AI agent with Lexia",
    debug: true
});

// Initialize handler
const lexia = new LexiaHandler(true);

// Define processing function
async function processMessage(data) {
    const session = lexia.begin(data);
    
    // Your AI logic here
    await session.stream("Hello from AI");
    
    await session.close();
}

// Add standard endpoints
addStandardEndpoints(app, {
    lexiaHandler: lexia,
    processMessageFunc: processMessage
});

// Run
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

Standard endpoints added:
- `POST /api/v1/send_message` - Main chat endpoint
- `GET /api/v1/health` - Health check
- `GET /api/v1/stream/{channel}` - SSE streaming (dev mode)
- `GET /api/v1/poll/{channel}` - Polling endpoint (dev mode)

---

## Complete Example

```javascript
const { LexiaHandler, Variables, MemoryHelper, ForceToolsHelper } = require('@lexia/sdk');
const OpenAI = require('openai');

// Initialize
const lexia = new LexiaHandler(true);

async function processMessage(data) {
    try {
        // Start session
        const session = lexia.begin(data);
        
        // Get variables
        const vars = new Variables(data.variables);
        const apiKey = vars.get("OPENAI_API_KEY");
        
        if (!apiKey) {
            await session.error("OpenAI API key not found");
            return;
        }
        
        // Get user memory
        const memory = new MemoryHelper(data.memory);
        const userName = memory.hasName() ? memory.getName() : "there";
        
        // Check forced tools
        const tools = new ForceToolsHelper(data.force_tools);
        const mustSearch = tools.has("search");
        
        // Show loading
        await session.start_loading("thinking");
        
        // Call OpenAI
        const client = new OpenAI({ apiKey });
        const stream = await client.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: `You are helpful. User name: ${userName}` },
                { role: "user", content: data.message }
            ],
            stream: true
        });
        
        await session.end_loading("thinking");
        
        // Stream response
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                await session.stream(content);
            }
        }
        
        // Complete
        await session.close({
            prompt_tokens: 10,
            completion_tokens: 50,
            total_tokens: 60
        });
        
    } catch (error) {
        await session.error(`Error: ${error.message}`, error);
    }
}
```

---

## Dev Mode vs Production Mode

**Dev Mode** (`devMode: true`):
- Streams directly to HTTP response (SSE)
- No Centrifugo needed
- File uploads handled locally
- Perfect for development and testing

**Production Mode** (`devMode: false`):
- Uses Centrifugo for real-time streaming
- Returns immediate HTTP response
- Processing happens in background
- Scalable for production use

---

## Usage Info Format

```javascript
const usageInfo = {
    prompt_tokens: 100,
    completion_tokens: 50,
    total_tokens: 150
};

await session.close(usageInfo);
```

If not provided, Lexia SDK will estimate token counts.

---

## Loading Markers

Send loading indicators to frontend:

```javascript
// Semantic commands (auto-converted to markers)
await session.stream("show thinking load");  // Start thinking
await session.stream("end thinking load");   // End thinking

// Or use helper methods
await session.start_loading("thinking");
await session.end_loading("thinking");

// Types: "thinking", "code", "image", "search"
```

---

## Image Display

Show images in the response:

```javascript
await session.image("https://example.com/image.png");

// Or manually
await session.stream("[lexia.image.start]https://example.com/image.png[lexia.image.end]");
```

---

## Error Handling

```javascript
try {
    // Your code
} catch (error) {
    // Automatic trace logging with session
    await session.error("Failed to process", error);
}
```

Errors are:
1. Displayed to user in frontend
2. Logged to Lexia backend with trace
3. Persisted in conversation

---

## Environment Variables

Set from request variables:

```javascript
const { setEnvVariables } = require('@lexia/sdk');

// Auto-set all variables as env vars
setEnvVariables(data.variables);

// Now accessible via process.env
const apiKey = process.env.OPENAI_API_KEY;
```

---

## Version

```javascript
const { VERSION } = require('@lexia/sdk');
console.log(VERSION);  // "1.2.9"
```

---

## Progressive Tracing Example

Build a trace incrementally:

```javascript
const session = lexia.begin(data);

// Start the trace
session.tracing_begin("🔄 Processing chunks:", "all");

const chunks = ["chunk1", "chunk2", "chunk3"];
for (let i = 0; i < chunks.length; i++) {
    session.tracing_append(`\n  • Chunk ${i+1}/${chunks.length}...`);
    
    // Process chunk
    await processChunk(chunks[i]);
    
    session.tracing_append(" ✓");
}

// Complete the trace
await session.tracing_end("\n✅ All chunks processed!");
```

This creates a single trace entry that builds up over time:
```
🔄 Processing chunks:
  • Chunk 1/3... ✓
  • Chunk 2/3... ✓
  • Chunk 3/3... ✓
✅ All chunks processed!
```

---

## File Upload Handling (Dev Mode)

In dev mode, base64 files are automatically handled:

```javascript
// SDK automatically:
// 1. Detects file_base64 in request
// 2. Decodes to temporary file
// 3. Saves to uploads/ directory
// 4. Creates file_url for local access
// 5. Serves via /uploads endpoint

// No code changes needed!

// If you want to manually handle:
const { decodeBase64File } = require('@lexia/sdk');

if (data.file_base64) {
    const { filePath, isTempFile } = decodeBase64File(
        data.file_base64,
        data.file_name
    );
    
    // Use the file
    console.log('File saved to:', filePath);
    
    // Clean up
    if (isTempFile) {
        fs.unlinkSync(filePath);
    }
}
```

---

## TypeScript Support

Full TypeScript definitions included:

```typescript
import { 
    LexiaHandler, 
    ChatMessage, 
    Variables, 
    MemoryHelper,
    ForceToolsHelper,
    LexiaSession
} from '@lexia/sdk';

const lexia = new LexiaHandler(true);

async function processMessage(data: ChatMessage): Promise<void> {
    const session: LexiaSession = lexia.begin(data);
    
    const vars = new Variables(data.variables);
    const apiKey: string | null = vars.get("OPENAI_API_KEY");
    
    const memory = new MemoryHelper(data.memory);
    const userName: string = memory.getName();
    
    const tools = new ForceToolsHelper(data.force_tools);
    const hasSearch: boolean = tools.has("search");
    
    await session.stream("Hello");
    await session.close();
}
```

---

## Advanced: Custom Loading States

```javascript
// Start multiple loaders
await session.start_loading("code");
await session.stream("Analyzing code...");
await session.end_loading("code");

await session.start_loading("search");
await session.stream("Searching...");
await session.end_loading("search");

await session.start_loading("image");
await session.stream("Generating image...");
await session.end_loading("image");
```

---

## Advanced: Visibility Control

Control who sees trace messages:

```javascript
// Visible to everyone
await session.tracing("User request processed", "all");

// Visible to admins only (debugging)
await session.tracing("Internal state: processing=true", "admin");
await session.tracing("DB query took 125ms", "admin");

// Progressive trace with admin visibility
session.tracing_begin("🔍 Debug Info:", "admin");
session.tracing_append("\n  - Cache miss");
session.tracing_append("\n  - DB lookup: 42ms");
await session.tracing_end("\n  - Total: 45ms");
```

---

## API Reference Summary

### Classes
- `LexiaHandler` - Main handler
- `LexiaSession` - Session object (from `begin()`)
- `ChatMessage` - Request model
- `ChatResponse` - Response model
- `Variables` - Variables helper
- `MemoryHelper` - Memory helper
- `ForceToolsHelper` - Force tools helper
- `DevStreamClient` - Dev mode streaming
- `CentrifugoClient` - Production streaming

### Functions
- `createSuccessResponse()` - Create success response
- `createCompleteResponse()` - Create complete response
- `decodeBase64File()` - Decode base64 file
- `getVariableValue()` - Get variable value
- `getOpenAIApiKey()` - Get OpenAI API key
- `setEnvVariables()` - Set environment variables
- `formatSystemPrompt()` - Format system prompt
- `formatMessagesForAI()` - Format messages for AI

### Web Framework
- `createLexiaApp()` - Create Express app
- `addStandardEndpoints()` - Add standard endpoints

---

## Quick Start Template

```javascript
const { LexiaHandler, createLexiaApp, addStandardEndpoints } = require('@lexia/sdk');
const OpenAI = require('openai');

const lexia = new LexiaHandler(true); // Dev mode

async function processMessage(data) {
    const session = lexia.begin(data);
    
    try {
        // Your AI logic
        const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const stream = await client.chat.completions.create({
            model: "gpt-4",
            messages: [{ role: "user", content: data.message }],
            stream: true
        });
        
        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) await session.stream(content);
        }
        
        await session.close();
    } catch (error) {
        await session.error(error.message, error);
    }
}

const app = createLexiaApp({ debug: true });
addStandardEndpoints(app, { lexiaHandler: lexia, processMessageFunc: processMessage });
app.listen(5001, () => console.log('Server ready on port 5001'));
```

---

## Need Help?

- Check examples in the repository
- Review the TypeScript definitions for full API details
- See `UPDATE_SUMMARY.md` for migration from older versions
- See `CHANGELOG_1.2.9.md` for recent changes

