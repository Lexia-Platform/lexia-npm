/**
 * Lexia Standard Endpoints
 * ========================
 * 
 * Standard endpoint patterns for Lexia applications.
 * These can be added to any Express app using addStandardEndpoints().
 */

const express = require('express');
const { DevStreamClient } = require('../dev-stream-client');
const { createSuccessResponse } = require('../response-handler');

/**
 * Add standard Lexia endpoints to an Express application.
 * @param {Object} app - Express application instance
 * @param {Object} options - Configuration options
 * @param {Object} options.conversationManager - Optional conversation manager for history endpoints
 * @param {Object} options.lexiaHandler - Optional LexiaHandler instance for communication
 * @param {Function} options.processMessageFunc - Optional function to process messages (custom AI logic)
 */
function addStandardEndpoints(app, options = {}) {
  const {
    conversationManager = null,
    lexiaHandler = null,
    processMessageFunc = null
  } = options;

  // Create router for standard endpoints
  const router = express.Router();

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'Lexia AI Agent',
      version: app.locals.version || '1.0.0'
    });
  });

  // Test streaming endpoint
  router.get('/test_stream', async (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('X-Accel-Buffering', 'no');
    res.setHeader('Connection', 'keep-alive');

    for (let i = 0; i < 10; i++) {
      res.write(`Chunk ${i + 1} `);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    res.end();
  });

  // Root endpoint
  router.get('/', (req, res) => {
    res.json({
      message: 'Lexia AI Agent - Ready',
      endpoints: [
        '/api/v1/health',
        '/api/v1/send_message',
        '/api/v1/stream/:channel',
        '/api/v1/poll/:channel'
      ]
    });
  });

  // SSE streaming endpoint
  router.get('/stream/:channel', (req, res) => {
    const { channel } = req.params;

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ event: 'connected', channel })}\n\n`);

    let lastChunkCount = 0;
    const intervalId = setInterval(() => {
      const streamData = DevStreamClient.getStream(channel);

      // Send new chunks
      const currentChunkCount = streamData.chunks.length;
      if (currentChunkCount > lastChunkCount) {
        const newChunks = streamData.chunks.slice(lastChunkCount);
        newChunks.forEach(chunk => {
          res.write(`data: ${JSON.stringify({ event: 'delta', content: chunk })}\n\n`);
        });
        lastChunkCount = currentChunkCount;
      }

      // Check if finished
      if (streamData.finished) {
        if (streamData.error) {
          res.write(`data: ${JSON.stringify({ event: 'error', content: streamData.error })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ event: 'complete', content: streamData.fullResponse })}\n\n`);
        }
        clearInterval(intervalId);
        res.end();
      }
    }, 100);

    // Clean up on client disconnect
    req.on('close', () => {
      clearInterval(intervalId);
    });
  });

  // Polling endpoint
  router.get('/poll/:channel', (req, res) => {
    const { channel } = req.params;
    const streamData = DevStreamClient.getStream(channel);

    res.json({
      channel,
      chunks_count: streamData.chunks.length,
      full_response: streamData.fullResponse,
      finished: streamData.finished,
      error: streamData.error
    });
  });

  // Main send_message endpoint
  if (lexiaHandler && processMessageFunc) {
    router.post('/send_message', async (req, res) => {
      try {
        const data = req.body;

        // Validate required fields
        if (!data.message || !data.message.trim() || !data.channel || !data.variables) {
          return res.status(400).json({ error: 'Missing required fields' });
        }

        // DEV MODE: Handle base64 file upload
        if (lexiaHandler.devMode && data.file_base64 && !data.file_url) {
          const { decodeBase64File } = require('../utils');
          const path = require('path');
          const fs = require('fs');
          
          console.log('🔧 Dev mode: Converting file_base64 to file_url');
          
          try {
            // Decode base64 to file
            const { filePath } = decodeBase64File(data.file_base64, data.file_name);
            
            // Create uploads directory if it doesn't exist
            const uploadsDir = 'uploads';
            if (!fs.existsSync(uploadsDir)) {
              fs.mkdirSync(uploadsDir, { recursive: true });
            }
            
            // Move file to uploads directory with original name
            let filename = data.file_name || path.basename(filePath);
            // Sanitize filename
            filename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '');
            let destPath = path.join(uploadsDir, filename);
            
            // If file exists, add timestamp
            if (fs.existsSync(destPath)) {
              const ext = path.extname(filename);
              const name = path.basename(filename, ext);
              filename = `${name}_${Date.now()}${ext}`;
              destPath = path.join(uploadsDir, filename);
            }
            
            fs.renameSync(filePath, destPath);
            
            // Create HTTP URL for local access (served by static files endpoint)
            // Default to localhost:5001, but could be configured
            const port = process.env.LEXIA_PORT || '5001';
            data.file_url = `http://localhost:${port}/uploads/${filename}`;
            
            console.log(`✅ Converted base64 to file_url: ${data.file_url}`);
          } catch (error) {
            console.error(`Failed to convert base64 to file: ${error.message}`);
            return res.status(400).json({ error: `Failed to process file: ${error.message}` });
          }
        }

        // DEV MODE: Return streaming response directly
        if (lexiaHandler.devMode) {
          console.log('🔧 Dev mode: Streaming response directly');

          // Clear any existing stream data for this channel
          DevStreamClient.clearStream(data.channel);
          console.log(`🔴 [INIT] Cleared stream for channel: ${data.channel}`);

          // Set up SSE headers
          res.setHeader('Content-Type', 'text/event-stream');
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
          res.setHeader('X-Accel-Buffering', 'no');
          res.setHeader('Connection', 'keep-alive');

          // Send initial comment to establish connection
          res.write(': connected\n\n');
          console.log('🔴 [INIT] Sent initial SSE comment');

          // Get the stream and listen to events
          const stream = DevStreamClient.getStream(data.channel);
          const emitter = stream.emitter;

          // Set up event listeners
          emitter.on('delta', (content) => {
            const sseChunk = `data: ${content}\n\n`;
            res.write(sseChunk);
          });

          emitter.on('complete', (fullResponse) => {
            res.end();
          });

          emitter.on('error', (errorMsg) => {
            res.write(`data: \n\n❌ Error: ${errorMsg}\n\n`);
            res.end();
          });

          // Start processing in background
          console.log('🔴 [INIT] Starting background processing');
          setImmediate(async () => {
            try {
              await processMessageFunc(data);
            } catch (error) {
              console.error('Background processing error:', error);
              emitter.emit('error', error.message);
            }
          });

        } else {
          // PRODUCTION MODE: Return immediate response, process in background
          console.log('🚀 Production mode: Processing in background');

          // Start processing in background
          setImmediate(async () => {
            try {
              await processMessageFunc(data);
            } catch (error) {
              console.error('Background processing error:', error);
            }
          });

          // Return immediate success response
          const response = createSuccessResponse(
            data.response_uuid,
            data.thread_id
          );
          res.json(response);
        }

      } catch (error) {
        console.error('Error in send_message endpoint:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  }

  // Conversation history endpoints
  if (conversationManager) {
    router.get('/conversation/:thread_id/history', async (req, res) => {
      try {
        const { thread_id } = req.params;
        const history = conversationManager.getHistory(thread_id);
        res.json({
          thread_id,
          history,
          count: history.length
        });
      } catch (error) {
        console.error(`Error getting history for thread ${req.params.thread_id}:`, error);
        res.status(500).json({ error: 'Failed to get conversation history' });
      }
    });

    router.delete('/conversation/:thread_id/history', async (req, res) => {
      try {
        const { thread_id } = req.params;
        conversationManager.clearHistory(thread_id);
        res.json({
          status: 'success',
          thread_id,
          message: 'Conversation history cleared'
        });
      } catch (error) {
        console.error(`Error clearing history for thread ${req.params.thread_id}:`, error);
        res.status(500).json({ error: 'Failed to clear conversation history' });
      }
    });
  }

  // Mount router
  app.use('/api/v1', router);

  // Add static file serving for uploads (dev mode)
  if (lexiaHandler && lexiaHandler.devMode) {
    const fs = require('fs');
    const uploadsDir = 'uploads';
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    app.use('/uploads', express.static(uploadsDir));
    console.log(`📁 Dev mode: Serving static files from /${uploadsDir}`);
  }

  return app;
}

module.exports = { addStandardEndpoints };

