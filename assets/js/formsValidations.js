// Máscara do CPF e do CEP
const masks = {
    cpf(value) {
        return value
            .replace(/\D/g, '') // Remove caracteres não numéricos
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os primeiros 3 dígitos
            .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona ponto após os próximos 3 dígitos
            .replace(/(\d{3})(\d{1,2})/, '$1-$2') // Adiciona hífen e os últimos dígitos
            .replace(/(-\d{2})(\d+?$)/, '$1') // Remove caracteres após os últimos 2 dígitos
    },
    cep(value) {
        return value
            .replace(/\D/g, '') // Remove caracteres não numéricos
            .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona hífen após os primeiros 5 dígitos
            .replace(/(-\d{3})(\d+?$)/, '$1') // Remove caracteres após os últimos 3 dígitos
    },
    telefone(value) {
        return value
            .replace(/\D/g, '') // Remove caracteres não numéricos
            .replace(/(\d{2})(\d)/, '($1)$2') // Adiciona parênteses após os primeiros 2 dígitos
            .replace(/(\d{5})(\d)/, '$1-$2') // Adiciona hífen após os próximos 4 dígitos
            .replace(/(-\d{4})(\d+?$)/, '$1'); // Remove caracteres após os últimos 4 dígitos
    }
}


const tel = document.getElementById('number');

tel.addEventListener('input', async (e) => {
    const msgError = document.querySelector('#telefoneError');
    e.target.value = masks["telefone"](e.target.value); // Aplica a máscara de Telefone
    if (tel.value.length < 14) {
        msgError.innerHTML = '*Insira um telefone válido';
        tel.classList.add("errorInput");
        return;
    } else {
        msgError.innerHTML = '';
        tel.classList.remove("errorInput");
    }
}, false)


// Validação do CEP
const cep = document.getElementById('cep');
const address = document.getElementById('address');
const msgError = document.querySelector('#cepError');
cep.addEventListener('input', async (e) => {
    e.target.value = masks["cep"](e.target.value); // Aplica a máscara de CEP
    var validarCep = cep.value.replaceAll('.', '').replace('-', ''); // Remove caracteres especiais
    if (validarCep.length == 8) { // Se o CEP tiver 8 dígitos...
        var cepValido = await buscaCEP(validarCep); // Busca informações de endereço com base no CEP

        if (!cepValido || cep.value.length < 9) {
            msgError.innerHTML = '*Insira um CEP válido';
            cep.classList.add("errorInput");
            return;
        } else {
            msgError.innerHTML = '';
            cep.classList.remove("errorInput");
        }
        address.value = cepValido.logradouro + ', ' + cepValido.bairro + ', ' + cepValido.localidade + ' - ' + cepValido.uf; // Preenche os campos de endereço
    }
}, false)



// Utilização de fetch para consumir API de CEP
async function buscaCEP(cep) {
    let busca = cep.replace('-', '');
    const option = {
        method: 'get',
        mode: 'cors',
        cache: 'default'
    }
    const response = await fetch(`https://viacep.com.br/ws/${busca}/json/`, option);

    const cepInfo = await response.json();
    if (cepInfo.erro) {
        return false;
    }

    return cepInfo;
}


// Validação do CPF
const cpf = document.getElementById('cpf');
cpf.addEventListener('input', (e) => {
    const msgError = document.querySelector('#cpfError');
    e.target.value = masks["cpf"](e.target.value); // Aplica a máscara de CPF
    var validarCpf = cpf.value.replaceAll('.', '').replace('-', ''); // Remove caracteres especiais
    if (validarCpf.length == 11) { // Se o CPF tiver 11 dígitos...
        var cpfValido = TestaCPF(validarCpf); // Realiza a validação do CPF

        if (!cpfValido) {
            msgError.innerHTML = '*Insira um CPF válido';
            cpf.classList.add("errorInput");
        } else {
            msgError.innerHTML = '';
            cpf.classList.remove("errorInput");
        }
    }
}, false)


// Função para validar o CPF
function TestaCPF(validarCpf) {
    var Soma;
    var Resto;
    Soma = 0;
    if (validarCpf == "00000000000") return false; // CPF com todos os dígitos iguais é inválido

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(validarCpf.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(validarCpf.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(validarCpf.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(validarCpf.substring(10, 11))) return false;

    return true; // Se a validação for bem-sucedida, o CPF é considerado válido
}


// Validação de preenchimento dos campos 
function enviar() {
    let nome = document.querySelector('#name');
    let nomeLabel = document.querySelector('#nameLabel');

    let cpf = document.querySelector('#cpf');
    let cpfLabel = document.querySelector('#cpfLabel');

    let data = document.querySelector('#date');
    let dataLabel = document.querySelector('#dateLabel');

    let email = document.querySelector('#email');
    let emailLabel = document.querySelector('#emailLabel');

    let cep = document.querySelector('#cep');
    let cepLabel = document.querySelector('#cepLabel');

    let endereco = document.querySelector('#address');
    let enderecoLabel = document.querySelector('#addressLabel');

    let numero = document.querySelector('#number');
    let numeroLabel = document.querySelector('#numberLabel');

    let genero = document.querySelector('#gender');
    let generoLabel = document.querySelector('#genderLabel');

    // Cria uma lista de objetos com campos e seus respectivos labels
    let campos = [
        { field: nome, label: nomeLabel },
        { field: cpf, label: cpfLabel },
        { field: cep, label: cepLabel },
        { field: data, label: dataLabel },
        { field: email, label: emailLabel },
        { field: endereco, label: enderecoLabel },
        { field: numero, label: numeroLabel },
        { field: genero, label: generoLabel },
    ];

    let msgError = document.querySelector('#msgError');
    let hasErrors = false;

    // Itera sobre a lista de campos para verificar se estão preenchidos
    campos.forEach((campo) => {
        if (campo.field.value.trim() === '') { // Verifica se o campo está vazio
            campo.field.classList.add("errorInput");
            campo.field.classList.add('red-placeholder');
            hasErrors = true;
        } else {
            campo.field.classList.remove("errorInput");
            campo.field.classList.remove('red-placeholder');
        }
    });

    if (hasErrors){
        msgError.style.display = 'block';
        msgError.innerHTML = '<strong>Preencha todos os campos!</strong>';
        campos[0].field.focus(); // Define o foco no primeiro campo vazio
    }  else {
        msgError.style.display = 'none';
    }

}
