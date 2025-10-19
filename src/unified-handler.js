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

    // Internal aggregation buffers keyed by response UUID
    this._buffers = new Map();
    
    // Semantic marker aliases (developer-friendly strings)
    this._markerAliases = new Map([
      ['show image load', '[lexia.loading.image.start]\n\n'],
      ['end image load', '[lexia.loading.image.end]\n\n'],
      ['hide image load', '[lexia.loading.image.end]\n\n'],
      ['show code load', '[lexia.loading.code.start]\n\n'],
      ['end code load', '[lexia.loading.code.end]\n\n'],
      ['show search load', '[lexia.loading.search.start]\n\n'],
      ['end search load', '[lexia.loading.search.end]\n\n'],
      ['show thinking load', '[lexia.loading.thinking.start]\n\n'],
      ['end thinking load', '[lexia.loading.thinking.end]\n\n'],
    ]);
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

  /** Developer-friendly streaming that also aggregates for finalization */
  async stream(data, content) {
    // Normalize semantic commands to markers
    if (typeof content === 'string') {
      const key = content.trim().toLowerCase();
      if (this._markerAliases.has(key)) {
        content = this._markerAliases.get(key);
      }
    }
    // Append to buffer
    const uuid = data.response_uuid;
    if (!this._buffers.has(uuid)) this._buffers.set(uuid, []);
    this._buffers.get(uuid).push(content);
    // Forward chunk
    await this.streamChunk(data, content);
  }

  _drainBuffer(uuid) {
    if (!uuid) return '';
    const parts = this._buffers.get(uuid) || [];
    this._buffers.delete(uuid);
    return parts.length ? parts.join('') : '';
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

  /** Finalize using aggregated buffer, return finalized text */
  async close(data, usageInfo = null, fileUrl = null) {
    const full = this._drainBuffer(data.response_uuid);
    await this.completeResponse(data, full, usageInfo, fileUrl);
    return full;
  }

  /**
   * Send error message via streaming client and persist to backend API.
   * Uses DevStreamClient in dev mode, Centrifugo in production.
   * @param {Object} data - Request data
   * @param {string} errorMessage - Error message to send
   * @param {string} trace - Optional stack trace string
   * @param {Error} exception - Optional exception object (will extract trace from it)
   */
  async sendError(data, errorMessage, trace = null, exception = null) {
    // Update config if dynamic values are provided (production only)
    if (!this.devMode && data.stream_url && data.stream_token) {
      this.updateCentrifugoConfig(data.stream_url, data.stream_token);
    }
    
    // Format error message for display
    const errorDisplayMessage = `❌ **Error:** ${errorMessage}`;
    
    // In DEV mode: Stream exactly like normal responses (chunk + complete)
    if (this.devMode) {
      // Clear any pending aggregation
      this._drainBuffer(data.response_uuid);
      // Stream the error message as chunks (same as normal content)
      await this.streamClient.sendDelta(data.channel, data.response_uuid, data.thread_id, errorDisplayMessage);
      // Complete the stream (same as normal completion)
      await this.streamClient.sendCompletion(data.channel, data.response_uuid, data.thread_id, errorDisplayMessage);
      console.log('🔧 Dev mode: Error streamed to frontend (delta + complete), skipping backend API calls');
      return;
    }
    
    // PRODUCTION mode: Different flow for Centrifugo
    // First stream the error as visible content
    await this.streamClient.sendDelta(data.channel, data.response_uuid, data.thread_id, errorDisplayMessage);
    // Then send error signal via Centrifugo
    await this.streamClient.sendError(data.channel, data.response_uuid, data.thread_id, errorMessage);
    // Clear any pending aggregation
    this._drainBuffer(data.response_uuid);
    
    // Skip if no URL provided (production mode only)
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
    
    // Also send error to logging endpoint (api/internal/v1/logs)
    try {
      // Extract base URL from data.url
      const url = new URL(data.url);
      const baseUrl = `${url.protocol}//${url.host}`;
      const logUrl = `${baseUrl}/api/internal/v1/logs`;
      
      // Get stack trace from various sources
      let traceInfo = '';
      if (trace) {
        // Use provided trace string
        traceInfo = trace;
      } else if (exception && exception.stack) {
        // Extract trace from exception object
        traceInfo = exception.stack;
      }
      
      // Prepare log payload according to Laravel API spec
      const logPayload = {
        message: errorMessage.substring(0, 1000), // Max 1000 chars as per validation
        trace: traceInfo ? traceInfo.substring(0, 5000) : '', // Max 5000 chars as per validation
        level: 'error', // error, warning, info, or critical
        where: 'lexia-sdk', // Where the error occurred
        additional: {
          uuid: data.response_uuid,
          conversation_id: data.conversation_id,
          thread_id: data.thread_id,
          channel: data.channel
        }
      };
      
      console.log('=== SENDING ERROR LOG TO LEXIA ===');
      console.log(`Log URL: ${logUrl}`);
      console.log('Log Payload:', logPayload);
      
      // Send to logging endpoint
      const logResponse = await this.api.post(logUrl, logPayload, requestHeaders);
      
      console.log('=== LEXIA LOG API RESPONSE ===');
      console.log(`Status Code: ${logResponse.status}`);
      console.log('Response Content:', logResponse.data);
      
      if (logResponse.status !== 200) {
        console.error(`LEXIA LOG API FAILED: ${logResponse.status} - ${logResponse.data}`);
      } else {
        console.log('✅ LEXIA LOG API SUCCESS: Error logged to backend');
      }
    } catch (error) {
      console.error(`Failed to send error log to Lexia:`, error.message);
    }
  }
}

// Session object to avoid passing data repeatedly
class LexiaSession {
  constructor(handler, data) {
    this._h = handler;
    this._d = data;
    // Preconfigure Centrifugo in prod
    if (!handler.devMode && data.stream_url && data.stream_token) {
      handler.updateCentrifugoConfig(data.stream_url, data.stream_token);
    }
  }
  async stream(content) { return this._h.stream(this._d, content); }
  async close(usageInfo = null, fileUrl = null) { return this._h.close(this._d, usageInfo, fileUrl); }
  async error(message, exception = null, trace = null) { return this._h.sendError(this._d, message, trace, exception); }
  // Loading helpers
  _loadingMarker(kind, action) {
    const k = (kind || 'thinking').toLowerCase();
    const a = action === 'start' ? 'start' : 'end';
    return `[lexia.loading.${['image','code','search','thinking'].includes(k)?k:'thinking'}.${a}]\n\n`;
  }
  async start_loading(kind = 'thinking') { return this.stream(this._loadingMarker(kind, 'start')); }
  async end_loading(kind = 'thinking') { return this.stream(this._loadingMarker(kind, 'end')); }
  async image(url) { if (url) return this.stream(`[lexia.image.start]${url}[lexia.image.end]`); }
  async pass_image(url) { return this.image(url); }
}

LexiaHandler.prototype.begin = function(data) { return new LexiaSession(this, data); };

module.exports = { LexiaHandler };










