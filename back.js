const LOCAL_STORAGE_NAME = 'lista-de-compras-storage'

let itemEditando = null

function validarSeNovoItemJaExiste()
{
    let values = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME) || "[]")
    let inputValue = document.getElementById('input-name-item').value
    let exists = values.find(x => x.name == inputValue)
    return !exists ? false : true
}

function novoItem()
{
    let input = document.getElementById('input-name-item')
    input.style.border = ''

    if(!input.value.trim())
    {
        input.style.border = '1px solid red'
        alert('Digite o nome do item que deseja adicionar na lista')
        return
    }

    if(validarSeNovoItemJaExiste())
    {
        alert('Já existe um item com esse nome')
        return
    }

    let values = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME) || "[]")

    values.push({
        name: input.value.trim(),
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
                ${item.name}

                <button onclick="marcarComoComprado('${item.name}')">
                    ${item.isPurchased ? 'Desmarcar' : 'Comprado'}
                </button>

                <button onclick="editarItem('${item.name}')">
                    Editar
                </button>

                <button onclick="removerItem('${item.name}')">
                    Remover
                </button>
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

function removerItem(data)
{
    let values = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME) || "[]")
    let index = values.findIndex(x => x.name == data)
    values.splice(index, 1)
    localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(values))
    mostrarValores()
}

function atualizarContadores(values)
{
    let total = values.length
    let comprados = values.filter(x => x.isPurchased).length
    let pendentes = total - comprados
    document.getElementById('contador-total').textContent = total
    document.getElementById('contador-comprados').textContent = comprados
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

mostrarValores()