import { readFileSync } from 'fs';
import { z } from 'zod';
import { logger } from './logger.js';

const ConfigSchema = z.object({
  huly: z.object({
    endpoint: z.string().url(),
    workspace: z.string(),
    auth: z.union([
      z.object({
        method: z.literal('token'),
        token: z.string(),
      }),
      z.object({
        method: z.literal('credentials'),
        email: z.string().email(),
        password: z.string(),
      }),
    ]),
  }),
  mcp: z.object({
    server: z.object({
      name: z.string(),
      version: z.string(),
    }),
    logging: z.object({
      level: z.string().default('info'),
      file: z.string().optional(),
    }),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;

export async function loadConfig(): Promise<Config> {
  const configPath = process.env.CONFIG_PATH || './config.json';
  
  try {
    const configData = readFileSync(configPath, 'utf-8');
    const config = JSON.parse(configData);
    
    const validatedConfig = ConfigSchema.parse(config);
    logger.info('Configuration loaded successfully');
    
    return validatedConfig;
  } catch (error) {
    logger.error('Failed to load configuration:', error);
    throw new Error('Configuration validation failed');
  }
}