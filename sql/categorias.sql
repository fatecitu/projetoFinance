--Criação da tabela de Categorias
--uuid = universal unique identifier
create table categorias(
    id uuid constraint pk_categorias primary key 
            constraint df_categorias_id default gen_random_uuid(),
    descricao varchar(100) not null
            constraint uk_categorias_descricao unique,
    tipo char(7) not null constraint ck_categorias_tipo check
    (tipo in ('receita','despesa'))
)    
--Habilitar RLS - Row Level Security no Supabase
alter table categorias enable row level security;
--Politica de leitura
create policy "Permitir leitura pública das categorias"
on categorias for select using (true);
--Politica de insert/update (with check é a condição de checagem)
create policy "Bloquear alterações nas categorias"
on categorias for all using (false) with check(false);