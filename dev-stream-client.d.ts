export class DevStreamClient {
    /**
     * Get the current stream state for a channel.
     * @param {string} channel - Channel name
     * @returns {Object} Stream state
     */
    static getStream(channel: string): any;
    /**
     * Clear a stream's data.
     * @param {string} channel - Channel name
     */
    static clearStream(channel: string): void;
    /**
     * Store data for a channel and emit event.
     * @param {string} channel - Channel name
     * @param {Object} data - Data to store
     */
    send(channel: string, data: any): void;
    /**
     * Send a streaming delta message.
     * @param {string} channel - Channel name
     * @param {string} uuid - Response UUID
     * @param {string} threadId - Thread ID
     * @param {string} delta - Text delta to send
     */
    sendDelta(channel: string, uuid: string, threadId: string, delta: string): void;
    /**
     * Send a completion signal.
     * @param {string} channel - Channel name
     * @param {string} uuid - Response UUID
     * @param {string} threadId - Thread ID
     * @param {string} fullResponse - Complete response text
     */
    sendCompletion(channel: string, uuid: string, threadId: string, fullResponse: string): void;
    /**
     * Send an error notification.
     * @param {string} channel - Channel name
     * @param {string} uuid - Response UUID
     * @param {string} threadId - Thread ID
     * @param {string} errorMessage - Error message
     */
    sendError(channel: string, uuid: string, threadId: string, errorMessage: string): void;
}
export namespace DevStreamClient {
    let _streams: {};
}
//# sourceMappingURL=dev-stream-client.d.ts.map