# Funções de Usuário com Configurações de Empresa - API Backend

Este documento descreve as funcionalidades relacionadas ao registro, login e gerenciamento das configurações de um usuário e sua empresa.

---

## **1. Funções básicas de Usuário**

### **1.1 Função: `register`**

A função `register` é responsável por criar um novo usuário com dados pessoais e empresariais.

**Etapas:**

1. **Recebimento dos Dados do Usuário**:
   - O corpo da requisição (`req.body`) deve conter informações como:
     - Nome
     - Email
     - Senha
     - CNPJ
     - Valores de serviço
     - Endereço
     - Outros detalhes da empresa

2. **Validações**:
   - **Campos obrigatórios**: Verifica se todos os campos foram fornecidos.
   - **Senha**: Checa se a senha segue critérios de segurança (mín. 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos).
   - **Email único**: Confirma que o email não está cadastrado.
   - **CNPJ único**: Verifica se o CNPJ não foi utilizado.

3. **Hash da Senha**:
   - Utiliza o `bcrypt` para armazenar a senha com segurança.

4. **Criação do Usuário**:
   - Insere um novo documento no banco de dados MongoDB com:
     - Dados do usuário
     - Subdocumento de configurações da empresa

5. **Resposta**:
   - **Sucesso (201)**: Retorna um token JWT e a mensagem de sucesso.
   - **Erro (422 ou 500)**: Retorna uma mensagem indicando o problema.

6. **Envio de arquivo**:
   - Um arquivo .png ou .jpg é esperado no campo `logo` para a empresa.

7. **Estrutura do JSON para Teste**:
   - O exemplo abaixo ilustra os dados esperados na requisição para testar a funcionalidade de atualização de configurações:

```json
{
  "name": "John Doe",
  "email": "user@techcompany.com",
  "password": "Aa123456_",
  "confirmpassword": "Aa123456_",
  "settings": {
    "companyName": "Tech Company",
    "cnpj": "12.345.678/0001-90",
    "serviceRates": {
      "maintenance": 100,
      "creation": 150,
      "development": 150,
      "integration": 180,
      "extra": 120
    },
    "address": "123 Tech Street, Silicon Valley, CA",
    "contactEmail": "contact@techcompany.com",
    "contactPhone": "(11) 99999-9999",
    "website": "www.techcompany.com"
  }
}
```

---

### **1.2 Função: `login`**

A função `login` autentica um usuário existente na aplicação.

**Etapas:**

1. **Recebimento dos Dados de Login**:
   - O corpo da requisição (`req.body`) deve conter:
     - Email
     - Senha

2. **Validações**:
   - **Campos obrigatórios**: Verifica se `email` e `password` foram fornecidos.
   - **Usuário existente**: Confirma que o email está cadastrado.

3. **Verificação da Senha**:
   - Compara a senha fornecida com o hash armazenado no banco usando `bcrypt`.

4. **Geração do Token**:
   - Gera um token JWT para o usuário autenticado.

5. **Resposta**:
   - **Sucesso (200)**: Retorna o token JWT.
   - **Erro (401 ou 422)**: Retorna mensagens de erro apropriadas.

6. **Envio de arquivo**:
   - Um arquivo .png ou .jpg é esperado no campo `logo` para a empresa.

7. **Estrutura do JSON para Teste**:
   - O exemplo abaixo ilustra os dados esperados na requisição para testar a funcionalidade de atualização de configurações:

```json
{
  "email": "user@techcompany.com",
  "password": "Aa123456_",
}
```

---

## **2. Funções de Configuração de Usuário**

### **2.1 Função: `getUserSettings`**

A função `getUserSettings` retorna as configurações da empresa associada ao usuário autenticado.

**Etapas:**

1. **Autenticação do Usuário**:
   - Verifica se o token JWT está presente e válido.

2. **Restrições de Acesso**:
   - Se o token for inválido ou ausente, retorna "Acesso negado!" (401).

3. **Envio das Configurações**:
   - Remove o campo `password` dos dados do usuário.
   - Retorna as configurações da empresa.

4. **Resposta**:
   - **Sucesso (200)**: Configurações retornadas com sucesso.
   - **Erro (401)**: Mensagem de "Acesso negado!".

---

### **2.2 Função: `updateUserSettings`**

A função `updateUserSettings` atualiza as configurações da empresa associada ao usuário autenticado.

**Etapas:**

1. **Recebimento dos Dados**:
   - Obtém os novos valores das configurações no corpo da requisição (`req.body`).

2. **Autenticação do Usuário**:
   - Confirma o usuário autenticado com base no token JWT.

3. **Validações**:
   - Checa a presença e validade dos campos obrigatórios:
     - `companyName`, `cnpj`, `serviceRates`, `address`, `contactEmail`, `contactPhone`, `website` e `logo`.

4. **Atualização e Persistência**:
   - Substitui as configurações atuais pelas novas e salva no banco de dados.

5. **Resposta**:
   - **Sucesso (200)**: Retorna as configurações atualizadas.
   - **Erro (422 ou 500)**: Mensagens indicando o problema.

6. **Estrutura do JSON para Teste**:
   - O exemplo abaixo ilustra os dados esperados na requisição para testar a funcionalidade de atualização de configurações:

```json
{
   "companyName": "Tech Company",
   "cnpj": "12.345.678/0001-90",
   "serviceRates": {
      "maintenance": 100,
      "creation": 150,
      "development": 150,
      "integration": 180,
      "extra": 120
   },
   "address": "123 Tech Street, Silicon Valley, CA",
   "contactEmail": "contact@techcompany.com",
   "contactPhone": "(11) 99999-9999",
   "website": "www.techcompany.com"
}
```

---

## **3. Funções básicas de Orçamento**

### **3.1 Função: `createBudget`**

A função `createBudget` é responsável por criar um novo orçamento associado ao usuário autenticado.

**Etapas:**

1. **Coleta de Dados**:
   - Obtém os dados do corpo da requisição (`req.body`), exceto o campo `status`, que é definido como `"waiting"` por padrão.

2. **Autenticação do Usuário**:
   - Extrai o token JWT usando a função `getToken`.
   - Obtém o usuário correspondente com a função `getUserByToken`.

3. **Validação do Usuário**:
   - Se o usuário não for encontrado, retorna uma mensagem de erro (422) com `"Usuário não encontrado!"`.

4. **Validações dos Campos**:
   - Verifica se todos os campos obrigatórios estão presentes:
     - `generalVision`, `proposal`, `startDate`, `endDate`, `maintenanceHours`, `creationHours`, `developmentHours`, `integrationHours` e `extraHours`.
   - Caso algum campo esteja ausente, retorna um erro (422) com uma mensagem correspondente.

5. **Obtenção das Taxas de Serviço**:
   - Recupera as taxas de serviço (`serviceRates`) associadas à empresa do usuário.

6. **Criação do Orçamento**:
   - Cria um novo documento de orçamento com os dados fornecidos, incluindo os valores calculados com base nas taxas de serviço.

7. **Associação do Orçamento ao Usuário**:
   - Salva o orçamento criado no banco de dados.
   - Adiciona o ID do orçamento à lista de orçamentos do usuário.

8. **Resposta**:
   - **Sucesso (201)**: Retorna uma mensagem de sucesso e os detalhes do orçamento criado.
   - **Erro (422)**: Mensagem de erro de validação ou usuário não encontrado.
   - **Erro (500)**: Mensagem de erro interno com detalhes do problema.

9. **Estrutura do JSON para Teste**:

```json
   {
      "message": "Orçamento criado com sucesso!",
      "budget": {
              "generalVision": "Descrição geral do primeiro orçamento...",
              "proposal": "Proposta do primeiro projeto...",
              "startDate": "2024-12-01",
              "endDate": "2024-12-31",
              "hoursAndValues": {
                  "maintenanceHours": 10,
                  "creationHours": 20,
                  "developmentHours": 15,
                  "integrationHours": 5,
                  "extraHours": 2,
                  "maintenanceValue": 500,
                  "creationValue": 1000,
                  "developmentValue": 750,
                  "integrationValue": 250,
                  "extraValue": 100
              },
      }  
   }
```

---

## **3.2 Função: `getAllUserBudgets`**

A função `getAllUserBudgets` é responsável por recuperar todos os orçamentos associados ao usuário autenticado, ordenados pela data de criação em ordem decrescente.

**Etapas:**

1. **Autenticação do Usuário**:
   - Extrai o token JWT utilizando a função `getToken`.
   - Recupera o usuário correspondente com a função `getUserByToken`.

2. **Validação do Usuário**:
   - Se o usuário não for encontrado, retorna uma mensagem de erro (422) com `"Usuário não encontrado!"`.

3. **Recuperação dos Orçamentos**:
   - Busca no banco de dados todos os orçamentos associados ao usuário autenticado, ordenados por data de criação (`createdAt`) em ordem decrescente.

4. **Resposta**:
   - **Sucesso (200)**: Retorna os orçamentos encontrados em um array.
   - **Erro (422)**: Mensagem de erro indicando que o usuário não foi encontrado.
   - **Erro (500)**: Mensagem de erro interno com detalhes do problema.

**Exemplo de Respostas**:

- **Sucesso (200)**:

  ```json
  {
      "budgets": [
          {
              "_id": "6390f1c79f1a5e001e5b345a",
              "status": "waiting",
              "generalVision": "Descrição geral do primeiro orçamento...",
              "proposal": "Proposta do primeiro projeto...",
              "startDate": "2024-12-01",
              "endDate": "2024-12-31",
              "hoursAndValues": {
                  "maintenanceHours": 10,
                  "creationHours": 20,
                  "developmentHours": 15,
                  "integrationHours": 5,
                  "extraHours": 2,
                  "maintenanceValue": 500,
                  "creationValue": 1000,
                  "developmentValue": 750,
                  "integrationValue": 250,
                  "extraValue": 100
              },
              "createdAt": "2024-12-06T12:00:00Z",
              "updatedAt": "2024-12-08T01:29:39.025Z",
          },
          {
              "_id": "1836f1c79f1a5e001e8g7dy6",
              "status": "approved",
              "generalVision": "Descrição geral do segundo orçamento...",
              "proposal": "Proposta do segundo projeto...",
              "startDate": "2024-11-01",
              "endDate": "2024-11-30",
              "hoursAndValues": {
                  "maintenanceHours": 8,
                  "creationHours": 15,
                  "developmentHours": 12,
                  "integrationHours": 6,
                  "extraHours": 1,
                  "maintenanceValue": 400,
                  "creationValue": 750,
                  "developmentValue": 600,
                  "integrationValue": 300,
                  "extraValue": 50
              },
              "createdAt": "2024-12-08T01:29:39.025Z",
              "updatedAt": "2024-12-08T01:29:39.025Z",
          }
      ]
  }
  ```

## **3.3 Função: `getBudgetById`**

A função `getBudgetById` é responsável por recuperar um orçamento específico pelo seu ID.

**Etapas:**

1. **Parâmetro de Entrada**:
   - Obtém o ID do orçamento a partir do parâmetro de rota (`req.params.id`).

2. **Busca no Banco de Dados**:
   - Procura o orçamento no banco de dados utilizando o ID fornecido.

3. **Validação da Existência**:
   - Se o orçamento não for encontrado, retorna uma mensagem de erro (422) com `"Orçamento não encontrado!"`.

4. **Resposta**:
   - **Sucesso (200)**: Retorna os detalhes do orçamento.
   - **Erro (422)**: Mensagem de erro indicando que o orçamento não foi encontrado.
   - **Erro (500)**: Mensagem de erro interno com detalhes do problema.

**Exemplo de Respostas**:

- **Sucesso (200)**:

  ```json
  {
      "budget": {
          "_id": "6390f1c79f1a5e001e5b345a",
          "status": "waiting",
          "generalVision": "Descrição geral do orçamento...",
          "proposal": "Proposta do projeto...",
          "startDate": "2024-12-01",
          "endDate": "2024-12-31",
          "hoursAndValues": {
              "maintenanceHours": 10,
              "creationHours": 20,
              "developmentHours": 15,
              "integrationHours": 5,
              "extraHours": 2,
              "maintenanceValue": 500,
              "creationValue": 1000,
              "developmentValue": 750,
              "integrationValue": 250,
              "extraValue": 100
          },
          "createdAt": "2024-12-08T01:29:39.025Z",
          "updatedAt": "2024-12-08T01:29:39.025Z",
      }
  }
  ```
  
---

## **3.4 Função: `updateBudget`**

A função `updateBudget` atualiza os dados de um orçamento específico associado ao usuário autenticado.

**Etapas:**

1. **Parâmetro de Entrada**:
   - Obtém o ID do orçamento a partir de `req.params.id`.
   - Recupera os dados atualizados do orçamento a partir de `req.body`.

2. **Autenticação e Validação**:
   - Extrai e valida o token JWT.
   - Verifica se o usuário existe.
   - Verifica se o orçamento existe no banco de dados.
   - Confirma se o orçamento pertence ao usuário autenticado.

3. **Validações de Entrada**:
   - Certifica-se de que todos os campos obrigatórios estão preenchidos: `status`, `generalVision`, `proposal`, `startDate`, `endDate` e todos os campos de horas.

4. **Atualização no Banco de Dados**:
   - Calcula os novos valores baseados nas horas fornecidas e nas taxas da empresa do usuário.
   - Atualiza o orçamento no banco de dados.

5. **Resposta**:
   - **Sucesso (200)**: Mensagem de sucesso e dados atualizados do orçamento.
   - **Erro (422)**: Mensagens de erro indicando problemas de validação ou autorização.
   - **Erro (500)**: Mensagem de erro interno.

6. **Estrutura do JSON para Teste**:

```json
{
    "maintenanceHours": 10,
    "creationHours": 11,
    "developmentHours": 12,
    "integrationHours": 13,
    "extraHours": 14,
    "maintenanceValue": 1000,
    "creationValue": 1650,
    "developmentValue": 1800,
    "integrationValue": 2340,
    "extraValue": 1680,
    "status": "waiting",
    "generalVision": "A general edited vision of the budget's project.",
    "proposal": "How the budget's project will be edited.",
    "startDate": "2024-12-01T00:00:00.000Z",
    "endDate": "2024-12-31T00:00:00.000Z"
}
```

---

## **3.5 Função: `deleteBudget`**

A função `deleteBudget` remove um orçamento específico associado ao usuário autenticado.

**Etapas:**

1. **Parâmetro de Entrada**:
   - Obtém o ID do orçamento a partir de `req.params.id`.

2. **Autenticação e Validação**:
   - Extrai e valida o token JWT.
   - Verifica se o usuário existe.
   - Confirma se o orçamento existe no banco de dados.
   - Verifica se o orçamento pertence ao usuário autenticado.

3. **Exclusão do Orçamento**:
   - Remove o orçamento do banco de dados pelo ID.

4. **Resposta**:
   - **Sucesso (200)**: Mensagem confirmando a exclusão do orçamento.
   - **Erro (422)**: Mensagens de erro indicando problemas de validação ou autorização.
   - **Erro (500)**: Mensagem de erro interno.

---

## **3.6 Função: `dashboard`**

A função `dashboard` retorna métricas consolidadas sobre os orçamentos associados ao usuário autenticado.

**Etapas:**

1. **Autenticação do Usuário**:
   - Obtém o token JWT da requisição e valida o usuário associado.
   - Verifica se o usuário existe no sistema.

2. **Cálculos de Métricas**:
   - **Total de Orçamentos com Status `'waiting'`**:
     - Conta todos os orçamentos do usuário com status "waiting".
   - **Total de Orçamentos com Status `'approved'`**:
     - Conta todos os orçamentos do usuário com status "approved".
   - **Total de Orçamentos Criados nos Últimos 3 Meses**:
     - Filtra os orçamentos criados nos últimos 3 meses usando o campo `createdAt`.

3. **Resposta**:
   - **Sucesso (200)**: Retorna as métricas calculadas.
   - **Erro (422)**: Indica que o usuário não foi encontrado.
   - **Erro (500)**: Retorna uma mensagem de erro interno.

---
