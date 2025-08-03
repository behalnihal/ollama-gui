// API Configuration
export const API_BASE_URL = "http://localhost:11434";

// Utility function for making API requests
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(
          `Ollama API not found at ${API_BASE_URL}. Please make sure Ollama is running. You can start it by running 'ollama serve' in your terminal.`
        );
      }
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Cannot connect to Ollama at ${API_BASE_URL}. Please make sure Ollama is running. You can start it by running 'ollama serve' in your terminal.`
      );
    }
    throw error;
  }
}

// Utility function for streaming requests
export async function* streamRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): AsyncGenerator<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  let response: Response;

  try {
    response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        `Cannot connect to Ollama at ${API_BASE_URL}. Please make sure Ollama is running. You can start it by running 'ollama serve' in your terminal.`
      );
    }
    throw error;
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        `Ollama API not found at ${API_BASE_URL}. Please make sure Ollama is running. You can start it by running 'ollama serve' in your terminal.`
      );
    }
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`
    );
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("Response body is not readable");
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.trim()) {
          try {
            const data = JSON.parse(line);
            yield data as T;
          } catch (e) {
            console.warn("Failed to parse JSON from stream:", line);
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
