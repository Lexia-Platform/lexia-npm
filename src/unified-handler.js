/**
 * Unified Lexia Handler
 * =====================
 * 
 * Single, clean interface for all Lexia platform communication.
 * Supports both production (Centrifugo) and dev mode (in-memory streaming).
 */

const { CentrifugoClient } = require('./centrifugo-client');
const { DevStreamClient } = require('./dev-stream-client');
const { APIClient } = require('./api-client');
const { createCompleteResponse } = require('./response-handler');

class LexiaHandler {
  /**
   * Initialize LexiaHandler with optional dev mode.
   * @param {boolean} devMode - If true, uses DevStreamClient instead of Centrifugo.
   *                           If null/undefined, checks LEXIA_DEV_MODE environment variable.
   */
  constructor(devMode = null) {
    // Determine dev mode from parameter or environment
    if (devMode === null || devMode === undefined) {
      const envValue = (process.env.LEXIA_DEV_MODE || 'false').toLowerCase();
      devMode = ['true', '1', 'yes'].includes(envValue);
    }
    
    this.devMode = devMode;
    
    // Initialize appropriate streaming client
    if (this.devMode) {
      this.streamClient = new DevStreamClient();
      console.log('🔧 LexiaHandler initialized in DEV MODE (no Centrifugo)');
    } else {
      this.streamClient = new CentrifugoClient();
      console.log('🚀 LexiaHandler initialized in PRODUCTION MODE (Centrifugo)');
    }
    
    this.api = new APIClient();
  }

  /**
   * Update Centrifugo configuration with dynamic values from request.
   * Only applicable in production mode.
   * @param {string} streamUrl - Centrifugo server URL from request
   * @param {string} streamToken - Centrifugo API key from request
   */
  updateCentrifugoConfig(streamUrl, streamToken) {
    if (this.devMode) {
      console.log('Dev mode active - skipping Centrifugo config update');
      return;
    }
    
    if (streamUrl && streamToken) {
      this.streamClient.updateConfig(streamUrl, streamToken);
      console.log(`Updated Centrifugo config - URL: ${streamUrl}`);
    } else {
      console.warn('Stream URL or token not provided, using default configuration');
    }
  }

  /**
   * Stream a chunk of AI response.
   * Uses DevStreamClient in dev mode, Centrifugo in production.
   * @param {Object} data - Request data
   * @param {string} content - Content chunk to stream
   */
  async streamChunk(data, content) {
    console.log(`🟢 [HANDLER] streamChunk() called with '${content}' (${content.length} chars)`);
    
    // Update config if dynamic values are provided (production only)
    if (!this.devMode && data.stream_url && data.stream_token) {
      this.updateCentrifugoConfig(data.stream_url, data.stream_token);
    }
    
    await this.streamClient.sendDelta(data.channel, data.response_uuid, data.thread_id, content);
    console.log(`🟢 [HANDLER] Chunk sent to streamClient.sendDelta()`);
  }

  /**
   * Complete AI response and send to Lexia.
   * Uses DevStreamClient in dev mode, Centrifugo in production.
   * @param {Object} data - Request data
   * @param {string} fullResponse - Complete AI response
   * @param {Object} usageInfo - Usage information (optional)
   * @param {string} fileUrl - File URL for generated files (optional)
   */
  async completeResponse(data, fullResponse, usageInfo = null, fileUrl = null) {
    // Update config if dynamic values are provided (production only)
    if (!this.devMode && data.stream_url && data.stream_token) {
      this.updateCentrifugoConfig(data.stream_url, data.stream_token);
    }
    
    // Send completion via appropriate streaming client
    await this.streamClient.sendCompletion(data.channel, data.response_uuid, data.thread_id, fullResponse);
    
    // Create complete response with all required fields
    const backendData = createCompleteResponse(data.response_uuid, data.thread_id, fullResponse, usageInfo, fileUrl);
    backendData.conversation_id = data.conversation_id;
    
    // Ensure required fields have proper values even if usage_info is missing
    if (!usageInfo || usageInfo.prompt_tokens === 0) {
      // Provide default values when usage info is missing
      backendData.usage = {
        input_tokens: 1,
        output_tokens: fullResponse ? fullResponse.split(' ').length : 1,
        total_tokens: 1 + (fullResponse ? fullResponse.split(' ').length : 1),
        input_token_details: {
          tokens: [{ token: 'default', logprob: 0.0 }]
        },
        output_token_details: {
          tokens: [{ token: 'default', logprob: 0.0 }]
        }
      };
    }
    
    // In dev mode, skip backend API call if URL is not provided
    if (this.devMode && !data.url) {
      console.log('🔧 Dev mode: Skipping backend API call (no URL provided)');
      return;
    }
    
    // Extract headers from request data
    const requestHeaders = {};
    if (data.headers) {
      Object.assign(requestHeaders, data.headers);
      console.log('Extracted headers from request:', requestHeaders);
    }
    
    // Skip if no URL provided (optional in dev mode)
    if (!data.url) {
      console.warn('⚠️  No URL provided, skipping backend API call');
      return;
    }
    
    console.log('=== SENDING TO LEXIA API ===');
    console.log(`URL: ${data.url}`);
    console.log('Headers:', requestHeaders);
    console.log('Data:', backendData);
    
    // Send to Lexia backend with headers
    try {
      const response = await this.api.post(data.url, backendData, requestHeaders);
      
      console.log('=== LEXIA API RESPONSE ===');
      console.log(`Status Code: ${response.status}`);
      console.log('Response Headers:', response.headers);
      console.log('Response Content:', response.data);
      
      if (response.status !== 200) {
        console.error(`LEXIA API ERROR: ${response.status} - ${response.data}`);
      } else {
        console.log('✅ LEXIA API SUCCESS: Response accepted');
      }
    } catch (error) {
      console.error(`Failed to send to Lexia API:`, error.message);
    }
  }

  /**
   * Send error message via streaming client and persist to backend API.
   * Uses DevStreamClient in dev mode, Centrifugo in production.
   * @param {Object} data - Request data
   * @param {string} errorMessage - Error message to send
   */
  async sendError(data, errorMessage) {
    // Update config if dynamic values are provided (production only)
    if (!this.devMode && data.stream_url && data.stream_token) {
      this.updateCentrifugoConfig(data.stream_url, data.stream_token);
    }
    
    // Send error notification via appropriate streaming client
    await this.streamClient.sendError(data.channel, data.response_uuid, data.thread_id, errorMessage);
    
    // In dev mode, skip backend API call if URL is not provided
    if (this.devMode && !data.url) {
      console.log('🔧 Dev mode: Skipping error API call (no URL provided)');
      return;
    }
    
    // Skip if no URL provided
    if (!data.url) {
      console.warn('⚠️  No URL provided, skipping error API call');
      return;
    }
    
    // Also persist error to backend API
    const errorResponse = {
      uuid: data.response_uuid,
      conversation_id: data.conversation_id,
      content: errorMessage,
      role: 'developer',
      status: 'FAILED',
      usage: {
        input_tokens: 0,
        output_tokens: 0,
        total_tokens: 0,
        input_token_details: {
          tokens: []
        },
        output_token_details: {
          tokens: []
        }
      }
    };
    
    // Extract headers from request data
    const requestHeaders = {};
    if (data.headers) {
      Object.assign(requestHeaders, data.headers);
      console.log('Extracted headers from request for error:', requestHeaders);
    }
    
    console.log('=== SENDING ERROR TO LEXIA API ===');
    console.log(`URL: ${data.url}`);
    console.log('Headers:', requestHeaders);
    console.log('Error Data:', errorResponse);
    
    // Send error to Lexia backend with headers
    try {
      const response = await this.api.post(data.url, errorResponse, requestHeaders);
      
      console.log('=== LEXIA ERROR API RESPONSE ===');
      console.log(`Status Code: ${response.status}`);
      console.log('Response Headers:', response.headers);
      console.log('Response Content:', response.data);
      
      if (response.status !== 200) {
        console.error(`LEXIA ERROR API FAILED: ${response.status} - ${response.data}`);
      } else {
        console.log('✅ LEXIA ERROR API SUCCESS: Error persisted to backend');
      }
    } catch (error) {
      console.error(`Failed to persist error to backend API:`, error.message);
    }
  }
}

module.exports = { LexiaHandler };

