/**
 * Lexia Response Handler
 * ======================
 * 
 * Handles creation of Lexia-compatible API responses.
 */

const { ChatResponse } = require('./models');

/**
 * Create a standard success response for Lexia.
 * @param {string} responseUuid - Response UUID
 * @param {string} threadId - Thread ID
 * @param {string} message - Message (default: "Processing started")
 * @returns {ChatResponse} Success response object
 */
function createSuccessResponse(responseUuid, threadId, message = 'Processing started') {
  return new ChatResponse('success', message, responseUuid, threadId);
}

/**
 * Create a complete response with all required fields for Lexia API.
 * @param {string} responseUuid - Response UUID
 * @param {string} threadId - Thread ID
 * @param {string} content - Response content
 * @param {Object} usageInfo - Usage information (optional)
 * @param {string} fileUrl - File URL for generated files (optional)
 * @returns {Object} Complete response object
 */
function createCompleteResponse(responseUuid, threadId, content, usageInfo = null, fileUrl = null) {
  // Calculate default token counts if usage_info is missing
  let inputTokens, outputTokens, totalTokens;
  
  if (!usageInfo) {
    const estimatedTokens = content ? content.split(' ').length : 1;
    inputTokens = 1;
    outputTokens = estimatedTokens;
    totalTokens = inputTokens + outputTokens;
  } else {
    inputTokens = usageInfo.prompt_tokens || 1;
    outputTokens = usageInfo.completion_tokens || 1;
    totalTokens = usageInfo.total_tokens || (inputTokens + outputTokens);
  }
  
  const responseData = {
    uuid: responseUuid,
    conversation_id: null, // Will be set by the handler
    content,
    role: 'assistant',
    status: 'FINISHED',
    usage: {
      input_tokens: inputTokens,
      output_tokens: outputTokens,
      total_tokens: totalTokens,
      input_token_details: {
        tokens: inputTokens > 0 ? [{ token: 'default', logprob: 0.0 }] : []
      },
      output_token_details: {
        tokens: outputTokens > 0 ? [{ token: 'default', logprob: 0.0 }] : []
      }
    }
  };
  
  // Add file field if provided (for DALL-E generated images)
  if (fileUrl) {
    responseData.file = fileUrl;
  }
  
  return responseData;
}

module.exports = {
  createSuccessResponse,
  createCompleteResponse
};




