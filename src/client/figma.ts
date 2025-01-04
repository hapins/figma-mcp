import axios, { AxiosInstance } from 'axios';

export class FigmaClient {
  private client: AxiosInstance;

  constructor(accessToken: string) {
    this.client = axios.create({
      baseURL: 'https://api.figma.com/v1',
      headers: {
        'X-Figma-Token': accessToken,
      },
    });
  }

  async listFiles(params: { project_id?: string; team_id?: string }) {
    const response = await this.client.get('/files', { params });
    return response.data;
  }

  async getFileInfo(
    fileKey: string,
    options?: { depth?: number; node_id?: string }
  ) {
    const response = await this.client.get(`/files/${fileKey}`, {
      params: options,
    });
    return response.data;
  }

  async getComponents(fileKey: string) {
    const response = await this.client.get(`/files/${fileKey}/components`);
    return response.data;
  }

  async getStyles(fileKey: string) {
    const response = await this.client.get(`/files/${fileKey}/styles`);
    return response.data;
  }

  async getFileVersions(fileKey: string) {
    const response = await this.client.get(`/files/${fileKey}/versions`);
    return response.data;
  }

  async getFileComments(fileKey: string) {
    const response = await this.client.get(`/files/${fileKey}/comments`);
    return response.data;
  }

  async getFileNodes(fileKey: string, ids: string[]) {
    const response = await this.client.get(`/files/${fileKey}/nodes`, {
      params: { ids: ids.join(',') },
    });
    return response.data;
  }
}
