/**
 * Lexia Models
 * ============
 * 
 * Data models for Lexia API communication.
 */

/**
 * Memory model for structured user memory data from Lexia request.
 */
class Memory {
  constructor(data = {}) {
    this.name = data.name || '';
    this.goals = data.goals || [];
    this.location = data.location || '';
    this.interests = data.interests || [];
    this.preferences = data.preferences || [];
    this.past_experiences = data.past_experiences || [];
  }
}

/**
 * Variable model for environment variables from Lexia request.
 */
class Variable {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

/**
 * Request model for chat messages matching Lexia's expected format.
 */
class ChatMessage {
  constructor(data) {
    this.thread_id = data.thread_id;
    this.model = data.model;
    this.message = data.message;
    this.conversation_id = data.conversation_id;
    this.response_uuid = data.response_uuid;
    this.message_uuid = data.message_uuid;
    this.channel = data.channel;
    this.file_type = data.file_type || '';
    this.file_url = data.file_url || '';
    this.variables = data.variables || [];
    this.url = data.url;
    this.url_update = data.url_update || '';
    this.url_upload = data.url_upload || '';
    this.force_search = data.force_search || false;
    this.force_code = data.force_code || null;
    this.system_message = data.system_message || null;
    this.memory = data.memory || new Memory();
    this.project_system_message = data.project_system_message || null;
    this.first_message = data.first_message || false;
    this.project_id = data.project_id || '';
    this.project_files = data.project_files || null;
    this.stream_url = data.stream_url || null;
    this.stream_token = data.stream_token || null;
    this.headers = data.headers || null;
  }
}

/**
 * Response model for chat requests matching Lexia's expected format.
 */
class ChatResponse {
  constructor(status, message, response_uuid, thread_id) {
    this.status = status;
    this.message = message;
    this.response_uuid = response_uuid;
    this.thread_id = thread_id;
  }
}

module.exports = {
  Memory,
  Variable,
  ChatMessage,
  ChatResponse
};




