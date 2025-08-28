import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const pipelines = pgTable("pipelines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"), // draft, running, stopped, error
  nodes: json("nodes").notNull().default([]),
  connections: json("connections").notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // data-source, processor, ai, output
  subtype: text("subtype").notNull(), // database, api, file, ocr, transform, validation, llm, rag, mcp, webhook, report
  description: text("description"),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  configuration: json("configuration").notNull().default({}),
  isActive: boolean("is_active").notNull().default(true),
});

export const pipelineNodes = pgTable("pipeline_nodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pipelineId: varchar("pipeline_id").references(() => pipelines.id),
  agentId: varchar("agent_id").references(() => agents.id),
  position: json("position").notNull(), // {x: number, y: number}
  configuration: json("configuration").notNull().default({}),
  status: text("status").notNull().default("idle"), // idle, running, success, error
  metrics: json("metrics").notNull().default({}),
});

export const pipelineConnections = pgTable("pipeline_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  pipelineId: varchar("pipeline_id").references(() => pipelines.id),
  sourceNodeId: varchar("source_node_id").references(() => pipelineNodes.id),
  targetNodeId: varchar("target_node_id").references(() => pipelineNodes.id),
  label: text("label"),
});

export const insertPipelineSchema = createInsertSchema(pipelines).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
});

export const insertPipelineNodeSchema = createInsertSchema(pipelineNodes).omit({
  id: true,
});

export const insertPipelineConnectionSchema = createInsertSchema(pipelineConnections).omit({
  id: true,
});

export type Pipeline = typeof pipelines.$inferSelect;
export type InsertPipeline = z.infer<typeof insertPipelineSchema>;
export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type PipelineNode = typeof pipelineNodes.$inferSelect;
export type InsertPipelineNode = z.infer<typeof insertPipelineNodeSchema>;
export type PipelineConnection = typeof pipelineConnections.$inferSelect;
export type InsertPipelineConnection = z.infer<typeof insertPipelineConnectionSchema>;
