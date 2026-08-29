import test from 'node:test'
import assert from 'node:assert'
import { generateMcpServerCode, generateMcpManifest, generateClaudeDesktopConfig } from '../src/generator.ts'
import type { McpServerConfig } from '../src/types.ts'

const testConfig: McpServerConfig = {
  serverName: 'test-mcp-server',
  serverVersion: '1.0.0',
  transportType: 'stdio',
  tools: [
    {
      id: 'tool1',
      name: 'fetch_data',
      description: 'Fetches sample data from an API endpoint.',
      parameters: [
        { name: 'endpoint', type: 'string', description: 'API URL', required: true },
        { name: 'timeoutMs', type: 'number', description: 'Timeout in ms', required: false },
      ],
    },
  ],
}

test('generateMcpManifest produces valid JSON with tool inputSchema', () => {
  const jsonStr = generateMcpManifest(testConfig)
  const parsed = JSON.parse(jsonStr)

  assert.strictEqual(parsed.name, 'test-mcp-server')
  assert.strictEqual(parsed.tools.length, 1)
  assert.strictEqual(parsed.tools[0].name, 'fetch_data')
  assert.deepStrictEqual(parsed.tools[0].inputSchema.required, ['endpoint'])
})

test('generateMcpServerCode creates valid TypeScript server structure', () => {
  const tsCode = generateMcpServerCode(testConfig)

  assert.ok(tsCode.includes("import { Server } from '@modelcontextprotocol/sdk/server/index.js'"))
  assert.ok(tsCode.includes("case 'fetch_data':"))
  assert.ok(tsCode.includes('ListToolsRequestSchema'))
  assert.ok(tsCode.includes('CallToolRequestSchema'))
})

test('generateClaudeDesktopConfig produces valid config structure', () => {
  const configStr = generateClaudeDesktopConfig(testConfig)
  const parsed = JSON.parse(configStr)

  assert.ok(parsed.mcpServers['test-mcp-server'])
  assert.strictEqual(parsed.mcpServers['test-mcp-server'].command, 'node')
})
