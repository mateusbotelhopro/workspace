import { Queue } from "bullmq";
import {
  QUEUES,
  type CapiEventJob,
  type ResolveAdNamesJob,
  type SyncInsightsJob,
} from "@crm/shared";
import { redisConnection } from "./lib/redis";

// Filas que o próprio worker enfileira (jobs derivados de outros jobs).

const defaultJobOptions = {
  attempts: 5,
  backoff: { type: "exponential" as const, delay: 5_000 },
  removeOnComplete: { count: 1_000 },
  removeOnFail: { count: 5_000 },
};

const capiQueue = new Queue<CapiEventJob>(QUEUES.CAPI_EVENT, {
  connection: redisConnection,
  defaultJobOptions,
});

const resolveAdNamesQueue = new Queue<ResolveAdNamesJob>(QUEUES.RESOLVE_AD_NAMES, {
  connection: redisConnection,
  defaultJobOptions,
});

const syncInsightsQueue = new Queue<SyncInsightsJob>(QUEUES.SYNC_INSIGHTS, {
  connection: redisConnection,
  defaultJobOptions,
});

export async function enqueueCapiEvent(job: CapiEventJob): Promise<void> {
  await capiQueue.add("send", job);
}

export async function enqueueResolveAdNames(job: ResolveAdNamesJob): Promise<void> {
  // jobId por ad evita resolver o mesmo anúncio em paralelo
  await resolveAdNamesQueue.add("resolve", job, { jobId: `${job.orgId}:${job.adId}` });
}

export async function enqueueSyncInsights(job: SyncInsightsJob): Promise<void> {
  await syncInsightsQueue.add("sync", job);
}
