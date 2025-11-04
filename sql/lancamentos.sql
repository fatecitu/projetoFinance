-- ===========================================================
-- TABELA: lançamentos financeiros por usuário
-- ===========================================================
create table if not exists lancamentos (
  id uuid constraint pk_lancamentos primary key default gen_random_uuid(),
  user_id uuid constraint fk_lancamentos_user references auth.users on delete cascade /*Quando uma linha da tabela referenciada é excluída, todas as linhas relacionadas na tabela filha (que possuem a foreign key) são automaticamente deletadas.*/
               constraint df_lancamentos_user DEFAULT auth.uid(),
  categoria_id uuid constraint fk_lancamentos_categoria references categorias(id) on delete restrict, /*Impede a exclusão de uma linha da tabela referenciada enquanto existirem registros dependentes na tabela filha.*/
  valor numeric(12,2) not null constraint ck_lancamentos_valor check (valor >= 0),
  descricao varchar(200),
  data_ocorrencia date not null,
  data_vencimento date constraint ck_lancamentos_vencimento check (data_vencimento is null or data_vencimento >= data_ocorrencia),
  created_at timestamp with time zone constraint df_lancamentos_created default timezone('utc'::text, now()),
  updated_at timestamp with time zone constraint df_lancamentos_updated default timezone('utc'::text, now())  
);

-- ===========================================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- ===========================================================
alter table lancamentos enable row level security;

-- 1. Política de Leitura (SELECT)
CREATE POLICY "Permitir SELECT apenas para o próprio usuário"
ON lancamentos
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Política de Criação (INSERT)
-- A segurança é garantida pela função DEFAULT (auth.uid()) e pelo token JWT.
CREATE POLICY "Permitir INSERT para usuários autenticados"
ON lancamentos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- 3. Política de Atualização (UPDATE)
CREATE POLICY "Permitir UPDATE apenas para o próprio usuário"
ON lancamentos
FOR UPDATE
USING (auth.uid() = user_id);

-- 4. Política de Exclusão (DELETE)
CREATE POLICY "Permitir DELETE apenas para o próprio usuário"
ON lancamentos
FOR DELETE
USING (auth.uid() = user_id);