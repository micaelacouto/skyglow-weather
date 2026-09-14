document.getElementById('btn-buscar').addEventListener('click', buscarClima);
document.getElementById('cidade-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') buscarClima();
});

async function buscarClima() {
    const inputEl = document.getElementById('cidade-input');
    const cidade = inputEl.value.trim();
    
    // Validação local 1: Campo Vazio
    if (!cidade) {
        exibirErro('Digite o nome de uma cidade antes de buscar!');
        return;
    }

    // Validação local 2: Apenas Números
    if (/^\d+$/.test(cidade)) {
        exibirErro('Por favor, insira o nome de uma cidade, não números.');
        return;
    }

    // Validação local 3: Menos de 2 caracteres
    if (cidade.length < 2) {
        exibirErro('O nome da cidade é muito curto.');
        return;
    }

    ocultarErro();
    
    try {
        const resposta = await fetch(`/api/clima?cidade=${encodeURIComponent(cidade)}`);
        const dados = await resposta.json();

        if (!resposta.ok) {
            exibirErro(dados.erro);
            return;
        }

        document.getElementById('cidade-nome').textContent = dados.cidade;
        document.getElementById('temp-valor').textContent = Math.round(dados.temperatura);
        document.getElementById('vento-valor').textContent = dados.vento;

        atualizarTemaEEfeitos(dados.codigo_clima);
        document.getElementById('resultado').classList.remove('escondido');
    } catch (err) {
        exibirErro('Não foi possível conectar ao servidor. Tente novamente.');
    }
}

function exibirErro(mensagem) {
    const erroEl = document.getElementById('mensagem-erro');
    const resultadoEl = document.getElementById('resultado');
    
    erroEl.textContent = mensagem;
    erroEl.classList.remove('escondido');
    resultadoEl.classList.add('escondido');
    limparAnimacoes();
}

function ocultarErro() {
    document.getElementById('mensagem-erro').classList.add('escondido');
}

function limparAnimacoes() {
    document.getElementById('bg-animacao').innerHTML = '';
}

function atualizarTemaEEfeitos(codigo) {
    const body = document.body;
    const statusEl = document.getElementById('status-texto');
    const bgContainer = document.getElementById('bg-animacao');

    body.className = '';
    limparAnimacoes();

    // Céu Limpo
    if (codigo === 0) {
        statusEl.textContent = 'Céu Limpo ☀️';
        body.classList.add('sol');
        
        const sol = document.createElement('div');
        sol.classList.add('sol-efeito');
        bgContainer.appendChild(sol);
    } 
    // Nublado (Gera 3 nuvens cartoon em alturas e velocidades diferentes)
    else if (codigo >= 1 && codigo <= 3) {
        statusEl.textContent = 'Nublado ⛅';
        body.classList.add('nublado');
        
        for (let i = 0; i < 3; i++) {
            const nuvem = document.createElement('div');
            nuvem.classList.add('nuvem-efeito');
            nuvem.style.top = `${15 + i * 20}%`;
            nuvem.style.animationDelay = `${i * 5}s`;
            nuvem.style.animationDuration = `${15 + i * 3}s`;
            bgContainer.appendChild(nuvem);
        }
    } 
    // Chuva
    else if (codigo >= 51) {
        statusEl.textContent = 'Chovendo 🌧️';
        body.classList.add('chuva');
        
        for (let i = 0; i < 40; i++) {
            const pingo = document.createElement('div');
            pingo.classList.add('pingo');
            pingo.style.left = `${Math.random() * 100}%`;
            pingo.style.animationDuration = `${Math.random() * 0.5 + 0.5}s`;
            pingo.style.animationDelay = `${Math.random() * 2}s`;
            bgContainer.appendChild(pingo);
        }
    } 
    else {
        statusEl.textContent = 'Tempo Variável 🌤️';
        body.classList.add('sol');
    }
}