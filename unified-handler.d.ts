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
    _buffers: Map<any, any>;
    _markerAliases: Map<string, string>;
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
    /** Developer-friendly streaming that also aggregates for finalization */
    stream(data: any, content: any): Promise<void>;
    _drainBuffer(uuid: any): any;
    /**
     * Complete AI response and send to Lexia.
     * Uses DevStreamClient in dev mode, Centrifugo in production.
     * @param {Object} data - Request data
     * @param {string} fullResponse - Complete AI response
     * @param {Object} usageInfo - Usage information (optional)
     * @param {string} fileUrl - File URL for generated files (optional)
     */
    completeResponse(data: any, fullResponse: string, usageInfo?: any, fileUrl?: string): Promise<void>;
    /** Finalize using aggregated buffer, return finalized text */
    close(data: any, usageInfo?: any, fileUrl?: any): Promise<any>;
    /**
     * Send error message via streaming client and persist to backend API.
     * Uses DevStreamClient in dev mode, Centrifugo in production.
     * @param {Object} data - Request data
     * @param {string} errorMessage - Error message to send
     * @param {string} trace - Optional stack trace string
     * @param {Error} exception - Optional exception object (will extract trace from it)
     */
    sendError(data: any, errorMessage: string, trace?: string, exception?: Error): Promise<void>;
    begin(data: any): LexiaSession;
}
import { CentrifugoClient } from "./centrifugo-client";
import { DevStreamClient } from "./dev-stream-client";
import { APIClient } from "./api-client";
declare class LexiaSession {
    constructor(handler: any, data: any);
    _h: any;
    _d: any;
    stream(content: any): Promise<any>;
    close(usageInfo?: any, fileUrl?: any): Promise<any>;
    error(message: any, exception?: any, trace?: any): Promise<any>;
    _loadingMarker(kind: any, action: any): string;
    start_loading(kind?: string): Promise<any>;
    end_loading(kind?: string): Promise<any>;
    image(url: any): Promise<any>;
    pass_image(url: any): Promise<any>;
}
export {};
//# sourceMappingURL=unified-handler.d.ts.map