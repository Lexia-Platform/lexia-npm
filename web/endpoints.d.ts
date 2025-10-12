/**
 * Add standard Lexia endpoints to an Express application.
 * @param {Object} app - Express application instance
 * @param {Object} options - Configuration options
 * @param {Object} options.conversationManager - Optional conversation manager for history endpoints
 * @param {Object} options.lexiaHandler - Optional LexiaHandler instance for communication
 * @param {Function} options.processMessageFunc - Optional function to process messages (custom AI logic)
 */
export function addStandardEndpoints(app: any, options?: {
    conversationManager: any;
    lexiaHandler: any;
    processMessageFunc: Function;
}): any;
//# sourceMappingURL=endpoints.d.ts.map