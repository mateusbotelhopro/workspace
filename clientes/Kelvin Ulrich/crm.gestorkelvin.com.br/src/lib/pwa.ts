// Registra o Service Worker apenas em produção fora de iframes (preview do Lovable)
export function registerServiceWorker() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  const isInIframe = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();
  const host = window.location.hostname;
  const isPreviewHost =
    host.includes("lovableproject.com") ||
    host.includes("id-preview--") ||
    host === "localhost" ||
    host === "127.0.0.1";

  if (isInIframe || isPreviewHost) {
    // Garante limpeza de SW antigos no preview
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
    return;
  }

  navigator.serviceWorker
    .register("/sw.js")
    .catch((err) => console.warn("SW register failed", err));
}
