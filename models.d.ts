/**
 * Lexia Models
 * ============
 *
 * Data models for Lexia API communication.
 */
/**
 * Memory model for structured user memory data from Lexia request.
 */
export class Memory {
    constructor(data?: {});
    name: any;
    goals: any;
    location: any;
    interests: any;
    preferences: any;
    past_experiences: any;
}
/**
 * Variable model for environment variables from Lexia request.
 */
export class Variable {
    constructor(name: any, value: any);
    name: any;
    value: any;
}
/**
 * Request model for chat messages matching Lexia's expected format.
 */
export class ChatMessage {
    constructor(data: any);
    thread_id: any;
    model: any;
    message: any;
    conversation_id: any;
    response_uuid: any;
    message_uuid: any;
    channel: any;
    file_type: any;
    file_url: any;
    variables: any;
    url: any;
    url_update: any;
    url_upload: any;
    force_search: any;
    force_code: any;
    system_message: any;
    memory: any;
    project_system_message: any;
    first_message: any;
    project_id: any;
    project_files: any;
    stream_url: any;
    stream_token: any;
    headers: any;
}
/**
 * Response model for chat requests matching Lexia's expected format.
 */
export class ChatResponse {
    constructor(status: any, message: any, response_uuid: any, thread_id: any);
    status: any;
    message: any;
    response_uuid: any;
    thread_id: any;
}
//# sourceMappingURL=models.d.ts.map