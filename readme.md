# Funções de Usuário com Configurações de Empresa - API Backend

Este documento explica as funcionalidades do código responsáveis pelo registro, login e atualizações das informações de um usuário com informações detalhadas de sua empresa, bem como o teste associado para validar cada função.

---

## **Descrição do Código**

### **Função: `register`**

A função `register` é um endpoint para criar um novo usuário com dados detalhados de perfil e empresa. Ela realiza as seguintes etapas:

1. **Recebimento dos Dados do Usuário**:
   - O corpo da requisição (`req.body`) deve conter informações do usuário e da empresa, como nome, email, senha, CNPJ, taxas de serviço, endereço, entre outros.

2. **Validações**:
   - **Campos obrigatórios**: Verifica se todos os campos necessários foram fornecidos.
   - **Senha**: Verifica se a senha atende a critérios de segurança (mínimo 8 caracteres, incluindo maiúsculas, minúsculas, números e caracteres especiais).
   - **Email único**: Confirma que o email informado ainda não está cadastrado.
   - **CNPJ único**: Verifica se o CNPJ informado não foi usado por outro usuário.

3. **Hash da Senha**:
   - Utiliza o `bcrypt` para gerar um hash seguro da senha antes de armazená-la no banco de dados.

4. **Criação do Usuário**:
   - Cria um novo documento no banco de dados MongoDB com as informações fornecidas, incluindo um subdocumento de configurações (`settings`) que contém os dados da empresa vinculada ao usuário.

5. **Resposta**:
   - Retorna um token e uma mensagem de sucesso com o código HTTP 201 se o cadastro for bem-sucedido.
   - Em caso de erro, retorna uma mensagem apropriada com o código HTTP 422 ou 500.

Exemplo de resposta em caso de sucesso:

```json
{
    "message": "Autenticado com sucesso!",
    "token": "<tokenJWTválido>",
    "userId": "<id do usuário>",
}
```

---

## **Estrutura do JSON para Teste**

O exemplo abaixo ilustra os dados esperados na requisição para testar a funcionalidade de registro:

```json
{
  "name": "John Doe",
  "email": "user@techcompany.com",
  "password": "Aa123456_",
  "confirmpassword": "Aa123456_",
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

### **Função: `login`**

A função `login` permite que um usuário existente autentique-se na aplicação. Ela realiza as seguintes etapas:

1. **Recebimento dos Dados de Login**:
   - O corpo da requisição (`req.body`) deve conter o email e a senha do usuário.

2. **Validações**:
   - **Campos obrigatórios**: Verifica se os campos `email` e `password` foram preenchidos.
   - **Usuário existente**: Confirma se há um registro correspondente ao email fornecido no banco de dados.

3. **Verificação da Senha**:
   - Utiliza o `bcrypt` para comparar a senha fornecida com o hash armazenado no banco de dados.

4. **Geração do Token**:
   - Caso o email e a senha estejam corretos, chama a função `createUserToken` para gerar e enviar um token JWT ao cliente.

5. **Resposta**:
   - Retorna mensagens apropriadas para os seguintes cenários:
     - Login bem-sucedido.
     - Campos obrigatórios ausentes.
     - Email não encontrado.
     - Senha incorreta.

Exemplo de resposta em caso de sucesso:

```json
{
    "message": "Autenticado com sucesso!",
    "token": "<tokenJWTválido>",
    "userId": "<id do usuário>",
}
```

---

## Estrutura do JSON para Teste

O exemplo abaixo ilustra os dados esperados na requisição para testar a funcionalidade de login:

```json
{
    "email": "user@techcompany.com",
    "password": "Aa123456_"
}
```
