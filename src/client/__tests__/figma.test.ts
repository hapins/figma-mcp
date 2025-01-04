import { FigmaClient } from '../figma';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FigmaClient', () => {
  let client: FigmaClient;
  const mockAccessToken = 'mock-token';
  const mockFileKey = 'mock-file-key';

  let mockGet: jest.Mock;

  beforeEach(() => {
    mockGet = jest.fn();
    mockedAxios.create.mockReturnValue({
      get: mockGet,
    } as any);
    client = new FigmaClient(mockAccessToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.figma.com/v1',
        headers: {
          'X-Figma-Token': mockAccessToken,
        },
      });
    });
  });

  describe('getFileInfo', () => {
    const mockResponse = {
      data: {
        document: {
          id: '0:0',
          name: 'Document',
          type: 'DOCUMENT',
        },
      },
    };

    it('should fetch file info without options', async () => {
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await client.getFileInfo(mockFileKey);

      expect(mockGet).toHaveBeenCalledWith(`/files/${mockFileKey}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch file info with options', async () => {
      mockGet.mockResolvedValueOnce(mockResponse);

      const options = { depth: 2, node_id: 'node-1' };
      const result = await client.getFileInfo(mockFileKey, options);

      expect(mockGet).toHaveBeenCalledWith(
        `/files/${mockFileKey}?depth=2&node_id=node-1`
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getComponents', () => {
    const mockResponse = {
      data: {
        meta: {
          components: [
            {
              key: 'component-1',
              name: 'Button',
            },
          ],
        },
      },
    };

    it('should fetch components', async () => {
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await client.getComponents(mockFileKey);

      expect(mockGet).toHaveBeenCalledWith(
        `/files/${mockFileKey}/components?page_size=100`
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('listFiles', () => {
    const mockResponse = {
      data: {
        files: [
          {
            key: 'file-1',
            name: 'Design System',
          },
        ],
      },
    };

    it('should list files with project_id', async () => {
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await client.listFiles({ project_id: 'project-1' });

      expect(mockGet).toHaveBeenCalledWith('/files?project_id=project-1');
      expect(result).toEqual(mockResponse.data);
    });

    it('should list files with team_id', async () => {
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await client.listFiles({ team_id: 'team-1' });

      expect(mockGet).toHaveBeenCalledWith('/files?team_id=team-1');
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('error handling', () => {
    it('should propagate API errors', async () => {
      mockGet.mockRejectedValueOnce(new Error('API Error'));

      await expect(client.getFileInfo(mockFileKey)).rejects.toThrow(
        'API Error'
      );
    });
  });
});
