export function valida(input){
    const tipoDoInput=input.dataset.tipo

    if (validadores[tipoDoInput]){
        validadores[tipoDoInput](input);
    }

    if(input.validity.valid){
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML="deu"
    }else{
        input.parentElement.classList.add('input-container--invalido')
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemDeErro(tipoDoInput, input)
    }
}

function recuperaCEP(input){
    const cepFormatado = input.value.replace(/\D/g, '');
    const url = `https://viacep.com.br/ws/${cepFormatado}/json/`;
    const options = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'content-type': 'application/json;charset=utf-8'
        }
    }

    if(!input.validity.patternMismatch&&!input.validity.valueMissing){
        fetch(url,options).then(
            response=>response.json()
        ).then(
            data=>{
                if(data.erro){
                    input.setCustomValidity('Não foi possível buscar o CEP informado');
                    return 0;
                }
                input.setCustomValidity('');
                preencheCamposCEP(data);
                return 0
            }
        )
    }
}

function preencheCamposCEP(data){
    const logradouro=document.querySelector('[data-tipo="logradouro"]');
    const cidade=document.querySelector('[data-tipo="cidade"]');
    const estado=document.querySelector('[data-tipo="estado"]');
    logradouro.value=data.logradouro;
    cidade.value=data.localidade;
    estado.value=data.uf;
}

function contaCPF(cpfSemDigitos, digitoVerificador){
    let multiplicador=0;
    let resultado=0;
    let i=0;

    for(multiplicador=cpfSemDigitos.length+1, i=0;multiplicador>=2, i<cpfSemDigitos.length;multiplicador--, i++){
        resultado=resultado+cpfSemDigitos[i]*multiplicador;
    }

    resultado=(resultado*10)%11;
    return resultado
}
function testaCPF(input){
    const cpfFormatado=input.value.replace(/\D/g, '');
    let mensagem='';
    let multiplicador=10;
    let multiplicadorFor=10;
    let i=0;
    let resultado=0;

    for(multiplicadorFor=10;multiplicadorFor<12;multiplicadorFor++){
        let cpfSemDigitos = cpfFormatado.substr(0, multiplicadorFor - 1).split('');
        let digitoVerificador = cpfFormatado.charAt(multiplicadorFor - 1);
        resultado=contaCPF(cpfSemDigitos, digitoVerificador);
        if(resultado==cpfFormatado[multiplicadorFor-1]){
            continue;
        }else{
            mensagem="O CPF não é válido";
            break;
        }
    }
    input.setCustomValidity(mensagem);
}
function mostraMensagemDeErro(tipoDeInput, input){
    let mensagem = '';
    tiposDeErro.forEach(erro=>{
        if(input.validity[erro]==true){
            mensagem=mensagensDeErro[tipoDeInput][erro];
        }
    }
    )
    return mensagem
}
const validadores ={
    dataNascimento:input=>validaDataNascimento(input),
    cpf:input=>testaCPF(input),
    cep:input=>recuperaCEP(input)
}
function validaDataNascimento(input){
    const dataRecebida=new Date(input.value)
    const maiorQue16=new Date(dataRecebida.getUTCFullYear()+16, dataRecebida.getUTCMonth(), dataRecebida.getUTCDate());
    const dataAtual=new Date();
    let mensagem='';

    if(dataAtual<=maiorQue16){
        mensagem='Você deve ser maior que 16 para completar o cadastro.'
    }
    input.setCustomValidity(mensagem);
}
const tiposDeErro = [
    'valueMissing',
    'typeMismatch',
    'patternMismatch',
    'customError'
]
const mensagensDeErro = {
    nome: {
        valueMissing: 'O campo de nome não pode estar vazio.',
        patternMismatch:'O nome de usuário deve ter de 6 a 15 caracteres e não pode ter espaço.'
    },
    email: {
        valueMissing: 'O campo de email não pode estar vazio.',
        typeMismatch: 'O email digitado não é válido.'
    },
    senha: {
        valueMissing: 'O campo de senha não pode estar vazio.',
        patternMismatch: 'A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, uma minúcula, um número e um símbolo.'
    },
    dataNascimento: {
        valueMissing: 'O campo de data de nascimento não pode estar vazio.',
        customError: 'Você deve ser maior que 16 anos para completar o cadastro.'
    },
    cpf: {
        valueMissing: 'O campo de CPF não pode estar vazio.',
        customError: 'O CPF digitado não é válido.' 
    },
    cep: {
        valueMissing: 'O campo de CEP não pode estar vazio.',
        patternMismatch: 'O CEP digitado não é válido.',
        customError: 'Não foi possível buscar o CEP.'
    },
    logradouro: {
        valueMissing: 'O campo de logradouro não pode estar vazio.'
    },
    cidade: {
        valueMissing: 'O campo de cidade não pode estar vazio.'
    },
    estado: {
        valueMissing: 'O campo de estado não pode estar vazio.'
    }
}