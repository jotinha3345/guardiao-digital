# Diagramas do Projeto Guardiao Digital

Este documento apresenta uma concepcao inicial do sistema Guardiao Digital, incluindo visao conceitual, arquitetura, modelo de dados e fluxos principais.

## 1. Visao Conceitual

```mermaid
mindmap
  root((Guardiao Digital))
    Comunidade
      Denunciar golpes
      Consultar alertas
      Compartilhar informacoes
    Seguranca da informacao
      Autenticacao
      Validacao de dados
      Upload controlado
      Moderacao admin
    Educacao digital
      Materiais educativos
      Quiz anti-golpe
      Orientacoes de emergencia
    Administracao
      Aprovar denuncias
      Rejeitar denuncias
      Visualizar estatisticas
      Monitorar cidades afetadas
```

## 2. Arquitetura Geral

```mermaid
flowchart LR
  U[Usuario da comunidade] --> FE[Frontend React + Vite]
  A[Administrador] --> FE

  FE -->|Axios / REST| API[Backend Node.js + Express]

  API --> AUTH[JWT Authentication]
  API --> UPLOAD[Multer Upload]
  API --> PRISMA[Prisma ORM]

  PRISMA --> DB[(PostgreSQL)]
  UPLOAD --> FILES[Pasta uploads]

  API --> R1[Rotas Auth]
  API --> R2[Rotas Denuncias]
  API --> R3[Rotas Admin]
  API --> R4[Rotas Material Educativo]
  API --> R5[Rotas Quiz]
```

## 3. Modelo Conceitual de Dados

```mermaid
erDiagram
  USUARIO ||--o{ DENUNCIA : realiza
  USUARIO ||--o{ RESULTADO_QUIZ : possui
  ADMINISTRADOR ||--o{ DENUNCIA : modera
  MATERIAL_EDUCATIVO }o--|| COMUNIDADE : orienta
  PERGUNTA_QUIZ ||--o{ RESULTADO_QUIZ : compoe

  USUARIO {
    string nome
    string email
    string senha
    string cidade
    string telefone
  }

  ADMINISTRADOR {
    string nome
    string email
    string senha
  }

  DENUNCIA {
    string tipo_golpe
    string descricao
    string numero_suspeito
    string link_suspeito
    string nome_suspeito
    string imagem
    string cidade
    string status
  }

  MATERIAL_EDUCATIVO {
    string titulo
    string resumo
    string conteudo
    string categoria
  }

  PERGUNTA_QUIZ {
    string pergunta
    string resposta_correta
    string explicacao
  }

  RESULTADO_QUIZ {
    int pontuacao
    string nivel
  }
```

## 4. Modelo Logico

```mermaid
erDiagram
  users ||--o{ denuncias : "usuario_id"
  users ||--o{ quiz_resultados : "usuario_id"

  users {
    string id PK
    string nome
    string email UK
    string senha
    string cidade
    string telefone
    datetime created_at
  }

  admins {
    string id PK
    string nome
    string email UK
    string senha
    datetime created_at
  }

  denuncias {
    string id PK
    string tipo_golpe
    string descricao
    string numero_suspeito
    string link_suspeito
    string nome_suspeito
    string imagem
    string cidade
    string usuario_id FK
    enum status
    datetime created_at
    datetime updated_at
  }

  materiais_educativos {
    string id PK
    string slug UK
    string titulo
    string resumo
    string conteudo
    string categoria
    datetime created_at
  }

  quiz_perguntas {
    string id PK
    string pergunta
    string resposta_correta
    string explicacao
    datetime created_at
  }

  quiz_resultados {
    string id PK
    string usuario_id FK
    int pontuacao
    string nivel
    datetime created_at
  }
```

## 5. Modelo Fisico Simplificado

```mermaid
classDiagram
  class users {
    TEXT id
    TEXT nome
    TEXT email UNIQUE
    TEXT senha
    TEXT cidade
    TEXT telefone
    TIMESTAMP created_at
  }

  class admins {
    TEXT id
    TEXT nome
    TEXT email UNIQUE
    TEXT senha
    TIMESTAMP created_at
  }

  class denuncias {
    TEXT id
    TEXT tipo_golpe
    TEXT descricao
    TEXT numero_suspeito
    TEXT link_suspeito
    TEXT nome_suspeito
    TEXT imagem
    TEXT cidade
    TEXT usuario_id
    DenunciaStatus status
    TIMESTAMP created_at
    TIMESTAMP updated_at
  }

  class materiais_educativos {
    TEXT id
    TEXT slug UNIQUE
    TEXT titulo
    TEXT resumo
    TEXT conteudo
    TEXT categoria
    TIMESTAMP created_at
  }

  class quiz_perguntas {
    TEXT id
    TEXT pergunta
    TEXT resposta_correta
    TEXT explicacao
    TIMESTAMP created_at
  }

  class quiz_resultados {
    TEXT id
    TEXT usuario_id
    INTEGER pontuacao
    TEXT nivel
    TIMESTAMP created_at
  }

  users "1" --> "0..*" denuncias
  users "1" --> "0..*" quiz_resultados
```

## 6. Casos de Uso

```mermaid
flowchart TB
  Usuario[Usuario]
  Admin[Administrador]

  UC1((Cadastrar conta))
  UC2((Entrar no sistema))
  UC3((Denunciar golpe))
  UC4((Consultar denuncias))
  UC5((Acessar materiais educativos))
  UC6((Responder quiz anti-golpe))
  UC7((Consultar emergencia))
  UC8((Aprovar denuncia))
  UC9((Rejeitar denuncia))
  UC10((Visualizar estatisticas))

  Usuario --> UC1
  Usuario --> UC2
  Usuario --> UC3
  Usuario --> UC4
  Usuario --> UC5
  Usuario --> UC6
  Usuario --> UC7

  Admin --> UC2
  Admin --> UC8
  Admin --> UC9
  Admin --> UC10
```

## 7. Fluxo de Denuncia

```mermaid
sequenceDiagram
  actor Usuario
  participant Frontend
  participant API
  participant Multer
  participant Prisma
  participant PostgreSQL

  Usuario->>Frontend: Preenche tipo, descricao e dados suspeitos
  Usuario->>Frontend: Envia imagem opcional
  Frontend->>API: POST /denuncias/create com JWT
  API->>API: Valida token do usuario
  API->>Multer: Processa upload seguro
  API->>Prisma: Cria denuncia com status pendente
  Prisma->>PostgreSQL: INSERT em denuncias
  PostgreSQL-->>Prisma: Denuncia salva
  Prisma-->>API: Registro criado
  API-->>Frontend: Confirmacao
  Frontend-->>Usuario: Exibe mensagem de sucesso
```

## 8. Fluxo de Moderacao Admin

```mermaid
sequenceDiagram
  actor Admin
  participant Frontend
  participant API
  participant Prisma
  participant PostgreSQL

  Admin->>Frontend: Acessa painel administrativo
  Frontend->>API: POST /admin/login
  API-->>Frontend: Retorna JWT admin
  Frontend->>API: GET /admin/denuncias
  API->>API: Valida token admin
  API->>Prisma: Busca denuncias
  Prisma->>PostgreSQL: SELECT denuncias
  PostgreSQL-->>Prisma: Lista de denuncias
  Prisma-->>API: Dados
  API-->>Frontend: Tabela admin
  Admin->>Frontend: Aprova ou rejeita denuncia
  Frontend->>API: POST /admin/aprovar ou /admin/rejeitar
  API->>Prisma: Atualiza status
  Prisma->>PostgreSQL: UPDATE denuncias
  API-->>Frontend: Status atualizado
```

## 9. Fluxo de Consulta Publica

```mermaid
flowchart TD
  A[Visitante informa numero, link ou palavra-chave] --> B[Frontend envia GET /denuncias/search]
  B --> C[Backend pesquisa denuncias aprovadas]
  C --> D{Quantidade encontrada}
  D -->|0 a 2| E[Baixo risco]
  D -->|3 a 9| F[Atencao]
  D -->|10 ou mais| G[Alto risco]
  E --> H[Exibe resultados e badge]
  F --> H
  G --> H
```

## 10. Fluxo do Quiz Anti-Golpe

```mermaid
flowchart TD
  A[Usuario acessa quiz] --> B[Frontend busca perguntas em /quiz/list]
  B --> C[Usuario responde confiavel ou golpe]
  C --> D[Frontend envia respostas para /quiz/submit]
  D --> E[Backend compara respostas]
  E --> F[Calcula pontuacao]
  F --> G{Nivel}
  G -->|Abaixo de 50 por cento| H[Iniciante]
  G -->|50 a 79 por cento| I[Atento]
  G -->|80 por cento ou mais| J[Especialista digital]
  H --> K[Exibe explicacoes educativas]
  I --> K
  J --> K
```

## 11. Camadas do Sistema

```mermaid
flowchart TB
  subgraph Apresentacao
    P1[React Pages]
    P2[Componentes reutilizaveis]
    P3[React Router]
  end

  subgraph Comunicacao
    C1[Axios Client]
    C2[REST API]
  end

  subgraph Backend
    B1[Express App]
    B2[Middlewares JWT]
    B3[Middlewares Admin]
    B4[Multer Upload]
    B5[Rotas e Controllers]
  end

  subgraph Persistencia
    D1[Prisma ORM]
    D2[(PostgreSQL)]
    D3[Uploads locais]
  end

  P1 --> P2
  P1 --> P3
  P3 --> C1
  C1 --> C2
  C2 --> B1
  B1 --> B2
  B1 --> B3
  B1 --> B4
  B1 --> B5
  B5 --> D1
  D1 --> D2
  B4 --> D3
```
