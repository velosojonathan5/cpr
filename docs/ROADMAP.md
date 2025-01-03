# Roadmap - Plataforma Digital CPR

## 🗂️ Backend

- [x] **Criação de CPR** com persistência in-memory.
- [x] Finalizar **geração do documento da CPR**.
- [x] Adicionar **persistência nos arquivos da aplicação** (S3, GCP Buckets).
- [x] Adicionar **persistência dos dados da aplicação** (banco de dados).
- [x] Implementar **autenticação** (ex: Cognito ou outra solução).
- [ ] Criar **rotas de CRUD** (emitente, credor, fazendas, local de entrega, etc.).
- [ ] Implementar funcionalidade de **envio para assinatura digital**, conforme o provedor do tenant.
- [ ] Revisar e ajustar lógica do backend (detalhar escopo).
- [ ] Adicionar suporte a **multi-tenant** (lógica de organizações).

---

## 🎨 Frontend

- [ ] Escolher **tecnologias**, arquitetura e biblioteca de UI.
- [ ] Configurar o **setup inicial do projeto**.
- [ ] Criar **tela de login**.
- [ ] Criar **tela de criação da CPR**.
- [ ] Criar **tela de busca das CPRs**.
- [ ] Desenvolver telas para **CRUD** (emitente, credor, fazendas, local de entrega, etc.).
- [ ] Prototipar e validar as telas com potenciais usuários.

---

## 🚀 DevOps

- [ ] Escolher **cloud provider** e definir infraestrutura (AWS, GCP, Azure, etc.).
- [ ] Configurar **Continuous Integration** (ex: unit tests, gitleaks).
- [ ] Configurar **Continuous Delivery**.

---

## 📊 Negócio

- [ ] Definir o **nome do produto**.
- [ ] Criar o **logo** e identidade visual.
- [ ] Planejar estratégias de precificação e monetização (modelo SaaS).

---

## ✅ Qualidade

- [ ] Definir um **processo de testes** (unitário, integração, e2e).
- [ ] Criar um ambiente de **teste automatizado**.
- [ ] Validar funcionalidades com grupos de usuários reais.
- [ ] Monitorar e melhorar a performance e segurança.
