# Huly.io MCP Integration

A Model Context Protocol (MCP) server implementation for [Huly.io](https://huly.io) - the open-source all-in-one project management platform.

## Overview

This MCP server enables AI assistants like Claude to interact with Huly.io's comprehensive project management, chat, and document features. Built following MCP best practices and leveraging Huly.io's official API SDK.

## Features

### 🔧 Tools (Actions)
- **Task Management**: Create, update, and delete tasks/issues
- **Project Operations**: Manage projects and sprints
- **Document Creation**: Create and edit collaborative documents
- **Chat Integration**: Send messages and manage conversations
- **Sprint Planning**: Plan and track sprints with velocity metrics

### 📚 Resources (Data Access)
- **Tasks & Issues**: Access project tasks and issue data
- **Documents**: Read collaborative documents and notes
- **Chat Messages**: Retrieve conversation history
- **Sprint Data**: Access sprint information and metrics
- **Project Metadata**: Get workspace and project information

### 💬 Prompts (Templates)
- **Task Creation**: Structured task creation templates
- **Sprint Planning**: Sprint planning and retrospective prompts
- **Document Formatting**: Document structure and formatting guides
- **Project Status**: Project status and progress summaries

## Getting Started

### Prerequisites
- Node.js v20.11.0 or higher
- Access to a Huly.io instance (self-hosted or Huly Cloud)
- Claude Desktop or compatible MCP client

### Installation

```bash
git clone https://github.com/claranceliberi/huly-io-mcp.git
cd huly-io-mcp
npm install
```

### Configuration

1. Copy the example configuration:
```bash
cp config.example.json config.json
```

2. Update `config.json` with your Huly.io credentials:
```json
{
  "huly": {
    "endpoint": "https://your-huly-instance.com",
    "workspace": "your-workspace-id",
    "auth": {
      "method": "token",
      "token": "your-api-token"
    }
  }
}
```

### Usage with Claude Desktop

Add to your Claude Desktop MCP settings:

```json
{
  "mcpServers": {
    "huly": {
      "command": "node",
      "args": ["path/to/huly-io-mcp/dist/server.js"],
      "cwd": "path/to/huly-io-mcp"
    }
  }
}
```

## Development

### Building
```bash
npm run build
```

### Testing
```bash
npm test
```

### Development Mode
```bash
npm run dev
```

## Architecture

This MCP server follows the official MCP specification and uses:

- **Transport**: StdioServerTransport for standard MCP connectivity
- **SDK**: Official `@modelcontextprotocol/sdk` TypeScript implementation
- **API Client**: Huly.io's official TypeScript API client
- **Authentication**: Support for both token-based and email/password authentication

## Contributing

1. Fork the repository
2. Create a feature branch
3. Follow MCP best practices and Huly.io API patterns
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Related Projects

- [Huly Platform](https://github.com/hcengineering/platform) - The main Huly.io platform
- [Model Context Protocol](https://modelcontextprotocol.io) - Official MCP documentation
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - Official TypeScript SDK

## Support

- [Huly.io Documentation](https://docs.huly.io)
- [MCP Documentation](https://modelcontextprotocol.io)
- [Issues](https://github.com/claranceliberi/huly-io-mcp/issues)