# Guia de Deploy no EasyPanel (Separado)

Para colocar seu sistema no ar, você deve criar **3 serviços** dentro do mesmo Projeto no EasyPanel.

## 1. Banco de Dados (Postgres)
1.  Clique em **Add Service** -> **Database** -> **Postgres**.
2.  Defina o nome como `postgres` (facilita a conexão).
3.  **Anote a senha** ou use a padrão gerada.
4.  Crie o serviço.

## 2. API (Backend)
1.  Clique em **Add Service** -> **App**.
2.  Dê o nome exato de: `vira-api` (Importante para o site encontrar).
3.  **Source**: Selecione seu GitHub e este repositório.
4.  **Build Settings**:
    - **Root Directory**: `./api` (Preste atenção nisso!)
5.  **Environment Variables** (Copie os dados do passo 1):
    - `DB_HOST`: `postgres` (ou o IP interno do banco)
    - `DB_USER`: `postgres`
    - `DB_PASSWORD`: (A senha do banco)
    - `DB_NAME`: `vira_db`
    - `JWT_SECRET`: (Crie uma senha secreta qualquer)
6.  **Port**: Certifique-se que está `3000`.
7.  Clique em **Create/Deploy**.

## 3. Frontend (Site)
1.  Clique em **Add Service** -> **App**.
2.  Nome: `vira-site` (ou o que preferir).
3.  **Source**: Mesmo repositório.
4.  **Build Settings**:
    - **Root Directory**: `./` (Deixe virazio ou ponto).
5.  **Domains**: Configure seu domínio (ex: `vira.com`).
6.  **Port**: `80`.
7.  Clique em **Create/Deploy**.

---

## 🛠 Como funciona a conexão?
- O **Site** recebe o acesso do usuário.
- Quando o usuário tenta Logar, o site chama `/api`.
- O **Nginx** (no site) pega essa chamada e manda para o serviço chamado `api`.
- A **API** recebe, processa no **Postgres** e devolve a resposta.

> **Nota**: Se o serviço da API não se chamar `vira-api`, você precisará editar o arquivo `nginx.conf` no código e mudar a linha `proxy_pass http://vira-api:3000/;` para `http://nome-que-voce-deu:3000/;`.
