import { Queue } from "bullmq";
import { Redis } from "ioredis";
import { QUEUES, type IncomingWebhookJob } from "@leady/shared";
import { serverEnv } from "./env";

// Lado "produtor" das filas: o web só enfileira, quem consome é o worker.

declare global {
  // eslint-disable-next-line no-var
  var __queueRedis: Redis | undefined;
}

function getRedis(): Redis {
  if (!globalThis.__queueRedis) {
    globalThis.__queueRedis = new Redis(serverEnv.redisUrl, {
      maxRetriesPerRequest: null,
      lazyConnect: true,
    });
  }
  return globalThis.__queueRedis;
}

let incomingWebhookQueue: Queue<IncomingWebhookJob> | null = null;

export async function enqueueIncomingWebhook(job: IncomingWebhookJob): Promise<void> {
  incomingWebhookQueue ??= new Queue<IncomingWebhookJob>(QUEUES.INCOMING_WEBHOOK, {
    connection: getRedis(),
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: "exponential", delay: 2_000 },
      removeOnComplete: { count: 1_000 },
    },
  });
  await incomingWebhookQueue.add("webhook", job);
}
