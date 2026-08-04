# 💻 Plataforma de Recrutamento Interno - Frontend Angular



Interface web responsiva e moderna desenvolvida em Angular para a Plataforma de Recrutamento Interno, fornecendo uma experiência visual fluida tanto para colaboradores (Candidatos) quanto para a equipe de Recursos Humanos (Administradores/RH).

---

## 📌 Principais Funcionalidades

- **Autenticação & Controle de Acesso:** Tela de login integrada com armazenamento seguro de JWT em localStorage e suporte a controle de rotas por perfis (ROLE_ADMIN e ROLE_CANDIDATO).
- **Navegação Adaptativa & Guards:** Proteção de telas com RoleGuard e navegação baseada no perfil autenticado.
- **Painel de Vagas (Geral):**
    - Visualização de oportunidades com filtros em tempo real por título e requisitos.
    - Interface diferenciada para Admin (Criar, Editar, Encerrar Inscrições e ver Candidatos) e para Colaborador (Candidatar-se / Estado de "Aplicado").
    - Modais interativos para criação, edição e encerramento de vagas.

- **Gestão de Candidatos (RH):**
    - Tabela responsiva com dados completos dos candidatos inscritos.
    - Filtros avançados por vaga, busca textual por candidato e status da candidatura.
    - Modal de avaliação para atribuição de notas (1 a 10), feedbacks e alteração de etapas (RECEBIDA, EM_ANALISE, APROVADO, REJEITADO).

- **Painel do Candidato:** Acompanhamento do histórico de inscrições, notas recebidas e feedbacks de processos seletivos.

- **Suporte a Dark Mode / Light Mode:** Alternância de temas em tempo real via ThemeService.

- **Design Totalmente Responsivo:** Layout adaptável para dispositivos móveis, tablets e desktops com quebras fluidas nos elementos de cabeçalho e modais.

---

## 🏗️ Estrutura do Projeto

A aplicação foi organizada utilizando arquitetura baseada em Standable Components, separando responsabilidades de forma clara e escalável:

```text
Plaintext
recrutamento-interno-web/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/          # Proteção de rotas (AuthGuard, RoleGuard)
│   │   │   ├── interceptors/    # Injeção automática de Token Bearer JWT (JwtInterceptor)
│   │   │   ├── models/          # Interfaces TypeScript (Vaga, Candidatura, Usuario)
│   │   │   └── services/        # Serviços globais (ThemeService, NotificationService)
│   │   ├── pages/
│   │   │   ├── gestao-candidatos/# Tela de Avaliação e Triagem de Candidatos (RH)
│   │   │   ├── login/           # Tela de Autenticação
│   │   │   ├── painel-candidato/# Tela de Acompanhamento do Colaborador
│   │   │   └── vagas/           # Tela de Listagem e Gestão de Vagas
│   │   ├── services/            # Serviços HTTP (AuthService, VagaService, CandidaturaService)
│   │   ├── app.component.ts     # Componente Raiz
│   │   ├── app.config.ts        # Configurações globais do Angular (Providers, Router, Interceptors)
│   │   └── app.routes.ts        # Mapeamento de Rotas
│   ├── assets/                  # Imagens, ícones e recursos estáticos
│   ├── styles.scss              # Estilos globais e variáveis de temas (CSS Variables)
│   └── index.html               # Documento Principal HTML
├── .gitignore                   # Regras de ignorados pelo Git
├── angular.json                 # Configurações da CLI do Angular
├── package.json                 # Dependências e scripts Node.js
└── README.md                    # Documentação da Solução
```
---

## 🛠️ Tecnologias Utilizadas

- **Framework:** Angular (Standable Components & Control Flow Syntax @if / @for)
- **Linguagem:** TypeScript
- **Estilização:** SASS / SCSS (CSS Variables, Flexbox, CSS Grid & Media Queries)
- **Comunicação HTTP:** Angular HttpClient & RxJS
- **Gerenciamento de Formulários:** Reactive Forms (FormBuilder, FormGroup, Validators)
- **Tooling & Build:** Angular CLI / Vite

---

## ⚡ Como Rodar o Projeto

### Pré-requisitos

- **Node.js (versão 18 ou superior)**

   ```bash
   npm (incluso com o Node.js)
   ```

- **Backend RESTful API rodando na porta 8080 (http://localhost:8080)**

### Passo a Passo

1. **Clonar o Repositório:**

   ```bash
    git clone https://github.com/Murillosys/recrutamento-interno-web.git
    cd recrutamento-interno-web
   ```

2. **Instalar as Dependências:**

   ```bash
   npm install
   ```

3. **Executar o Servidor de Desenvolvimento:**

   ```bash
   npm run start
   ```

   ou via Angular CLI:

   ```bash
   ng serve
   ```

### Acessar no Navegador:

Navegue para http://localhost:4200/. A aplicação recarregará automaticamente se você alterar qualquer arquivo fonte.

---

## 👥 Credenciais de Teste Padrão

Para testar a aplicação no ambiente local, utilize as credenciais cadastradas na carga inicial do backend:

| Perfil | E-mail | Senha Padrão | Funcionalidades de Acesso |
| :--- | :--- | :--- | :--- |
| **Administrador / RH** | `admin@empresa.com` | `admin1234` | `Criar/Editar/Encerrar vagas, realizar triagem e avaliar candidaturas.` |
| **Candidato / Colaborador** | `joao.candidato@empresa.com` | `admin1234` | `Candidatar-se a vagas e acompanhar status e pareceres.` |
| **Candidato / Colaborador** | `maria.candidato@empresa.com` | `admin1234` | `Candidatar-se a vagas e acompanhar status e pareceres.` |