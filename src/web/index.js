/**
 * Lexia Web Package
 * ================
 * 
 * Web framework utilities for creating Express applications with Lexia integration.
 * Provides standard endpoints, middleware, and app factory functions.
 */

const { createLexiaApp } = require('./app-factory');
const { addStandardEndpoints } = require('./endpoints');

module.exports = {
  createLexiaApp,
  addStandardEndpoints
};




