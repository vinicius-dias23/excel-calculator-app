
# Arquivo Excel de Exemplo

Para testar a aplicação, você pode criar um arquivo Excel (.xlsm) com as seguintes células:

## Estrutura da Planilha

| Célula | Campo | Tipo | Descrição |
|--------|-------|------|-----------|
| B3 | Diameter Initial | Decimal | Diâmetro inicial |
| B5 | Diameter Final | Decimal | Diâmetro final |
| C3 | %C | Decimal | Percentual de carbono |
| D5 | Structure | String | Estrutura (P/W/R) |
| E5 | Treatment | String | Tratamento |
| D8 | Number of Passes | Integer | Número de passes |
| D9 | Bench Mark Speed | Integer | Velocidade benchmark |

## Como Criar o Arquivo de Teste

1. Abra o Microsoft Excel
2. Crie uma nova planilha
3. Deixe as células mencionadas vazias ou com valores padrão
4. Salve como .xlsm (Excel Macro-Enabled Workbook)
5. Faça upload na aplicação

## Exemplo de Valores para Teste

- Diameter Initial: 10.50
- Diameter Final: 8.75
- %C: 0.82
- Structure: P (Patented)
- Treatment: descaled
- Number of Passes: 3
- Bench Mark Speed: 450

A aplicação irá atualizar essas células com os valores fornecidos e retornará a planilha atualizada para download.
