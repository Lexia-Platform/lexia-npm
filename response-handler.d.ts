/**
 * Create a standard success response for Lexia.
 * @param {string} responseUuid - Response UUID
 * @param {string} threadId - Thread ID
 * @param {string} message - Message (default: "Processing started")
 * @returns {ChatResponse} Success response object
 */
export function createSuccessResponse(responseUuid: string, threadId: string, message?: string): ChatResponse;
/**
 * Create a complete response with all required fields for Lexia API.
 * @param {string} responseUuid - Response UUID
 * @param {string} threadId - Thread ID
 * @param {string} content - Response content
 * @param {Object} usageInfo - Usage information (optional)
 * @param {string} fileUrl - File URL for generated files (optional)
 * @returns {Object} Complete response object
 */
export function createCompleteResponse(responseUuid: string, threadId: string, content: string, usageInfo?: any, fileUrl?: string): any;
import { ChatResponse } from "./models";
//# sourceMappingURL=response-handler.d.ts.map