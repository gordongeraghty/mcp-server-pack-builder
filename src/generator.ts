import type { McpServerConfig } from './types.ts'

/**
 * Generates an MCP manifest JSON string.
 */
export function generateMcpManifest(config: McpServerConfig): string {
  const toolList = config.tools.map((t) => {
    const properties: Record<string, any> = {}
    const required: string[] = []
    t.parameters.forEach((p) => {
      properties[p.name] = { type: p.type, description: p.description }
      if (p.required) required.push(p.name)
    })

    return {
      name: t.name,
      description: t.description,
      inputSchema: {
        type: 'object',
        properties,
        required,
      },
    }
  })

  const manifest = {
    name: config.serverName,
    version: config.serverVersion,
    transport: config.transportType,
    tools: toolList,
  }

  return JSON.stringify(manifest, null, 2)
}

/**
 * Generates TypeScript server boilerplate using @modelcontextprotocol/sdk.
 */
export function generateMcpServerCode(config: McpServerConfig): string {
  const toolsJson = JSON.stringify(
    config.tools.map((t) => ({
      name: t.name,
      description: t.description,
      inputSchema: {
        type: 'object',
        properties: t.parameters.reduce((acc, p) => {
          acc[p.name] = { type: p.type, description: p.description }
          return acc
        }, {} as Record<string, any>),
        required: t.parameters.filter((p) => p.required).map((p) => p.name),
      },
    })),
    null,
    4
  )

  const toolHandlers = config.tools
    .map(
      (t) => `    case '${t.name}': {
      // Logic implementation for ${t.name}
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ success: true, tool: '${t.name}', args }),
          },
        ],
      };
    }`
    )
    .join('\n')

  return `import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

/**
 * Model Context Protocol (MCP) Server: ${config.serverName}
 */
const server = new Server(
  {
    name: '${config.serverName}',
    version: '${config.serverVersion}',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. List Available Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: ${toolsJson},
  };
});

// 2. Handle Tool Calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
${toolHandlers}
    default:
      throw new Error(\`Unknown MCP tool: \${name}\`);
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('${config.serverName} running on stdio');
}

run().catch((err) => {
  console.error('Fatal MCP Server Error:', err);
  process.exit(1);
});
`
}

/**
 * Generates Claude Desktop configuration JSON.
 */
export function generateClaudeDesktopConfig(config: McpServerConfig): string {
  const snippet = {
    mcpServers: {
      [config.serverName]: {
        command: 'node',
        args: [`/path/to/${config.serverName}/dist/index.js`],
        env: {
          NODE_ENV: 'production',
        },
      },
    },
  }
  return JSON.stringify(snippet, null, 2)
}
