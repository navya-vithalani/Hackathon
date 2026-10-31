import { z } from 'zod'

export const structureRequestSchema = z.object({
  event_id: z.string().uuid().optional(),
  messages: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string().trim().min(1).max(5000),
  })).min(1).max(10),
}).strict()

export const eventStructureSchema = z.object({
  reply: z.string().min(1).max(1200),
  structured: z.object({
    summary: z.string().max(3000),
    schedule: z.array(z.object({
      time: z.string().max(120),
      title: z.string().min(1).max(200),
      description: z.string().max(500).optional(),
    })).max(16),
    rules: z.array(z.string().max(500)).max(20),
    prizes: z.array(z.string().max(500)).max(12),
    faqs: z.array(z.object({
      question: z.string().min(1).max(300),
      answer: z.string().min(1).max(700),
    })).max(12),
    contacts: z.array(z.object({
      name: z.string().min(1).max(120),
      role: z.string().max(120),
      email: z.string().email().or(z.literal('')).optional(),
    })).max(8),
  }).strict(),
  open_questions: z.array(z.string().min(1).max(300)).max(8),
}).strict()

export type EventStructureResult = z.infer<typeof eventStructureSchema>
