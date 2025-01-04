# Figma MCP Server Example

This directory contains example configuration and usage of the Figma MCP server.

## Setup

1. Install the package globally:

```bash
npm install -g @hapins/figma-mcp
```

2. Get your Figma access token:

- Go to your Figma account settings
- Navigate to Personal access tokens
- Create a new access token

3. Configure the MCP server:

- Copy `claude_desktop_config.json` to your Claude Desktop config directory
- Replace `your-figma-access-token` with your actual Figma access token

## Running the Server

### Using Claude Desktop

1. Open Claude Desktop
2. The Figma MCP server will automatically start with your configuration

### Using Command Line

You can also run the server directly:

```bash
# Using environment variable
FIGMA_ACCESS_TOKEN=your-token npx figma-mcp

# Or using config file
npx figma-mcp --config path/to/claude_desktop_config.json
```

## Testing the Connection

Once the server is running, you can use Claude to:

- List your Figma files
- Get file information
- Access components and styles
- And more!

Example prompts:

- "Show me the list of files in my Figma project"
- "Get information about a specific Figma file"
- "What components are available in this file?"
