export interface McpToolParam {
  name: string
  type: 'string' | 'number' | 'boolean' | 'array'
  description: string
  required: boolean
}

export interface McpTool {
  id: string
  name: string
  description: string
  parameters: McpToolParam[]
}

export interface McpServerConfig {
  serverName: string
  serverVersion: string
  transportType: 'stdio' | 'sse'
  port?: number
  tools: McpTool[]
}
