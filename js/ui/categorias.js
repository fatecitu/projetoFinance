import { buscarCategorias } from "../modules/categorias.js";

export async function carregarCategorias(){
    const dados = await buscarCategorias()
    const tbody = document.getElementById('tabelaCategorias')
    tbody.innerHTML = '' //limpamos o conteúdo
    dados.forEach(categoria => {
        //criamos a linha com tr
        const tr = document.createElement('tr')
        tr.innerHTML = `
        <td class='border border-gray-400 p-2'>${categoria.descricao}</td>
        <td class='border border-gray-400 p-2'>${categoria.tipo}</td>`
        tbody.appendChild(tr)
    })
}