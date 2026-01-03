"use client";

import { useState, useEffect } from "react";
import { X, Copy, Check, AlertTriangle } from "lucide-react";

interface GenerateKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (
    name: string,
  ) => Promise<{ success: boolean; apiKey?: string; error?: string }>;
  initialName?: string;
}

export function GenerateKeyDialog({
  isOpen,
  onClose,
  onGenerate,
  initialName = "",
}: GenerateKeyDialogProps) {
  const [name, setName] = useState(initialName);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update name when initialName changes (for regenerate)
  useEffect(() => {
    if (initialName) {
      setName(initialName);
    }
  }, [initialName]);

  const handleGenerate = async () => {
    if (!name.trim()) {
      setError("Please enter a name for your API key");
      return;
    }

    setIsGenerating(true);
    setError(null);

    const result = await onGenerate(name.trim());

    setIsGenerating(false);

    if (result.success && result.apiKey) {
      setGeneratedKey(result.apiKey);
    } else {
      setError(result.error || "Failed to generate API key");
    }
  };

  const handleCopy = async () => {
    if (generatedKey) {
      await navigator.clipboard.writeText(generatedKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setName("");
    setGeneratedKey(null);
    setError(null);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {generatedKey ? "API Key Generated" : "Generate New API Key"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {!generatedKey ? (
            <>
              <div className="mb-4">
                <label
                  htmlFor="key-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Key Name
                </label>
                <input
                  id="key-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., My Cursor Integration"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isGenerating}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !name.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? "Generating..." : "Generate API Key"}
              </button>
            </>
          ) : (
            <>
              <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <div className="flex gap-2 mb-2">
                  <AlertTriangle
                    className="text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                    size={20}
                  />
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Save this key now!
                  </p>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  This is the only time you'll see this key. Make sure to copy
                  it and store it securely.
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your API Key
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={generatedKey}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Done
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
