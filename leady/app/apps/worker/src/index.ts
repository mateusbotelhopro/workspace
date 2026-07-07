import { Worker } from "bullmq";
import {
  QUEUES,
  type AutomationJob,
  type CapiEventJob,
  type IncomingWebhookJob,
  type OutboundMessageJob,
  type ResolveAdNamesJob,
  type SyncInsightsJob,
} from "@leady/shared";
import { redisConnection } from "./lib/redis";
import { processIncomingWebhook } from "./jobs/process-incoming-webhook";
import { sendOutboundMessage } from "./jobs/send-outbound-message";
import { sendCapiEventJob } from "./jobs/send-capi-event";
import { resolveAdNames } from "./jobs/resolve-ad-names";
import { syncInsights } from "./jobs/sync-insights";
import { runAutomation } from "./jobs/run-automation";

const connection = redisConnection;

const workers = [
  new Worker<IncomingWebhookJob>(
    QUEUES.INCOMING_WEBHOOK,
    (job) => processIncomingWebhook(job.data),
    { connection, concurrency: 10 },
  ),
  new Worker<OutboundMessageJob>(
    QUEUES.OUTBOUND_MESSAGE,
    (job) => sendOutboundMessage(job.data),
    { connection, concurrency: 5 },
  ),
  new Worker<CapiEventJob>(QUEUES.CAPI_EVENT, (job) => sendCapiEventJob(job.data), {
    connection,
    concurrency: 5,
  }),
  new Worker<ResolveAdNamesJob>(QUEUES.RESOLVE_AD_NAMES, (job) => resolveAdNames(job.data), {
    connection,
    concurrency: 2,
  }),
  new Worker<SyncInsightsJob>(QUEUES.SYNC_INSIGHTS, (job) => syncInsights(job.data), {
    connection,
    concurrency: 1,
  }),
  new Worker<AutomationJob>(QUEUES.AUTOMATION, (job) => runAutomation(job.data), {
    connection,
    concurrency: 5,
  }),
];

for (const worker of workers) {
  worker.on("failed", (job, err) => {
    console.error(`[${worker.name}] job ${job?.id} falhou: ${err.message}`);
  });
  worker.on("completed", (job) => {
    console.log(`[${worker.name}] job ${job.id} ok`);
  });
}

console.log(`Worker de filas rodando (${workers.length} filas). Ctrl+C pra parar.`);

async function shutdown() {
  await Promise.all(workers.map((w) => w.close()));
  await connection.quit();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
