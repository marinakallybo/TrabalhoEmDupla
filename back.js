// Nome que será usado como "chave" para guardar os dados no Local Storage.
// O Local Storage é um armazenamento do navegador.
// Mesmo atualizando a página, os dados continuam salvos.
const LOCAL_STORAGE_NAME = 'lista-de-compras-storage'

// Guarda temporariamente o ID do item que está sendo editado.
// Quando nenhum item estiver sendo editado, o valor será null.
let itemEditandoId = null


// FUNÇÕES AUXILIARES PARA LER E SALVAR NO LOCALSTORAGE

// Busca os itens salvos no LocalStorage e converte de JSON para Array.
function buscarItens() {
    return JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME) || "[]")
}

// Converte o Array de itens em texto (JSON) e salva no LocalStorage.
function salvarItens(itens) {
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(itens))
}


// VERIFICAR SE O ITEM JÁ EXISTE

// Valida se o nome digitado já existe na lista.
// Se passarmos o "idAtual" (ao editar), ele ignora o próprio item para não dar falso positivo.
function validarSeItemJaExiste(nome, idAtual = null) {
    const itens = buscarItens()
    const nomeFormatado = nome.trim().toLowerCase()
    
    // Procura se já existe algum item com o mesmo nome e ID diferente
    return itens.some(item => 
        item.name.toLowerCase() === nomeFormatado && item.id !== idAtual
    )
}


// ADICIONAR NOVO ITEM

function novoItem() {
    // Pega o campo onde o usuário digita o nome do produto.
    const input = document.getElementById('input-name-item')
    const nome = input.value.trim()
    input.style.border = ''

    // trim() remove espaços no começo e no final.
    // O ! verifica se o campo está vazio.
    if (!nome) {
        input.style.border = '1px solid red'
        alert('Digite o nome do item que deseja adicionar na lista')
        return
    }

    // Verifica se já existe um produto com esse nome.
    if (validarSeItemJaExiste(nome)) {
        alert('Já existe um item com esse nome na lista')
        return
    }

    const itens = buscarItens()

    // Adiciona o novo objeto com um id único (crypto.randomUUID())
    itens.push({
        id: crypto.randomUUID(),
        name: nome,
        isPurchased: false
    })

    salvarItens(itens)
    input.value = ''

    // Atualiza a lista que aparece na tela.
    mostrarValores()
}


// MOSTRAR OS VALORES NA TELA

function mostrarValores() {
    const itens = buscarItens()
    const list = document.getElementById('lista-compras')
    list.innerHTML = ''

    // Constrói os elementos visualmente usando a API do DOM para evitar falhas com caracteres especiais
    itens.forEach(item => {
        const li = document.createElement('li')
        if (item.isPurchased) li.classList.add('comprado')

        const span = document.createElement('span')
        span.textContent = item.name // Insere o nome do produto com segurança

        const divButtons = document.createElement('div')
        divButtons.className = 'item-buttons'

        // Botão para remover
        const btnRemover = document.createElement('button')
        btnRemover.textContent = 'Remover'
        btnRemover.onclick = () => removerItem(item.id)

        // Botão para editar
        const btnEditar = document.createElement('button')
        btnEditar.textContent = 'Editar'
        btnEditar.onclick = () => editarItem(item.id)

        // Botão para marcar como comprado
        const btnStatus = document.createElement('button')
        btnStatus.textContent = item.isPurchased ? 'Desmarcar' : 'Comprado'
        btnStatus.onclick = () => marcarComoComprado(item.id)

        divButtons.append(btnRemover, btnEditar, btnStatus)
        li.append(span, divButtons)
        list.appendChild(li)
    })

    atualizarContadores(itens)
}


// MARCAR / DESMARCAR COMO COMPRADO

function marcarComoComprado(id) {
    const itens = buscarItens()
    const item = itens.find(x => x.id === id)

    if (item) {
        // Inverte o valor de isPurchased (false vira true, true vira false)
        item.isPurchased = !item.isPurchased
        salvarItens(itens)
        mostrarValores()
    }
}


// REMOVER ITEM

function removerItem(id) {
    // Filtra removendo apenas o item que possui o ID recebido
    const itens = buscarItens().filter(x => x.id !== id)
    salvarItens(itens)
    mostrarValores()
}


// PREPARAR PARA EDITAR ITEM

function editarItem(id) {
    const itens = buscarItens()
    const item = itens.find(x => x.id === id)
    if (!item) return

    const input = document.getElementById('input-name-item')
    const button = document.getElementById('btn-novo-item')
    
    // Preenche o campo de texto com o nome atual do item
    input.value = item.name
    
    // Altera a ação e texto do botão principal para modo de edição
    button.textContent = 'Salvar edição'
    itemEditandoId = id
    button.onclick = salvarEdicao
}


// SALVAR ALTERAÇÃO DE EDIÇÃO

function salvarEdicao() {
    const input = document.getElementById('input-name-item')
    const novoNome = input.value.trim()
    input.style.border = ''

    if (!novoNome) {
        input.style.border = '1px solid red'
        alert('Digite um nome válido')
        return
    }

    // Valida se o novo nome já existe na lista, IGNORANDO o próprio item que está sendo editado
    if (validarSeItemJaExiste(novoNome, itemEditandoId)) {
        alert('Já existe outro item com esse nome na lista')
        return
    }

    const itens = buscarItens()
    const item = itens.find(x => x.id === itemEditandoId)

    if (item) {
        item.name = novoNome
        salvarItens(itens)
    }

    // Reseta o estado do formulário de volta para a criação de novos itens
    input.value = ''
    itemEditandoId = null
    const button = document.getElementById('btn-novo-item')
    button.textContent = 'Adicionar'
    button.onclick = novoItem

    mostrarValores()
}


// ATUALIZAR CONTADORES

function atualizarContadores(itens) {
    let total = itens.length
    let comprados = itens.filter(x => x.isPurchased).length
    let pendentes = total - comprados

    // Atualiza os elementos na tela
    document.getElementById('contador-total').textContent = total
    document.getElementById('contador-comprados').textContent = comprados
    document.getElementById('contador-pendentes').textContent = pendentes
}


// INICIAR A APLICAÇÃO

// Quando o JavaScript for carregado, chama mostrarValores().
// Isso faz com que os produtos que já estavam salvos no Local Storage apareçam na tela.
mostrarValores()