/**
 * API Client
 * ==========
 * 
 * Handles HTTP communication with external services for Lexia integration.
 */

const axios = require('axios');

class APIClient {
  /**
   * Initialize the API client.
   * @param {Object} defaultHeaders - Default headers to use for all requests
   */
  constructor(defaultHeaders = null) {
    this.defaultHeaders = defaultHeaders || {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    console.log('API client initialized');
  }

  /**
   * Send POST request to external service.
   * @param {string} url - URL endpoint to send request to
   * @param {Object} data - JSON data to send in request body
   * @param {Object} headers - Additional headers (merged with default headers)
   * @returns {Promise<Object>} HTTP response object
   */
  async post(url, data, headers = null) {
    // Validate inputs
    if (!url || typeof url !== 'string') {
      throw new Error('URL must be a non-empty string');
    }
    if (!data || typeof data !== 'object') {
      throw new Error('Data must be a non-empty object');
    }
    
    return this._request('POST', url, { data, headers });
  }

  /**
   * Send PUT request to external service.
   * @param {string} url - URL endpoint to send request to
   * @param {Object} data - JSON data to send in request body
   * @param {Object} headers - Additional headers (merged with default headers)
   * @returns {Promise<Object>} HTTP response object
   */
  async put(url, data, headers = null) {
    // Validate inputs
    if (!url || typeof url !== 'string') {
      throw new Error('URL must be a non-empty string');
    }
    if (!data || typeof data !== 'object') {
      throw new Error('Data must be a non-empty object');
    }
    
    return this._request('PUT', url, { data, headers });
  }

  /**
   * Send GET request to external service.
   * @param {string} url - URL endpoint to send request to
   * @param {Object} params - Query parameters
   * @param {Object} headers - Additional headers (merged with default headers)
   * @returns {Promise<Object>} HTTP response object
   */
  async get(url, params = null, headers = null) {
    return this._request('GET', url, { params, headers });
  }

  /**
   * Send DELETE request to external service.
   * @param {string} url - URL endpoint to send request to
   * @param {Object} headers - Additional headers (merged with default headers)
   * @returns {Promise<Object>} HTTP response object
   */
  async delete(url, headers = null) {
    return this._request('DELETE', url, { headers });
  }

  /**
   * Make HTTP request with common logging and error handling.
   * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
   * @param {string} url - URL endpoint
   * @param {Object} options - Additional options for axios
   * @returns {Promise<Object>} HTTP response object
   */
  async _request(method, url, options = {}) {
    // Merge headers
    const headers = { ...this.defaultHeaders };
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    console.log(`=== API CLIENT ${method} ===`);
    console.log(`URL: ${url}`);
    console.log(`Headers:`, headers);
    if (options.data) {
      console.log(`JSON Data:`, options.data);
    }
    if (options.params) {
      console.log(`Params:`, options.params);
    }

    try {
      const axiosConfig = {
        method,
        url,
        headers,
        ...options
      };

      const response = await axios(axiosConfig);
      
      console.log(`Response Status: ${response.status}`);
      console.log(`Response Headers:`, response.headers);
      console.log(`Response Content:`, response.data);
      console.log(`=== END API CLIENT ${method} ===`);
      
      return response;
      
    } catch (error) {
      console.error(`Error making ${method} request to ${url}:`, error.message);
      if (error.response) {
        console.error(`Response status: ${error.response.status}`);
        console.error(`Response data:`, error.response.data);
      }
      throw error;
    }
  }
}

module.exports = { APIClient };






