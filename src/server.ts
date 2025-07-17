#!/usr/bin/env node

/**
 * Huly.io MCP Server
 * 
 * A Model Context Protocol server for Huly.io integration.
 * Enables AI assistants to interact with Huly's project management,
 * chat, and document features.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { logger } from './utils/logger.js';
import { HulyClient } from './utils/huly-client.js';
import { loadConfig } from './utils/config.js';
import { registerResources } from './resources/index.js';
import { registerTools } from './tools/index.js';
import { registerPrompts } from './prompts/index.js';

async function main(): Promise<void> {
  try {
    // Load configuration
    const config = await loadConfig();
    
    // Initialize Huly client
    const hulyClient = new HulyClient(config.huly);
    await hulyClient.connect();
    
    // Create MCP server
    const server = new Server(
      {
        name: config.mcp.server.name,
        version: config.mcp.server.version,
      },
      {
        capabilities: {
          resources: {},
          tools: {},
          prompts: {},
          logging: {},
        },
      }
    );

    // Register resources, tools, and prompts
    await registerResources(server, hulyClient);
    await registerTools(server, hulyClient);
    await registerPrompts(server, hulyClient);

    // Error handling
    server.onerror = (error) => {
      logger.error('MCP Server error:', error);
    };

    process.on('SIGINT', async () => {
      logger.info('Received SIGINT, shutting down gracefully...');
      await hulyClient.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      logger.info('Received SIGTERM, shutting down gracefully...');
      await hulyClient.disconnect();
      process.exit(0);
    });

    // Start server
    const transport = new StdioServerTransport();
    await server.connect(transport);
    
    logger.info('Huly.io MCP Server started successfully');
    
  } catch (error) {
    logger.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch((error) => {
  logger.error('Unhandled error:', error);
  process.exit(1);
});