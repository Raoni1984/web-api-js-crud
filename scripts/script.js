var editMode = false;
var btnSalvar = document.querySelector('#btnSalvar');
var btnCancelar = document.querySelector('#btnCancelar');
var titulo = document.querySelector('#titulo');

    var aluno = {
        nome,
        sobrenome,
        telefone,
        ra
    }

CarregaEstudantes('GET');

function Cadastrar() {

    titulo.textContent = `Cadastrar Aluno`;

    //Reseta a tabela para reconstruir-la com as novas entradas.
    document.querySelector('table tbody').innerHTML = '';

    aluno.nome = document.querySelector('#nome').value;
    aluno.sobrenome = document.querySelector('#sobrenome').value;
    aluno.telefone = document.querySelector('#telefone').value;
    aluno.ra = document.querySelector('#ra').value;

    
    if(!editMode) CarregaEstudantes('POST', 0, aluno);

    if(editMode)
    {
        CarregaEstudantes('PUT', aluno.id, aluno);
        editMode = false;
        CarregaEstudantes('GET');
    }
    this.Cancelar();
}

function Editar(id){
    CarregaEstudantes('GET', id);
    editMode = true;
    btnSalvar.textContent = 'Salvar';
    titulo.textContent = `Editar aluno ${aluno.nome}`;
}

function Excluir(estudante){
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', `http://localhost:50647/api/aluno/${estudante.id}`, false);
    xhr.send();
}

function Deletar(estudante){
    // if(!confirm('Deseja excluir o estudante ' + aluno.nome + '?'))
    //     return;
    bootbox.confirm({
        message: `Deseja excluir o estudante ${estudante.nome}?`,
        buttons: {
            confirm: {
                label: 'Sim',
                className: 'btn-success'
            },
            cancel: {
                label: 'Não',
                className: 'btn-danger'
            }
        },
        callback: function (result) {
            if(result)
                Excluir(estudante.id);
        }
    });
    

    //Reseta a tabela para reconstruir-la com as novas entradas.
    document.querySelector('table tbody').innerHTML = '';

    CarregaEstudantes('GET');
}

function Cancelar(){
    document.querySelector('#nome').value = '';
    document.querySelector('#sobrenome').value = '';
    document.querySelector('#telefone').value = '';
    document.querySelector('#ra').value = '';

    btnSalvar.textContent = 'Cadastrar';
    btnCancelar.textContent = 'Limpar Campos';
    titulo.textContent = 'Cadastrar Aluno';

    editMode = false;
}

function CarregaEstudantes(metodo, id, corpo) {
    
    var xhr = new XMLHttpRequest();

    //Ignora o id se não foi passado como parametro desta funcao.
    if(id === undefined)
    {
        id = '';
    }
    //Se foi passado, o id é atribuido à instância auxiliar 'aluno'.
    else
    {
        aluno.id = id;
    }

    xhr.open(metodo, `http://localhost:50647/api/aluno/${id}`, false);
    
    xhr.onload = function(){

        var estudantes = JSON.parse(this.responseText);

        //Pega o nome do estudante para exibir no titulo: 'Editar Aluno {aluno.nome}'
        aluno.nome = estudantes.Nome;

        //Se o metodo chamado for 'GET SINGLE'
        if(metodo == 'GET' && id != '')
        {
            //Atribui atributos do aluno selecionado ao Form.
            document.querySelector('#nome').value = estudantes.Nome
            document.querySelector('#sobrenome').value = estudantes.Sobrenome
            document.querySelector('#telefone').value = estudantes.Telefone
            document.querySelector('#ra').value = estudantes.RA
        }
        else if(metodo == 'GET' || metodo == 'POST' )
        {
            //Para cada estudante recebido cria uma linha na tabela.
            estudantes.forEach(estudante => {
                adicionaLinha(estudante);
            });
        }
    }
    
    //Envia o corpo da requisicao se ele foi passado como parametro desta funcao.
    if (corpo !== undefined)
    {
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(corpo));
    }
    else
    {
        xhr.send();
    }
}

function adicionaLinha(estudante){
    var tbody = document.querySelector('table tbody');
    
    var trow = `<tr>
                    <td>${estudante.Nome}</td>
                    <td>${estudante.Sobrenome}</td>
                    <td>${estudante.Telefone}</td>
                    <td>${estudante.RA}</td>
                    <td><button class="btn btn-outline-primary" data-toggle="modal" data-target="#exampleModal" onclick='Editar(${estudante.Id})'>Editar</button></td>
                    <td><button class="btn btn-outline-danger" onclick='Deletar(${JSON.stringify(estudante.Id)})'>Deletar</button></td>
                </tr>`
                
    tbody.innerHTML += trow;
}
