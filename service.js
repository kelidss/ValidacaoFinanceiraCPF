// Função para validar os dados de um lançamento financeiro
const validarEntradaDeDados = (lancamento) => {
    // Destruturação do objeto lancamento para obter cpf e valor
    const { cpf, valor } = lancamento;

    // Verifica se o CPF tem exatamente 11 dígitos numéricos
    if (!/^\d{11}$/.test(cpf)) {
        return 'CPF deve conter exatamente 11 caracteres numéricos.';
    }
    
    // Chama a função validarCPF para verificar a validade do CPF
    if (!validarCPF(cpf)) {
        return 'CPF inválido.';
    }

    // Converte o valor para um número flutuante
    const valorNumerico = parseFloat(valor);
    
    // Verifica se o valor é um número válido
    if (isNaN(valorNumerico)) {
        return 'O valor deve ser numérico.';
    }
    
    // Verifica se o valor está dentro dos limites permitidos
    if (valorNumerico > 15000) {
        return 'O valor não pode ser superior a 15000,00.';
    }
    if (valorNumerico < -2000) {
        return 'O valor não pode ser inferior a -2000,00.';
    }

    return null; // Retorna null se todas as validações forem bem-sucedidas
}

// Função para validar o formato do CPF seguindo o algoritmo padrão brasileiro
const validarCPF = (cpf) => {
    // Converte o CPF em um array de números
    const cpfArray = cpf.split('').map(Number);
    
    // Função auxiliar para calcular os dígitos verificadores do CPF
    const calcularDigito = (fatorInicial) => {
        // Calcula a soma dos produtos dos dígitos pelo fator decrescente
        const soma = cpfArray
            .slice(0, fatorInicial - 1)
            .reduce((acc, num, idx) => acc + num * (fatorInicial - idx), 0);

        // Calcula o resto da divisão da soma por 11
        const resto = (soma * 10) % 11;
        
        // Retorna 0 se o resto for 10 ou 11, caso contrário retorna o próprio resto
        return resto === 10 || resto === 11 ? 0 : resto;
    }

    // Compara os dígitos verificadores calculados com os fornecidos
    return calcularDigito(10) === cpfArray[9] && calcularDigito(11) === cpfArray[10];
}

// Função para acumular os valores dos lançamentos por CPF
const recuperarSaldosPorConta = (lancamentos) => {
    const saldos = {}; // Objeto para armazenar os saldos por CPF

    lancamentos.forEach(({ cpf, valor }) => {
        // Acumula o valor dos lançamentos por CPF
        saldos[cpf] = (saldos[cpf] || 0) + valor;
    });

    // Converte o objeto saldos em um array de objetos e retorna
    return Object.entries(saldos).map(([cpf, valor]) => ({ cpf, valor }));
}

// Função para encontrar os maiores e menores lançamentos por CPF
const recuperarMaiorMenorLancamentos = (cpf, lancamentos) => {
    // Filtra os lançamentos pelo CPF especificado
    const lancamentosCpf = lancamentos.filter(lanc => lanc.cpf === cpf);

    // Se não houver lançamentos para o CPF, retorna um array vazio
    if (lancamentosCpf.length === 0) return [];

    // Encontra os valores mínimo e máximo entre os lançamentos filtrados
    const valores = lancamentosCpf.map(lanc => lanc.valor);
    const menor = Math.min(...valores);
    const maior = Math.max(...valores);

    // Retorna os lançamentos com os valores mínimo e máximo
    return menor === maior 
        ? [{ cpf, valor: menor }] 
        : [{ cpf, valor: menor }, { cpf, valor: maior }];
}

// Função para encontrar os três maiores saldos entre todos os CPFs
const recuperarMaioresSaldos = (lancamentos) => {
    // Usa a função recuperarSaldosPorConta para obter os saldos por conta
    const saldos = recuperarSaldosPorConta(lancamentos);

    // Ordena os saldos em ordem decrescente e retorna os três primeiros
    return saldos.sort((a, b) => b.valor - a.valor).slice(0, 3);
}

// Função para calcular as três maiores médias de lançamentos por CPF
const recuperarMaioresMedias = (lancamentos) => {
    const medias = {}; // Objeto para armazenar as somas dos valores por CPF
    const contagens = {}; // Objeto para contar o número de lançamentos por CPF

    lancamentos.forEach(({ cpf, valor }) => {
        // Acumula os valores e incrementa a contagem de lançamentos por CPF
        medias[cpf] = (medias[cpf] || 0) + valor;
        contagens[cpf] = (contagens[cpf] || 0) + 1;
    });

    // Calcula as médias finais e retorna os três maiores valores
    const mediasFinais = Object.entries(medias).map(([cpf, soma]) => ({
        cpf,
        valor: soma / contagens[cpf]
    }));

    return mediasFinais.sort((a, b) => b.valor - a.valor).slice(0, 3);
}
