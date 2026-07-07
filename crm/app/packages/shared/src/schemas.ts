import { z } from "zod";

// Schemas de validação de entrada (formulários e API).

export const createLeadSchema = z.object({
  contactId: z.string().uuid(),
  pipelineId: z.string().uuid(),
  stageId: z.string().uuid().optional(),
  valueCents: z.number().int().nonnegative().nullable().optional(),
  ownerId: z.string().uuid().nullable().optional(),
});

export const moveLeadSchema = z.object({
  leadId: z.string().uuid(),
  stageId: z.string().uuid(),
});

export const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  body: z.string().min(1).max(4096),
  isInternalNote: z.boolean().default(false),
});

export const createTrackingLinkSchema = z.object({
  channelId: z.string().uuid(),
  name: z.string().min(1).max(80),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Só letras minúsculas, números e hífen"),
  defaultText: z.string().max(500).optional(),
});

export const stageCapiMappingSchema = z.object({
  stageId: z.string().uuid(),
  capiEventName: z.enum(["Lead", "QualifiedLead", "Purchase"]).nullable(),
});

export const integrationSettingsSchema = z.object({
  metaDatasetId: z.string().optional(),
  metaCapiToken: z.string().optional(),
  metaAdAccountId: z.string().optional(),
  metaAdsToken: z.string().optional(),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type MoveLeadInput = z.infer<typeof moveLeadSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type CreateTrackingLinkInput = z.infer<typeof createTrackingLinkSchema>;
