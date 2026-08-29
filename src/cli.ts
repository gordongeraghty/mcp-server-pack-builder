#!/usr/bin/env node

import { generateMcpServerCode, generateMcpManifest, generateClaudeDesktopConfig } from './generator.ts'
import type { McpServerConfig } from './types.ts'

function run() {
  const sampleConfig: McpServerConfig = {
    serverName: 'marketing-analytics-mcp',
    serverVersion: '1.0.0',
    transportType: 'stdio',
    tools: [
      {
        id: 't1',
        name: 'query_google_ads_gaql',
        description: 'Executes a Google Ads Query Language (GAQL) query.',
        parameters: [
          { name: 'query', type: 'string', description: 'GAQL query string', required: true },
          { name: 'customerId', type: 'string', description: 'Google Ads CID', required: true },
        ],
      },
      {
        id: 't2',
        name: 'audit_page_meta_tags',
        description: 'Extracts title, description, and canonical tags from target URL.',
        parameters: [
          { name: 'url', type: 'string', description: 'Target URL', required: true },
        ],
      },
    ],
  }

  console.log('=== MCP Server TypeScript Code ===\n')
  console.log(generateMcpServerCode(sampleConfig))
  console.log('\n=== Claude Desktop Config ===\n')
  console.log(generateClaudeDesktopConfig(sampleConfig))
}

run()
