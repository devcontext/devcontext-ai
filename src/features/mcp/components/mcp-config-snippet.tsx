"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/features/shared/ui/button";
import { useToast } from "@/features/shared/hooks/use-toast";
import { cn } from "@/lib/utils";

interface McpConfigSnippetProps {
  accessToken: string;
}

const projectUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function McpConfigSnippet({ accessToken }: McpConfigSnippetProps) {
  const { toast } = useToast();
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
              url: `${projectUrl}/api/mcp/http`,
              transport: "http",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
          },
        },
        null,
        2,
      ),
      instructions: [
        "Open Cursor Settings (Cmd/Ctrl + ,)",
        "Navigate to 'Features' → 'Model Context Protocol'",
        "Click 'Edit Config'",
        "Add the configuration below to the mcpServers object",
        "Save and restart Cursor",
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
                Authorization: `Bearer ${accessToken}`,
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
        "Add the configuration below to the file",
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
                Authorization: `Bearer ${accessToken}`,
              },
            },
          },
        },
        null,
        2,
      ),
      instructions: [
        "Edit ~/.gemini/antigravity/mcp_config.json",
        "Add the configuration below to the mcpServers object",
        "Save the file",
        "Restart Antigravity",
        'Note: Antigravity uses "serverUrl" instead of "url" + "transport"',
      ],
    },
  };

  const currentConfig = configs[activeTab];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentConfig.config);
    setCopied(true);
    toast({
      title: "Config copied",
      description: "MCP configuration copied to clipboard.",
      variant: "success",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border">
        {(Object.keys(configs) as Array<keyof typeof configs>).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 font-medium text-sm border-b-2 transition-all -mb-0.5 cursor-pointer",
              activeTab === tab
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {configs[tab].title}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">
          Setup Instructions
        </h4>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground bg-muted/30 p-4 rounded-lg border border-border/50">
          {currentConfig.instructions.map((instruction, index) => (
            <li key={index} className="pl-1">
              {instruction}
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">
            Configuration Snippet
          </h4>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleCopy}
            className="h-8 gap-2"
          >
            {copied ? (
              <>
                <Check size={14} />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy JSON
              </>
            )}
          </Button>
        </div>
        <div className="relative group">
          <pre className="p-4 bg-muted/50 border border-border rounded-xl overflow-x-auto text-xs font-mono leading-relaxed max-h-[400px]">
            <code className="text-foreground/90">{currentConfig.config}</code>
          </pre>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
            >
              <Copy size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
