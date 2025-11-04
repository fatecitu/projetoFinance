import { buscarLancamentos, adicionarLancamento, editarLancamento, excluirLancamento, buscarLancamentoPeloId } from "./../modules/lancamentos.js"
import { buscarCategorias } from "./../modules/categorias.js"     // É necessário importar a função para buscar categorias para popular o <select>



export async function popularCategorias() {
    const select = document.getElementById("categoria_id");
    select.innerHTML = '<option value="" disabled selected>Selecione a Categoria</option>';

    try {
        const categorias = await buscarCategorias(); // Função que busca categorias


        // Popula o <select>
        categorias.forEach(cat => {
            const tipoClass = cat.tipo === 'receita'
                ? 'bg-green-100'
                : 'bg-red-100'
            const option = document.createElement("option");
            option.value = cat.id;
            // Exibe a descrição com o emoji
            option.textContent = cat.descricao
            option.className = tipoClass
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Erro ao carregar categorias:", error);
        // Adiciona uma opção de fallback em caso de erro
        const option = document.createElement("option");
        option.textContent = "Erro ao carregar categorias";
        option.disabled = true;
        select.appendChild(option);
    }
}

export async function carregarLancamentos() {
    const dados = await buscarLancamentos();
    const tbody = document.getElementById("tabelaLancamentos");
    tbody.innerHTML = "";

    dados.forEach(l => {
        const tr = document.createElement("tr");

        tr.innerHTML = `          
          <td class="border p-2">${l.categorias.descricao}</td>
          <td class="border p-2">${l.descricao}</td>
          <td class="border p-2">R$ ${l.valor.toFixed(2)}</td>
          <td class="border p-2">${new Date(l.data_ocorrencia + 'T00:00:00').toLocaleDateString('pt-BR')}</td>    
          <td class="border p-2">${l.data_vencimento}</td>
           <td class="border p-2 flex space-x-2">    
              <button class="bg-yellow-400 hover:bg-stone-500 text-white px-2 py-1 flex items-center justify-center flex-1 btnEditar" data-id="${l.id}">
                <span class="material-symbols-outlined mr-1">edit</span>
                Editar
              </button>
              
              <button class="bg-red-500 hover:bg-stone-500 text-white px-2 py-1 flex items-center justify-center flex-1 btnExcluir" data-id="${l.id}">
                <span class="material-symbols-outlined mr-1">delete_forever</span>
                Excluir
              </button>
           </td>
        `;
        tbody.appendChild(tr);
    });
    //Linha de total
    const trTotal = document.createElement('tr')
    trTotal.innerHTML = `<td colspan='5' 
    class='text-right text-gray-700 p-4 border border-gray-400'> 
    Total de Registros: </td>
    <td class='text-left text-gray-700 p-4 border border-gray-400'>
    ${dados.length}</td>`
    tbody.appendChild(trTotal)
    // Listener para o botão Editar
    document.querySelectorAll(".btnEditar").forEach(btn => {
        btn.addEventListener("click", e => {
            const id = e.target.dataset.id;
            // Chama a nova função para carregar no formulário
            carregarLancamentoNoFormulario(id);
        });
    });
    document.querySelectorAll(".btnExcluir").forEach(btn => {
        btn.addEventListener("click", async e => {
            const id = e.target.dataset.id;

            const result = await Swal.fire({
                title: 'Confirma a exclusão?',
                text: "Isso irá excluir o lançamento e NÃO poderá ser desfeito!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33', // Cor padrão para 'danger'
                cancelButtonColor: '#3085d6', // Cor padrão
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Cancelar'
            });

            if (result.isConfirmed) {
                await excluirLancamento(id);
                carregarLancamentos();
            }
        });
    });
}

document.getElementById("formLancamento").addEventListener("submit", async e => {
    e.preventDefault();

   const form = e.target;    
    const id = form.dataset.id; //pega o id do formuláro
    const categoria_id = document.getElementById("categoria_id").value;
    const descricao = document.getElementById("descricao").value;
    const valor = parseFloat(document.getElementById("valor").value);
    const data_ocorrencia = document.getElementById("data_ocorrencia").value;
    const data_vencimento = document.getElementById("data_vencimento").value || null; // Se estiver vazio, envia null

    const lancamento = {
        id,
        categoria_id,
        descricao,
        valor,
        data_ocorrencia,
        data_vencimento
    }

  try {
        if (id) {
            // CHAMADA PARA EDIÇÃO. Se tem id é que devemos editar
            await editarLancamento(id, lancamento);
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Lançamento editado com sucesso!',
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            // CHAMADA PARA ADIÇÃO. Se não tem id iremos inserir
            await adicionarLancamento(lancamento);
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Novo lançamento adicionado!',
                showConfirmButton: false,
                timer: 1500
            });
        }
        
        // Limpa o formulário e recarrega a tabela após sucesso
        limparFormulario(); 
        carregarLancamentos();

    } catch (error) {
        console.error("Erro ao salvar lançamento:", error);
        // SUBSTITUIÇÃO DO ALERT PELO SWEET ALERT EM CASO DE ERRO NA REQUISIÇÃO
        Swal.fire({
            icon: 'error',
            title: 'Erro na Operação',
            text: `Houve um erro ao salvar o lançamento: ${error.message || 'Erro desconhecido'}`,
        });
    }
});

async function carregarLancamentoNoFormulario(id) {    
    // 1. Encontra o lançamento nos dados carregados
    const lancamento = await buscarLancamentoPeloId(id)
    if (!lancamento) return;

    // 2. Preenche os campos do formulário
    const form = document.getElementById("formLancamento");
    form.dataset.id = lancamento.id; // Armazena o ID no atributo data-id do formulário

    document.getElementById("categoria_id").value = lancamento.categoria_id;
    document.getElementById("descricao").value = lancamento.descricao;
    document.getElementById("valor").value = lancamento.valor;
    // NOTA: O input date precisa do formato YYYY-MM-DD
    document.getElementById("data_ocorrencia").value = lancamento.data_ocorrencia;
    // Se data_vencimento for nulo, ele limpará o campo
    document.getElementById("data_vencimento").value = lancamento.data_vencimento ? lancamento.data_vencimento : '';
   //adiciona o foco no campo descricao
   document.getElementById('descricao').focus()
}


function limparFormulario() {
    const form = document.getElementById("formLancamento")    
    delete form.dataset.id // Remove o ID do formulário       
    form.reset() //Limpa o form 
}

export function datasLancamentos(){
    //obtém o dia e hoje
    const hoje = new Date().toISOString().split("T")[0]    
    //a data é retornada com o fuso horário, por isso removemos
    //Referências aos campos do formulário
   const dataOcorrencia = document.getElementById('data_ocorrencia')
   const dataVencimento = document.getElementById('data_vencimento')
   //define a data da ocorrencia como hoje
   dataOcorrencia.value = hoje
   dataVencimento.value = hoje
   //define a maior data como hoje
   dataOcorrencia.setAttribute('max', hoje)
   //define a data mínima do vencimento
   dataVencimento.setAttribute('min', dataOcorrencia.value)
   //verifica se houve mudança na data da ocorrencia
   dataOcorrencia.addEventListener('change', () => {
    dataVencimento.value ='' //limpamos o vencimento
    dataVencimento.setAttribute('min', dataOcorrencia.value)
   })
}
