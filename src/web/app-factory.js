/**
 * Lexia App Factory
 * ================
 * 
 * Factory functions for creating Express applications with standard Lexia configuration.
 */

const express = require('express');

/**
 * Create an Express application with standard Lexia configuration.
 * @param {Object} options - Configuration options
 * @param {string} options.title - Application title
 * @param {string} options.version - Application version
 * @param {string} options.description - Application description
 * @param {boolean} options.debug - Enable debug mode
 * @returns {Object} Configured Express application
 */
function createLexiaApp(options = {}) {
  const {
    title = 'Lexia AI Agent',
    version = '1.0.0',
    description = 'AI agent with Lexia platform integration',
    debug = false
  } = options;

  // Create the app
  const app = express();

  // Add JSON parsing middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Add CORS middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Add request logging in debug mode
  if (debug) {
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  // Store app metadata
  app.locals.title = title;
  app.locals.version = version;
  app.locals.description = description;
  app.locals.debug = debug;

  return app;
}

module.exports = { createLexiaApp };

