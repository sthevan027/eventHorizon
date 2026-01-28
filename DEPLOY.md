# Deploy stubticket. - Instruções

## Pré-requisitos

- Servidor com Docker e Docker Compose instalados
- Coolify configurado e rodando
- Domínio configurado (opcional, mas recomendado)
- Credenciais do Mercado Pago (Access Token e Public Key)

## Configuração no Coolify

### 1. Conectar Repositório

1. No Coolify, crie um novo projeto
2. Conecte o repositório Git (GitHub/GitLab)
3. Selecione o branch principal (main/master)

### 2. Configurar Build

- **Dockerfile:** `Dockerfile.all-in-one`
- **Context:** `/` (raiz do projeto)
- **Porta:** `80`

### 3. Variáveis de Ambiente

Configure as seguintes variáveis de ambiente no Coolify:

#### Aplicação
```
APP_NAME=stubticket.
APP_KEY=<gerar com: php artisan key:generate>
JWT_SECRET=<gerar com: php artisan jwt:secret>
APP_FRONTEND_URL=https://seu-dominio.com
APP_CDN_URL=https://seu-dominio.com/storage
```

#### Banco de Dados (PostgreSQL)
```
DB_CONNECTION=pgsql
DB_HOST=<host-do-neon-db>
DB_PORT=5432
DB_DATABASE=<nome-do-banco>
DB_USERNAME=<usuario>
DB_PASSWORD=<senha>
DATABASE_URL=postgresql://usuario:senha@host:5432/nome-do-banco
```

#### Mercado Pago (OBRIGATÓRIO)
```
MERCADOPAGO_ACCESS_TOKEN=<seu-access-token>
MERCADOPAGO_PUBLIC_KEY=<sua-public-key>
MERCADOPAGO_WEBHOOK_SECRET=<seu-webhook-secret>
```

#### Email (Resend recomendado)
```
MAIL_MAILER=smtp
MAIL_HOST=smtp.resend.com
MAIL_PORT=465
MAIL_USERNAME=resend
MAIL_PASSWORD=<sua-api-key-resend>
MAIL_ENCRYPTION=ssl
MAIL_FROM_ADDRESS=noreply@stubticket.com
MAIL_FROM_NAME=stubticket.
```

#### Logo
```
APP_EMAIL_LOGO_URL=https://seu-dominio.com/logos/logo.png
APP_EMAIL_LOGO_LINK_URL=https://seu-dominio.com
```

#### Outras Configurações
```
APP_DISABLE_REGISTRATION=false
APP_SAAS_MODE_ENABLED=false
LOG_CHANNEL=stderr
QUEUE_CONNECTION=redis
REDIS_HOST=redis
REDIS_PORT=6379
FILESYSTEM_PUBLIC_DISK=public
FILESYSTEM_PRIVATE_DISK=local
```

### 4. Configurar Banco de Dados

1. Crie um banco PostgreSQL no Neon DB (ou use outro provedor)
2. Configure as variáveis de ambiente acima
3. Execute as migrações após o primeiro deploy:
   ```bash
   php artisan migrate
   ```

### 5. Configurar Webhook do Mercado Pago

1. No painel do Mercado Pago, configure o webhook:
   - URL: `https://seu-dominio.com/api/public/webhooks/mercadopago`
   - Eventos: `payment`, `payment.update`
2. Copie o webhook secret e configure em `MERCADOPAGO_WEBHOOK_SECRET`

### 6. Deploy

1. No Coolify, clique em "Deploy"
2. Aguarde o build e deploy completarem
3. Verifique os logs para garantir que não há erros

## Pós-Deploy

### 1. Executar Migrações

```bash
php artisan migrate
```

### 2. Criar Usuário Admin

```bash
php artisan tinker
```

```php
$user = \HiEvents\DomainObjects\UserDomainObject::create([
    'email' => 'admin@stubticket.com',
    'password' => bcrypt('senha-segura'),
    'name' => 'Admin',
    'email_verified_at' => now(),
]);
```

### 3. Configurar Storage Link

```bash
php artisan storage:link
```

### 4. Testar

1. Acesse `https://seu-dominio.com`
2. Faça login com o usuário admin criado
3. Crie um evento de teste
4. Teste o fluxo de compra com Mercado Pago (sandbox)

## Troubleshooting

### Erro de conexão com banco
- Verifique as credenciais do PostgreSQL
- Verifique se o banco está acessível do servidor

### Erro de webhook
- Verifique se a URL do webhook está correta
- Verifique se o webhook secret está configurado
- Verifique os logs: `docker logs <container-id>`

### Erro de pagamento
- Verifique as credenciais do Mercado Pago
- Use credenciais de sandbox para testes
- Verifique os logs para mais detalhes

## Notas Importantes

- **Mercado Pago é OBRIGATÓRIO** - Não funciona sem as credenciais configuradas
- **Zero ingressos sem pagamento** - Ingressos só são liberados após confirmação via webhook
- **Sandbox para MVP** - Use credenciais de sandbox do Mercado Pago para testes
- **Produção** - Migre para credenciais live quando estiver pronto
