#!/usr/bin/env node
import fs from 'fs';
import { Server } from '@modelcontextprotocol/sdk/server/index';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types';
import { FigmaClient } from './client/figma';

function loadConfig(): { figmaAccessToken: string } {
  const configArg = process.argv.find((arg) => arg.startsWith('--config='));
  if (configArg) {
    const configPath = configArg.split('=')[1];
    try {
      console.error('[MCP Debug] Loading config from:', configPath);
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const token = config.mcpServers?.figma?.env?.FIGMA_ACCESS_TOKEN;
      if (token) {
        console.error('[MCP Debug] Config loaded successfully');
        return { figmaAccessToken: token };
      }
    } catch (error) {
      console.error('[MCP Debug] Failed to load config:', error);
    }
  }

  console.error('[MCP Debug] Environment variables:', {
    FIGMA_ACCESS_TOKEN: process.env.FIGMA_ACCESS_TOKEN ? '***' : 'undefined',
    NODE_ENV: process.env.NODE_ENV,
    PATH: process.env.PATH,
  });

  const token = process.env.FIGMA_ACCESS_TOKEN;
  if (!token) {
    console.error('[MCP Debug] FIGMA_ACCESS_TOKEN not found');
    throw new Error(
      'FIGMA_ACCESS_TOKEN is required. Provide it via environment variable or config file.'
    );
  }

  console.error('[MCP Debug] Using FIGMA_ACCESS_TOKEN from environment');
  return { figmaAccessToken: token };
}

function getFigmaAccessToken(): string {
  const { figmaAccessToken } = loadConfig();
  console.error(
    '[MCP Debug] Access token found:',
    figmaAccessToken.substring(0, 8) + '...'
  );
  return figmaAccessToken;
}

class FigmaServer {
  private server: Server;
  private figmaClient: FigmaClient;

  constructor() {
    console.error('[MCP Debug] Initializing Figma MCP server');
    this.server = new Server(
      {
        name: 'figma-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.figmaClient = new FigmaClient(getFigmaAccessToken());
    this.setupToolHandlers();

    this.server.onerror = (error) => {
      console.error('[MCP Error]', {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
    };

    process.on('SIGINT', async () => {
      console.error('[MCP Debug] Shutting down server');
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    console.error('[MCP Debug] Setting up tool handlers');
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'list_files',
          description: 'List files in a project or team',
          inputSchema: {
            type: 'object',
            properties: {
              project_id: {
                type: 'string',
                description: 'Project ID to list files from',
              },
              team_id: {
                type: 'string',
                description: 'Team ID to list files from',
              },
            },
          },
        },
        {
          name: 'get_file_versions',
          description: 'Get version history of a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              file_key: {
                type: 'string',
                description: 'Figma file key',
              },
            },
            required: ['file_key'],
          },
        },
        {
          name: 'get_file_comments',
          description: 'Get comments on a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              file_key: {
                type: 'string',
                description: 'Figma file key',
              },
            },
            required: ['file_key'],
          },
        },
        {
          name: 'get_file_info',
          description: 'Get Figma file information',
          inputSchema: {
            type: 'object',
            properties: {
              file_key: {
                type: 'string',
                description: 'Figma file key',
              },
              depth: {
                type: 'number',
                description:
                  'Maximum depth to traverse the node tree (1-4 recommended)',
                minimum: 1,
              },
              node_id: {
                type: 'string',
                description: 'ID of a specific node to fetch',
              },
            },
            required: ['file_key'],
          },
        },
        {
          name: 'get_components',
          description: 'Get components from a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              file_key: {
                type: 'string',
                description: 'Figma file key',
              },
            },
            required: ['file_key'],
          },
        },
        {
          name: 'get_styles',
          description: 'Get styles from a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              file_key: {
                type: 'string',
                description: 'Figma file key',
              },
            },
            required: ['file_key'],
          },
        },
        {
          name: 'get_file_nodes',
          description: 'Get specific nodes from a Figma file',
          inputSchema: {
            type: 'object',
            properties: {
              file_key: {
                type: 'string',
                description: 'Figma file key',
              },
              ids: {
                type: 'array',
                items: {
                  type: 'string',
                },
                description: 'Array of node IDs to retrieve',
              },
            },
            required: ['file_key', 'ids'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      console.error('[MCP Request]', {
        tool: request.params.name,
        arguments: request.params.arguments,
      });

      try {
        switch (request.params.name) {
          case 'get_file_info': {
            const args = request.params.arguments as {
              file_key: string;
              depth?: number;
              node_id?: string;
            };
            if (!args.file_key) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'file_key is required'
              );
            }
            console.error('[MCP Debug] Fetching file info', {
              fileKey: args.file_key,
              depth: args.depth,
              nodeId: args.node_id,
            });
            const data = await this.figmaClient.getFileInfo(args.file_key, {
              depth: args.depth,
              node_id: args.node_id,
            });
            console.error('[MCP Debug] File info fetched successfully');

            try {
              const jsonString = JSON.stringify(data, null, 2);
              const sizeInMB = jsonString.length / (1024 * 1024);
              console.error(
                '[MCP Debug] Response size:',
                sizeInMB.toFixed(2),
                'MB'
              );

              return {
                content: [{ type: 'text', text: jsonString }],
              };
            } catch (error) {
              console.error('[MCP Debug] JSON stringify error:', error);
              const suggestion = args.node_id
                ? 'Try requesting a child node instead.'
                : 'Try using a smaller depth value or specifying a node_id.';
              throw new McpError(
                ErrorCode.InternalError,
                `Response size too large. ${suggestion}`
              );
            }
          }

          case 'get_components': {
            const args = request.params.arguments as { file_key: string };
            if (!args.file_key) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'file_key is required'
              );
            }
            console.error('[MCP Debug] Fetching components', {
              fileKey: args.file_key,
            });
            const data = await this.figmaClient.getComponents(args.file_key);
            console.error('[MCP Debug] Components fetched successfully');
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
          }

          case 'get_styles': {
            const args = request.params.arguments as { file_key: string };
            if (!args.file_key) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'file_key is required'
              );
            }
            console.error('[MCP Debug] Fetching styles', {
              fileKey: args.file_key,
            });
            const data = await this.figmaClient.getStyles(args.file_key);
            console.error('[MCP Debug] Styles fetched successfully');
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
          }

          case 'list_files': {
            const args = request.params.arguments as {
              project_id?: string;
              team_id?: string;
            };
            console.error('[MCP Debug] Listing files', args);
            const data = await this.figmaClient.listFiles(args);
            console.error('[MCP Debug] Files listed successfully');
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
          }

          case 'get_file_versions': {
            const args = request.params.arguments as { file_key: string };
            if (!args.file_key) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'file_key is required'
              );
            }
            console.error('[MCP Debug] Fetching file versions', {
              fileKey: args.file_key,
            });
            const data = await this.figmaClient.getFileVersions(args.file_key);
            console.error('[MCP Debug] File versions fetched successfully');
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
          }

          case 'get_file_comments': {
            const args = request.params.arguments as { file_key: string };
            if (!args.file_key) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'file_key is required'
              );
            }
            console.error('[MCP Debug] Fetching file comments', {
              fileKey: args.file_key,
            });
            const data = await this.figmaClient.getFileComments(args.file_key);
            console.error('[MCP Debug] File comments fetched successfully');
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
          }

          case 'get_file_nodes': {
            const args = request.params.arguments as {
              file_key: string;
              ids: string[];
            };
            if (!args.file_key) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'file_key is required'
              );
            }
            if (
              !args.ids ||
              !Array.isArray(args.ids) ||
              args.ids.length === 0
            ) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'ids array is required and must not be empty'
              );
            }
            console.error('[MCP Debug] Fetching file nodes', {
              fileKey: args.file_key,
              ids: args.ids,
            });
            const data = await this.figmaClient.getFileNodes(
              args.file_key,
              args.ids
            );
            console.error('[MCP Debug] File nodes fetched successfully');
            return {
              content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error: any) {
        console.error('[MCP Error]', {
          tool: request.params.name,
          arguments: request.params.arguments,
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        });

        if (error instanceof McpError) {
          throw error;
        }
        return {
          content: [
            {
              type: 'text',
              text: `Figma API error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Figma MCP server running on stdio');
  }
}

const server = new FigmaServer();
server.run().catch((error) => {
  console.error('[MCP Fatal Error]', {
    name: error.name,
    message: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
