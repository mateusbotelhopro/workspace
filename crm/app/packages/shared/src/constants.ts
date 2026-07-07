/** Eventos padrão enviados pro Meta via Conversions API */
export const CAPI_EVENTS = {
  LEAD: "Lead",
  QUALIFIED_LEAD: "QualifiedLead", // evento custom
  PURCHASE: "Purchase",
} as const;

export type CapiEventName = (typeof CAPI_EVENTS)[keyof typeof CAPI_EVENTS];

/** Prefixo do código rastreável injetado na 1ª mensagem do link (ex: "#a1b2c3") */
export const TRACKING_CODE_PREFIX = "#";
export const TRACKING_CODE_LENGTH = 6;

/**
 * Janela de correlação do fallback heurístico: clique recente sem código casado
 * + conversa nova sem origem dentro dessa janela = atribuição "provavel".
 */
export const CLICK_MATCH_WINDOW_MINUTES = 15;

/** Janela de atendimento da Cloud API (fora dela, só template aprovado) */
export const CLOUD_API_SESSION_HOURS = 24;

export const DEFAULT_CURRENCY = "BRL";
