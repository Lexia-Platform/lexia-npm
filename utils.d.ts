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
//# sourceMappingURL=utils.d.ts.map