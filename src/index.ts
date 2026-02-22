#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { initClient } from "./client.js";
import { registerTools } from "./tools.js";

const server = new McpServer({
  name: "app-store-connect",
  version: "1.0.0",
});

// Register all tools
registerTools(server);

async function main() {
  // Initialize the App Store Connect client
  try {
    await initClient();
    console.error("App Store Connect client initialized successfully");
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Warning: ASC client init deferred — ${message}`);
    console.error(
      "Tools will fail until valid credentials are provided via environment variables."
    );
  }

  // Start stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("App Store Connect MCP server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
