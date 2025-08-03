"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ModelSelector } from "./model-selector";

interface MessageInputProps {
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  disabled?: boolean;
  initialValue?: string;
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

export function MessageInput({
  onSendMessage,
  placeholder = "Ask me anything...",
  disabled = false,
  initialValue = "",
  selectedModel,
  onModelChange,
}: MessageInputProps) {
  const [message, setMessage] = useState(initialValue);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Update message when initialValue changes
  useEffect(() => {
    setMessage(initialValue);
  }, [initialValue]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSendMessage = () => {
    if (message.trim() && !disabled) {
      onSendMessage?.(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  return (
    <div className="sticky bottom-0 z-10 flex justify-center">
      <div className="relative w-full max-w-2xl">
        <div className="relative flex flex-col border border-border rounded-xl bg-card">
          <div className="overflow-y-auto">
            <Textarea
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              style={{ overflow: "hidden" }}
              className="w-full resize-none bg-transparent border-none focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground align-top leading-normal min-h-[60px] text-foreground"
              placeholder={placeholder}
              disabled={disabled}
            />
          </div>
          <div className="h-12">
            <div className="absolute left-3 right-3 bottom-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ModelSelector
                  selectedModel={selectedModel}
                  onModelChange={onModelChange}
                />
                {/* TODO: Add file upload */}
                {/* <Button
                  variant="outline"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground h-8 w-8 cursor-pointer"
                  aria-label="Attach file"
                  type="button"
                  disabled={disabled}
                >
                  <svg
                    className="w-3.5 h-3.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth={2}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                    height={14}
                    width={14}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                </Button> */}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary hover:text-primary/80 h-8 w-8 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Send message"
                type="button"
                onClick={handleSendMessage}
                disabled={!message.trim() || disabled}
              >
                <svg
                  className="w-5 h-5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  strokeWidth={2}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                  height={20}
                  width={20}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle r={10} cy={12} cx={12} />
                  <path d="m16 12-4-4-4 4" />
                  <path d="M12 16V8" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
