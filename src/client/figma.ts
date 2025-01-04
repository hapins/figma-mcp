import axios, { AxiosInstance } from 'axios';
import {
  DocumentNode,
  FigmaComponent,
  FigmaFile,
  FigmaFileVersion,
  FigmaComment,
  FigmaStyle,
  SceneNode,
} from '../types/figma';

/**
 * Client for interacting with the Figma API.
 * Provides methods to access Figma files, components, styles, and more.
 */
export class FigmaClient {
  private axiosInstance: AxiosInstance;

  /**
   * Creates a new instance of the Figma API client.
   * @param accessToken - Your Figma access token
   */
  constructor(accessToken: string) {
    this.axiosInstance = axios.create({
      baseURL: 'https://api.figma.com/v1',
      headers: {
        'X-Figma-Token': accessToken,
      },
    });
  }

  /**
   * Get information about a Figma file.
   * @param fileKey - The key of the file to get
   * @param options - Additional options
   * @param options.depth - Depth level of the traversal (1-4 recommended)
   * @param options.node_id - ID of a specific node to fetch
   * @returns The file data including document structure
   */
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

  /**
   * Get components from a Figma file.
   * @param fileKey - The key of the file to get components from
   * @returns List of components in the file
   */
  async getComponents(fileKey: string) {
    const response = await this.axiosInstance.get<{
      meta: { components: FigmaComponent[] };
    }>(`/files/${fileKey}/components?page_size=100`);
    return response.data;
  }

  /**
   * Get styles from a Figma file.
   * @param fileKey - The key of the file to get styles from
   * @returns List of styles in the file
   */
  async getStyles(fileKey: string) {
    const response = await this.axiosInstance.get<{
      meta: { styles: FigmaStyle[] };
    }>(`/files/${fileKey}/styles?page_size=100`);
    return response.data;
  }

  /**
   * List files in a project or team.
   * @param params - Query parameters
   * @param params.project_id - ID of the project to list files from
   * @param params.team_id - ID of the team to list files from
   * @returns List of files matching the query
   */
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

  /**
   * Get version history of a Figma file.
   * @param fileKey - The key of the file to get versions from
   * @returns List of file versions
   */
  async getFileVersions(fileKey: string) {
    const response = await this.axiosInstance.get<{
      versions: FigmaFileVersion[];
    }>(`/files/${fileKey}/versions`);
    return response.data;
  }

  /**
   * Get comments on a Figma file.
   * @param fileKey - The key of the file to get comments from
   * @returns List of comments on the file
   */
  async getFileComments(fileKey: string) {
    const response = await this.axiosInstance.get<{ comments: FigmaComment[] }>(
      `/files/${fileKey}/comments`
    );
    return response.data;
  }

  /**
   * Get specific nodes from a Figma file.
   * @param fileKey - The key of the file to get nodes from
   * @param ids - Array of node IDs to retrieve
   * @returns Object containing the requested nodes and their associated components and styles
   */
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
