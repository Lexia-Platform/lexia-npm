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
    _progressiveTraceBuffer: string;
    _progressiveTraceVisibility: string;
    stream(content: any): Promise<any>;
    close(usageInfo?: any, fileUrl?: any): Promise<any>;
    error(message: any, exception?: any, trace?: any): Promise<any>;
    _loadingMarker(kind: any, action: any): string;
    start_loading(kind?: string): Promise<any>;
    end_loading(kind?: string): Promise<any>;
    image(url: any): Promise<any>;
    pass_image(url: any): Promise<any>;
    /**
     * Send tracing information with visibility control.
     * @param {string} content - The tracing text content to display
     * @param {string} visibility - Who can see this trace - "all" or "admin" (default: "all")
     */
    tracing(content: string, visibility?: string): Promise<any>;
    /**
     * Start a progressive trace block that can be built incrementally.
     *
     * Use this when you want to build a single trace entry over time,
     * updating it as progress happens, rather than creating multiple
     * separate trace entries.
     *
     * @param {string} message - Initial message to start the trace with
     * @param {string} visibility - Who can see this trace - "all" or "admin" (default: "all")
     *
     * @example
     * session.tracing_begin("🔄 Processing chunks:", "all");
     * for (let i = 0; i < 10; i++) {
     *   session.tracing_append(`\n  • Chunk ${i+1}/10...`);
     *   // ... do work ...
     *   session.tracing_append(` ✓`);
     * }
     * session.tracing_end("\n✅ All done!");
     */
    tracing_begin(message: string, visibility?: string): void;
    /**
     * Append content to the current progressive trace block.
     *
     * Must be called after tracing_begin(). Appends the message to
     * the internal buffer. The complete trace will be sent when
     * tracing_end() is called.
     *
     * @param {string} message - Content to append to the progressive trace
     *
     * @example
     * session.tracing_begin("Processing:");
     * session.tracing_append("\n  - Step 1 done");
     * session.tracing_append("\n  - Step 2 done");
     * session.tracing_end();
     */
    tracing_append(message: string): void;
    /**
     * Complete and send the progressive trace block.
     *
     * Optionally append a final message, then send the complete
     * trace content as a single trace entry.
     *
     * @param {string} message - Optional final message to append before sending
     *
     * @example
     * session.tracing_begin("Processing items:");
     * for (const item of items) {
     *   session.tracing_append(`\n  • ${item}...`);
     *   process(item);
     *   session.tracing_append(" ✓");
     * }
     * session.tracing_end("\n✅ Complete!");
     */
    tracing_end(message?: string): Promise<void>;
}
export {};
//# sourceMappingURL=unified-handler.d.ts.map