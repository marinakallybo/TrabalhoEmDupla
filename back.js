// Nome que será usado como "chave" para guardar os dados no Local Storage.
// O Local Storage é um armazenamento do navegador.
// Mesmo atualizando a página, os dados continuam salvos.
const LOCAL_STORAGE_NAME = 'lista-de-compras-storage'


// Guarda temporariamente o nome do item que está sendo editado.
// Quando nenhum item estiver sendo editado, o valor será null.
let itemEditando = null


// VERIFICAR SE O ITEM JÁ EXISTE

function validarSeNovoItemJaExiste()
{

    let values = JSON.parse( //transforma esse texto novamente em array/objeto.
        localStorage.getItem(LOCAL_STORAGE_NAME) || "[]"     // Se não existi nada salvo, usa [] (array vazio).

    )

    // Pega o valor digitado pelo usuário no input.
    let inputValue = document.getElementById('input-name-item').value


    // Procura dentro do array algum item que tenha o mesmo nome.
    // x representa cada item encontrado.
    let exists = values.find(x => x.name == inputValue)


    // Se não encontrou, retorna false.
    // Se encontrou, retorna true.
    return !exists ? false : true
}

// ADICIONAR NOVO ITEM

function novoItem()
{
    // Pega o campo onde o usuário digita o nome do produto.
    let input = document.getElementById('input-name-item')


    input.style.border = ''


    // trim() remove espaços no começo e no final.
    // O ! verifica se o campo está vazio.
    if(!input.value.trim())
    {
        input.style.border = '1px solid red'


        alert('Digite o nome do item que deseja adicionar na lista')

        return
    }


    // Verifica se já existe um produto com esse nome.
    if(validarSeNovoItemJaExiste())
    {
        alert('Já existe um item com esse nome')

        return
    }


    // Pega os dados existentes no Local Storage.

    // Se ainda não houver dados, começa com um array vazio.
    let values = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_NAME) || "[]"
    )


    // Adiciona um novo objeto dentro do array.
    values.push({
        // Nome do produto.
        name: input.value.trim(),

        // Quando adicionamos um produto,
        // ele começa como "não comprado".
        isPurchased: false
    })


    // Salva o array atualizado no Local Storage.
    // JSON.stringify() transforma o array/objeto em texto,
    // porque o Local Storage só consegue guardar strings.
    localStorage.setItem(
        LOCAL_STORAGE_NAME,
        JSON.stringify(values)
    )


    input.value = ''


    // Atualiza a lista que aparece na tela.
    mostrarValores()
}


// MOSTRAR OS VALORES NA TELA

function mostrarValores()
{
    // Busca os produtos salvos.
    let values = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_NAME) || "[]"
    )


    // Pega a <ul> ou <ol> onde os produtos serão mostrados.
    let list = document.getElementById('lista-compras')



    list.innerHTML = ''


    // Percorre todos os produtos.
    for(let i = 0; i < values.length; i++)
    {
        // Pega o produto atual.
        let item = values[i]


        // Se o produto estiver comprado,
        // a variável recebe a classe "comprado".
        // Se não estiver comprado, recebe uma string vazia.
        let status = item.isPurchased ? 'comprado' : ''


        // Adiciona o produto dentro da lista HTML.
        list.innerHTML += `
            <li class="${status}">

                <!-- Nome do produto -->
                <span>${item.name}</span>

                <div class="item-buttons">

                    <!-- Botão para remover -->
                    <button onclick="removerItem('${item.name}')">
                        Remover
                    </button>


                    <!-- Botão para editar -->
                    <button onclick="editarItem('${item.name}')">
                        Editar
                    </button>


                    <!-- Botão para marcar como comprado -->
                    <button onclick="marcarComoComprado('${item.name}')">

                        ${item.isPurchased ? 'Desmarcar' : 'Comprado'}

                    </button>

                </div>

            </li>
        `
    }


    atualizarContadores(values)
}


// MARCAR / DESMARCAR COMO COMPRADO

function marcarComoComprado(data)
{
    // Busca os produtos salvos.
    let values = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_NAME) || "[]"
    )



    let index = values.findIndex(x => x.name == data)


    // Inverte o valor de isPurchased.
   
    // false vira true
    // true vira false
    values[index].isPurchased = !values[index].isPurchased
const LOCAL_STORAGE_NAME = 'lista-de-compras-storage'
let itemEditandoId = null

function buscarItens() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME) || "[]")
}

function salvarItens(itens) {
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(itens))
}

// Valida se o nome já existe na lista (ignorando o item atual se estiver editando)
function validarSeItemJaExiste(nome, idAtual = null) {
    const itens = buscarItens()
    const nomeFormatado = nome.trim().toLowerCase()
    
    return itens.some(item => 
        item.name.toLowerCase() === nomeFormatado && item.id !== idAtual
    )
}

function novoItem() {
    const input = document.getElementById('input-name-item')
    const nome = input.value.trim()
    input.style.border = ''

    if (!nome) {
        input.style.border = '1px solid red'
        alert('Digite o nome do item que deseja adicionar na lista')
        return
    }

    // validando se já existe um item com o mesmo nome (idAtual é null por padrão)
    if (validarSeItemJaExiste(nome)) {
        alert('Já existe um item com esse nome na lista')
        return
    }

    const itens = buscarItens()
    itens.push({
        id: crypto.randomUUID(),
        name: nome,
        isPurchased: false
    })

    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(values))
    input.value = ''

    mostrarValores()
}

function mostrarValores()
{
    let values = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME) || "[]")
    let list = document.getElementById('lista-compras')
    list.innerHTML = ''

    for(let i = 0; i < values.length; i++)
    {
        let item = values[i]
        let status = item.isPurchased ? 'comprado' : ''
        list.innerHTML += `
            <li class="${status}">
                <span>${item.name}</span>

                <div class="item-buttons">
                    <button onclick="removerItem('${item.name}')">Remover</button>

                    <button onclick="editarItem('${item.name}')">Editar</button>

                    <button onclick="marcarComoComprado('${item.name}')">
                        ${item.isPurchased ? 'Desmarcar' : 'Comprado'}
                    </button>
                </div>
            </li>
        `
    }
    atualizarContadores(values)
}

function marcarComoComprado(data)
{
    let values = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME) || "[]")
    let index = values.findIndex(x => x.name == data)
    values[index].isPurchased = !values[index].isPurchased
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(values))
    mostrarValores()
}


// REMOVER ITEM

function removerItem(data)
{
    let values = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME) || "[]")
    let index = values.findIndex(x => x.name == data)
    values.splice(index, 1)
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(values))
    mostrarValores()
}


// ATUALIZAR CONTADORES

function atualizarContadores(values)
{
    let total = values.length
    let comprados = values.filter(x => x.isPurchased).length
    let pendentes = total - comprados
    document.getElementById('contador-total').textContent = total


    // Atualiza o contador de comprados.
    document.getElementById('contador-comprados').textContent = comprados


    // Atualiza o contador de pendentes.
    document.getElementById('contador-pendentes').textContent = pendentes
}

function editarItem(data)
{
    let input = document.getElementById('input-name-item')
    let button = document.getElementById('btn-novo-item')
    input.value = data
    button.textContent = 'Salvar edição'
    itemEditando = data
    button.onclick = salvarEdicao
}

function salvarEdicao()
{
    let input = document.getElementById('input-name-item')
    if(!input.value.trim())
    {
        input.style.border = '1px solid red'
        alert('Digite um nome válido')
        return
    }

    let values = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME) || "[]")
    let index = values.findIndex(x => x.name == itemEditando)
    values[index].name = input.value.trim()
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(values))
    input.value = ''
    itemEditando = null
    let button = document.getElementById('btn-novo-item')
    button.textContent = 'Adicionar'
    button.onclick = novoItem
    mostrarValores()
}


// INICIAR A APLICAÇÃO

// Quando o JavaScript for carregado,
// chama mostrarValores().
//
// Isso faz com que os produtos que já estavam
// salvos no Local Storage apareçam na tela.
mostrarValores()
