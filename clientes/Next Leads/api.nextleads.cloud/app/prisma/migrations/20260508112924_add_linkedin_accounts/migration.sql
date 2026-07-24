-- CreateTable
CREATE TABLE "sdrs" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sdrs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "linkedin_accounts" (
    "id" TEXT NOT NULL,
    "unipileAccountId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "clientName" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sdrId" TEXT,

    CONSTRAINT "linkedin_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "nome" TEXT,
    "linkedinProfileUrl" TEXT,
    "unipileChatId" TEXT,
    "sdrId" TEXT,
    "linkedinAccountId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "leadId" TEXT,
    "unipileMessageId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_analysis" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "resumo" TEXT,
    "temperatura" TEXT,
    "intencao" TEXT,
    "prioridade" TEXT,
    "proximoPasso" TEXT,
    "respostaSugerida" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_analysis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "whatsapp_logs" (
    "id" TEXT NOT NULL,
    "messageId" TEXT,
    "sdrId" TEXT,
    "status" TEXT NOT NULL,
    "error" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whatsapp_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "linkedin_accounts_unipileAccountId_key" ON "linkedin_accounts"("unipileAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "leads_unipileChatId_key" ON "leads"("unipileChatId");

-- CreateIndex
CREATE UNIQUE INDEX "messages_unipileMessageId_key" ON "messages"("unipileMessageId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_analysis_messageId_key" ON "ai_analysis"("messageId");

-- AddForeignKey
ALTER TABLE "linkedin_accounts" ADD CONSTRAINT "linkedin_accounts_sdrId_fkey" FOREIGN KEY ("sdrId") REFERENCES "sdrs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_sdrId_fkey" FOREIGN KEY ("sdrId") REFERENCES "sdrs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "leads" ADD CONSTRAINT "leads_linkedinAccountId_fkey" FOREIGN KEY ("linkedinAccountId") REFERENCES "linkedin_accounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_analysis" ADD CONSTRAINT "ai_analysis_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_logs" ADD CONSTRAINT "whatsapp_logs_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "whatsapp_logs" ADD CONSTRAINT "whatsapp_logs_sdrId_fkey" FOREIGN KEY ("sdrId") REFERENCES "sdrs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
