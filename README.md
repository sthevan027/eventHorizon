# EventHorizon - Plataforma de Eventos e Ingressos

Protótipo de alta fidelidade para uma plataforma web de eventos e venda de ingressos, desenvolvido com React + TypeScript + Vite.

## 🚀 Tecnologias

- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Roteamento de páginas
- **Lucide React** - Ícones modernos

## 📦 Instalação

```bash
# Instalar dependências
pnpm install

# Iniciar servidor de desenvolvimento
pnpm dev

# Build para produção
pnpm build

# Preview da build
pnpm preview
```

## 🎨 Telas Implementadas

### 1. HOME / EXPLORAR EVENTOS
- Header com busca e navegação
- Hero section com barra de busca centralizada
- Sidebar de filtros (categorias, preço, data)
- Grid de cards de eventos responsivo

### 2. PÁGINA DO EVENTO
- Banner grande com título e informações
- Descrição do evento
- Line-up com fotos circulares
- Mapa do local (Google Maps)
- Sidebar fixa com seletor de ingressos

### 3. CHECKOUT
- Fluxo em 3 etapas:
  1. Dados do comprador
  2. Forma de pagamento
  3. Confirmação
- Resumo da compra na sidebar
- Design limpo e focado na conversão

### 4. CONFIRMAÇÃO / INGRESSO DIGITAL
- Mensagem de sucesso
- QR Code do ingresso
- Informações do evento
- Botões de ação (Baixar, Ver, Compartilhar)

## 🎯 Características

- ✅ Design moderno e profissional
- ✅ Layout responsivo (mobile-first)
- ✅ Componentes reutilizáveis
- ✅ Navegação fluida entre telas
- ✅ Paleta de cores roxo/azul premium
- ✅ Cards com sombras suaves
- ✅ Bordas arredondadas
- ✅ Tipografia sans-serif moderna

## 📱 Responsividade

O protótipo é totalmente responsivo, adaptando-se a:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔗 Rotas

- `/` - Home / Explorar Eventos
- `/evento/:id` - Página do Evento
- `/checkout` - Checkout
- `/confirmacao` - Confirmação / Ingresso Digital

## 🎨 Paleta de Cores

- **Primary**: Roxo/Azul (#6366f1 - #4f46e5)
- **Background**: Branco (#ffffff)
- **Text**: Cinza escuro (#111827)
- **Borders**: Cinza claro (#e5e7eb)

## 📝 Notas

Este é um protótipo de alta fidelidade com dados mockados. Para produção, seria necessário:
- Integração com backend/API
- Autenticação de usuários
- Processamento de pagamentos
- Geração real de QR Codes
- Sistema de gestão de eventos
