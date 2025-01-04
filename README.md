# @hapins/figma-mcp

A Model Context Protocol server for Figma API integration. This package provides a set of tools to interact with the Figma API through the Model Context Protocol.

> **Note**: This package was implemented by [Cline](https://github.com/cursor-ai/cline), an open-source CLI tool for Claude AI. All code in this repository was written by Claude through Cline.

## Installation

```bash
npm install -g @hapins/figma-mcp
```

## Quick Start

1. Get your Figma access token:

   - Go to your [Figma account settings](https://www.figma.com/settings)
   - Navigate to Personal access tokens
   - Create a new access token

2. Run the server:

```bash
# Using environment variable
FIGMA_ACCESS_TOKEN=your-token npx @hapins/figma-mcp

# Or using config file
npx @hapins/figma-mcp --config=config.json
```

Example config.json:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["-y", "@hapins/figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-figma-access-token"
      }
    }
  }
}
```

## Features

- List Figma files in a project or team
- Get file versions and comments
- Retrieve file information and components
- Access file nodes and styles
- Full TypeScript support
- Easy integration with Claude AI

## Usage

### With Cline

1. Install the package:

```bash
npm install -g @hapins/figma-mcp
```

2. Add the following to your Cline settings file (`~/.config/cline/settings.json` or platform equivalent):

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["@hapins/figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-figma-access-token"
      }
    }
  }
}
```

### With Claude Desktop

Add the following to your Claude Desktop settings file:

```json
{
  "mcpServers": {
    "figma": {
      "command": "npx",
      "args": ["@hapins/figma-mcp"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your-figma-access-token"
      }
    }
  }
}
```

### Available MCP Tools

The server provides the following tools through the Model Context Protocol:

- `list_files`: List files in a project or team

  - Parameters:
    - `project_id`: (optional) Project ID to list files from
    - `team_id`: (optional) Team ID to list files from

- `get_file_versions`: Get version history of a file

  - Parameters:
    - `file_key`: (required) Figma file key

- `get_file_comments`: Get comments on a file

  - Parameters:
    - `file_key`: (required) Figma file key

- `get_file_info`: Get detailed file information

  - Parameters:
    - `file_key`: (required) Figma file key
    - `depth`: (optional) Maximum depth to traverse the node tree (1-4 recommended)
    - `node_id`: (optional) ID of a specific node to fetch

- `get_components`: Get components from a file

  - Parameters:
    - `file_key`: (required) Figma file key

- `get_styles`: Get styles from a file

  - Parameters:
    - `file_key`: (required) Figma file key

- `get_file_nodes`: Get specific nodes from a file
  - Parameters:
    - `file_key`: (required) Figma file key
    - `ids`: (required) Array of node IDs to retrieve

## Environment Variables

- `FIGMA_ACCESS_TOKEN`: Your Figma access token (required)

## Development

```bash
# Install dependencies
npm install

# Build the package
npm run build

# Watch mode
npm run watch

# Run tests
npm test
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
