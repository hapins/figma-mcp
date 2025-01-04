const mockErrorCode = {
  InvalidParams: 'INVALID_PARAMS',
  MethodNotFound: 'METHOD_NOT_FOUND',
} as const;

const mockMcpError = class extends Error {
  constructor(public code: string, message: string) {
    super(message);
  }
};

const mockCallToolRequestSchema = Symbol('CallToolRequestSchema');
const mockListToolsRequestSchema = Symbol('ListToolsRequestSchema');

jest.mock('@modelcontextprotocol/sdk/types', () => ({
  ErrorCode: mockErrorCode,
  McpError: mockMcpError,
  CallToolRequestSchema: mockCallToolRequestSchema,
  ListToolsRequestSchema: mockListToolsRequestSchema,
}));
import { FigmaClient } from '../client/figma';
import { DocumentNode } from '../types/figma';

jest.mock('../client/figma');

const mockServer = {
  setRequestHandler: jest.fn().mockReturnThis(),
  connect: jest.fn(),
  close: jest.fn(),
  onerror: jest.fn(),
};

jest.mock('@modelcontextprotocol/sdk/server/index', () => ({
  Server: jest.fn().mockImplementation(() => mockServer),
}));

jest.mock('@modelcontextprotocol/sdk/server/stdio', () => ({
  StdioServerTransport: jest.fn(),
}));

describe('FigmaServer', () => {
  const mockAccessToken = 'mock-token';
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = process.env;
    process.env = { ...originalEnv, FIGMA_ACCESS_TOKEN: mockAccessToken };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should throw error if FIGMA_ACCESS_TOKEN is not provided', () => {
      delete process.env.FIGMA_ACCESS_TOKEN;
      jest.isolateModules(() => {
        expect(() => {
          require('../index');
        }).toThrow(
          'FIGMA_ACCESS_TOKEN is required. Provide it via environment variable or config file.'
        );
      });
    });

    it('should initialize server with correct config', () => {
      const { Server } = require('@modelcontextprotocol/sdk/server/index');
      jest.isolateModules(() => {
        require('../index');
      });
      expect(Server).toHaveBeenCalledWith(
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
    });

    it('should initialize FigmaClient with access token', () => {
      jest.isolateModules(() => {
        require('../index');
      });
      expect(FigmaClient).toHaveBeenCalledWith(mockAccessToken);
    });
  });

  describe('tool handlers', () => {
    let mockFigmaClient: jest.Mocked<FigmaClient>;

    beforeEach(() => {
      mockFigmaClient = {
        getFileInfo: jest.fn(),
      } as unknown as jest.Mocked<FigmaClient>;

      (FigmaClient as jest.Mock).mockImplementation(() => mockFigmaClient);

      // Initialize server with mock handlers
      jest.isolateModules(() => {
        require('../index');
      });
    });

    it('should handle get_file_info tool', async () => {
      const mockFileData = {
        document: {
          id: 'doc-1',
          name: 'Test',
          type: 'DOCUMENT',
          children: [],
        } as DocumentNode,
      };
      mockFigmaClient.getFileInfo.mockResolvedValueOnce(mockFileData);

      const request = {
        params: {
          name: 'get_file_info',
          arguments: {
            file_key: 'file-1',
            depth: 2,
          },
        },
      };

      const handlers = mockServer.setRequestHandler.mock.calls;
      const [schema, handler] =
        handlers.find(([s]) => s === mockCallToolRequestSchema) || [];

      if (!handler) {
        throw new Error('Handler not found');
      }

      const response = await handler(request);
      expect(response).toEqual({
        content: [
          { type: 'text', text: JSON.stringify(mockFileData, null, 2) },
        ],
      });
    });

    it('should handle errors', async () => {
      mockFigmaClient.getFileInfo.mockRejectedValueOnce(new Error('API Error'));

      const request = {
        params: {
          name: 'get_file_info',
          arguments: {
            file_key: 'file-1',
          },
        },
      };

      const handlers = mockServer.setRequestHandler.mock.calls;
      const [schema, handler] =
        handlers.find(([s]) => s === mockCallToolRequestSchema) || [];

      if (!handler) {
        throw new Error('Handler not found');
      }

      const response = await handler(request);
      expect(response).toEqual({
        content: [{ type: 'text', text: 'Figma API error: API Error' }],
        isError: true,
      });
    });

    it('should validate required parameters', async () => {
      const request = {
        params: {
          name: 'get_file_info',
          arguments: {},
        },
      };

      const handlers = mockServer.setRequestHandler.mock.calls;
      const [schema, handler] =
        handlers.find(([s]) => s === mockCallToolRequestSchema) || [];

      if (!handler) {
        throw new Error('Handler not found');
      }

      await expect(handler(request)).rejects.toThrow(
        new mockMcpError(mockErrorCode.InvalidParams, 'file_key is required')
      );
    });
  });
});
