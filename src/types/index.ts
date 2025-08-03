export type ChatRole = "assistant" | "user";

export interface Config {
  id?: number;
  model: string;
  systemPrompt: string;
  createdAt: Date;
}

export interface Chat {
  id?: number;
  name: string;
  model: string;
  createdAt: Date;
}

export interface Message {
  id?: number;
  chatId: number;
  role: ChatRole;
  content: string;
  meta?: any;
  context?: number[];
  createdAt: Date;
}

export interface Model {
  name: string;
  modified_at: string;
  size: number;
}

// Ollama API Types
export interface OllamaModel {
  name: string;
  model: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
}

export interface OllamaMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
  thinking?: string;
  images?: string[];
  tool_calls?: OllamaToolCall[];
  tool_name?: string;
}

export interface OllamaToolCall {
  function: {
    name: string;
    arguments: Record<string, any>;
  };
}

export interface OllamaTool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: {
      type: string;
      properties: Record<string, any>;
      required: string[];
    };
  };
}

// API Request Types
export interface GenerateRequest {
  model: string;
  prompt?: string;
  suffix?: string;
  images?: string[];
  think?: boolean;
  format?: "json" | Record<string, any>;
  options?: Record<string, any>;
  system?: string;
  template?: string;
  stream?: boolean;
  raw?: boolean;
  keep_alive?: string;
  context?: number[];
}

export interface ChatRequest {
  model: string;
  messages: OllamaMessage[];
  tools?: OllamaTool[];
  think?: boolean;
  format?: "json" | Record<string, any>;
  options?: Record<string, any>;
  stream?: boolean;
  keep_alive?: string;
}

export interface CreateRequest {
  model: string;
  from?: string;
  files?: Record<string, string>;
  adapters?: Record<string, string>;
  template?: string;
  license?: string | string[];
  system?: string;
  parameters?: Record<string, any>;
  messages?: OllamaMessage[];
  stream?: boolean;
  quantize?: string;
}

export interface ShowRequest {
  model: string;
  verbose?: boolean;
}

export interface CopyRequest {
  source: string;
  destination: string;
}

export interface DeleteRequest {
  model: string;
}

export interface PullRequest {
  model: string;
  insecure?: boolean;
  stream?: boolean;
}

export interface PushRequest {
  model: string;
  insecure?: boolean;
  stream?: boolean;
}

export interface EmbedRequest {
  model: string;
  input: string | string[];
  truncate?: boolean;
  options?: Record<string, any>;
  keep_alive?: string;
}

// API Response Types
export interface GenerateResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
  done_reason?: string;
  context?: number[];
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface ChatResponse {
  model: string;
  created_at: string;
  message: OllamaMessage;
  done: boolean;
  done_reason?: string;
  total_duration?: number;
  load_duration?: number;
  prompt_eval_count?: number;
  prompt_eval_duration?: number;
  eval_count?: number;
  eval_duration?: number;
}

export interface CreateResponse {
  status: string;
  digest?: string;
  total?: number;
  completed?: number;
}

export interface ShowResponse {
  modelfile: string;
  parameters: string;
  template: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
  model_info: Record<string, any>;
  capabilities: string[];
}

export interface EmbedResponse {
  model: string;
  embeddings: number[][];
  total_duration: number;
  load_duration: number;
  prompt_eval_count: number;
}

export interface RunningModel {
  name: string;
  model: string;
  size: number;
  digest: string;
  details: {
    parent_model: string;
    format: string;
    family: string;
    families: string[];
    parameter_size: string;
    quantization_level: string;
  };
  expires_at: string;
  size_vram: number;
}

export interface VersionResponse {
  version: string;
}

export interface ListModelsResponse {
  models: OllamaModel[];
}

export interface ListRunningModelsResponse {
  models: RunningModel[];
}

export interface PullResponse {
  status: string;
  digest?: string;
  total?: number;
  completed?: number;
}

export interface PushResponse {
  status: string;
  digest?: string;
  total?: number;
  completed?: number;
}
