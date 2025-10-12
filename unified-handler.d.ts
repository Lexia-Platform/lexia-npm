export class LexiaHandler {
    /**
     * Initialize LexiaHandler with optional dev mode.
     * @param {boolean} devMode - If true, uses DevStreamClient instead of Centrifugo.
     *                           If null/undefined, checks LEXIA_DEV_MODE environment variable.
     */
    constructor(devMode?: boolean);
    devMode: boolean;
    streamClient: CentrifugoClient | DevStreamClient;
    api: APIClient;
    /**
     * Update Centrifugo configuration with dynamic values from request.
     * Only applicable in production mode.
     * @param {string} streamUrl - Centrifugo server URL from request
     * @param {string} streamToken - Centrifugo API key from request
     */
    updateCentrifugoConfig(streamUrl: string, streamToken: string): void;
    /**
     * Stream a chunk of AI response.
     * Uses DevStreamClient in dev mode, Centrifugo in production.
     * @param {Object} data - Request data
     * @param {string} content - Content chunk to stream
     */
    streamChunk(data: any, content: string): Promise<void>;
    /**
     * Complete AI response and send to Lexia.
     * Uses DevStreamClient in dev mode, Centrifugo in production.
     * @param {Object} data - Request data
     * @param {string} fullResponse - Complete AI response
     * @param {Object} usageInfo - Usage information (optional)
     * @param {string} fileUrl - File URL for generated files (optional)
     */
    completeResponse(data: any, fullResponse: string, usageInfo?: any, fileUrl?: string): Promise<void>;
    /**
     * Send error message via streaming client and persist to backend API.
     * Uses DevStreamClient in dev mode, Centrifugo in production.
     * @param {Object} data - Request data
     * @param {string} errorMessage - Error message to send
     */
    sendError(data: any, errorMessage: string): Promise<void>;
}
import { CentrifugoClient } from "./centrifugo-client";
import { DevStreamClient } from "./dev-stream-client";
import { APIClient } from "./api-client";
//# sourceMappingURL=unified-handler.d.ts.map