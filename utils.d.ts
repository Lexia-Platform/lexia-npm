/**
 * Utilities
 * ========
 *
 * Common utility functions for Lexia integration.
 */
/**
 * Set environment variables from the variables list.
 * Lexia sends variables in format: [{"name": "OPENAI_API_KEY", "value": "..."}]
 * @param {Array} variables - List of Variable objects or plain objects
 */
export function setEnvVariables(variables: any[]): void;
/**
 * Helper class for easy access to user memory data from Lexia requests.
 */
export class MemoryHelper {
    /**
     * Initialize with memory data from request.
     * @param {Object|Array} memoryData - Memory object, dictionary, or list from request
     */
    constructor(memoryData: any | any[]);
    memory: any;
    getName(): any;
    getGoals(): any;
    getLocation(): any;
    getInterests(): any;
    getPreferences(): any;
    getPastExperiences(): any;
    hasName(): boolean;
    hasGoals(): boolean;
    hasLocation(): boolean;
    hasInterests(): boolean;
    hasPreferences(): boolean;
    hasPastExperiences(): boolean;
    toDict(): {
        name: any;
        goals: any;
        location: any;
        interests: any;
        preferences: any;
        past_experiences: any;
    };
    isEmpty(): boolean;
}
/**
 * Helper class for easy access to force_tools data from Lexia requests.
 */
export class ForceToolsHelper {
    /**
     * Initialize with force_tools list from request.
     * @param {Array<string>} forceTools - List of tool names from request (e.g., ['code', 'search', 'xyz'])
     */
    constructor(forceTools?: Array<string>);
    tools: string[];
    /**
     * Check if a specific tool is forced.
     * @param {string} toolName - Name of the tool to check (e.g., 'code', 'search')
     * @returns {boolean} True if tool is forced
     */
    has(toolName: string): boolean;
    /**
     * Get all forced tools.
     * @returns {Array<string>} List of forced tool names
     */
    getAll(): Array<string>;
    /**
     * Check if no tools are forced.
     * @returns {boolean} True if no tools are forced
     */
    isEmpty(): boolean;
    /**
     * Get count of forced tools.
     * @returns {number} Number of forced tools
     */
    count(): number;
}
/**
 * Helper class for easy access to variables from Lexia requests.
 */
export class Variables {
    /**
     * Initialize with a list of Variable objects or plain objects.
     * @param {Array} variablesList - List of Variable objects or plain objects from request
     */
    constructor(variablesList: any[]);
    variablesList: any[];
    _cache: {};
    /**
     * Get a variable value by name.
     * @param {string} variableName - Name of the variable to get
     * @returns {string|null} Variable value or null if not found
     */
    get(variableName: string): string | null;
    /**
     * Check if a variable exists.
     * @param {string} variableName - Name of the variable to check
     * @returns {boolean} True if variable exists
     */
    has(variableName: string): boolean;
    /**
     * Get list of all variable names.
     * @returns {Array} List of variable names
     */
    listNames(): any[];
    /**
     * Convert all variables to a plain object.
     * @returns {Object} Dictionary of variable names to values
     */
    toDict(): any;
}
/**
 * Extract a specific variable value from variables list by name.
 * @param {Array} variables - List of Variable objects or plain objects from request
 * @param {string} variableName - Name of the variable to extract
 * @returns {string|null} Variable value or null if not found
 */
export function getVariableValue(variables: any[], variableName: string): string | null;
/**
 * Extract OpenAI API key from variables list.
 * @param {Array} variables - List of Variable objects or plain objects from request
 * @returns {string|null} OpenAI API key or null if not found
 */
export function getOpenAIApiKey(variables: any[]): string | null;
/**
 * Format the system prompt for AI APIs.
 * @param {string} systemMessage - Custom system message
 * @param {string} projectSystemMessage - Project-specific system message
 * @returns {string} Formatted system prompt
 */
export function formatSystemPrompt(systemMessage?: string, projectSystemMessage?: string): string;
/**
 * Format messages for AI API call.
 * @param {string} systemPrompt - System prompt to use
 * @param {Array} conversationHistory - Previous conversation messages
 * @param {string} currentMessage - Current user message
 * @returns {Array} List of messages formatted for AI API
 */
export function formatMessagesForAI(systemPrompt: string, conversationHistory: any[], currentMessage: string): any[];
/**
 * Decode a base64 encoded file and save to temporary file.
 * @param {string} fileBase64 - Base64 encoded file data (data URI format: "data:mime;base64,...")
 * @param {string} filename - Optional filename to use for extension detection
 * @returns {Object} Object with filePath and isTempFile properties
 *
 * @example
 * const { filePath, isTempFile } = decodeBase64File(data.file_base64, data.file_name);
 * // Use the file
 * if (isTempFile) {
 *   fs.unlinkSync(filePath); // Clean up
 * }
 */
export function decodeBase64File(fileBase64: string, filename?: string): any;
//# sourceMappingURL=utils.d.ts.map