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
mostrarValores()

    // Salva novamente os dados atualizados.
    localStorage.setItem(
        LOCAL_STORAGE_NAME,
        JSON.stringify(values)
    )


    // Atualiza a lista na tela.
    mostrarValores()
}


// REMOVER ITEM

function removerItem(data)
{
    // Busca os produtos salvos.
    let values = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_NAME) || "[]"
    )


    // Descobre a posição do produto.
    let index = values.findIndex(x => x.name == data)


    // Remove 1 elemento daquela posição.
    //
    // splice(index, 1)
    // significa:
    // "a partir de index, remova 1 elemento".
    values.splice(index, 1)


    // Salva o array novamente.
    localStorage.setItem(
        LOCAL_STORAGE_NAME,
        JSON.stringify(values)
    )


    // Atualiza a lista na tela.
    mostrarValores()
}


// ATUALIZAR CONTADORES

function atualizarContadores(values)
{
    // Quantidade total de produtos.
    let total = values.length


    // filter() cria um novo array contendo somente
    // os produtos que possuem isPurchased = true.
    // .length informa quantos foram encontrados.
    let comprados = values.filter(
        x => x.isPurchased
    ).length


    // Produtos pendentes são:
    // total - produtos comprados
    let pendentes = total - comprados


    // Atualiza o número que aparece no HTML.
    document.getElementById('contador-total').textContent = total


    // Atualiza o contador de comprados.
    document.getElementById('contador-comprados').textContent = comprados


    // Atualiza o contador de pendentes.
    document.getElementById('contador-pendentes').textContent = pendentes
}


// COMEÇAR A EDITAR UM ITEM

function editarItem(data)
{
    // Pega o campo de texto.
    let input = document.getElementById('input-name-item')


    // Pega o botão de adicionar.
    let button = document.getElementById('btn-novo-item')


    // Coloca o nome antigo dentro do input.
    input.value = data


    // Muda o texto do botão.
    button.textContent = 'Salvar edição'


    // Guarda qual item está sendo editado.
   
    itemEditando = data


    // Quando o botão for clicado,
    // agora ele executará salvarEdicao()
    button.onclick = salvarEdicao
}


// SALVAR A EDIÇÃO

function salvarEdicao()
{
    let input = document.getElementById('input-name-item')


    // Verifica se o campo está vazio.
    if(!input.value.trim())
    {
        input.style.border = '1px solid red'


        alert('Digite um nome válido')


        return
    }


    // Busca os produtos salvos.
    let values = JSON.parse(
        localStorage.getItem(LOCAL_STORAGE_NAME) || "[]"
    )


    // Procura o produto que estava sendo editado.
    //
    // itemEditando contém o nome antigo.
    let index = values.findIndex(
        x => x.name == itemEditando
    )


    // Troca o nome antigo pelo novo nome digitado.
    values[index].name = input.value.trim()


    // Salva os dados atualizados.
    localStorage.setItem(
        LOCAL_STORAGE_NAME,
        JSON.stringify(values)
    )


    // Limpa o input.
    input.value = ''


    // Informa que não estamos mais editando nenhum item.
    itemEditando = null


    // Pega novamente o botão.
    let button = document.getElementById('btn-novo-item')


    // Volta o texto do botão para "Adicionar".
    button.textContent = 'Adicionar'


    // Faz o botão voltar a executar novoItem().
    button.onclick = novoItem


    // Atualiza a lista na tela.
    mostrarValores()
}


// INICIAR A APLICAÇÃO

// Quando o JavaScript for carregado,
// chama mostrarValores().
//
// Isso faz com que os produtos que já estavam
// salvos no Local Storage apareçam na tela.
mostrarValores()
