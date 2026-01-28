# **stubticket.** - Plano de Ação

## 1. CONTEXTO E OBJETIVO

### 1.1 Problema de Negócio

O cliente precisa de uma **plataforma de venda de ingressos** para eventos (shows, festas, conferências) focada no mercado brasileiro, permitindo:
- Venda rápida com métodos de pagamento locais (PIX + cartão parcelado).
- Controle de eventos, tipos de ingresso e participantes.
- Oferecer diferencial prático e real para produtor do evento.
- Capacidade de escalar com múltiplos eventos.

### 1.2 Objetivo do Projeto

Entregar um **MVP funcional em produção** que permita:
- Criar e publicar eventos
- Vender ingressos com PIX e cartão parcelado (Mercado Pago)
- Confirmar pagamentos automaticamente via webhook
- Emitir ingressos digitais com QR code
- Validar ingressos na portaria
- Acompanhar vendas e relatórios básicos
-Sistema de acompanhamento Afiliados

### 1.3 Critério de Sucesso

- **Velocidade:** MVP no ar em 7–10 dias
- **Validação:** Pelo menos 1 evento real vendendo ingressos com sucesso
- **Técnico:** Zero ingressos liberados sem confirmação de pagamento
- **Negócio:** Cliente consegue operar sozinho após passagem de conhecimento

### 2.1 Base de Código

**Decisão:** Usar **Hi.Events** (open-source) como base, ao invés de desenvolver do zero.

**Justificativa:**
- Já tem core completo de eventos, tickets, participantes, afiliados, webhooks
- Reduz tempo de desenvolvimento em 60–90 dias
- Código maduro e ativo (comunidade ativa no GitHub)
- Licença AGPL-3.0 permite uso comercial

**Alternativas consideradas e descartadas:**
- Attendize: risco de licença para uso SaaS sem compra de licença comercial
- Desenvolver do zero: alto custo e tempo incompatível com orçamento <10k

### 2.2 Gateway de Pagamento

**Decisão:** **Mercado Pago** como provedor principal para PIX e cartão.

**Justificativa:**
- Brasil-first: PIX com taxa 0% (ou 0,49% conforme perfil) vs taxa fixa Asaas
- Alta penetração e confiança do público brasileiro
- Suporte nativo a parcelamento com juros do comprador
- Transferências Pix/TED gratuitas (facilita repasse manual)

(nexo como alternativa futura)

**Alternativas consideradas:**
- Stripe: forte em cartão internacional, mas PIX não disponível nativamente
- Asaas: ótimo para split/escrow, mas taxa fixa PIX pode pesar em tickets baixos

**Implementação:**
- Manter Stripe no código (desligado via feature flag) como fallback
- Mercado Pago ligado por padrão
- Ocultar features Stripe-only (Connect/marketplace)

### 2.3 Modelo Financeiro

**Decisão:** **Merchant of Record (MoR)** com repasse manual por 60 dias.

**Justificativa:**
- Reduz complexidade de onboarding (1 conta MP vs múltiplas)
- Acelera go-to-market
- Cliente ainda está validando demanda, não precisa de marketplace/split agora
- Repasse manual é aceitável para baixo volume inicial

**Modelo operacional:**
- Plataforma recebe todos os pagamentos em 1 conta Mercado Pago
- Repasse para organizadores: manual, após evento ou conforme acordo
- Fase 2: migrar para split/marketplace quando escalar

### 2.4 Métodos de Pagamento

**Decisão:** PIX (nativo assíncrono) + Cartão via **Checkout Pro redirecionado**.

**Justificativa:**
- **PIX:** obrigatório para conversão BR, assíncrono por natureza (QR + webhook)
- **Cartão:** redirecionamento reduz escopo (sem PCI-DSS, antifraude custom, UI complexa)
- **Parcelamento:** com juros do comprador (zero custo adicional para plataforma)

**Alternativa descartada:**
- Checkout transparente (cartão dentro do site): fora do orçamento <10k

### 2.5 Hospedagem e Infraestrutura

**Decisão:** Fornecedor entrega “pronto” (deploy completo em servidor do cliente ou gerenciado).

**Responsabilidades:**
- Fornecedor: provisionamento, deploy, configuração, SSL, backup, documentação
- Cliente: fornece domínio, credenciais Mercado Pago e aprovações

---

## 3. MODELO DE NEGÓCIO E OPERAÇÃO FINANCEIRA

### 3.1 Fluxo de Recebimento (MoR)

```
Cliente compra ingresso
    ↓
Mercado Pago (conta única da plataforma)
    ↓
Plataforma confirma pagamento via webhook
    ↓
Libera ingresso digital com QR code
    ↓
[Pós-evento ou período combinado]
    ↓
Repasse manual (Pix/TED) para organizador / saque via painel
```

### 3.2 Taxas e Custos

**Mercado Pago (estimativas de mercado):**
- PIX: 0% para maioria (ou 0,49% para novos CNPJ >R$15k/mês)
- Cartão: ~4,98% (crédito na hora) / ~1,99% (débito)
- Parcelamento: com juros do comprador (sem custo adicional plataforma)
- Transferência Pix/TED: gratuita

**Take rate da plataforma:**
- A definir pelo cliente (ex: 5–10% sobre valor bruto ou taxa fixa por ingresso)
- Não implementado no MVP (fica manual/fora do sistema)

### 3.3 Repasse Manual (Processo)

1. Após evento ou conforme combinado (semanal/quinzenal)
2. Backoffice gera relatório de vendas por organizador
3. Calcula: Vendas aprovadas − Estornos − Taxa da plataforma = Valor a repassar
4. Transferência Pix/TED com comprovante
5. Anexar comprovante + relatório para auditoria

**Ponto de atenção:**
- Política clara de reembolso e cancelamento
- Não repassar antes de garantir que não haverá chargeback/contestação

---

## 4. ARQUITETURA E STACK TÉCNICO

### 4.1 Base: Hi.Events

- **Linguagem:** PHP (Laravel framework)
- **Frontend:** Blade templates + Vue.js (componentes interativos)
- **Banco de dados:** MySQL ou PostgreSQL - Neon DB
- **Deploy:** Docker (recomendado) ou servidor LAMP/LEMP tradicional
    - Coolify→ Vercel Open Source

### 4.2 Pagamentos: Mercado Pago

**Integração PIX:**
- Criar pagamento via API Checkout/Preferences
- Retorno: QR code (base64/URL) + código copia-e-cola
- Tela aguarda confirmação (polling opcional, webhook é fonte de verdade)
- Webhook/notificação atualiza status do pedido

**Integração Cartão (Checkout Pro):**
- Criar preference com items, payer info, back URLs
- Redirecionar cliente para `init_point` do Mercado Pago
- MP processa pagamento e parcelamento
- Cliente retorna via back URL (success/failure/pending)
- Webhook/notificação confirma status real (não confiar só no redirect)

**Webhook/Notificações:**
- Endpoint público: `POST /api/public/webhooks/mercadopago`
- Validação: assinatura (x-signature) ou consulta API para confirmar status
- Idempotência: table `webhook_events` com `external_id` único
- Retry: se webhook falhar, admin pode “re-sync” consultando API

### 4.3 Estados de Pagamento

```
pending → approved → ingresso liberado
pending → failed → cliente pode tentar novamente
approved → refunded → ingresso cancelado
```

### 4.4 Infraestrutura

- **Servidor:** Hetzner Cloud (CX21 ou CX31) — melhor custo-benefício e confiabilidade
- **Deploy:** Coolify (PaaS self-hosted) — interface Heroku-like com controle total
- **Domínio:** cliente fornece (ex: `ingressos.exemplo.com.br`)
- **SSL:** Let's Encrypt (automático via Coolify)
- **Backup:** diário, armazenado em bucket S3 ou local seguro
- **Logs:** centralizados (Coolify dashboard ou Dozzle)
- **Monitoramento:** básico (uptime, disk space, erros críticos)

**Por que Hetzner + Coolify:**
- Hetzner: 99.9%+ uptime, rede estável, €5-10/mês
- Coolify: deploy 1-click, SSL automático, zero vendor lock-in
- Controle total da infra sem dependência de PaaS externos (Heroku, Railway, etc.)

### 4.5 Segurança Mínima

- HTTPS obrigatório (redirect HTTP → HTTPS)
- Validação de entrada (CSRF, XSS, SQL Injection prevenidos pelo Laravel)
- Rate limiting em webhooks (prevenir DDoS/spam)
- Secrets em `.env` (nunca no código)
- Logs de ações críticas (pagamentos, reembolsos, acesso admin)
    - Grafana→ logs servidor docker

---

## 5. ESCOPO DO MVP (O QUE VAI TER)

### 5.1 Funcionalidades de Eventos

✅ Criar, editar, publicar/despublicar eventos

✅ Configurar: nome, descrição, data/hora, local, capacidade, banner

✅ Página pública do evento (SEO-friendly, compartilhável)

✅ Widget embeddable (iframe para sites externos)

✅ Dashboard: vendas em tempo real, gráficos, últimos pedidos

- Ideia: Story de Template para compartilhar no insta no pós compra

### 5.2 Tipos de Ingresso

✅ Múltiplos tipos no mesmo evento (Inteira, Meia*, VIP, Camarote)

✅ Preço, quantidade, descrição, data início/fim de venda

✅ Lotes (Early Bird, Normal, Última Hora) com transição automática

✅ Cupons de desconto (%, R$) com limite de uso e validade

Meia*→ colocar verificação de documento para inibir no checkout espertinhos

### 5.3 Gestão de Pedidos

✅ Listagem com filtros (status, data, tipo ingresso)

✅ Busca por ID, e-mail, nome

✅ Detalhes do pedido: cliente, ingressos, valores, status, transação MP

✅ Ações: reembolso, cancelamento, reenvio de e-mail

✅ Exportação CSV/Excel

### 5.4 Gestão de Participantes

✅ Lista de presença com QR codes

✅ Status de check-in (validado/não validado)

✅ Exportação para impressão/conferência

✅ E-mail em massa (confirmação, lembrete, pós-evento)

### 5.5 Programa de Afiliados

✅ Link único por afiliado

✅ Rastreamento de vendas geradas

✅ Cálculo de comissão (% ou R$)

✅ Relatório exportável

*(Se disponível na base Hi.Events; senão entra como “futura”)*

### 5.6 Ingressos Digitais

✅ PDF com QR code único (não reutilizável)

✅ Envio automático por e-mail após confirmação pagamento

✅ Download via login do participante

✅ Validação de QR code via endpoint API

✅ Marca como “usada” após primeira validação

Futuro: Upsell ingresso fisico: Ingresso Premium

### 5.7 Dashboard e Relatórios

✅ Cards resumo: vendas, receita, ocupação, pedidos

✅ Gráfico de vendas por dia

✅ Gráfico de receita por tipo de ingresso

✅ Exportações: pedidos, participantes, financeiro, afiliados

### 5.8 Pagamentos Mercado Pago

✅ **PIX:** geração QR/copia-e-cola + webhook + liberação automática

✅ **Cartão:** Checkout Pro redirecionado + parcelamento com juros do comprador

✅ Estados claros: pending, approved, failed, refunded

✅ Idempotência de webhook (não processa duplicado)

✅ Admin pode “re-sync” status consultando API

### 5.9 Infraestrutura

✅ Deploy completo (servidor, domínio, SSL, backup)

✅ Credenciais Mercado Pago configuradas (live, não sandbox)

✅ Documentação de acesso e manutenção

✅ 1 evento de teste criado e funcional

- Resend talvez, para enviar emails

## 6. FORA DO ESCOPO (O QUE NÃO VAI TER AGORA)

### 6.1 Pagamentos e Financeiro

❌ Checkout transparente (cartão sem redirecionamento)

❌ Split de pagamento automático (divisão em tempo real)

❌ Subcontas Mercado Pago / onboarding de organizadores

❌ Conciliação financeira avançada (fechamento mensal automatizado)

❌ Reembolso automatizado completo (fica manual assistido)

❌ Suporte a boleto bancário

### 6.2 Funcionalidades Avançadas

❌ Assentos marcados / seat map interativo

❌ Marketplace público (listagem de todos eventos de todos organizadores)

❌ Multi-idioma (fica só português)

❌ App mobile nativo (iOS/Android)

❌ Scanner de QR code mobile app (fica web-based ou integração futura)

### 6.3 Integrações Externas

❌ CRM (HubSpot, RD Station, Pipedrive)

❌ WhatsApp Business API / chatbot

❌ E-mail marketing (Mailchimp, SendGrid custom)

❌ Redes sociais (post automático no Instagram/Facebook)

❌ Google Analytics / Facebook Pixel (cliente pode adicionar manualmente)

### 6.4 Customizações

❌ Design/branding 100% customizado (fica padrão Hi.Events com ajustes mínimos)

❌ White-label completo (remoção total de “powered by”)

❌ Multi-tenancy avançado (cada organizador com subdomínio)

### 6.5 Operação e Suporte

❌ Suporte 24/7 pós-entrega

❌ SLA de uptime contratual

❌ Manutenção e atualizações contínuas (disponível sob contrato recorrente separado)

### 7.2 Fases de Entrega

### **Fase 1: Setup e Base**

**Prazo:**

**Atividades:**
- Provisionamento de servidor e domínio
- Deploy base do Hi.Events
- Configuração de banco de dados e env vars
- SSL e backup configurados
- Acesso admin criado

**Entrega:**
- Sistema Hi.Events acessível via domínio
- Login funcional
- Credenciais documentadas

---

### **Fase 2: Mercado Pago PIX + Eventos**

**Prazo:**

**Atividades:**
- Implementar provider Mercado Pago
- Integração PIX (criar cobrança, exibir QR/copia-e-cola)
- Webhook/notificação idempotente
- Estados de pagamento (pending → approved)
- Liberação de ingresso após confirmação
- Testar fluxo completo: criar evento → vender → confirmar → ingresso liberado

**Entrega:**
- 1 evento de teste funcional
- Compra com PIX confirmando corretamente
- Ingresso PDF gerado e enviado por e-mail
- QR code único e validável

---

### **Fase 3: Cartão + Finalização**

**Prazo:** 

**Atividades:**
- Integração cartão via Checkout Pro (redirecionado)
- Configurar parcelamento (juros do comprador)
- Back URLs (retorno após pagamento)
- Webhook confirma status (não confiar só em redirect)
- Ocultar/desativar features Stripe-only
- Ajustes de UI/UX mínimos
- Testes de regressão (PIX + cartão)
- Documentação final e passagem de conhecimento

Sentry→ monitora bugs que podem acontecer.

Discord→ recebe as notificações

Coolify→ Docker→ Container 
Server→terminal 

Github→ Codigo 

Repo→ push 

Garantia de 90 dias→ bugs, erros ou alguma coisa pontal 

Maio e Junho

- Gerar story para pessoa postar depois de comprar ingresso→ estimulo
- Automações→ n8n avisar as notificações.

**Entrega:**
- Cartão parcelado funcionando
- PIX + cartão ambos confirmando corretamente
- Nenhuma referência visual a Stripe Connect
- README e documentação completa