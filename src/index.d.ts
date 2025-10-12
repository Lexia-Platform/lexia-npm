/**
 * Type definitions for @lexia/sdk
 */

export const VERSION: string;

// Models
export class Memory {
  name: string;
  goals: string[];
  location: string;
  interests: string[];
  preferences: string[];
  past_experiences: string[];
  
  constructor(data?: Partial<Memory>);
}

export class Variable {
  name: string;
  value: string;
  
  constructor(name: string, value: string);
}

export interface ChatMessageData {
  thread_id: string;
  model: string;
  message: string;
  conversation_id: number;
  response_uuid: string;
  message_uuid: string;
  channel: string;
  file_type?: string;
  file_url?: string;
  variables: Variable[];
  url: string;
  url_update?: string;
  url_upload?: string;
  force_search?: boolean;
  force_code?: boolean | null;
  system_message?: string | null;
  memory?: Memory | Record<string, any> | any[];
  project_system_message?: string | null;
  first_message?: boolean;
  project_id?: string;
  project_files?: any;
  stream_url?: string | null;
  stream_token?: string | null;
  headers?: Record<string, string> | null;
}

export class ChatMessage {
  thread_id: string;
  model: string;
  message: string;
  conversation_id: number;
  response_uuid: string;
  message_uuid: string;
  channel: string;
  file_type: string;
  file_url: string;
  variables: Variable[];
  url: string;
  url_update: string;
  url_upload: string;
  force_search: boolean;
  force_code: boolean | null;
  system_message: string | null;
  memory: Memory | Record<string, any> | any[];
  project_system_message: string | null;
  first_message: boolean;
  project_id: string;
  project_files: any;
  stream_url: string | null;
  stream_token: string | null;
  headers: Record<string, string> | null;
  
  constructor(data: ChatMessageData);
}

export class ChatResponse {
  status: string;
  message: string;
  response_uuid: string;
  thread_id: string;
  
  constructor(status: string, message: string, response_uuid: string, thread_id: string);
}

// API Client
export class APIClient {
  constructor(defaultHeaders?: Record<string, string>);
  post(url: string, data: Record<string, any>, headers?: Record<string, string>): Promise<any>;
  put(url: string, data: Record<string, any>, headers?: Record<string, string>): Promise<any>;
  get(url: string, params?: Record<string, any>, headers?: Record<string, string>): Promise<any>;
  delete(url: string, headers?: Record<string, string>): Promise<any>;
}

// Centrifugo Client
export class CentrifugoClient {
  constructor(url?: string, apiKey?: string);
  updateConfig(url: string, apiKey: string): void;
  send(channel: string, data: Record<string, any>): Promise<void>;
  sendDelta(channel: string, uuid: string, threadId: string, delta: string): Promise<void>;
  sendCompletion(channel: string, uuid: string, threadId: string, fullResponse: string): Promise<void>;
  sendError(channel: string, uuid: string, threadId: string, errorMessage: string): Promise<void>;
}

// Dev Stream Client
export class DevStreamClient {
  constructor();
  static getStream(channel: string): {
    chunks: string[];
    fullResponse: string;
    finished: boolean;
    error: string | null;
    emitter: any;
  };
  static clearStream(channel: string): void;
  send(channel: string, data: Record<string, any>): void;
  sendDelta(channel: string, uuid: string, threadId: string, delta: string): void;
  sendCompletion(channel: string, uuid: string, threadId: string, fullResponse: string): void;
  sendError(channel: string, uuid: string, threadId: string, errorMessage: string): void;
}

// Response Handler
export function createSuccessResponse(
  responseUuid: string,
  threadId: string,
  message?: string
): ChatResponse;

export function createCompleteResponse(
  responseUuid: string,
  threadId: string,
  content: string,
  usageInfo?: Record<string, any> | null,
  fileUrl?: string | null
): Record<string, any>;

// Unified Handler
export class LexiaHandler {
  devMode: boolean;
  
  constructor(devMode?: boolean | null);
  updateCentrifugoConfig(streamUrl: string, streamToken: string): void;
  streamChunk(data: ChatMessage | ChatMessageData, content: string): Promise<void>;
  completeResponse(
    data: ChatMessage | ChatMessageData,
    fullResponse: string,
    usageInfo?: Record<string, any> | null,
    fileUrl?: string | null
  ): Promise<void>;
  sendError(data: ChatMessage | ChatMessageData, errorMessage: string): Promise<void>;
}

// Utils
export class MemoryHelper {
  constructor(memoryData: Memory | Record<string, any> | any[] | null);
  getName(): string;
  getGoals(): string[];
  getLocation(): string;
  getInterests(): string[];
  getPreferences(): string[];
  getPastExperiences(): string[];
  hasName(): boolean;
  hasGoals(): boolean;
  hasLocation(): boolean;
  hasInterests(): boolean;
  hasPreferences(): boolean;
  hasPastExperiences(): boolean;
  toDict(): Record<string, any>;
  isEmpty(): boolean;
}

export class Variables {
  constructor(variablesList: Variable[] | any[]);
  get(variableName: string): string | null;
  has(variableName: string): boolean;
  listNames(): string[];
  toDict(): Record<string, string>;
}

export function setEnvVariables(variables: Variable[] | any[]): void;
export function getVariableValue(variables: Variable[] | any[], variableName: string): string | null;
export function getOpenAIApiKey(variables: Variable[] | any[]): string | null;
export function formatSystemPrompt(
  systemMessage?: string | null,
  projectSystemMessage?: string | null
): string;
export function formatMessagesForAI(
  systemPrompt: string,
  conversationHistory: any[],
  currentMessage: string
): any[];

// Web (optional)
export interface AppOptions {
  title?: string;
  version?: string;
  description?: string;
  debug?: boolean;
}

export interface EndpointOptions {
  conversationManager?: any;
  lexiaHandler?: LexiaHandler;
  processMessageFunc?: (data: ChatMessage | ChatMessageData) => Promise<void>;
}

export function createLexiaApp(options?: AppOptions): any;
export function addStandardEndpoints(app: any, options?: EndpointOptions): any;

