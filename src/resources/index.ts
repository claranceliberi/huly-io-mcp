import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { HulyClient } from '../utils/huly-client.js';
import { logger } from '../utils/logger.js';

/**
 * Register all MCP resources with the server
 */
export async function registerResources(server: Server, hulyClient: HulyClient): Promise<void> {
  logger.info('Registering MCP resources...');
  
  // Task resources
  server.setRequestHandler('resources/list', async () => {
    return {
      resources: [
        {
          uri: 'huly://tasks',
          name: 'All Tasks',
          description: 'List all tasks in the workspace',
          mimeType: 'application/json',
        },
        {
          uri: 'huly://projects',
          name: 'Projects',
          description: 'List all projects in the workspace',
          mimeType: 'application/json',
        },
        {
          uri: 'huly://documents',
          name: 'Documents',
          description: 'List all documents in the workspace',
          mimeType: 'application/json',
        },
        {
          uri: 'huly://conversations',
          name: 'Conversations',
          description: 'List all conversations in the workspace',
          mimeType: 'application/json',
        },
      ],
    };
  });

  server.setRequestHandler('resources/read', async (request) => {
    const { uri } = request.params;
    
    try {
      if (uri.startsWith('huly://tasks')) {
        const tasks = await hulyClient.getTasks();
        return {
          contents: [
            {
              uri: uri,
              mimeType: 'application/json',
              text: JSON.stringify(tasks, null, 2),
            },
          ],
        };
      }
      
      if (uri.startsWith('huly://projects')) {
        const projects = await hulyClient.getProjects();
        return {
          contents: [
            {
              uri: uri,
              mimeType: 'application/json',
              text: JSON.stringify(projects, null, 2),
            },
          ],
        };
      }
      
      if (uri.startsWith('huly://documents')) {
        const documents = await hulyClient.getDocuments();
        return {
          contents: [
            {
              uri: uri,
              mimeType: 'application/json',
              text: JSON.stringify(documents, null, 2),
            },
          ],
        };
      }
      
      if (uri.startsWith('huly://conversations')) {
        const conversations = await hulyClient.getConversations();
        return {
          contents: [
            {
              uri: uri,
              mimeType: 'application/json',
              text: JSON.stringify(conversations, null, 2),
            },
          ],
        };
      }
      
      throw new Error(`Unknown resource URI: ${uri}`);
    } catch (error) {
      logger.error('Error reading resource:', error);
      throw error;
    }
  });
  
  logger.info('MCP resources registered successfully');
}