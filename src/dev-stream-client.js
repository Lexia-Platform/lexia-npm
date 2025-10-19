/**
 * Dev Stream Client
 * =================
 * 
 * Handles streaming for local development without Centrifugo.
 * Uses in-memory storage and event emitters for real-time updates.
 */

const EventEmitter = require('events');

class DevStreamClient {
  constructor() {
    console.log('🔧 Dev Stream Client initialized (no Centrifugo)');
  }

  /**
   * Get the current stream state for a channel.
   * @param {string} channel - Channel name
   * @returns {Object} Stream state
   */
  static getStream(channel) {
    if (!DevStreamClient._streams[channel]) {
      DevStreamClient._streams[channel] = {
        chunks: [],
        fullResponse: '',
        finished: false,
        error: null,
        emitter: new EventEmitter()
      };
    }
    return DevStreamClient._streams[channel];
  }

  /**
   * Clear a stream's data.
   * @param {string} channel - Channel name
   */
  static clearStream(channel) {
    if (DevStreamClient._streams[channel]) {
      const stream = DevStreamClient._streams[channel];
      const emitter = stream.emitter;
      
      DevStreamClient._streams[channel] = {
        chunks: [],
        fullResponse: '',
        finished: false,
        error: null,
        emitter
      };
      
      console.log(`🟠 [CLEAR] Cleared stream data for channel ${channel}`);
    }
  }

  /**
   * Store data for a channel and emit event.
   * @param {string} channel - Channel name
   * @param {Object} data - Data to store
   */
  send(channel, data) {
    try {
      const stream = DevStreamClient.getStream(channel);
      
      // Handle delta (streaming chunk)
      if (data.delta) {
        stream.chunks.push(data.delta);
        stream.fullResponse += data.delta;
        console.log(`🟠 [DELTA] Added chunk. Total chunks: ${stream.chunks.length}`);
        
        // Emit delta event
        stream.emitter.emit('delta', data.delta);
        
        // Also log to console for immediate visibility
        process.stdout.write(data.delta);
      }
      
      // Handle completion
      if (data.finished) {
        stream.finished = true;
        if (data.full_response) {
          stream.fullResponse = data.full_response;
        }
        console.log(`✅ Dev stream completed for ${channel}`);
        
        // Emit complete event
        stream.emitter.emit('complete', stream.fullResponse);
        process.stdout.write('\n');
      }
      
      // Handle error
      if (data.error) {
        stream.error = data.content || 'An error occurred';
        stream.finished = true;
        console.error(`❌ Dev stream error for ${channel}: ${stream.error}`);
        
        // Emit error event
        stream.emitter.emit('error', stream.error);
      }
      
      // Store the complete message data
      stream.lastMessage = data;
      
    } catch (error) {
      console.error(`Error in dev stream send to ${channel}:`, error.message);
    }
  }

  /**
   * Send a streaming delta message.
   * @param {string} channel - Channel name
   * @param {string} uuid - Response UUID
   * @param {string} threadId - Thread ID
   * @param {string} delta - Text delta to send
   */
  sendDelta(channel, uuid, threadId, delta) {
    console.log(`🟡 [DEVCLIENT] sendDelta() called with '${delta}' (${delta.length} chars)`);
    
    const data = {
      delta,
      finished: false,
      uuid,
      thread_id: threadId
    };
    this.send(channel, data);
  }

  /**
   * Send a completion signal.
   * @param {string} channel - Channel name
   * @param {string} uuid - Response UUID
   * @param {string} threadId - Thread ID
   * @param {string} fullResponse - Complete response text
   */
  sendCompletion(channel, uuid, threadId, fullResponse) {
    const data = {
      finished: true,
      uuid,
      thread_id: threadId,
      full_response: fullResponse
    };
    this.send(channel, data);
  }

  /**
   * Send an error notification.
   * @param {string} channel - Channel name
   * @param {string} uuid - Response UUID
   * @param {string} threadId - Thread ID
   * @param {string} errorMessage - Error message
   */
  sendError(channel, uuid, threadId, errorMessage) {
    const data = {
      error: true,
      content: errorMessage,
      finished: true,
      uuid,
      thread_id: threadId,
      status: 'FAILED',
      role: 'developer'
    };
    this.send(channel, data);
  }
}

// Class-level storage for streaming data (shared across instances)
DevStreamClient._streams = {};

module.exports = { DevStreamClient };






