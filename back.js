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

    salvarItens(itens)
    input.value = ''
    mostrarValores()
}

function salvarEdicao() {
    const input = document.getElementById('input-name-item')
    const novoNome = input.value.trim()
    input.style.border = ''

    if (!novoNome) {
        input.style.border = '1px solid red'
        alert('Digite um nome válido')
        return
    }

    // validando se ja existe um item com o mesmo nome na hr de editar: passa o itemEditandoId para permitir manter o mesmo nome
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

    // reseta o estado do formulario para o modo de adição
    input.value = ''
    itemEditandoId = null
    const button = document.getElementById('btn-novo-item')
    button.textContent = 'Adicionar'
    button.onclick = novoItem

    mostrarValores()
}

function editarItem(id) {
    const itens = buscarItens()
    const item = itens.find(x => x.id === id)
    if (!item) return

    const input = document.getElementById('input-name-item')
    const button = document.getElementById('btn-novo-item')
    
    input.value = item.name
    button.textContent = 'Salvar edição'
    itemEditandoId = id
    button.onclick = salvarEdicao
}

function mostrarValores() {
    const itens = buscarItens()
    const list = document.getElementById('lista-compras')
    list.innerHTML = ''

    itens.forEach(item => {
        const li = document.createElement('li')
        if (item.isPurchased) li.classList.add('comprado')

        const span = document.createElement('span')
        span.textContent = item.name

        const divButtons = document.createElement('div')
        divButtons.className = 'item-buttons'

        const btnRemover = document.createElement('button')
        btnRemover.textContent = 'Remover'
        btnRemover.onclick = () => removerItem(item.id)

        const btnEditar = document.createElement('button')
        btnEditar.textContent = 'Editar'
        btnEditar.onclick = () => editarItem(item.id)

        const btnStatus = document.createElement('button')
        btnStatus.textContent = item.isPurchased ? 'Desmarcar' : 'Comprado'
        btnStatus.onclick = () => marcarComoComprado(item.id)

        divButtons.append(btnRemover, btnEditar, btnStatus)
        li.append(span, divButtons)
        list.appendChild(li)
    })

    atualizarContadores(itens)
}

function marcarComoComprado(id) {
    const itens = buscarItens()
    const item = itens.find(x => x.id === id)
    if (item) {
        item.isPurchased = !item.isPurchased
        salvarItens(itens)
        mostrarValores()
    }
}

function removerItem(id) {
    const itens = buscarItens().filter(x => x.id !== id)
    salvarItens(itens)
    mostrarValores()
}

function atualizarContadores(itens) {
    const total = itens.length
    const comprados = itens.filter(x => x.isPurchased).length
    const pendentes = total - comprados

    document.getElementById('contador-total').textContent = total
    document.getElementById('contador-comprados').textContent = comprados
    document.getElementById('contador-pendentes').textContent = pendentes
}

mostrarValores()