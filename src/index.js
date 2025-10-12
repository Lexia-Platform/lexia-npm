/**
 * Lexia Integration Package
 * ========================
 * 
 * Clean, minimal package for Lexia platform integration.
 * Contains only essential components for communication.
 */

const VERSION = '1.0.0';

// Core exports
const { ChatResponse, ChatMessage, Variable, Memory } = require('./models');
const { createSuccessResponse } = require('./response-handler');
const { LexiaHandler } = require('./unified-handler');
const { 
  getVariableValue, 
  getOpenAIApiKey, 
  Variables, 
  MemoryHelper 
} = require('./utils');
const { DevStreamClient } = require('./dev-stream-client');

// Web framework utilities (optional)
let createLexiaApp, addStandardEndpoints;
try {
  const web = require('./web');
  createLexiaApp = web.createLexiaApp;
  addStandardEndpoints = web.addStandardEndpoints;
} catch (err) {
  // Web dependencies not available - continue without them
  createLexiaApp = undefined;
  addStandardEndpoints = undefined;
}

module.exports = {
  // Core
  ChatResponse,
  ChatMessage,
  Variable,
  Memory,
  createSuccessResponse,
  LexiaHandler,
  DevStreamClient,
  getVariableValue,
  getOpenAIApiKey,
  Variables,
  MemoryHelper,
  
  // Web (optional)
  createLexiaApp,
  addStandardEndpoints,
  
  // Version
  VERSION
};

