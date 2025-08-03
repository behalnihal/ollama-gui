import {
  Model,
  ListModelsResponse,
  OllamaModel,
  OllamaMessage,
  OllamaToolCall,
  OllamaTool,
  GenerateRequest,
  GenerateResponse,
  ChatRequest,
  ChatResponse,
  CreateRequest,
  CreateResponse,
  ShowRequest,
  ShowResponse,
  CopyRequest,
  DeleteRequest,
  PullRequest,
  PushRequest,
  EmbedRequest,
  EmbedResponse,
  RunningModel,
  ListRunningModelsResponse,
  VersionResponse,
  PullResponse,
  PushResponse,
} from "@/types";
import { apiRequest, streamRequest, API_BASE_URL } from "./config";

// Legacy function for backward compatibility
export type showModelInfoRequest = {
  name: string;
};

export type showModelInfoResponse = {
  license: string;
  modelfile: string;
  parameters: string;
  template: string;
};

// Model Management
export async function getModels(): Promise<ListModelsResponse> {
  return apiRequest<ListModelsResponse>("/api/tags");
}

export async function showModel(request: ShowRequest): Promise<ShowResponse> {
  return apiRequest<ShowResponse>("/show", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function createModel(
  request: CreateRequest
): Promise<CreateResponse> {
  return apiRequest<CreateResponse>("/create", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function createModelStream(
  request: CreateRequest
): AsyncGenerator<CreateResponse> {
  return streamRequest<CreateResponse>("/create", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function copyModel(request: CopyRequest): Promise<void> {
  await apiRequest("/copy", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function deleteModel(request: DeleteRequest): Promise<void> {
  await apiRequest("/delete", {
    method: "DELETE",
    body: JSON.stringify(request),
  });
}

// Model Operations
export async function pullModel(
  request: PullRequest
): Promise<{ status: string }> {
  return apiRequest<{ status: string }>("/pull", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function pullModelStream(
  request: PullRequest
): AsyncGenerator<PullResponse> {
  return streamRequest<PullResponse>("/pull", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export async function pushModel(
  request: PushRequest
): Promise<{ status: string }> {
  return apiRequest<{ status: string }>("/push", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function pushModelStream(
  request: PushRequest
): AsyncGenerator<PushResponse> {
  return streamRequest<PushResponse>("/push", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

// Text Generation
export async function generateCompletion(
  request: GenerateRequest
): Promise<GenerateResponse> {
  return apiRequest<GenerateResponse>("/api/generate", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function generateCompletionStream(
  request: GenerateRequest
): AsyncGenerator<GenerateResponse> {
  return streamRequest<GenerateResponse>("/api/generate", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

// Chat Completion
export async function generateChatCompletion(
  request: ChatRequest
): Promise<ChatResponse> {
  return apiRequest<ChatResponse>("/api/chat", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

export function generateChatCompletionStream(
  request: ChatRequest
): AsyncGenerator<ChatResponse> {
  return streamRequest<ChatResponse>("/api/chat", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

// Embeddings
export async function generateEmbeddings(
  request: EmbedRequest
): Promise<EmbedResponse> {
  return apiRequest<EmbedResponse>("/embed", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

// System Information
export async function getRunningModels(): Promise<ListRunningModelsResponse> {
  return apiRequest<ListRunningModelsResponse>("/ps");
}

export async function getVersion(): Promise<VersionResponse> {
  return apiRequest<VersionResponse>("/version");
}

// Blob Operations
export async function checkBlobExists(digest: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/blobs/${digest}`, {
      method: "HEAD",
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function pushBlob(digest: string, file: File): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/blobs/${digest}`, {
    method: "POST",
    body: file,
  });

  if (!response.ok) {
    throw new Error(
      `Failed to push blob: ${response.status} ${response.statusText}`
    );
  }
}

// Helper Functions
export async function loadModel(model: string): Promise<void> {
  await generateCompletion({ model, prompt: "" });
}

export async function unloadModel(model: string): Promise<void> {
  await generateCompletion({ model, prompt: "", keep_alive: "0" });
}

export async function loadModelForChat(model: string): Promise<void> {
  await generateChatCompletion({ model, messages: [] });
}

export async function unloadModelForChat(model: string): Promise<void> {
  await generateChatCompletion({ model, messages: [], keep_alive: "0" });
}

export function createChatMessage(
  role: OllamaMessage["role"],
  content: string,
  images?: string[]
): OllamaMessage {
  return {
    role,
    content,
    ...(images && { images }),
  };
}

export function createToolCallMessage(
  toolCalls: OllamaToolCall[]
): OllamaMessage {
  return {
    role: "assistant",
    content: "",
    tool_calls: toolCalls,
  };
}

export function createToolResultMessage(
  toolName: string,
  content: string
): OllamaMessage {
  return {
    role: "tool",
    content,
    tool_name: toolName,
  };
}

// Legacy function for backward compatibility
const getBaseUrl = (path: string) => {
  return `${API_BASE_URL}${path}`;
};
