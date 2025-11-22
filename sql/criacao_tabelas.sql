CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DROP TABLE IF EXISTS equipe_tecnico CASCADE;
DROP TABLE IF EXISTS visita_tecnica CASCADE;
DROP TABLE IF EXISTS produto_projeto CASCADE;
DROP TABLE IF EXISTS projeto CASCADE;
DROP TABLE IF EXISTS produto CASCADE;
DROP TABLE IF EXISTS equipe CASCADE;
DROP TABLE IF EXISTS tecnico CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;

CREATE TABLE cliente (
  cliente_id     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome           VARCHAR(120) NOT NULL,
  cpf_cnpj       VARCHAR(20)  NOT NULL UNIQUE,
  email          VARCHAR(180),
  telefone       VARCHAR(30),
  logradouro     VARCHAR(150),
  numero         VARCHAR(20),
  complemento    VARCHAR(80),
  bairro         VARCHAR(80),
  cidade         VARCHAR(80),
  uf             CHAR(2),
  cep            VARCHAR(10)
);

CREATE TABLE equipe (
  equipe_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome      VARCHAR(120) NOT NULL,
  ativo     BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE tecnico (
  tecnico_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       VARCHAR(120) NOT NULL,
  cpf        VARCHAR(14) UNIQUE,
  email      VARCHAR(180),
  telefone   VARCHAR(30),
  ativo      BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE equipe_tecnico (
  equipe_id  UUID NOT NULL,
  tecnico_id UUID NOT NULL,
  funcao     VARCHAR(60),
  PRIMARY KEY (equipe_id, tecnico_id),
  CONSTRAINT fk_eqt_equipe  FOREIGN KEY (equipe_id)  REFERENCES equipe (equipe_id)  ON DELETE CASCADE,
  CONSTRAINT fk_eqt_tecnico FOREIGN KEY (tecnico_id) REFERENCES tecnico (tecnico_id) ON DELETE RESTRICT
);

CREATE TABLE produto (
  produto_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       VARCHAR(120) NOT NULL,
  tipo       VARCHAR(60)  NOT NULL,
  preco      NUMERIC(12,2) NOT NULL CHECK (preco >= 0),
  unidade    VARCHAR(20)   NOT NULL
);

CREATE TABLE projeto (
  projeto_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo           VARCHAR(150) NOT NULL,
  descricao        TEXT,
  status           VARCHAR(30) NOT NULL DEFAULT 'pendente',
  valor_estimado   NUMERIC(12,2),
  data_solicitacao DATE NOT NULL DEFAULT CURRENT_DATE,
  data_aprovacao   DATE,
  consumo_medio    NUMERIC(10,2),
  cliente_id       UUID NOT NULL,
  CONSTRAINT fk_proj_cliente FOREIGN KEY (cliente_id) REFERENCES cliente (cliente_id) ON DELETE RESTRICT
);

CREATE TABLE produto_projeto (
  projeto_id  UUID NOT NULL,
  produto_id  UUID NOT NULL,
  quantidade  NUMERIC(12,2) NOT NULL CHECK (quantidade > 0),
  observacao  VARCHAR(255),
  PRIMARY KEY (projeto_id, produto_id),
  CONSTRAINT fk_pp_projeto FOREIGN KEY (projeto_id) REFERENCES projeto (projeto_id) ON DELETE CASCADE,
  CONSTRAINT fk_pp_produto FOREIGN KEY (produto_id) REFERENCES produto (produto_id) ON DELETE RESTRICT
);

CREATE TABLE visita_tecnica (
  visita_tecnica_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_agendada     TIMESTAMP NOT NULL,
  data_realizada    TIMESTAMP,
  status            VARCHAR(30) NOT NULL DEFAULT 'agendada',
  observacao        TEXT,
  projeto_id        UUID NOT NULL,
  equipe_id         UUID NOT NULL,
  CONSTRAINT fk_vt_projeto FOREIGN KEY (projeto_id) REFERENCES projeto (projeto_id) ON DELETE CASCADE,
  CONSTRAINT fk_vt_equipe  FOREIGN KEY (equipe_id)  REFERENCES equipe  (equipe_id)  ON DELETE RESTRICT
);
