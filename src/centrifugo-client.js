/**
 * Centrifugo Client
 * ================
 * 
 * Handles real-time messaging via Centrifugo for Lexia integration.
 */

const axios = require('axios');

class CentrifugoClient {
  /**
   * Initialize the Centrifugo client.
   * @param {string} url - Centrifugo server URL (defaults to environment variable)
   * @param {string} apiKey - Centrifugo API key (defaults to environment variable)
   */
  constructor(url = null, apiKey = null) {
    this.url = url || process.env.CENTRIFUGO_URL || 'http://centrifugo:8000';
    this.apiKey = apiKey || process.env.CENTRIFUGO_API_KEY || 'my_api_key';
    
    console.log(`Centrifugo client initialized with URL: ${this.url}`);
  }

  /**
   * Update the Centrifugo configuration dynamically.
   * @param {string} url - New Centrifugo server URL
   * @param {string} apiKey - New Centrifugo API key
   */
  updateConfig(url, apiKey) {
    this.url = url;
    this.apiKey = apiKey;
    console.log(`Centrifugo client configuration updated - URL: ${this.url}`);
  }

  /**
   * Send data to a Centrifugo channel.
   * @param {string} channel - Channel name to send to
   * @param {Object} data - Data to send
   */
  async send(channel, data) {
    try {
      const headers = {
        'X-API-Key': this.apiKey,
        'Authorization': `apikey ${this.apiKey}`,
        'Content-Type': 'application/json'
      };
      
      const payload = {
        channel,
        data
      };
      
      const response = await axios.post(
        `${this.url}/api/publish`,
        payload,
        {
          headers,
          timeout: 10000
        }
      );
      
      if (response.status === 200) {
        console.log(`Successfully sent message to channel: ${channel}`);
      } else {
        console.warn(`Failed to send message to channel ${channel}. Status: ${response.status}`);
      }
      
    } catch (error) {
      console.error(`Error sending message to Centrifugo channel ${channel}:`, error.message);
    }
  }

  /**
   * Send a streaming delta message.
   * @param {string} channel - Channel name
   * @param {string} uuid - Response UUID
   * @param {string} threadId - Thread ID
   * @param {string} delta - Text delta to send
   */
  async sendDelta(channel, uuid, threadId, delta) {
    const data = {
      delta,
      finished: false,
      uuid,
      thread_id: threadId
    };
    await this.send(channel, data);
  }

  /**
   * Send a completion signal.
   * @param {string} channel - Channel name
   * @param {string} uuid - Response UUID
   * @param {string} threadId - Thread ID
   * @param {string} fullResponse - Complete response text
   */
  async sendCompletion(channel, uuid, threadId, fullResponse) {
    const data = {
      finished: true,
      uuid,
      thread_id: threadId,
      full_response: fullResponse
    };
    await this.send(channel, data);
  }

  /**
   * Send an error notification.
   * @param {string} channel - Channel name
   * @param {string} uuid - Response UUID
   * @param {string} threadId - Thread ID
   * @param {string} errorMessage - Error message
   */
  async sendError(channel, uuid, threadId, errorMessage) {
    const data = {
      error: true,
      content: errorMessage,
      finished: true,
      uuid,
      thread_id: threadId,
      status: 'FAILED',
      role: 'developer'
    };
    await this.send(channel, data);
  }
}

module.exports = { CentrifugoClient };




