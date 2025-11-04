import { SUPABASE_URL, API_KEY } from "./config.js";
import { logout } from "./auth.js";

const token = localStorage.getItem("sb_token")

// Buscar lançamentos
export async function buscarLancamentos() {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/lancamentos?select=*,categorias(descricao)`, {
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${token}`
    }
  });
  if (res.status === 401) {
    logout()
  }
  return res.json();
}

// Adicionar lançamento
export async function adicionarLancamento(lancamento) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/lancamentos`, {
    method: "POST",
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(lancamento)
  });
  if (res.status === 201) {
    // Se o status for 201 Created, consideramos sucesso e retornamos sem tentar ler o JSON.
    // O Supabase/PostgREST geralmente retorna 201 com body vazio.
    return true;
  }

  if (res.ok) {
    // Se o status for 200 (OK), 202 (Accepted), ou outro sucesso COM corpo.
    // (Isso é mais comum para GET/PUT, mas é bom ter).
    return res.json();
  }

  // Trata erros (4xx ou 5xx). Tenta ler o body caso a API envie detalhes do erro.
  try {
    const errorBody = await res.json();
    throw new Error(errorBody.message || `Erro do servidor: Status ${res.status}`);
  } catch (e) {
    // Se falhar ao ler o JSON (body vazio em erro, por exemplo), lança o erro com o status.
    throw new Error(`Falha na requisição: Status ${res.status}`);
  }
}

// Editar lançamento
export async function editarLancamento(id, dados) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/lancamentos?id=eq.${id}`, {
    method: "PUT",
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  });
  if (res.status === 204) {
    // Se o status for 204 No Content, consideramos sucesso e retornamos sem tentar ler o JSON.
    // O Supabase/PostgREST geralmente retorna 204 com body vazio no update
    return true;
  }

  if (res.ok) {
    // Se o status for 200 (OK), 202 (Accepted), ou outro sucesso COM corpo.
    // (Isso é mais comum para GET/PUT, mas é bom ter).
    return res.json();
  }

  // Trata erros (4xx ou 5xx). Tenta ler o body caso a API envie detalhes do erro.
  try {
    const errorBody = await res.json();
    throw new Error(errorBody.message || `Erro do servidor: Status ${res.status}`);
  } catch (e) {
    // Se falhar ao ler o JSON (body vazio em erro, por exemplo), lança o erro com o status.
    throw new Error(`Falha na requisição: Status ${res.status}`);
  }
}

// Excluir lançamento
export async function excluirLancamento(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/lancamentos?id=eq.${id}`, {
    method: "DELETE",
    headers: {
      "apikey": API_KEY,
      "Authorization": `Bearer ${token}`
    }
  });
  return res.ok;
}


/**
 * Busca um lançamento específico pelo seu ID.
 * @param {string | number} id - O ID do lançamento a ser buscado.
 * @returns {Promise<object>} Um objeto contendo os detalhes do lançamento ou uma lista vazia se não for encontrado.
 */
export async function buscarLancamentoPeloId(id) {

  // Adicionando o filtro 'id=eq.${id}' para buscar apenas o lançamento com o ID especificado.
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/lancamentos?id=eq.${id}&select=*,categorias(descricao)`,
    {
      headers: {
        "apikey": API_KEY,
        "Authorization": `Bearer ${token}`
      }
    }
  );

  if (!res.ok) {
    throw new Error(`Erro ao buscar lançamento: ${res.statusText}`);
  }

  const data = await res.json();

  // Como a query retorna um array, e você espera um único item (pelo ID), retorna o primeiro elemento.
  return data.length > 0 ? data[0] : null;
}