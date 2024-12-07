# Funções de Usuário com Configurações de Empresa - API Backend

Este documento descreve as funcionalidades relacionadas ao registro, login e gerenciamento das configurações de um usuário e sua empresa.

---

## **1. Descrição do Código**

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

6. **Estrutura do JSON para Teste**:
   - O exemplo abaixo ilustra os dados esperados na requisição para testar a funcionalidade de atualização de configurações:

```json
{
  "name": "John Doe",
  "email": "user@techcompany.com",
  "password": "Aa123456_",
  "confirmpassword": "Aa123456_",
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
  "website": "www.techcompany.com",
  "logo": "company_logo.png"
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

6. **Estrutura do JSON para Teste**:
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
    "message": "Dados atualizados com sucesso!",
    "data": {
        "serviceRates": {
            "maintenance": 100,
            "creation": 150,
            "development": 150,
            "integration": 180,
            "extra": 120
        },
        "companyName": "Tech Company",
        "cnpj": "12.345.678/0001-90",
        "address": "123 Tech Street, Silicon Valley, CA",
        "contactEmail": "contact@techcompany.com",
        "contactPhone": "(11) 99999-9999",
        "website": "www.techcompany.com",
        "logo": "company_logo.png"
    }
}
```

---

## **3.1 Função: `createBudget`**

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
         "generalVision": "A general vision of the budget's project.",
         "proposal": "How the budget's project will be made.",
         "startDate": "2024-12-01",
         "endDate": "2024-12-31",
         "maintenanceHours": 10,
         "creationHours": 11,
         "developmentHours": 12,
         "integrationHours": 13,
         "extraHours": 14
      }  
   }
```
