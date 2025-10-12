export class CentrifugoClient {
    /**
     * Initialize the Centrifugo client.
     * @param {string} url - Centrifugo server URL (defaults to environment variable)
     * @param {string} apiKey - Centrifugo API key (defaults to environment variable)
     */
    constructor(url?: string, apiKey?: string);
    url: string;
    apiKey: string;
    /**
     * Update the Centrifugo configuration dynamically.
     * @param {string} url - New Centrifugo server URL
     * @param {string} apiKey - New Centrifugo API key
     */
    updateConfig(url: string, apiKey: string): void;
    /**
     * Send data to a Centrifugo channel.
     * @param {string} channel - Channel name to send to
     * @param {Object} data - Data to send
     */
    send(channel: string, data: any): Promise<void>;
    /**
     * Send a streaming delta message.
     * @param {string} channel - Channel name
     * @param {string} uuid - Response UUID
     * @param {string} threadId - Thread ID
     * @param {string} delta - Text delta to send
     */
    sendDelta(channel: string, uuid: string, threadId: string, delta: string): Promise<void>;
    /**
     * Send a completion signal.
     * @param {string} channel - Channel name
     * @param {string} uuid - Response UUID
     * @param {string} threadId - Thread ID
     * @param {string} fullResponse - Complete response text
     */
    sendCompletion(channel: string, uuid: string, threadId: string, fullResponse: string): Promise<void>;
    /**
     * Send an error notification.
     * @param {string} channel - Channel name
     * @param {string} uuid - Response UUID
     * @param {string} threadId - Thread ID
     * @param {string} errorMessage - Error message
     */
    sendError(channel: string, uuid: string, threadId: string, errorMessage: string): Promise<void>;
}
//# sourceMappingURL=centrifugo-client.d.ts.map