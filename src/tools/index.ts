import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { HulyClient } from '../utils/huly-client.js';
import { logger } from '../utils/logger.js';
import { z } from 'zod';

/**
 * Register all MCP tools with the server
 */
export async function registerTools(server: Server, hulyClient: HulyClient): Promise<void> {
  logger.info('Registering MCP tools...');
  
  // List available tools
  server.setRequestHandler('tools/list', async () => {
    return {
      tools: [
        {
          name: 'create_task',
          description: 'Create a new task in Huly.io',
          inputSchema: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Task title' },
              description: { type: 'string', description: 'Task description' },
              projectId: { type: 'string', description: 'Project ID' },
              assigneeId: { type: 'string', description: 'Assignee user ID' },
              priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
              dueDate: { type: 'string', description: 'Due date (ISO format)' },
            },
            required: ['title', 'projectId'],
          },
        },
        {
          name: 'update_task',
          description: 'Update an existing task',
          inputSchema: {
            type: 'object',
            properties: {
              taskId: { type: 'string', description: 'Task ID to update' },
              title: { type: 'string', description: 'New task title' },
              description: { type: 'string', description: 'New task description' },
              status: { type: 'string', description: 'Task status' },
              assigneeId: { type: 'string', description: 'New assignee user ID' },
              priority: { type: 'string', enum: ['low', 'medium', 'high', 'urgent'] },
              dueDate: { type: 'string', description: 'New due date (ISO format)' },
            },
            required: ['taskId'],
          },
        },
        {
          name: 'create_document',
          description: 'Create a new document in Huly.io',
          inputSchema: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'Document title' },
              content: { type: 'string', description: 'Document content' },
              projectId: { type: 'string', description: 'Project ID' },
              template: { type: 'string', description: 'Document template to use' },
            },
            required: ['title', 'content'],
          },
        },
        {
          name: 'send_message',
          description: 'Send a message in a conversation',
          inputSchema: {
            type: 'object',
            properties: {
              conversationId: { type: 'string', description: 'Conversation ID' },
              message: { type: 'string', description: 'Message content' },
            },
            required: ['conversationId', 'message'],
          },
        },
      ],
    };
  });

  // Handle tool calls
  server.setRequestHandler('tools/call', async (request) => {
    const { name, arguments: args } = request.params;
    
    try {
      switch (name) {
        case 'create_task': {
          const taskData = z.object({
            title: z.string(),
            description: z.string().optional(),
            projectId: z.string(),
            assigneeId: z.string().optional(),
            priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
            dueDate: z.string().optional(),
          }).parse(args);
          
          const task = await hulyClient.createTask(taskData);
          return {
            content: [
              {
                type: 'text',
                text: `Task created successfully: ${task?.title || 'New Task'}`,
              },
            ],
          };
        }
        
        case 'update_task': {
          const updateData = z.object({
            taskId: z.string(),
            title: z.string().optional(),
            description: z.string().optional(),
            status: z.string().optional(),
            assigneeId: z.string().optional(),
            priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
            dueDate: z.string().optional(),
          }).parse(args);
          
          const { taskId, ...updates } = updateData;
          const task = await hulyClient.updateTask(taskId, updates);
          return {
            content: [
              {
                type: 'text',
                text: `Task updated successfully: ${task?.title || taskId}`,
              },
            ],
          };
        }
        
        case 'create_document': {
          const documentData = z.object({
            title: z.string(),
            content: z.string(),
            projectId: z.string().optional(),
            template: z.string().optional(),
          }).parse(args);
          
          const document = await hulyClient.createDocument(documentData);
          return {
            content: [
              {
                type: 'text',
                text: `Document created successfully: ${document?.title || 'New Document'}`,
              },
            ],
          };
        }
        
        case 'send_message': {
          const messageData = z.object({
            conversationId: z.string(),
            message: z.string(),
          }).parse(args);
          
          const message = await hulyClient.sendMessage(messageData.conversationId, messageData.message);
          return {
            content: [
              {
                type: 'text',
                text: `Message sent successfully to conversation ${messageData.conversationId}`,
              },
            ],
          };
        }
        
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      logger.error('Error executing tool:', error);
      throw error;
    }
  });
  
  logger.info('MCP tools registered successfully');
}