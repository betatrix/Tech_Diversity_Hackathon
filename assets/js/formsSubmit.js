const nome = document.getElementById('name');
const data = document.getElementById('date');
const genero = document.getElementById('gender');
const email = document.getElementById('email');
const endereco = document.getElementById('address');
const telefone = document.getElementById('number');

const formSubmit = (event) => {
    event.preventDefault();

     // Converter a data para o formato ISO
    const dataFormatada = new Date(data.value).toLocaleDateString('pt-BR');

    fetch('https://api.sheetmonkey.io/form/jCDWAbQpqSkPpjpEsbpXBP', {

        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(
            {
                nome: nome.value,
                cpf: cpf.value,
                nascimento: dataFormatada,
                genero: genero.value,
                email: email.value,
                cep: cep.value,
                endereco: endereco.value,
                telefone: telefone.value
            }
        )
    })
        .then(data => {
            alert('Cadastro enviado com sucesso!');
            limpar();
        })
        .catch(error => console.error("Erro ao realizar inscrição:", error));
}

function limpar() {
    const campos = [
        nome, cpf, email, telefone,
        cep, genero, data, endereco
    ];

    campos.forEach(campo => campo.value = "");
}


document.querySelector('form').addEventListener('submit', formSubmit)