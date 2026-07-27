import { useEffect } from "react";
import SEO from "@/components/SEO";

export default function FormsContrato() {
  useEffect(() => {
    // Carregar script do formulário Longfy
    const script = document.createElement("script");
    script.src = "https://app.nextleads.com.br/js/form_embed.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Limpar script ao desmontar
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="flex flex-col w-full min-h-screen bg-background">
      <SEO
        title="Formulário de Contrato - Next Leads"
        description="Preencha o formulário para iniciar o processo de contratação de serviços de prospecção B2B com a Next Leads."
        canonical="https://www.nextleads.com.br/forms-contrato"
      />

      {/* Hero Section - Centralizado */}
      <section className="relative py-20 md:py-32 bg-gradient-to-r from-foreground to-foreground/95 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10">
          <div className="flex flex-col items-center text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 mb-8 text-white/70 text-sm">
              <span className="flex items-center justify-center w-6 h-6 rounded-full border border-white/30">🏠</span>
              <span>Início</span>
              <span className="text-primary">/</span>
              <span className="text-primary">Formulário de Contrato</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 mb-8">
              <span className="text-xs font-semibold text-primary">Formulário de Contrato</span>
            </div>

            {/* Main Content - Centralizado */}
            <div className="max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
                Inicie sua <span className="text-primary">Parceria</span> com a Next Leads
              </h1>
              <p className="text-lg text-white/80">
                Preencha o formulário abaixo para dar início ao processo de contratação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="flex-1 py-12 md:py-16">
        <div className="container">
          <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-lg p-8 md:p-12 border border-border">
            {/* Iframe do Formulário Longfy */}
            <iframe
              src="https://app.nextleads.com.br/widget/form/Cvfa5MXhXQki8OGkt3Zn"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '3px'
              }}
              id="inline-Cvfa5MXhXQki8OGkt3Zn"
              data-layout="{'id':'INLINE'}"
              data-trigger-type="alwaysShow"
              data-trigger-value=""
              data-activation-type="alwaysActivated"
              data-activation-value=""
              data-deactivation-type="neverDeactivate"
              data-deactivation-value=""
              data-form-name="Formulário - Site Next"
              data-height="undefined"
              data-layout-iframe-id="inline-Cvfa5MXhXQki8OGkt3Zn"
              data-form-id="Cvfa5MXhXQki8OGkt3Zn"
              title="Formulário - Site Next"
            />
          </div>

          {/* Informações Adicionais */}
          <div className="max-w-4xl mx-auto mt-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24h</div>
                <p className="text-muted-foreground">Resposta rápida</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <p className="text-muted-foreground">Seguro e confidencial</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">+300</div>
                <p className="text-muted-foreground">Contratos assinados</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16">
        <div className="container max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Por que contratar a Next Leads?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">✅ Prospecção B2B Especializada</h3>
              <p className="text-muted-foreground">Nossa equipe de especialistas em prospecção B2B utiliza metodologias comprovadas para identificar e qualificar leads de alto valor para sua empresa.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">✅ Reuniões Qualificadas com Decisores</h3>
              <p className="text-muted-foreground">Não entregamos apenas leads - entregamos reuniões agendadas com decisores reais que têm poder de compra e interesse genuíno em sua solução.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">✅ Metodologia Humanizada e Personalizada</h3>
              <p className="text-muted-foreground">Combinamos inteligência de dados com abordagem humana para criar conexões autênticas com seus prospects, resultando em taxas de conversão superiores.</p>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">✅ Redução de Custo Operacional</h3>
              <p className="text-muted-foreground">Terceirizar sua prospecção com a Next Leads reduz significativamente o custo de aquisição de clientes (CAC) comparado a manter uma equipe interna de SDRs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-secondary/30">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Dúvidas antes de preencher?
            </h2>
            <p className="text-muted-foreground mb-8">
              Entre em contato conosco através do WhatsApp ou email para esclarecer qualquer dúvida.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/5511978670830?text=Olá! Gostaria de esclarecer algumas dúvidas sobre o formulário de contrato."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors"
              >
                💬 WhatsApp
              </a>
              <a
                href="mailto:joseluiz@nextleads.com.br"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-bold rounded-lg hover:bg-primary/10 transition-colors"
              >
                📧 Email
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
