//importa uma função de outro arquivo js
import{ valida } from './validacao.js'

//atribui todos os valores de input na constante
const inputs = document.querySelectorAll('input');

//vai percorrer a constante input
inputs.forEach(input => {

    if(input.dataset.tipo === 'preco'){
        SimpleMaskMoney.setMask(input,{
        prefix: 'R$',
        fixed: true,
        fractionDigits: 2,
        decimalSeparator: ',',
        thousandsSeparator: '.',
        cursor: 'end'
        })
    }

    // para coda input ele vai adicionar um evento que assim que sair de foco vai realizar
    input.addEventListener('blur', (evento) => {
        //chama a função valida tendo como parâmetro o input que aconteceu o evento de blur
        valida(evento.target)
    })
})