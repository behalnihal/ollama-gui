import { useEffect, useState } from "react";

export function ModelSelector() {
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/ollama/models")
      .then((res) => res.json())
      .then((data) => setAvailableModels(data));
  }, []);
}
