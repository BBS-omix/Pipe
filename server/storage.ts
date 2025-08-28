import { type Pipeline, type InsertPipeline, type Agent, type InsertAgent, type PipelineNode, type InsertPipelineNode, type PipelineConnection, type InsertPipelineConnection } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for pipeline management
export interface IStorage {
  // Pipeline CRUD
  getPipeline(id: string): Promise<Pipeline | undefined>;
  getAllPipelines(): Promise<Pipeline[]>;
  createPipeline(pipeline: InsertPipeline): Promise<Pipeline>;
  updatePipeline(id: string, updates: Partial<Pipeline>): Promise<Pipeline | undefined>;
  deletePipeline(id: string): Promise<boolean>;

  // Agent CRUD
  getAgent(id: string): Promise<Agent | undefined>;
  getAllAgents(): Promise<Agent[]>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | undefined>;
  deleteAgent(id: string): Promise<boolean>;

  // Pipeline Node CRUD
  getPipelineNode(id: string): Promise<PipelineNode | undefined>;
  getNodesByPipeline(pipelineId: string): Promise<PipelineNode[]>;
  createPipelineNode(node: InsertPipelineNode): Promise<PipelineNode>;
  updatePipelineNode(id: string, updates: Partial<PipelineNode>): Promise<PipelineNode | undefined>;
  deletePipelineNode(id: string): Promise<boolean>;

  // Pipeline Connection CRUD
  getPipelineConnection(id: string): Promise<PipelineConnection | undefined>;
  getConnectionsByPipeline(pipelineId: string): Promise<PipelineConnection[]>;
  createPipelineConnection(connection: InsertPipelineConnection): Promise<PipelineConnection>;
  deletePipelineConnection(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private pipelines: Map<string, Pipeline>;
  private agents: Map<string, Agent>;
  private pipelineNodes: Map<string, PipelineNode>;
  private pipelineConnections: Map<string, PipelineConnection>;

  constructor() {
    this.pipelines = new Map();
    this.agents = new Map();
    this.pipelineNodes = new Map();
    this.pipelineConnections = new Map();
  }

  // Pipeline methods
  async getPipeline(id: string): Promise<Pipeline | undefined> {
    return this.pipelines.get(id);
  }

  async getAllPipelines(): Promise<Pipeline[]> {
    return Array.from(this.pipelines.values());
  }

  async createPipeline(insertPipeline: InsertPipeline): Promise<Pipeline> {
    const id = randomUUID();
    const pipeline: Pipeline = { 
      ...insertPipeline,
      id,
      description: insertPipeline.description ?? null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.pipelines.set(id, pipeline);
    return pipeline;
  }

  async updatePipeline(id: string, updates: Partial<Pipeline>): Promise<Pipeline | undefined> {
    const pipeline = this.pipelines.get(id);
    if (!pipeline) return undefined;
    
    const updatedPipeline = { 
      ...pipeline, 
      ...updates, 
      id, 
      updatedAt: new Date() 
    };
    this.pipelines.set(id, updatedPipeline);
    return updatedPipeline;
  }

  async deletePipeline(id: string): Promise<boolean> {
    return this.pipelines.delete(id);
  }

  // Agent methods
  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async getAllAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const agent: Agent = { 
      ...insertAgent, 
      id,
      description: insertAgent.description ?? null
    };
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    
    const updatedAgent = { ...agent, ...updates, id };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  async deleteAgent(id: string): Promise<boolean> {
    return this.agents.delete(id);
  }

  // Pipeline Node methods
  async getPipelineNode(id: string): Promise<PipelineNode | undefined> {
    return this.pipelineNodes.get(id);
  }

  async getNodesByPipeline(pipelineId: string): Promise<PipelineNode[]> {
    return Array.from(this.pipelineNodes.values()).filter(
      node => node.pipelineId === pipelineId
    );
  }

  async createPipelineNode(insertNode: InsertPipelineNode): Promise<PipelineNode> {
    const id = randomUUID();
    const node: PipelineNode = { 
      ...insertNode, 
      id,
      status: insertNode.status ?? 'idle',
      pipelineId: insertNode.pipelineId ?? null,
      agentId: insertNode.agentId ?? null
    };
    this.pipelineNodes.set(id, node);
    return node;
  }

  async updatePipelineNode(id: string, updates: Partial<PipelineNode>): Promise<PipelineNode | undefined> {
    const node = this.pipelineNodes.get(id);
    if (!node) return undefined;
    
    const updatedNode = { ...node, ...updates, id };
    this.pipelineNodes.set(id, updatedNode);
    return updatedNode;
  }

  async deletePipelineNode(id: string): Promise<boolean> {
    return this.pipelineNodes.delete(id);
  }

  // Pipeline Connection methods
  async getPipelineConnection(id: string): Promise<PipelineConnection | undefined> {
    return this.pipelineConnections.get(id);
  }

  async getConnectionsByPipeline(pipelineId: string): Promise<PipelineConnection[]> {
    return Array.from(this.pipelineConnections.values()).filter(
      conn => conn.pipelineId === pipelineId
    );
  }

  async createPipelineConnection(insertConnection: InsertPipelineConnection): Promise<PipelineConnection> {
    const id = randomUUID();
    const connection: PipelineConnection = { 
      ...insertConnection, 
      id,
      label: insertConnection.label ?? null,
      pipelineId: insertConnection.pipelineId ?? null,
      sourceNodeId: insertConnection.sourceNodeId ?? null,
      targetNodeId: insertConnection.targetNodeId ?? null
    };
    this.pipelineConnections.set(id, connection);
    return connection;
  }

  async deletePipelineConnection(id: string): Promise<boolean> {
    return this.pipelineConnections.delete(id);
  }
}

export const storage = new MemStorage();
