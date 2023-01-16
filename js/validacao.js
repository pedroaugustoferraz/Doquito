
// O CÓDIGO A BAIXO É VALIDO, MAS CRIA A NESSECIDADE DE TODO INPUT DE DATA DE NASCIMENTO TER QUE SER CHAMADO POR UM QUERYSELECTOR
// // atribui a "dataNascimento" o id "nascimento"
// const dataNascimento = document.querySelector('#nascimento');

// // adiciona um evento a constante que recebe (assim que a variável perder o foco, função)
// dataNascimento.addEventListener('blur', (evento)=> {
// //chama a função e dá como parâmetro o conteudo da variavel assim que o evento acontecer
//     validaDataNascimento(evento.target)
// })

export function valida(input){
    //atribui a constante os dados daquele input ou elemento e pega o data atribute que a gente quer
    const tipoDeInput = input.dataset.tipo;

    // se dentro de validadores nos temos um tipo de input
    if(validadores[tipoDeInput]){
        // se tiver chamamos a função com o tipo de input certo e mandamos o input como parâmetro
        validadores[tipoDeInput](input);
    }

    //pega a estado de validação do input e verifica
    // se o topico VALID retornar true
    if(input.validity.valid){
        // ele retira a classe q deixa o alerta
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = ''
    } else{
        // se não ele mantem o alerta de invalido
        input.parentElement.classList.add('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDeInput, input)
    }
}

const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]

const mensagensDeErro = {
    nome:{
        valueMissing: 'O campo de nome não pode estar vazio.'

    },
    email:{
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    senha:{
        valueMissing: 'O campo de senha não pode estar vazio.',
        patternMismatch: 'A senha deve conter: Entre 6 e 12 caracteres; 1 letra minúscula e 1 maiúscula; e um número; não pode conter caracteres especiais.'
    },
    dataNascimento:{
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Você deve ser maior que 18 anos para se cadastrar.'
    },
    cpf:{
        valueMissing: 'O campo de CPF não pode estar vazio.',
        customError: 'O CPF digitado não é válido.'
    },
    cep:{
        valueMissing: 'O campo de CEP não pode estar vazio',
        patternMismatch: 'O CEP digitado não é válido',
        customError: 'Não foi possível buscar o endereço.'
    },
    logradouro:{
        valueMissing:'O campo de logradouro não pode estar vazio.',

    },
    cidade:{
        valueMissing:'O campo de cidade não pode estar vazio.',
        
    },
    estado:{
        valueMissing:'O campo de estado não pode estar vazio.',  
    },
    preco:{
        valueMissing:'O campo de preco não pode estar vazio.',  
    }
    
}
// objeto que dependendo do tipo de input vai chamar uma função diferente
const validadores = {
    // na caso da data de nascimento, passamos o input e fazemos uma arrow function e chama a função para validar a data
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input),
    cep:input => recuperarCEP(input)
}

function mostraMensagemDeErro(tipoDeInput, input){
    let mensagem = ''

    tiposDeErro.forEach(erro => {
        if(input.validity[erro]){
            mensagem = mensagensDeErro[tipoDeInput][erro]
        }
    })

    return mensagem
}

function validaDataNascimento(input){
    // cria a variavel que será igual a date recebida como parametro na função
    const dataRecebida = new Date(input.value)
    //cria uma variável string vazia
    let mensagem = ''

    // if para verificar se a data corresponde a alguem maior ou menor de 18 anos e assim mostrar a mensagem
    if(!maiorQue18(dataRecebida)){
        //se for menor de 18 entra na função e atribui um novo valor a mensagem
        mensagem = 'Você deve ser maior que 18 anos para se cadastrar'
    }

    //irá atribuir mensagem de falha no input do campo de idade
    input.setCustomValidity(mensagem)
}

//funçao para calcular idade da pessoa 
function maiorQue18(data){
    //atribui a constante a data de hoje
    const dataAtual = new Date()
    //atribui a constante a data enviada como parâmetro especificando primeiro o dia, depois o mes e o dia
    const dataMais18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())

    //retorna a comparação se dataMais18 é menor igual a dataAtual, ou seja, se for true é de maior, se false, de menor 
    return dataMais18 <= dataAtual
}

function validaCPF(input){
    const cpfFormatado = input.value.replace(/\D/g, '')
    let mensagem = ''

    if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)) {
        mensagem = 'O CPF digitado não é válido.'
    }
    input.setCustomValidity(mensagem)
}

function checaCPFRepetido(cpf){
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]
    let cpfValido = true

    valoresRepetidos.forEach(valor => {
        if(valor == cpf){
            cpfValido = false
        }
    })

    return cpfValido
}

function checaEstruturaCPF(cpf){
    const multiplicador = 10

    return checaDigitoVerificador(cpf, multiplicador)
}

function checaDigitoVerificador(cpf, multiplicador){
    if(multiplicador >= 12){
        return true
    }

    let multiplicadorInicial = multiplicador
    let soma = 0
    //anexa em uma variavel um vetor que dividi a string da primeira posição até a multiplicador -1 e depois coloca cada valor em 1 lugar no vetor
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('')
    const digitoVerificador = cpf.charAt(multiplicador - 1)

    for(let contador = 0; multiplicadorInicial > 1 ; multiplicadorInicial--) {
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
        contador++
    }

    if(digitoVerificador == confirmaDigito(soma)) {
        return checaDigitoVerificador(cpf, multiplicador + 1)
    }

    return false
}

function confirmaDigito(soma) {
    return 11 - (soma % 11)
}

function recuperarCEP(input){
    const cep = input.value.replace(/\D/g, '')
    const url = 'https://viacep.com.br/ws/'+cep+'/json'
    const options = {
        //metodo de requisição pro API
        method: 'GET',
        //modo de requisição pro API, cors pq é uma requisição entre API's
        mode: 'cors',
        // o que a gente espera de resposta do API
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch && !input.validity.valueMissing){
        fetch(url,options).then(
            response => response.json()
        ).then(
            data => {
                if(data.erro){
                    input.setCustomValidity('Não foi possível buscar o endereço')
                    return
                }
                input.setCustomValidity('')
                preencheCamposComCEP(data)
                return
            }
        )
    }

    function preencheCamposComCEP(data){
        const logradouro = document.querySelector('[data-tipo="logradouro"]')
        const cidade = document.querySelector('[data-tipo="cidade"]')
        const estado = document.querySelector('[data-tipo="estado"]')

        logradouro.value = data.logradouro
        cidade.value = data.localidade
        estado.value = data.uf
    }
}
