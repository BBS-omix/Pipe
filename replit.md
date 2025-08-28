# Dingl AI - Enterprise Automation Platform

## Overview

Dingl AI is an enterprise automation platform that provides a visual pipeline builder for creating automated workflows with multi-modal business data processing. The application features a drag-and-drop interface where users can connect various agent types (data sources, processors, AI components, and outputs) to build complex automation pipelines. The platform is designed to handle document processing, OCR, AI validation, and reporting workflows in an intuitive visual environment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: Custom hooks (usePipeline) for local state management with TanStack React Query for server state
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system variables and FontAwesome icons

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Development Server**: Custom Vite integration for hot module replacement in development
- **API Structure**: RESTful API with `/api` prefix, currently using placeholder routes
- **Error Handling**: Centralized error middleware with structured JSON responses
- **Logging**: Custom request/response logging with duration tracking

### Data Storage Solutions
- **Database**: PostgreSQL configured through Neon Database serverless connection
- **ORM**: Drizzle ORM with code-first schema definition
- **Schema**: Comprehensive pipeline management schema including:
  - `pipelines`: Main pipeline definitions with nodes and connections stored as JSON
  - `agents`: Reusable agent configurations for different workflow components
  - `pipeline_nodes`: Individual node instances within pipelines
  - `pipeline_connections`: Relationships between nodes
- **Development Storage**: In-memory storage implementation for development/testing

### Core Features
- **Visual Pipeline Builder**: Drag-and-drop canvas for creating automation workflows
- **Agent Library**: Categorized collection of pre-built agents (data sources, processors, AI, outputs)
- **Real-time Metrics**: Live pipeline status monitoring and performance tracking
- **Configuration Management**: Dynamic property panels for agent-specific settings
- **Pipeline Management**: Save, load, and execute automation pipelines

### Agent System Architecture
The application uses a modular agent architecture with four main categories:
- **Data Sources**: Database connectors, API integrators, file processors
- **Processors**: OCR, data transformation, validation agents
- **AI Agents**: LLM integration, RAG systems, MCP (Model Context Protocol) agents
- **Output Agents**: Webhooks, reports, notifications

### External Dependencies

- **Database**: Neon Database (PostgreSQL) for production data persistence
- **UI Components**: Radix UI primitives for accessible component foundation
- **Development Tools**: Replit-specific plugins for development environment integration
- **Motion Library**: Framer Motion for animations and transitions
- **Form Handling**: React Hook Form with Zod validation schemas
- **Date Utilities**: date-fns for date manipulation
- **Styling**: Tailwind CSS with class-variance-authority for component variants