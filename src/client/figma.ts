import axios, { AxiosInstance } from 'axios';
import {
  DocumentNode,
  FigmaComponent,
  FigmaFile,
  FigmaFileVersion,
  FigmaComment,
  FigmaStyle,
  SceneNode,
} from '../types/figma.js';

export class FigmaClient {
  private axiosInstance: AxiosInstance;

  constructor(accessToken: string) {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.figma.com/v1',
      headers: {
        'X-Figma-Token': accessToken,
      },
    });
  }

  async getFileInfo(
    fileKey: string,
    options?: { depth?: number; node_id?: string }
  ) {
    const searchParams = new URLSearchParams();

    if (options?.depth !== undefined) {
      searchParams.append('depth', options.depth.toString());
    }
    if (options?.node_id) {
      searchParams.append('node_id', options.node_id);
    }

    const queryString = searchParams.toString();
    const url = `/files/${fileKey}${queryString ? `?${queryString}` : ''}`;

    const response = await this.axiosInstance.get<{ document: DocumentNode }>(
      url
    );
    return response.data;
  }

  async getComponents(fileKey: string) {
    const response = await this.axiosInstance.get<{
      meta: { components: FigmaComponent[] };
    }>(`/files/${fileKey}/components?page_size=100`);
    return response.data;
  }

  async getStyles(fileKey: string) {
    const response = await this.axiosInstance.get<{
      meta: { styles: FigmaStyle[] };
    }>(`/files/${fileKey}/styles?page_size=100`);
    return response.data;
  }

  async listFiles(params: { project_id?: string; team_id?: string }) {
    const searchParams = new URLSearchParams();
    if (params.project_id) {
      searchParams.append('project_id', params.project_id);
    }
    if (params.team_id) {
      searchParams.append('team_id', params.team_id);
    }

    const response = await this.axiosInstance.get<{ files: FigmaFile[] }>(
      `/files?${searchParams.toString()}`
    );
    return response.data;
  }

  async getFileVersions(fileKey: string) {
    const response = await this.axiosInstance.get<{
      versions: FigmaFileVersion[];
    }>(`/files/${fileKey}/versions`);
    return response.data;
  }

  async getFileComments(fileKey: string) {
    const response = await this.axiosInstance.get<{ comments: FigmaComment[] }>(
      `/files/${fileKey}/comments`
    );
    return response.data;
  }

  async getFileNodes(fileKey: string, ids: string[]) {
    const response = await this.axiosInstance.get<{
      nodes: {
        [key: string]: {
          document: SceneNode;
          components?: { [key: string]: FigmaComponent };
          styles?: { [key: string]: FigmaStyle };
        };
      };
    }>(`/files/${fileKey}/nodes?ids=${ids.join(',')}`);
    return response.data;
  }
}
