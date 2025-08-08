"use client";

import { useState, useRef, useEffect } from "react";
import { MessageInput } from "@/components/message-input";
import { Button } from "@/components/ui/button";
import { Bot, User, Loader2, RefreshCw } from "lucide-react";
import {
  generateChatCompletionStream,
  createChatMessage,
  getModels,
} from "@/api/api";
import { OllamaMessage } from "@/types";
import { db } from "@/db/db";
import { useRouter } from "next/navigation";
import { ModelSelector } from "@/components/model-selector";
import { useChatContext } from "./chat-context";
import { Markdown } from "@/components/markdown";

interface PrebuiltMessage {
  id: string;
  prompt: string;
}

const prebuiltMessages: PrebuiltMessage[] = [
  {
    id: "creative-story",
    prompt:
      "I'd like to write a creative story. Can you help me brainstorm ideas and develop characters?",
  },
  {
    id: "technical-coding",
    prompt:
      "I need help with coding. Can you explain this concept and help me debug my code?",
  },
  {
    id: "education-learning",
    prompt:
      "I'm trying to learn about a new topic. Can you explain it in simple terms with examples?",
  },
  {
    id: "lifestyle-project",
    prompt:
      "I need to brainstorm some ideas for a project. Can you help me think through different approaches?",
  },
  {
    id: "creative-data",
    prompt:
      "I have some data I need to analyze. Can you help me understand the patterns and draw insights?",
  },
  {
    id: "creative-language",
    prompt:
      "I'm learning a new language. Can you help me practice and improve my skills?",
  },
  {
    id: "creative-design",
    prompt:
      "I'm working on a design project. Can you give me some creative inspiration and ideas?",
  },
  {
    id: "lifestyle-productivity",
    prompt:
      "I want to improve my productivity. Can you share some time management and efficiency tips?",
  },
];

const categories = [
  { name: "Creative", value: "Creative" },
  { name: "Technical", value: "Technical" },
  { name: "Education", value: "Education" },
  { name: "Lifestyle", value: "Lifestyle" },
];

interface ChatProps {
  chatId?: string;
}

export function Chat({ chatId }: ChatProps) {
  const router = useRouter();
  const { refreshChats } = useChatContext();
  const [selectedCategory, setSelectedCategory] = useState("Creative");
  const [messages, setMessages] = useState<OllamaMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState("");
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [copiedMessageIndex, setCopiedMessageIndex] = useState<number | null>(
    null
  );
  const [isStreaming, setIsStreaming] = useState(false);
  const [isCreatingNewChat, setIsCreatingNewChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredMessages = prebuiltMessages.filter((msg) => {
    if (selectedCategory === "Creative") {
      return msg.id.startsWith("creative-");
    } else if (selectedCategory === "Technical") {
      return msg.id.startsWith("technical-");
    } else if (selectedCategory === "Education") {
      return msg.id.startsWith("education-");
    } else if (selectedCategory === "Lifestyle") {
      return msg.id.startsWith("lifestyle-");
    }
    return false;
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Debug: Monitor messages state changes
  useEffect(() => {
    console.log("Messages state changed:", messages.length, "messages");
  }, [messages]);

  // Debug: Monitor currentChatId changes
  useEffect(() => {
    console.log("Current chat ID changed:", currentChatId);
  }, [currentChatId]);

  // Debug: Monitor loading states
  useEffect(() => {
    console.log(
      "Loading states - isLoading:",
      isLoading,
      "isStreaming:",
      isStreaming,
      "isLoadingChat:",
      isLoadingChat
    );
  }, [isLoading, isStreaming, isLoadingChat]);

  // Load available models
  useEffect(() => {
    const loadModels = async () => {
      try {
        const response = await getModels();
        const modelNames = response.models?.map((model) => model.name) || [];
        setAvailableModels(modelNames);

        // Set the first available model as default if no model is selected
        if (modelNames.length > 0 && !selectedModel) {
          setSelectedModel(modelNames[0]);
        }
      } catch (error) {
        console.error("Error loading models:", error);
      }
    };

    loadModels();
  }, [selectedModel]);

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
  };

  // Load existing chat if chatId is provided
  useEffect(() => {
    if (chatId && !isCreatingNewChat && !isLoading) {
      setIsLoadingChat(true);
      loadChat(parseInt(chatId));
    }
  }, [chatId, isCreatingNewChat, isLoading]);

  const loadChat = async (id: number) => {
    try {
      const chat = await db.chats.get(id);
      if (chat) {
        setCurrentChatId(id);
        setSelectedModel(chat.model);

        // Load messages for this chat
        const chatMessages = await db.messages
          .where("chatId")
          .equals(id)
          .sortBy("createdAt");

        const ollamaMessages: OllamaMessage[] = chatMessages.map((msg) => ({
          role: msg.role as "user" | "assistant",
          content: msg.content,
        }));

        // Only set messages if we're not currently loading or streaming
        if (!isLoading && !isStreaming) {
          setMessages(ollamaMessages);
        }
      }
    } catch (error) {
      console.error("Error loading chat:", error);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const createNewChat = async (model: string, firstMessage: string) => {
    try {
      setIsCreatingNewChat(true);
      const chatName =
        firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");
      const newChatId = await db.chats.add({
        name: chatName,
        model: model,
        createdAt: new Date(),
      });

      const chatIdNumber = newChatId as number;
      setCurrentChatId(chatIdNumber);

      // Save the first message
      await db.messages.add({
        chatId: chatIdNumber,
        role: "user",
        content: firstMessage,
        createdAt: new Date(),
      });

      // Notify parent component to refresh chat list
      try {
        if (typeof refreshChats === "function") {
          refreshChats();
        }
      } catch (error) {
        console.warn("Could not refresh chat list:", error);
      }

      return chatIdNumber;
    } catch (error) {
      console.error("Error creating new chat:", error);
      throw error;
    } finally {
      setIsCreatingNewChat(false);
    }
  };

  const saveMessage = async (
    role: "user" | "assistant",
    content: string,
    forcedChatId?: number | null
  ) => {
    const effectiveChatId = forcedChatId ?? currentChatId;
    if (!effectiveChatId) return;

    try {
      await db.messages.add({
        chatId: effectiveChatId,
        role: role,
        content: content,
        createdAt: new Date(),
      });

      // Update chat timestamp so recent chats reflect latest activity
      await db.chats.update(effectiveChatId, { createdAt: new Date() });

      // Notify chat list to refresh recents ordering
      try {
        if (typeof refreshChats === "function") {
          refreshChats();
        }
      } catch (e) {
        console.warn("Could not refresh chat list after save:", e);
      }
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Check if we have a valid model selected
    if (!selectedModel || selectedModel.trim() === "") {
      const errorMessage = createChatMessage(
        "assistant",
        "No model selected. Please select a model from the dropdown."
      );
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    const userMessage = createChatMessage("user", content);
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsStreaming(false);

    try {
      let chatId = currentChatId;
      let isNewChat = false;

      // Create new chat if this is the first message
      if (!chatId) {
        setIsCreatingNewChat(true);
        chatId = await createNewChat(selectedModel, content);
        isNewChat = true;
      } else {
        // Save user message to existing chat
        await saveMessage("user", content, chatId);
      }

      const stream = generateChatCompletionStream({
        model: selectedModel,
        messages: [...messages, userMessage],
        stream: true,
      });

      let assistantMessage = createChatMessage("assistant", "");
      let hasContent = false;

      for await (const chunk of stream) {
        if (chunk.message?.content) {
          assistantMessage.content += chunk.message.content;
          if (!hasContent) {
            // Add the assistant message to state only when it first gets content
            console.log(
              "Adding assistant message to state:",
              assistantMessage.content
            );
            setMessages((prev) => [...prev, { ...assistantMessage }]);
            hasContent = true;
            setIsStreaming(true); // Start streaming indicator
          } else {
            // Update the existing assistant message using functional update
            console.log(
              "Updating assistant message:",
              assistantMessage.content
            );
            setMessages((prev) => {
              const newMessages = [...prev];
              if (newMessages.length > 0) {
                newMessages[newMessages.length - 1] = { ...assistantMessage };
              }
              return newMessages;
            });
          }
        }
      }

      console.log(
        "Streaming complete. Final assistant message:",
        assistantMessage.content
      );

      // Ensure we have a valid assistant message before saving
      if (assistantMessage.content.trim()) {
        // Save assistant message
        await saveMessage("assistant", assistantMessage.content, chatId);

        // Navigate using Next router so sidebar pathname and UI update properly
        if (isNewChat && chatId) {
          router.push(`/chat/${chatId}`);
        }
      } else {
        // If no content was received, add an error message
        console.warn("No content received from streaming response");
        const errorMessage = createChatMessage(
          "assistant",
          "Sorry, I didn't receive a response. Please try again."
        );
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = createChatMessage(
        "assistant",
        `Sorry, I encountered an error: ${
          error instanceof Error ? error.message : "Unknown error"
        }. Please try again.`
      );
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handlePrebuiltMessageSelect = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    router.push("/");
  };

  const renderMessage = (message: OllamaMessage, index: number) => {
    const isUser = message.role === "user";
    const isAssistant = message.role === "assistant";

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(message.content);
        setCopiedMessageIndex(index);
        setTimeout(() => setCopiedMessageIndex(null), 2000); // Hide after 2 seconds
      } catch (error) {
        console.error("Failed to copy message:", error);
      }
    };

    return (
      <div
        key={index}
        className={`group flex ${isUser ? "justify-end" : "justify-start"} p-4`}
      >
        <div className="max-w-[80%]">
          <div
            className={`rounded-lg p-4 ${
              isUser ? "bg-primary text-primary-foreground" : "bg-muted border"
            }`}
          >
            <Markdown>{message.content}</Markdown>
          </div>
          {/* Hover-only metadata */}
          <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <span className="text-xs text-muted-foreground">
              {isAssistant && selectedModel && (
                <span className="ml-2">{selectedModel}</span>
              )}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              {copiedMessageIndex === index ? (
                <svg
                  className="w-3 h-3 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const TypingIndicator = () => (
    <div className="group flex justify-start p-4">
      <div className="max-w-[80%]">
        <div className="rounded-lg p-4 bg-muted border">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
            </div>
          </div>
        </div>
        {/* Hover-only metadata for typing indicator */}
        <div className="flex items-center justify-between mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-xs text-muted-foreground">{selectedModel}</span>
        </div>
      </div>
    </div>
  );

  // Show welcome screen if no messages
  if (messages.length === 0 && !isLoadingChat) {
    return (
      <div className="flex flex-col h-full">
        {/* Welcome Section */}
        <div className="flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full">
          <h1 className="text-2xl font-bold">How Can I Help You ?</h1>
        </div>
        <div className="flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full flex-1">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {categories.map((category) => (
              <Button
                key={category.value}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="rounded-full cursor-pointer"
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Prebuilt Messages Grid */}
          <div className="grid grid-cols-1 gap-2">
            {filteredMessages.map((message) => (
              <Button
                key={message.id}
                variant="ghost"
                size="sm"
                className="border-b cursor-pointer text-sm"
                onClick={() => handlePrebuiltMessageSelect(message.prompt)}
              >
                {message.prompt}
              </Button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="mt-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isLoading}
            initialValue={selectedPrompt}
            selectedModel={selectedModel}
            onModelChange={handleModelChange}
          />
        </div>
      </div>
    );
  }

  // Show loading indicator if chatId is provided but messages haven't loaded
  if (isLoadingChat) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground mt-4">Loading chat...</p>
      </div>
    );
  }

  // Show chat interface
  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => renderMessage(message, index))}
          {isLoading && !isStreaming && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="mt-auto relative bg-background/60 backdrop-blur-lg">
        <MessageInput
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          initialValue={selectedPrompt}
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
      </div>
    </div>
  );
}
