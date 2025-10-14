-- ===========================================================
-- CARGA INICIAL DE CATEGORIAS
-- (Executar via SQL Editor no Supabase)
-- ===========================================================

-- Receitas 💰
insert into categorias (descricao, tipo) values  
  ('Salário 💼', 'receita'),
  ('Freelance 🧾', 'receita'),
  ('Investimentos 📈', 'receita'),
  ('Rendimentos Bancários 🏦', 'receita'),
  ('Presentes 🎁', 'receita'),
  ('Reembolso 💸', 'receita'),
  ('Dividendos 📊', 'receita');

-- Despesas 🛒
insert into categorias (descricao, tipo) values  
  ('Alimentação 🍽️', 'despesa'),
  ('Transporte 🚌', 'despesa'),
  ('Moradia 🏠', 'despesa'),
  ('Contas (Luz, Água, Internet) 💡', 'despesa'),
  ('Compras Pessoais 🛍️', 'despesa'),
  ('Saúde ⚕️', 'despesa'),
  ('Educação 🎓', 'despesa'),
  ('Lazer 🎉', 'despesa'),
  ('Viagem ✈️', 'despesa'),
  ('Pets 🐶', 'despesa'),
  ('Vestuário 👕', 'despesa'),
  ('Veículo 🚗', 'despesa'),
  ('Assinaturas/Serviços 📱', 'despesa'),
  ('Dívidas/Empréstimos 💳', 'despesa'),
  ('Manutenção 🛠️', 'despesa'),
  ('Cuidados Pessoais 💅', 'despesa'),
  ('Presentes/Doações 🎁', 'despesa');
