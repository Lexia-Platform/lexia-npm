export class APIClient {
    /**
     * Initialize the API client.
     * @param {Object} defaultHeaders - Default headers to use for all requests
     */
    constructor(defaultHeaders?: any);
    defaultHeaders: any;
    /**
     * Send POST request to external service.
     * @param {string} url - URL endpoint to send request to
     * @param {Object} data - JSON data to send in request body
     * @param {Object} headers - Additional headers (merged with default headers)
     * @returns {Promise<Object>} HTTP response object
     */
    post(url: string, data: any, headers?: any): Promise<any>;
    /**
     * Send PUT request to external service.
     * @param {string} url - URL endpoint to send request to
     * @param {Object} data - JSON data to send in request body
     * @param {Object} headers - Additional headers (merged with default headers)
     * @returns {Promise<Object>} HTTP response object
     */
    put(url: string, data: any, headers?: any): Promise<any>;
    /**
     * Send GET request to external service.
     * @param {string} url - URL endpoint to send request to
     * @param {Object} params - Query parameters
     * @param {Object} headers - Additional headers (merged with default headers)
     * @returns {Promise<Object>} HTTP response object
     */
    get(url: string, params?: any, headers?: any): Promise<any>;
    /**
     * Send DELETE request to external service.
     * @param {string} url - URL endpoint to send request to
     * @param {Object} headers - Additional headers (merged with default headers)
     * @returns {Promise<Object>} HTTP response object
     */
    delete(url: string, headers?: any): Promise<any>;
    /**
     * Make HTTP request with common logging and error handling.
     * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
     * @param {string} url - URL endpoint
     * @param {Object} options - Additional options for axios
     * @returns {Promise<Object>} HTTP response object
     */
    _request(method: string, url: string, options?: any): Promise<any>;
}
//# sourceMappingURL=api-client.d.ts.map