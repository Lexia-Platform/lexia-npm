/**
 * Utilities
 * ========
 * 
 * Common utility functions for Lexia integration.
 */

/**
 * Set environment variables from the variables list.
 * Lexia sends variables in format: [{"name": "OPENAI_API_KEY", "value": "..."}]
 * @param {Array} variables - List of Variable objects or plain objects
 */
function setEnvVariables(variables) {
  if (!variables) {
    console.warn('No variables provided to setEnvVariables');
    return;
  }
  
  for (const varObj of variables) {
    try {
      if (varObj.name && varObj.value) {
        process.env[varObj.name] = varObj.value;
        console.log(`Set environment variable: ${varObj.name}`);
      } else {
        console.warn(`Invalid variable format:`, varObj);
      }
    } catch (error) {
      console.error(`Error setting environment variable:`, error.message);
    }
  }
}

/**
 * Helper class for easy access to user memory data from Lexia requests.
 */
class MemoryHelper {
  /**
   * Initialize with memory data from request.
   * @param {Object|Array} memoryData - Memory object, dictionary, or list from request
   */
  constructor(memoryData) {
    if (!memoryData) {
      this.memory = {};
    } else if (Array.isArray(memoryData)) {
      // Empty list or old format - treat as empty memory
      this.memory = {};
    } else if (typeof memoryData === 'object') {
      this.memory = memoryData;
    } else {
      this.memory = {};
    }
  }

  getName() {
    return this.memory.name || '';
  }

  getGoals() {
    return this.memory.goals || [];
  }

  getLocation() {
    return this.memory.location || '';
  }

  getInterests() {
    return this.memory.interests || [];
  }

  getPreferences() {
    return this.memory.preferences || [];
  }

  getPastExperiences() {
    return this.memory.past_experiences || [];
  }

  hasName() {
    return Boolean(this.getName());
  }

  hasGoals() {
    return this.getGoals().length > 0;
  }

  hasLocation() {
    return Boolean(this.getLocation());
  }

  hasInterests() {
    return this.getInterests().length > 0;
  }

  hasPreferences() {
    return this.getPreferences().length > 0;
  }

  hasPastExperiences() {
    return this.getPastExperiences().length > 0;
  }

  toDict() {
    return {
      name: this.getName(),
      goals: this.getGoals(),
      location: this.getLocation(),
      interests: this.getInterests(),
      preferences: this.getPreferences(),
      past_experiences: this.getPastExperiences()
    };
  }

  isEmpty() {
    return !(
      this.hasName() ||
      this.hasGoals() ||
      this.hasLocation() ||
      this.hasInterests() ||
      this.hasPreferences() ||
      this.hasPastExperiences()
    );
  }
}

/**
 * Helper class for easy access to force_tools data from Lexia requests.
 */
class ForceToolsHelper {
  /**
   * Initialize with force_tools list from request.
   * @param {Array<string>} forceTools - List of tool names from request (e.g., ['code', 'search', 'xyz'])
   */
  constructor(forceTools = null) {
    this.tools = forceTools || [];
  }

  /**
   * Check if a specific tool is forced.
   * @param {string} toolName - Name of the tool to check (e.g., 'code', 'search')
   * @returns {boolean} True if tool is forced
   */
  has(toolName) {
    return this.tools.includes(toolName);
  }

  /**
   * Get all forced tools.
   * @returns {Array<string>} List of forced tool names
   */
  getAll() {
    return [...this.tools];
  }

  /**
   * Check if no tools are forced.
   * @returns {boolean} True if no tools are forced
   */
  isEmpty() {
    return this.tools.length === 0;
  }

  /**
   * Get count of forced tools.
   * @returns {number} Number of forced tools
   */
  count() {
    return this.tools.length;
  }
}

/**
 * Helper class for easy access to variables from Lexia requests.
 */
class Variables {
  /**
   * Initialize with a list of Variable objects or plain objects.
   * @param {Array} variablesList - List of Variable objects or plain objects from request
   */
  constructor(variablesList) {
    this.variablesList = variablesList || [];
    this._cache = {};
    
    // Build a cache for faster lookups
    for (const varObj of this.variablesList) {
      try {
        if (varObj.name && varObj.value) {
          this._cache[varObj.name] = varObj.value;
        }
      } catch (error) {
        console.error('Error processing variable:', error.message);
      }
    }
  }

  /**
   * Get a variable value by name.
   * @param {string} variableName - Name of the variable to get
   * @returns {string|null} Variable value or null if not found
   */
  get(variableName) {
    return this._cache[variableName] || null;
  }

  /**
   * Check if a variable exists.
   * @param {string} variableName - Name of the variable to check
   * @returns {boolean} True if variable exists
   */
  has(variableName) {
    return variableName in this._cache;
  }

  /**
   * Get list of all variable names.
   * @returns {Array} List of variable names
   */
  listNames() {
    return Object.keys(this._cache);
  }

  /**
   * Convert all variables to a plain object.
   * @returns {Object} Dictionary of variable names to values
   */
  toDict() {
    return { ...this._cache };
  }
}

/**
 * Extract a specific variable value from variables list by name.
 * @param {Array} variables - List of Variable objects or plain objects from request
 * @param {string} variableName - Name of the variable to extract
 * @returns {string|null} Variable value or null if not found
 */
function getVariableValue(variables, variableName) {
  if (!variables) {
    console.warn(`No variables provided to getVariableValue for '${variableName}'`);
    return null;
  }
  
  for (const varObj of variables) {
    try {
      if (varObj.name === variableName) {
        console.log(`Found variable '${variableName}'`);
        return varObj.value;
      }
    } catch (error) {
      console.error('Error processing variable:', error.message);
    }
  }
  
  console.warn(`Variable '${variableName}' not found in variables`);
  return null;
}

/**
 * Extract OpenAI API key from variables list.
 * @param {Array} variables - List of Variable objects or plain objects from request
 * @returns {string|null} OpenAI API key or null if not found
 */
function getOpenAIApiKey(variables) {
  return getVariableValue(variables, 'OPENAI_API_KEY');
}

/**
 * Format the system prompt for AI APIs.
 * @param {string} systemMessage - Custom system message
 * @param {string} projectSystemMessage - Project-specific system message
 * @returns {string} Formatted system prompt
 */
function formatSystemPrompt(systemMessage = null, projectSystemMessage = null) {
  const defaultSystemPrompt = `You are a helpful AI assistant. You provide clear, accurate, and helpful responses.
    
Guidelines:
- Be concise but informative
- Use markdown formatting when helpful
- If you don't know something, say so
- Be friendly and professional
- Provide examples when helpful`;

  // Use project system message if available, then custom system message, then default
  return projectSystemMessage || systemMessage || defaultSystemPrompt;
}

/**
 * Format messages for AI API call.
 * @param {string} systemPrompt - System prompt to use
 * @param {Array} conversationHistory - Previous conversation messages
 * @param {string} currentMessage - Current user message
 * @returns {Array} List of messages formatted for AI API
 */
function formatMessagesForAI(systemPrompt, conversationHistory, currentMessage) {
  const messages = [
    { role: 'system', content: systemPrompt }
  ];
  
  // Add conversation history (excluding the current user message)
  for (let i = 0; i < conversationHistory.length - 1; i++) {
    messages.push(conversationHistory[i]);
  }
  
  // Add current user message
  messages.push({ role: 'user', content: currentMessage });
  
  return messages;
}

/**
 * Decode a base64 encoded file and save to temporary file.
 * @param {string} fileBase64 - Base64 encoded file data (data URI format: "data:mime;base64,...")
 * @param {string} filename - Optional filename to use for extension detection
 * @returns {Object} Object with filePath and isTempFile properties
 * 
 * @example
 * const { filePath, isTempFile } = decodeBase64File(data.file_base64, data.file_name);
 * // Use the file
 * if (isTempFile) {
 *   fs.unlinkSync(filePath); // Clean up
 * }
 */
function decodeBase64File(fileBase64, filename = null) {
  if (!fileBase64) {
    throw new Error('file_base64 is empty');
  }

  try {
    let base64Data, mimeType;

    // Parse data URI: "data:audio/wav;base64,UklGRiQAAABXQVZF..."
    if (fileBase64.startsWith('data:')) {
      // Split header and data
      const parts = fileBase64.split(',', 2);
      const header = parts[0];
      base64Data = parts[1];
      // Extract MIME type
      mimeType = header.split(':')[1].split(';')[0];
      console.log(`Detected MIME type: ${mimeType}`);
    } else {
      // Assume it's just base64 without data URI prefix
      base64Data = fileBase64;
      mimeType = null;
    }

    // Decode base64
    const fileBuffer = Buffer.from(base64Data, 'base64');
    console.log(`Decoded ${fileBuffer.length} bytes from base64`);

    // Determine file extension
    let ext;
    if (filename) {
      // Use extension from provided filename
      const path = require('path');
      ext = path.extname(filename);
    } else if (mimeType) {
      // Derive extension from MIME type
      const mimeToExt = {
        'audio/wav': '.wav',
        'audio/mpeg': '.mp3',
        'audio/mp3': '.mp3',
        'audio/ogg': '.ogg',
        'audio/flac': '.flac',
        'video/mp4': '.mp4',
        'video/avi': '.avi',
        'video/quicktime': '.mov',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'application/pdf': '.pdf',
        'text/plain': '.txt'
      };
      ext = mimeToExt[mimeType] || '.bin';
    } else {
      ext = '.bin';
    }

    // Create temporary file
    const os = require('os');
    const path = require('path');
    const fs = require('fs');
    const crypto = require('crypto');
    
    const tempDir = os.tmpdir();
    const randomName = crypto.randomBytes(16).toString('hex');
    const tempFilePath = path.join(tempDir, `${randomName}${ext}`);
    
    fs.writeFileSync(tempFilePath, fileBuffer);
    
    console.log(`Saved decoded file to: ${tempFilePath}`);
    return { filePath: tempFilePath, isTempFile: true };

  } catch (error) {
    console.error(`Error decoding base64 file: ${error.message}`);
    throw new Error(`Failed to decode base64 file: ${error.message}`);
  }
}

module.exports = {
  setEnvVariables,
  MemoryHelper,
  ForceToolsHelper,
  Variables,
  getVariableValue,
  getOpenAIApiKey,
  formatSystemPrompt,
  formatMessagesForAI,
  decodeBase64File
};






