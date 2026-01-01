"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface McpConfigSnippetProps {
  apiKey: string;
  projectUrl: string;
}

export function McpConfigSnippet({
  apiKey,
  projectUrl,
}: McpConfigSnippetProps) {
  const [activeTab, setActiveTab] = useState<
    "cursor" | "claude" | "antigravity"
  >("cursor");
  const [copied, setCopied] = useState(false);

  const configs = {
    cursor: {
      title: "Cursor",
      config: JSON.stringify(
        {
          mcpServers: {
            "devcontext-ai": {
              transport: "http",
              url: `${projectUrl}/api/mcp/http`,
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            },
          },
        },
        null,
        2,
      ),
      instructions: [
        "Open Cursor Settings",
        "Navigate to MCP Servers section",
        "Add the configuration below",
        "Restart Cursor to apply changes",
      ],
    },
    claude: {
      title: "Claude Desktop",
      config: JSON.stringify(
        {
          mcpServers: {
            "devcontext-ai": {
              url: `${projectUrl}/api/mcp/http`,
              transport: "http",
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            },
          },
        },
        null,
        2,
      ),
      instructions: [
        "Locate your Claude Desktop config file:",
        "  • macOS: ~/Library/Application Support/Claude/claude_desktop_config.json",
        "  • Windows: %APPDATA%\\Claude\\claude_desktop_config.json",
        "  • Linux: ~/.config/Claude/claude_desktop_config.json",
        "Add the configuration below",
        "Restart Claude Desktop",
      ],
    },
    antigravity: {
      title: "Antigravity (Google Gemini)",
      config: JSON.stringify(
        {
          mcpServers: {
            "devcontext-ai": {
              serverUrl: `${projectUrl}/api/mcp/http`,
              headers: {
                Authorization: `Bearer ${apiKey}`,
              },
            },
          },
        },
        null,
        2,
      ),
      instructions: [
        "Edit ~/.gemini/antigravity/mcp_config.json",
        "Add the configuration below",
        "Restart Antigravity to apply changes",
        'Note: Antigravity uses "serverUrl" instead of "url" + "transport"',
      ],
    },
  };

  const currentConfig = configs[activeTab];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentConfig.config);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {(Object.keys(configs) as Array<keyof typeof configs>).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab
                ? "border-blue-600 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            }`}
          >
            {configs[tab].title}
          </button>
        ))}
      </div>

      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Setup Instructions
        </h4>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
          {currentConfig.instructions.map((instruction, index) => (
            <li key={index} className="pl-2">
              {instruction}
            </li>
          ))}
        </ol>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Configuration
          </h4>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {copied ? (
              <>
                <Check size={14} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy
              </>
            )}
          </button>
        </div>
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md overflow-x-auto text-sm">
          <code className="text-gray-800 dark:text-gray-200">
            {currentConfig.config}
          </code>
        </pre>
      </div>
    </div>
  );
}
