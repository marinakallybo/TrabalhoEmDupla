// classe base
class Item {
    constructor(nome, isPurchased = false, id = crypto.randomUUID()) {
        this.id = id
        this.name = nome
        this.isPurchased = isPurchased
    }
}

// subclasse / herança

class ItemCompra extends Item {
    constructor(nome, isPurchased = false, id = undefined) {
        // chamando o construtor da classe pai
        super(nome, isPurchased, id)
    }

    // método da subclasse para alternar o status de comprado
    toggleStatus() {
        this.isPurchased = !this.isPurchased
    }

    // método da subclasse para atualizar o nome
    atualizarNome(novoNome) {
        this.name = novoNome.trim()
    }
}


// classe de gerenciamento (POO)

class ListaDeCompras {
    constructor(storageKey = 'lista-de-compras-storage') {
        this.storageKey = storageKey
        this.itens = []
        this.itemEditandoId = null

        // mapeamento dos elementos do DOM
        this.input = document.getElementById('input-name-item')
        this.btnPrincipal = document.getElementById('btn-novo-item')
        this.listElement = document.getElementById('lista-compras')

        // carregando os dados iniciais do localStorage e inicializando os eventos
        this.carregarDoStorage()
        this.bindEvents()
        this.render()
    }

    // localStorage - armazenamento local

    carregarDoStorage() {
        const dadosBrutos = JSON.parse(localStorage.getItem(this.storageKey) || "[]")
        this.itens = dadosBrutos.map(
            obj => new ItemCompra(obj.name, obj.isPurchased, obj.id)
        )
    }

    salvarNoStorage() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.itens))
    }

    // validação de item já existente

    validarSeItemJaExiste(nome, idAtual = null) {
        const nomeFormatado = nome.trim().toLowerCase()
        return this.itens.some(
            item => item.name.toLowerCase() === nomeFormatado && item.id !== idAtual
        )
    }

    // operações do CRUD

    adicionarOuSalvar() {
        const nome = this.input.value.trim()
        this.input.style.border = ''

        if (!nome) {
            this.input.style.border = '1px solid red'
            alert('Digite o nome do item')
            return
        }

        // validando nome existente caso usuário estiver editando um item já criado
        if (this.itemEditandoId) {
            if (this.validarSeItemJaExiste(nome, this.itemEditandoId)) {
                alert('Já existe outro item com esse nome na lista')
                return
            }

            const item = this.itens.find(i => i.id === this.itemEditandoId)
            if (item) {
                item.atualizarNome(nome)
            }
            this.resetarFormulario()
        } 
        // validando nome existente caso esteja adicionando um novo item
        else {
            if (this.validarSeItemJaExiste(nome)) {
                alert('Já existe um item com esse nome na lista')
                return
            }

            const novoItem = new ItemCompra(nome)
            this.itens.push(novoItem)
            this.input.value = ''
        }

        this.salvarNoStorage()
        this.render()
    }

    removerItem(id) {
        this.itens = this.itens.filter(item => item.id !== id)
        this.salvarNoStorage()
        this.render()
    }

    alternarStatusItem(id) {
        const item = this.itens.find(i => i.id === id)
        if (item) {
            item.toggleStatus() // método herdado na subclasse
            this.salvarNoStorage()
            this.render()
        }
    }

    prepararEdicao(id) {
        const item = this.itens.find(i => i.id === id)
        if (!item) return

        this.input.value = item.name
        this.btnPrincipal.textContent = 'Salvar edição'
        this.itemEditandoId = id
    }

    resetarFormulario() {
        this.input.value = ''
        this.itemEditandoId = null
        this.btnPrincipal.textContent = 'Adicionar'
    }

    // renderização

    bindEvents() {
        // definindo o evento de clique no botão principal apontando para a classe
        this.btnPrincipal.onclick = () => this.adicionarOuSalvar()
    }

    atualizarContadores() {
        const total = this.itens.length
        const comprados = this.itens.filter(i => i.isPurchased).length
        const pendentes = total - comprados

        document.getElementById('contador-total').textContent = total
        document.getElementById('contador-comprados').textContent = comprados
        document.getElementById('contador-pendentes').textContent = pendentes
    }

    render() {
        this.listElement.innerHTML = ''

        this.itens.forEach(item => {
            const li = document.createElement('li')
            if (item.isPurchased) li.classList.add('comprado')

            const span = document.createElement('span')
            span.textContent = item.name

            const divButtons = document.createElement('div')
            divButtons.className = 'item-buttons'

            const btnRemover = document.createElement('button')
            btnRemover.textContent = 'Remover'
            btnRemover.onclick = () => this.removerItem(item.id)

            const btnEditar = document.createElement('button')
            btnEditar.textContent = 'Editar'
            btnEditar.onclick = () => this.prepararEdicao(item.id)

            const btnStatus = document.createElement('button')
            btnStatus.textContent = item.isPurchased ? 'Desmarcar' : 'Comprado'
            btnStatus.onclick = () => this.alternarStatusItem(item.id)

            divButtons.append(btnRemover, btnEditar, btnStatus)
            li.append(span, divButtons)
            this.listElement.appendChild(li)
        })

        this.atualizarContadores()
    }
}

// iniciando aplicação
const appListaDeCompras = new ListaDeCompras()