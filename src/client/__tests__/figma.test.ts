import axios from 'axios';
import { FigmaClient } from '../figma';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('FigmaClient', () => {
  const mockAccessToken = 'mock-token';
  let client: FigmaClient;
  let mockGet: jest.Mock;

  beforeEach(() => {
    mockGet = jest.fn();
    mockedAxios.create = jest.fn().mockReturnValue({
      get: mockGet,
    } as any);
    client = new FigmaClient(mockAccessToken);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listFiles', () => {
    it('should list files with project_id', async () => {
      const mockResponse = { data: { files: [] } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await client.listFiles({ project_id: 'project-1' });
      expect(result).toEqual(mockResponse.data);
      expect(mockGet).toHaveBeenCalledWith('/files', {
        params: { project_id: 'project-1' },
      });
    });

    it('should list files with team_id', async () => {
      const mockResponse = { data: { files: [] } };
      mockGet.mockResolvedValueOnce(mockResponse);

      const result = await client.listFiles({ team_id: 'team-1' });
      expect(result).toEqual(mockResponse.data);
      expect(mockGet).toHaveBeenCalledWith('/files', {
        params: { team_id: 'team-1' },
      });
    });
  });

  describe('error handling', () => {
    it('should propagate API errors', async () => {
      const mockError = new Error('API Error');
      mockGet.mockRejectedValueOnce(mockError);

      await expect(
        client.listFiles({ project_id: 'project-1' })
      ).rejects.toThrow(mockError);
    });
  });
});
