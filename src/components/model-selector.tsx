"use client";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { ChevronDownIcon, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { getModels } from "@/api/api";

interface ModelSelectorProps {
  selectedModel?: string;
  onModelChange?: (model: string) => void;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  const [models, setModels] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const fetchModels = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getModels();
      const modelNames = response.models?.map((model) => model.name) || [];
      setModels(modelNames);
      if (modelNames.length > 0 && !selectedModel) {
        onModelChange?.(modelNames[0]);
      }
    } catch (err) {
      setError("Failed to fetch models");
      console.error("Error fetching models:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
    // fetchModels is stable; we intentionally call once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleModelSelect = (model: string) => {
    onModelChange?.(model);
  };

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="cursor-pointer">
            {selectedModel || "Models"}
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start">
          {models.length === 0 && !isLoading && (
            <DropdownMenuItem disabled>No models found</DropdownMenuItem>
          )}
          {models.map((model) => (
            <DropdownMenuItem
              key={model}
              onClick={() => handleModelSelect(model)}
            >
              {model}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Button
        variant="ghost"
        size="icon"
        onClick={fetchModels}
        disabled={isLoading}
        className="h-8 w-8 cursor-pointer"
        title="Reload models"
      >
        <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
      </Button>
    </div>
  );
}
