
# Deploy no cPanel - Excel Calculator App

Este projeto possui duas opções de deploy no cPanel, dependendo se seu provedor de hospedagem suporta Node.js ou não.

## 📋 Pré-requisitos

- Conta cPanel com acesso Git
- Node.js e Yarn instalados no servidor (verificar com o provedor)

## 🚀 Opção 1: Deploy com Node.js (Recomendado)

### Configuração:
1. **Arquivo**: Use `.cpanel.yml`
2. **Requisitos**: cPanel com suporte a Node.js Apps
3. **Funcionalidades**: Todas as funcionalidades funcionam (incluindo processamento de Excel)

### Passos:
1. Renomeie `.cpanel.yml` como o arquivo principal de deploy
2. Configure Git Repository no cPanel apontando para este repo
3. Após o deploy, vá em **Node.js Apps** no cPanel
4. Adicione nova aplicação:
   - **Node.js Version**: 18.x ou superior
   - **Application Root**: `/excel-calculator`
   - **Application URL**: `/excel-calculator`
   - **Startup File**: `app.js`
5. Clique em **Create**

### ✅ Vantagens:
- Todas as funcionalidades funcionam
- APIs para processamento de Excel funcionam
- Performance otimizada

## 📱 Opção 2: Deploy Estático (Fallback)

### Configuração:
1. **Arquivo**: Use `.cpanel-static.yml` (renomeie para `.cpanel.yml`)
2. **Requisitos**: Apenas hosting web básico
3. **Limitações**: APIs não funcionam (processamento Excel limitado)

### Passos:
1. Renomeie `.cpanel-static.yml` para `.cpanel.yml`
2. Configure Git Repository no cPanel
3. O deploy criará arquivos estáticos em `/public_html/excel-calculator`

### ⚠️ Limitações:
- Processamento de Excel não funcionará (requer servidor)
- Apenas interface funciona
- Adequado apenas para demonstração

## 🔧 Configurações Importantes

### Variáveis de Ambiente
Se usar Node.js, configure no cPanel:
```bash
NODE_ENV=production
PORT=3000
```

### Domínio Personalizado
Para usar domínio próprio, configure:
1. **Subdomain**: `excel-calculator.seudominio.com`
2. **Document Root**: `/public_html/excel-calculator`

### Problemas Comuns

#### 1. **Erro 500 - Internal Server Error**
- Verificar logs do Node.js no cPanel
- Confirmar que dependências foram instaladas
- Verificar permissões de arquivo (755)

#### 2. **APIs não funcionam**
- Confirmar que está usando deploy Node.js (não estático)
- Verificar se todas as dependências estão instaladas
- Confirmar configuração de CORS se necessário

#### 3. **Arquivos não carregam**
- Verificar .htaccess para redirecionamentos
- Confirmar estrutura de pastas
- Verificar permissões

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs no cPanel
2. Confirmar suporte Node.js com seu provedor
3. Testar primeiro com deploy estático para validar arquivos

## 🎯 Recomendação Final

- **Para produção completa**: Use Opção 1 (Node.js)
- **Para demonstração**: Use Opção 2 (Estático)
- **Para teste**: Comece com Opção 2, migre para Opção 1

A aplicação Excel Calculator funciona melhor com Node.js devido ao processamento servidor-side de planilhas Excel.
