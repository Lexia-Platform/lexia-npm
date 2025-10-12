/**
 * Example Usage
 * =============
 * 
 * This file demonstrates how to use the @lexia/sdk package.
 */

const {
  LexiaHandler,
  Variables,
  MemoryHelper,
  createSuccessResponse
} = require('./src/index');

// Example 1: Basic Usage
console.log('=== Example 1: Basic LexiaHandler ===\n');

const lexia = new LexiaHandler(true); // Dev mode
console.log('✓ LexiaHandler created in dev mode');

// Example 2: Working with Variables
console.log('\n=== Example 2: Variables Helper ===\n');

const sampleVariables = [
  { name: 'OPENAI_API_KEY', value: 'sk-test-key' },
  { name: 'ANTHROPIC_API_KEY', value: 'sk-ant-test-key' },
  { name: 'DATABASE_URL', value: 'postgresql://localhost:5432/mydb' }
];

const vars = new Variables(sampleVariables);
console.log('Available variables:', vars.listNames());
console.log('OpenAI Key:', vars.get('OPENAI_API_KEY'));
console.log('Has Anthropic Key:', vars.has('ANTHROPIC_API_KEY'));

// Example 3: Working with Memory
console.log('\n=== Example 3: Memory Helper ===\n');

const sampleMemory = {
  name: 'John Doe',
  goals: ['Learn AI', 'Build chatbots', 'Master Node.js'],
  location: 'San Francisco, CA',
  interests: ['Technology', 'AI', 'Music'],
  preferences: ['Dark mode', 'Concise responses']
};

const memory = new MemoryHelper(sampleMemory);
console.log('User Name:', memory.getName());
console.log('User Goals:', memory.getGoals());
console.log('User Location:', memory.getLocation());
console.log('Has interests:', memory.hasInterests());
console.log('Memory is empty:', memory.isEmpty());

// Example 4: Creating Responses
console.log('\n=== Example 4: Creating Responses ===\n');

const response = createSuccessResponse(
  'uuid-12345',
  'thread-67890',
  'Processing your request'
);
console.log('Success response created:', response);

// Example 5: Simulating Message Processing
console.log('\n=== Example 5: Message Processing Flow ===\n');

async function simulateMessageProcessing() {
  const testData = {
    thread_id: 'thread-test-123',
    model: 'gpt-4',
    message: 'Hello, how are you?',
    conversation_id: 1,
    response_uuid: 'uuid-test-456',
    message_uuid: 'msg-test-789',
    channel: 'test-channel',
    variables: sampleVariables,
    url: 'http://localhost:3000/api/response',
    memory: sampleMemory
  };

  // Use helpers to access data
  const vars = new Variables(testData.variables);
  const memory = new MemoryHelper(testData.memory);

  console.log('Processing message:', testData.message);
  console.log('From user:', memory.getName());
  console.log('Using API key:', vars.get('OPENAI_API_KEY') ? '✓ Found' : '✗ Missing');

  // Simulate AI response
  const aiResponse = `Hello ${memory.getName()}! I can help you with ${memory.getGoals().join(', ')}.`;
  console.log('AI Response:', aiResponse);

  // In a real scenario, you would call:
  // await lexia.streamChunk(testData, aiResponse);
  // await lexia.completeResponse(testData, aiResponse);
  
  console.log('✓ Message processing complete');
}

simulateMessageProcessing().then(() => {
  console.log('\n=== All Examples Complete ===\n');
}).catch(err => {
  console.error('Error in examples:', err);
});

// Example 6: Express Integration (if Express is available)
console.log('\n=== Example 6: Express Integration (Optional) ===\n');

try {
  const { createLexiaApp, addStandardEndpoints } = require('./src/index');
  
  if (createLexiaApp && addStandardEndpoints) {
    console.log('✓ Express integration available');
    console.log('  Use createLexiaApp() to create an Express app');
    console.log('  Use addStandardEndpoints() to add Lexia endpoints');
  } else {
    console.log('⚠️  Express integration not available (install express)');
  }
} catch (err) {
  console.log('⚠️  Express integration not available (install express)');
}

