
# Excel Calculator Interface

Interface amigável para calculadora complexa em Excel (.xlsm). Esta aplicação web permite fazer upload de planilhas Excel, inserir dados através de uma interface intuitiva e processar cálculos automaticamente.

## Funcionalidades

### 📋 Campos de Input Suportados
- **Diameter Initial** (Célula B3) - Tipo: decimal
- **Diameter Final** (Célula B5) - Tipo: decimal  
- **%C** (Célula C3) - Tipo: decimal (percentual de carbono)
- **Structure** (Célula D5) - Tipo: select com opções:
  - P (Patented)
  - W (Direct Drawn Wire)
  - R (Stelmor)
- **Treatment** (Célula E5) - Tipo: select com opções:
  - descaled
  - descaled+coating
  - pickled
- **Number of Passes** (Célula D8) - Tipo: inteiro
- **Bench Mark Speed** (Célula D9) - Tipo: inteiro

### 🚀 Principais Recursos

- **Upload de Arquivos**: Drag & drop ou seleção de arquivos .xlsm/.xlsx
- **Interface Responsiva**: Design moderno com Tailwind CSS
- **Validação de Dados**: Validação completa dos campos de input
- **Processamento Excel**: Manipulação direta das células Excel
- **Download Automático**: Planilha processada pronta para download
- **Feedback Visual**: Status em tempo real das operações
- **Tratamento de Erros**: Mensagens claras para o usuário

### 🛠 Tecnologias Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Shadcn/UI** - Componentes de interface
- **ExcelJS** - Manipulação de arquivos Excel
- **React Hook Form** - Gerenciamento de formulários
- **Lucide Icons** - Ícones modernos

## Como Usar

1. **Upload da Planilha**: Faça upload do seu arquivo .xlsm na área designada
2. **Preenchimento**: Preencha os campos com os dados necessários
3. **Cálculo**: Clique em "Calcular" para processar a planilha
4. **Download**: Baixe a planilha processada com os cálculos atualizados

## Estrutura do Projeto

```
├── app/
│   ├── api/
│   │   └── process-excel/     # API para processamento de arquivos
│   ├── globals.css            # Estilos globais
│   ├── layout.tsx             # Layout principal
│   └── page.tsx               # Página inicial
├── components/
│   ├── ui/                    # Componentes de interface
│   ├── excel-calculator.tsx   # Componente principal
│   ├── excel-form.tsx         # Formulário de dados
│   └── file-upload.tsx        # Componente de upload
└── lib/
    ├── types.ts               # Tipos TypeScript
    └── utils.ts               # Utilitários
```

## Limitações

- **Macros**: Não executa macros VBA por limitações do ambiente web
- **Formulas**: Recalcula fórmulas Excel automaticamente
- **Tamanho**: Limite de 50MB por arquivo
- **Formatos**: Suporte para .xlsm e .xlsx

## Instalação e Desenvolvimento

```bash
# Instalar dependências
yarn install

# Executar em modo de desenvolvimento
yarn dev

# Build para produção
yarn build

# Iniciar servidor de produção
yarn start
```

## API Endpoints

### POST /api/process-excel
Processa arquivo Excel com os dados fornecidos.

**Body (FormData):**
- `file`: Arquivo Excel (.xlsm/.xlsx)
- `data`: JSON com os dados do formulário

**Response:** Arquivo Excel processado para download

---

Desenvolvido com ❤️ para facilitar o trabalho com calculadoras complexas em Excel.
