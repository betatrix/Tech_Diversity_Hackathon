// Máscara do CPF e do CEP
const masks = {
    cpf(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})(\d+?$)/, '$1')
    },
    cep(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})(\d+?$)/, '$1')
    }
}

// Validação do CEP
const cep = document.getElementById('cep');
const address = document.getElementById('address');
const msgError = document.querySelector('#cepError');
cep.addEventListener('input', async (e) => {
    e.target.value = masks["cep"](e.target.value);
    var validarCep = cep.value.replaceAll('.', '').replace('-', '');
    if (validarCep.length == 8) {
        var cepValido = await buscaCEP(validarCep);
        console.log(cepValido);

        if (!cepValido) {
            msgError.innerHTML = '*Insira um CEP válido';
            cep.classList.add("errorInput");
            return;
        } else {
            msgError.innerHTML = '';
            cep.classList.remove("errorInput");
        }
        address.value = cepValido.logradouro + ', ' + cepValido.bairro + ', ' + cepValido.localidade + ' - ' + cepValido.uf;    

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
    e.target.value = masks["cpf"](e.target.value);
    var validarCpf = cpf.value.replaceAll('.', '').replace('-', '');
    if (validarCpf.length == 11) {
        var cpfValido = TestaCPF(validarCpf);

        if (!cpfValido) {
            msgError.innerHTML = '*Insira um CPF válido';
            cpf.classList.add("errorInput");
        } else {
            msgError.innerHTML = '';
            cpf.classList.remove("errorInput");
        }
    }
}, false)

function TestaCPF(validarCpf) {
    var Soma;
    var Resto;
    Soma = 0;
    if (validarCpf == "00000000000") return false;

    for (i = 1; i <= 9; i++) Soma = Soma + parseInt(validarCpf.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(validarCpf.substring(9, 10))) return false;

    Soma = 0;
    for (i = 1; i <= 10; i++) Soma = Soma + parseInt(validarCpf.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(validarCpf.substring(10, 11))) return false;
    return true;
}


//Validação de preenchimento dos campos 
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

    let senha = document.querySelector('#password');
    let senhaLabel = document.querySelector('#passwordLabel');

    let confirma = document.querySelector('#confirmpassword');
    let confirmaLabel = document.querySelector('#confirmpasswordLabel');

    let campos = [
        { field: nome, label: nomeLabel },
        { field: cpf, label: cpfLabel },
        { field: cep, label: cepLabel },
        { field: data, label: dataLabel },
        { field: email, label: emailLabel },
        { field: endereco, label: enderecoLabel },
        { field: numero, label: numeroLabel },
        { field: senha, label: senhaLabel },
        { field: confirma, label: confirmaLabel }
    ];

    let msgError = document.querySelector('#msgError');
    let hasErrors = false;

    campos.forEach((campo) => {
        if (campo.field.value.trim() === '') {
            campo.field.classList.add("errorInput");
            campo.field.classList.add('red-placeholder');
            hasErrors = true;
        } else {
            campo.field.classList.remove("errorInput");
            campo.field.classList.remove('red-placeholder');
        }
    });

    if (hasErrors) {
        msgError.style.display = 'block';
        msgError.innerHTML = '<strong>Preencha todos os campos!</strong>';
        campos[0].field.focus();
    }
}
