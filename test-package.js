/**
 * Test Package
 * ============
 * 
 * Simple test suite to verify package functionality.
 */

const {
  LexiaHandler,
  ChatMessage,
  ChatResponse,
  Variable,
  Memory,
  Variables,
  MemoryHelper,
  createSuccessResponse,
  VERSION
} = require('./src/index');

// Test utilities
let testsRun = 0;
let testsPassed = 0;

function test(name, fn) {
  testsRun++;
  try {
    fn();
    console.log(`✅ ${name} PASSED`);
    testsPassed++;
  } catch (error) {
    console.error(`❌ ${name} FAILED:`, error.message);
  }
}

console.log('🚀 Starting Lexia SDK Package Tests');
console.log('==================================================\n');

// Test 1: Basic Imports
test('Basic Imports', () => {
  if (!LexiaHandler) throw new Error('LexiaHandler not exported');
  if (!ChatMessage) throw new Error('ChatMessage not exported');
  if (!ChatResponse) throw new Error('ChatResponse not exported');
  if (!Variable) throw new Error('Variable not exported');
  if (!Memory) throw new Error('Memory not exported');
  console.log('  ✓ All core exports available');
});

// Test 2: Version
test('Version', () => {
  if (!VERSION) throw new Error('VERSION not exported');
  console.log(`  📦 Package version: ${VERSION}`);
});

// Test 3: Data Models
test('Data Models', () => {
  const variable = new Variable('TEST_VAR', 'test_value');
  if (variable.name !== 'TEST_VAR') throw new Error('Variable name incorrect');
  if (variable.value !== 'test_value') throw new Error('Variable value incorrect');
  console.log(`  ✓ Variable model: ${variable.name} = ${variable.value}`);
  
  const memory = new Memory({ name: 'John', goals: ['Learn AI'] });
  if (memory.name !== 'John') throw new Error('Memory name incorrect');
  console.log(`  ✓ Memory model: ${memory.name}`);
});

// Test 4: Variables Helper
test('Variables Helper', () => {
  const vars = new Variables([
    { name: 'OPENAI_API_KEY', value: 'sk-test' },
    { name: 'CUSTOM_VAR', value: 'custom' }
  ]);
  
  if (vars.get('OPENAI_API_KEY') !== 'sk-test') {
    throw new Error('Variables.get() failed');
  }
  if (!vars.has('OPENAI_API_KEY')) {
    throw new Error('Variables.has() failed');
  }
  if (vars.listNames().length !== 2) {
    throw new Error('Variables.listNames() failed');
  }
  
  console.log('  ✓ Variables helper works correctly');
});

// Test 5: Memory Helper
test('Memory Helper', () => {
  const memory = new MemoryHelper({
    name: 'Alice',
    goals: ['Build AI', 'Learn ML'],
    location: 'San Francisco'
  });
  
  if (memory.getName() !== 'Alice') {
    throw new Error('MemoryHelper.getName() failed');
  }
  if (!memory.hasName()) {
    throw new Error('MemoryHelper.hasName() failed');
  }
  if (memory.getGoals().length !== 2) {
    throw new Error('MemoryHelper.getGoals() failed');
  }
  if (memory.isEmpty()) {
    throw new Error('MemoryHelper.isEmpty() should be false');
  }
  
  console.log('  ✓ Memory helper works correctly');
  console.log(`  ✓ User: ${memory.getName()}, Goals: ${memory.getGoals().join(', ')}`);
});

// Test 6: Response Handler
test('Response Handler', () => {
  const response = createSuccessResponse('uuid123', 'thread456', 'Test message');
  if (response.status !== 'success') throw new Error('Response status incorrect');
  if (response.response_uuid !== 'uuid123') throw new Error('Response UUID incorrect');
  if (response.thread_id !== 'thread456') throw new Error('Thread ID incorrect');
  console.log(`  ✓ Response created: ${response.status} - ${response.message}`);
});

// Test 7: LexiaHandler
test('LexiaHandler', () => {
  const handler = new LexiaHandler(true); // Dev mode
  if (!handler) throw new Error('LexiaHandler creation failed');
  if (!handler.devMode) throw new Error('Dev mode not set correctly');
  if (typeof handler.streamChunk !== 'function') throw new Error('streamChunk method missing');
  if (typeof handler.completeResponse !== 'function') throw new Error('completeResponse method missing');
  if (typeof handler.sendError !== 'function') throw new Error('sendError method missing');
  console.log('  ✓ LexiaHandler created successfully in dev mode');
  console.log('  ✓ All required methods exist');
});

// Test 8: Web Imports (optional)
test('Web Imports', () => {
  try {
    const { createLexiaApp, addStandardEndpoints } = require('./src/index');
    if (createLexiaApp && addStandardEndpoints) {
      console.log('  ✓ Web utilities available');
    } else {
      console.log('  ⚠️  Web utilities not available (Express not installed)');
    }
  } catch (err) {
    console.log('  ⚠️  Web utilities not available (Express not installed)');
  }
});

// Summary
console.log('\n==================================================');
console.log(`📊 Test Results: ${testsPassed}/${testsRun} tests passed`);

if (testsPassed === testsRun) {
  console.log('🎉 All tests passed! Package is working correctly.');
  process.exit(0);
} else {
  console.log(`❌ ${testsRun - testsPassed} test(s) failed.`);
  process.exit(1);
}










