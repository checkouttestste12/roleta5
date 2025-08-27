// Estado do jogo ultra-aprimorado
let gameState = {
    usuario: null,
    saldo: 0,
    girosGratis: 0,
    girosUsados: 0,
    primeiroDeposito: false,
    roletaGirando: false,
    timeoutGiro: null,
    anguloAtual: 0,
    animacaoId: null,
    velocidadeAtual: 0,
    aceleracao: 0,
    desaceleracao: 0,
    tempoInicioGiro: 0,
    faseGiro: 'parado', // 'parado', 'acelerando', 'constante', 'desacelerando'
    anguloAnterior: 0,
    velocidadeAngular: 0,
    momentoAngular: 0
};

// Elementos DOM
const elements = {
    cadastroOverlay: document.getElementById('cadastro-overlay'),
    cadastroForm: document.getElementById('cadastro-form'),
    btnGirar: document.getElementById('btn-girar'),
    btnParar: document.getElementById('btn-parar'),
    roleta: document.getElementById('roleta'),
    saldoAtual: document.getElementById('saldo-atual'),
    girosCount: document.getElementById('giros-count'),
    girosInfo: document.getElementById('giros-info'),
    girosTitle: document.getElementById('giros-title'),
    girosSubtitle: document.getElementById('giros-subtitle'),
    roletaContainer: document.getElementById('roleta-gratis-container'),
    girosGratisInfo: document.getElementById('giros-gratis-info'),
    girosPremiosInfo: document.getElementById('giros-premios-info'),
    resultadoModal: document.getElementById('resultado-modal'),
    resultadoTitulo: document.getElementById('resultado-titulo'),
    resultadoDescricao: document.getElementById('resultado-descricao'),
    resultadoIcon: document.getElementById('resultado-icon'),
    premioValor: document.getElementById('premio-valor'),
    premioDisplay: document.getElementById('premio-display'),
    novoSaldo: document.getElementById('novo-saldo'),
    girosRestantesModal: document.getElementById('giros-restantes-modal'),
    girosRestantesCount: document.getElementById('giros-restantes-count'),
    btnContinuar: document.getElementById('btn-continuar'),
    toastContainer: document.getElementById('toast-container'),
    velocidadeIndicator: document.querySelector('.velocidade-bar'),
    roletaWrapper: document.querySelector('.roleta-premium-wrapper'),
    particlesBg: document.getElementById('particles-bg')
};

// Configurações da roleta ultra-refinadas com física hiper-realista
const roletaConfig = {
    setores: [
        { premio: 0, texto: 'Vazio', cor: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', angulo: 0 },
        { premio: 25, texto: 'R$ 25', cor: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)', angulo: 45 },
        { premio: 0, texto: 'Vazio', cor: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', angulo: 90 },
        { premio: 50, texto: 'R$ 50', cor: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)', angulo: 135 },
        { premio: 0, texto: 'Vazio', cor: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', angulo: 180 },
        { premio: 75, texto: 'R$ 75', cor: 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)', angulo: 225 },
        { premio: 0, texto: 'Vazio', cor: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', angulo: 270 },
        { premio: 0, texto: 'Vazio', cor: 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)', angulo: 315 }
    ],
    anguloSetor: 45, // 360 / 8 setores
    
    // Física ultra-refinada para máximo realismo
    aceleracaoInicial: 0.4,        // Início mais suave
    aceleracaoMaxima: 1.8,         // Pico de aceleração mais controlado
    velocidadeMinima: 1.5,         // Velocidade inicial mais baixa
    velocidadeMaxima: 35,          // Velocidade máxima mais alta
    velocidadeConstante: 24,       // Velocidade de cruzeiro otimizada
    desaceleracaoBase: 0.985,      // Desaceleração mais gradual
    desaceleracaoFinal: 0.94,      // Desaceleração final mais suave
    
    // Tempos refinados para transições ultra-suaves
    tempoAceleracao: 2500,         // Aceleração mais longa e suave
    tempoMinimoGiro: 5000,         // Giro mínimo mais longo
    tempoMaximoGiro: 9000,         // Giro máximo estendido
    tempoDesaceleracao: 4500,      // Desaceleração mais longa e natural
    
    // Efeitos visuais aprimorados
    intensidadeBrilho: 0.3,        // Brilho mais sutil
    intensidadeSaturacao: 0.25,    // Saturação mais natural
    frequenciaTick: 120,           // Ticks mais frequentes
    amplitudeVibracao: 1.5,        // Vibração mais sutil
    
    // Novos parâmetros para ultra-realismo
    inercia: 0.98,                 // Fator de inércia
    atrito: 0.002,                 // Atrito natural
    elasticidade: 0.15,            // Elasticidade para overshoot
    amortecimento: 0.85,           // Amortecimento do overshoot
    ruido: 0.3,                    // Ruído natural na velocidade
    gravidade: 0.1                 // Simulação de peso
};

// Sistema de áudio ultra-aprimorado
const audioSystem = {
    context: null,
    sounds: {},
    masterVolume: 0.3,
    
    init() {
        try {
            this.context = new (window.AudioContext || window.webkitAudioContext)();
            this.createSounds();
        } catch (e) {
            console.log('Áudio não suportado:', e);
        }
    },
    
    createSounds() {
        this.sounds = {
            giro: this.createComplexTone([220, 330, 440], 0.15, 'sawtooth'),
            tick: this.createComplexTone([800, 1200], 0.03, 'square'),
            parada: this.createComplexTone([150, 100, 75], 0.4, 'sine'),
            vitoria: this.createComplexTone([440, 554, 659], 0.6, 'sine'),
            derrota: this.createComplexTone([110, 82, 65], 0.4, 'triangle'),
            whoosh: this.createNoiseSound(0.1, 'pink')
        };
    },
    
    createComplexTone(frequencies, duration, type = 'sine') {
        return {
            play: (volume = 1) => {
                if (!this.context) return;
                
                frequencies.forEach((freq, index) => {
                    const oscillator = this.context.createOscillator();
                    const gainNode = this.context.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.context.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = type;
                    
                    const vol = (this.masterVolume * volume) / frequencies.length;
                    gainNode.gain.setValueAtTime(0, this.context.currentTime);
                    gainNode.gain.linearRampToValueAtTime(vol, this.context.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + duration);
                    
                    oscillator.start(this.context.currentTime + (index * 0.01));
                    oscillator.stop(this.context.currentTime + duration);
                });
            }
        };
    },
    
    createNoiseSound(duration, type = 'white') {
        return {
            play: (volume = 1) => {
                if (!this.context) return;
                
                const bufferSize = this.context.sampleRate * duration;
                const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
                const output = buffer.getChannelData(0);
                
                for (let i = 0; i < bufferSize; i++) {
                    output[i] = Math.random() * 2 - 1;
                }
                
                const source = this.context.createBufferSource();
                const gainNode = this.context.createGain();
                
                source.buffer = buffer;
                source.connect(gainNode);
                gainNode.connect(this.context.destination);
                
                gainNode.gain.value = this.masterVolume * volume * 0.1;
                
                source.start();
            }
        };
    },
    
    playSound(soundName, volume = 1) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play(volume);
        }
    }
};

// Inicialização ultra-aprimorada
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎰 RoletaWin Ultra-Fluida - Iniciando...');
    
    setTimeout(() => {
        carregarEstadoJogo();
        inicializarEventListeners();
        atualizarInterface();
        criarParticulas();
        inicializarEfeitosVisuais();
        audioSystem.init();
        
        // Garantir estado inicial correto dos botões
        if (elements.btnGirar && elements.btnParar) {
            elements.btnGirar.classList.remove('hidden');
            elements.btnParar.classList.add('hidden');
            console.log('✅ Estado inicial dos botões configurado');
        }
        
        console.log('🚀 Sistema ultra-fluido inicializado com sucesso!');
    }, 100);
});

// Carregar estado do jogo do localStorage
function carregarEstadoJogo() {
    const estadoSalvo = localStorage.getItem('roletaUser');
    if (estadoSalvo) {
        const estadoParsed = JSON.parse(estadoSalvo);
        gameState = { ...gameState, ...estadoParsed };
        console.log('📂 Estado carregado:', gameState);
    }
}

// Salvar estado do jogo no localStorage
function salvarEstadoJogo() {
    const estadoParaSalvar = { ...gameState };
    // Remover propriedades temporárias
    delete estadoParaSalvar.roletaGirando;
    delete estadoParaSalvar.timeoutGiro;
    delete estadoParaSalvar.anguloAtual;
    delete estadoParaSalvar.animacaoId;
    delete estadoParaSalvar.velocidadeAtual;
    delete estadoParaSalvar.aceleracao;
    delete estadoParaSalvar.desaceleracao;
    delete estadoParaSalvar.tempoInicioGiro;
    delete estadoParaSalvar.faseGiro;
    delete estadoParaSalvar.anguloAnterior;
    delete estadoParaSalvar.velocidadeAngular;
    delete estadoParaSalvar.momentoAngular;
    
    localStorage.setItem('roletaUser', JSON.stringify(estadoParaSalvar));
}

// Inicializar event listeners ultra-aprimorados
function inicializarEventListeners() {
    if (!elements.btnGirar || !elements.btnParar) {
        console.error('❌ Elementos de botão não encontrados');
        return;
    }
    
    // Botões de controle da roleta com efeito ripple aprimorado
    elements.btnGirar.addEventListener('click', (e) => {
        criarEfeitoRippleAprimorado(e, elements.btnGirar);
        handleGirarClick();
    });
    
    elements.btnParar.addEventListener('click', (e) => {
        criarEfeitoRippleAprimorado(e, elements.btnParar);
        handlePararClick();
    });
    
    // Garantir que o botão parar esteja inicialmente oculto
    elements.btnParar.classList.add('hidden');
    
    // Formulário de cadastro
    if (elements.cadastroForm) {
        elements.cadastroForm.addEventListener('submit', handleCadastro);
    }
    
    // Botão continuar do modal de resultado
    if (elements.btnContinuar) {
        elements.btnContinuar.addEventListener('click', fecharModalResultado);
    }
    
    // Fechar modal clicando no backdrop
    if (elements.cadastroOverlay) {
        elements.cadastroOverlay.addEventListener('click', function(e) {
            if (e.target === elements.cadastroOverlay) {
                fecharModalCadastro();
            }
        });
    }
    
    if (elements.resultadoModal) {
        elements.resultadoModal.addEventListener('click', function(e) {
            if (e.target === elements.resultadoModal) {
                fecharModalResultado();
            }
        });
    }
    
    // Botões das mesas pagas
    document.querySelectorAll('.mesa-card[data-valor]').forEach(mesa => {
        const btnJogar = mesa.querySelector('.btn-jogar');
        if (btnJogar) {
            btnJogar.addEventListener('click', (e) => {
                criarEfeitoRippleAprimorado(e, btnJogar);
                const valor = parseInt(mesa.dataset.valor);
                jogarMesaPaga(valor);
            });
        }
    });
    
    // Eventos de teclado para acessibilidade
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !gameState.roletaGirando && gameState.usuario && gameState.girosGratis > 0) {
            e.preventDefault();
            handleGirarClick();
        } else if (e.code === 'Space' && gameState.roletaGirando) {
            e.preventDefault();
            handlePararClick();
        }
    });
}

// Criar efeito ripple aprimorado nos botões
function criarEfeitoRippleAprimorado(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.2;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('btn-ripple-ultra');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 800);
}

// Handle click no botão girar
function handleGirarClick() {
    if (gameState.roletaGirando) return;
    
    if (!gameState.usuario) {
        mostrarModalCadastro();
    } else if (gameState.girosGratis > 0) {
        girarRoletaUltraFluida();
    } else {
        mostrarToast('Você não tem mais giros grátis disponíveis!', 'warning');
    }
}

// Handle click no botão parar
function handlePararClick() {
    if (!gameState.roletaGirando || gameState.faseGiro === 'desacelerando') return;
    pararRoletaUltraFluida();
}

// Handle cadastro
function handleCadastro(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const senha = document.getElementById('senha').value.trim();
    
    if (!nome || !email || !senha) {
        mostrarToast('Por favor, preencha todos os campos!', 'error');
        return;
    }
    
    // Simular cadastro
    gameState.usuario = {
        nome: nome,
        email: email
    };
    gameState.girosGratis = 3;
    gameState.girosUsados = 0;
    
    salvarEstadoJogo();
    fecharModalCadastro();
    atualizarInterface();
    
    mostrarToast(`Bem-vindo, ${nome}! Você recebeu 3 giros grátis!`, 'success');
}

// Mostrar modal de cadastro
function mostrarModalCadastro() {
    elements.cadastroOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de cadastro
function fecharModalCadastro() {
    elements.cadastroOverlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// FUNÇÃO PRINCIPAL ULTRA-APRIMORADA PARA GIRAR A ROLETA
function girarRoletaUltraFluida() {
    if (gameState.girosGratis <= 0 || gameState.roletaGirando) {
        return;
    }
    
    console.log('🎯 Iniciando giro ultra-fluido da roleta');
    
    // Marcar como girando
    gameState.roletaGirando = true;
    gameState.faseGiro = 'acelerando';
    gameState.tempoInicioGiro = Date.now();
    gameState.velocidadeAtual = roletaConfig.velocidadeMinima;
    gameState.aceleracao = roletaConfig.aceleracaoInicial;
    gameState.anguloAnterior = gameState.anguloAtual;
    gameState.velocidadeAngular = 0;
    gameState.momentoAngular = 0;
    
    // Atualizar interface dos botões
    trocarBotoesUltraFluido(true);
    
    // Adicionar classes para animação dinâmica
    adicionarClassesGiroUltraFluido();
    
    // Tocar som de giro com whoosh
    audioSystem.playSound('giro', 0.8);
    audioSystem.playSound('whoosh', 0.4);
    
    // Iniciar animação de giro contínuo ultra-aprimorada
    iniciarGiroContinuoUltraFluido();
    
    mostrarToast('Clique em PARAR quando quiser parar a roleta!', 'info');
}

// Trocar botões com animação ultra-suave
function trocarBotoesUltraFluido(girando) {
    if (!elements.btnGirar || !elements.btnParar) return;
    
    if (girando) {
        // Transição ultra-suave para o botão PARAR
        elements.btnGirar.style.transform = 'scale(0.9) rotateY(90deg)';
        elements.btnGirar.style.opacity = '0';
        
        setTimeout(() => {
            elements.btnGirar.classList.add('hidden');
            elements.btnParar.classList.remove('hidden');
            elements.btnParar.style.transform = 'scale(0.9) rotateY(-90deg)';
            elements.btnParar.style.opacity = '0';
            
            requestAnimationFrame(() => {
                elements.btnParar.style.transform = 'scale(1) rotateY(0deg)';
                elements.btnParar.style.opacity = '1';
            });
        }, 300);
    } else {
        // Transição ultra-suave para o botão GIRAR
        elements.btnParar.style.transform = 'scale(0.9) rotateY(90deg)';
        elements.btnParar.style.opacity = '0';
        
        setTimeout(() => {
            elements.btnParar.classList.add('hidden');
            elements.btnGirar.classList.remove('hidden');
            elements.btnGirar.style.transform = 'scale(0.9) rotateY(-90deg)';
            elements.btnGirar.style.opacity = '0';
            
            requestAnimationFrame(() => {
                elements.btnGirar.style.transform = 'scale(1) rotateY(0deg)';
                elements.btnGirar.style.opacity = '1';
            });
        }, 300);
    }
}

// Adicionar classes de giro ultra-fluido
function adicionarClassesGiroUltraFluido() {
    if (elements.roletaContainer) {
        elements.roletaContainer.classList.add('girando-ultra');
    }
    if (elements.roletaWrapper) {
        elements.roletaWrapper.classList.add('girando-ultra');
    }
    if (elements.girosPremiosInfo) {
        elements.girosPremiosInfo.classList.add('hidden-ultra');
    }
    if (elements.roleta) {
        elements.roleta.classList.add('girando-ultra');
    }
}

// Remover classes de giro ultra-fluido
function removerClassesGiroUltraFluido() {
    if (elements.roletaContainer) {
        elements.roletaContainer.classList.remove('girando-ultra');
    }
    if (elements.roletaWrapper) {
        elements.roletaWrapper.classList.remove('girando-ultra');
    }
    if (elements.girosPremiosInfo) {
        elements.girosPremiosInfo.classList.remove('hidden-ultra');
    }
    if (elements.roleta) {
        elements.roleta.classList.remove('girando-ultra');
        elements.roleta.classList.add('parando-ultra');
    }
}

// GIRO CONTÍNUO ULTRA-FLUIDO COM FÍSICA HIPER-REALISTA
function iniciarGiroContinuoUltraFluido() {
    let ultimoTick = 0;
    let ultimoTempoTick = 0;
    let frameCount = 0;
    
    function animarGiroUltraFluido() {
        if (!gameState.roletaGirando) return;
        
        const tempoAtual = Date.now();
        const tempoDecorrido = tempoAtual - gameState.tempoInicioGiro;
        const deltaTime = Math.min(tempoAtual - (ultimoTempoTick || tempoAtual), 32); // Cap at ~30fps minimum
        ultimoTempoTick = tempoAtual;
        frameCount++;
        
        // FASE DE ACELERAÇÃO ULTRA-SUAVE
        if (gameState.faseGiro === 'acelerando') {
            if (tempoDecorrido < roletaConfig.tempoAceleracao) {
                // Aceleração progressiva com curva ultra-suave
                const progresso = tempoDecorrido / roletaConfig.tempoAceleracao;
                const curvaAceleracao = easeInOutQuint(progresso);
                
                gameState.aceleracao = roletaConfig.aceleracaoInicial + 
                    (roletaConfig.aceleracaoMaxima - roletaConfig.aceleracaoInicial) * curvaAceleracao;
                
                // Aplicar aceleração com suavização
                const deltaVelocidade = gameState.aceleracao * (deltaTime / 16.67);
                gameState.velocidadeAtual += deltaVelocidade * (1 + Math.sin(frameCount * 0.1) * roletaConfig.ruido);
                gameState.velocidadeAtual = Math.min(gameState.velocidadeAtual, roletaConfig.velocidadeConstante);
            } else {
                gameState.faseGiro = 'constante';
                gameState.velocidadeAtual = roletaConfig.velocidadeConstante;
                console.log('🏃 Fase: Velocidade constante ultra-fluida');
            }
        }
        
        // FASE DE VELOCIDADE CONSTANTE ULTRA-ESTÁVEL
        else if (gameState.faseGiro === 'constante') {
            // Variações naturais ultra-sutis com ruído Perlin simulado
            const ruido = Math.sin(frameCount * 0.05) * Math.cos(frameCount * 0.03) * roletaConfig.ruido;
            const atrito = roletaConfig.atrito * gameState.velocidadeAtual;
            
            gameState.velocidadeAtual += ruido - atrito;
            gameState.velocidadeAtual = Math.max(
                roletaConfig.velocidadeConstante - 1.5, 
                Math.min(gameState.velocidadeAtual, roletaConfig.velocidadeConstante + 1.5)
            );
        }
        
        // Calcular momento angular para inércia realista
        gameState.momentoAngular = gameState.velocidadeAtual * roletaConfig.inercia;
        
        // Atualizar ângulo com suavização ultra-precisa
        const deltaAngulo = gameState.momentoAngular * (deltaTime / 16.67);
        gameState.anguloAtual += deltaAngulo;
        gameState.anguloAtual %= 360;
        
        // Calcular velocidade angular para efeitos visuais
        gameState.velocidadeAngular = (gameState.anguloAtual - gameState.anguloAnterior) / (deltaTime / 1000);
        gameState.anguloAnterior = gameState.anguloAtual;
        
        // Aplicar rotação com transformação ultra-suave
        if (elements.roleta) {
            // Usar transform3d para aceleração de hardware
            elements.roleta.style.transform = `translate3d(0, 0, 0) rotate(${gameState.anguloAtual}deg)`;
        }
        
        // Atualizar indicador de velocidade ultra-responsivo
        atualizarIndicadorVelocidadeUltraFluido();
        
        // Efeito sonoro de tick ultra-dinâmico
        const intervaloTick = Math.max(40, roletaConfig.frequenciaTick - (gameState.velocidadeAtual * 3));
        if (tempoAtual - ultimoTick > intervaloTick) {
            const volumeTick = Math.min(1, gameState.velocidadeAtual / roletaConfig.velocidadeMaxima);
            audioSystem.playSound('tick', volumeTick * 0.6);
            ultimoTick = tempoAtual;
        }
        
        // Efeito visual ultra-dinâmico
        aplicarEfeitosVisuaisUltraFluidos();
        
        gameState.animacaoId = requestAnimationFrame(animarGiroUltraFluido);
    }
    
    animarGiroUltraFluido();
}

// Atualizar indicador de velocidade ultra-fluido
function atualizarIndicadorVelocidadeUltraFluido() {
    if (elements.velocidadeIndicator) {
        const porcentagem = (gameState.velocidadeAtual / roletaConfig.velocidadeMaxima) * 100;
        const porcentagemSuavizada = Math.min(100, Math.max(0, porcentagem));
        
        // Transição ultra-suave
        elements.velocidadeIndicator.style.width = `${porcentagemSuavizada}%`;
        
        // Cor dinâmica baseada na velocidade
        const hue = Math.floor(120 - (porcentagemSuavizada * 1.2)); // Verde para vermelho
        elements.velocidadeIndicator.style.background = `linear-gradient(90deg, hsl(${hue}, 70%, 50%), hsl(${hue - 20}, 80%, 60%))`;
    }
}

// Aplicar efeitos visuais ultra-fluidos
function aplicarEfeitosVisuaisUltraFluidos() {
    if (!elements.roleta) return;
    
    const intensidadeBrilho = Math.min(1, gameState.velocidadeAtual / roletaConfig.velocidadeMaxima);
    const brilho = 1 + (intensidadeBrilho * roletaConfig.intensidadeBrilho);
    const saturacao = 1 + (intensidadeBrilho * roletaConfig.intensidadeSaturacao);
    
    // Motion blur baseado na velocidade angular
    const blurAmount = Math.min(3, Math.abs(gameState.velocidadeAngular) / 100);
    
    elements.roleta.style.filter = `brightness(${brilho}) saturate(${saturacao}) blur(${blurAmount}px)`;
    
    // Efeito de vibração ultra-sutil durante alta velocidade
    if (gameState.velocidadeAtual > roletaConfig.velocidadeConstante * 0.7) {
        const vibracao = Math.sin(Date.now() * 0.05) * roletaConfig.amplitudeVibracao;
        elements.roleta.style.transform += ` translateX(${vibracao}px) translateY(${vibracao * 0.5}px)`;
    }
}

// PARAR ROLETA ULTRA-FLUIDA
function pararRoletaUltraFluida() {
    if (!gameState.roletaGirando || gameState.faseGiro === 'desacelerando') return;
    
    console.log('🛑 Iniciando parada ultra-fluida da roleta');
    
    gameState.faseGiro = 'desacelerando';
    
    // Determinar prêmio baseado no número de giros (lógica de negócio)
    let premioGarantido = null;
    if (gameState.girosUsados === 1) { // Segunda rodada
        premioGarantido = 75; // Garantir R$ 75,00 na segunda rodada
    }
    
    // Calcular posição final com física ultra-realista
    const { anguloFinal, premioGanho } = calcularPosicaoFinalUltraFluida(premioGarantido);
    
    // Aplicar desaceleração ultra-realista até a posição final
    aplicarDesaceleracaoUltraFluida(anguloFinal, premioGanho);
}

// CALCULAR POSIÇÃO FINAL ULTRA-FLUIDA
function calcularPosicaoFinalUltraFluida(premioGarantido = null) {
    let setorEscolhido;
    
    if (premioGarantido !== null) {
        // Encontrar setor com o prêmio garantido
        setorEscolhido = roletaConfig.setores.findIndex(setor => setor.premio === premioGarantido);
        if (setorEscolhido === -1) {
            setorEscolhido = Math.floor(Math.random() * roletaConfig.setores.length);
        }
    } else {
        // Para outras rodadas, usar probabilidade realista
        const setoresVazios = [0, 2, 4, 6, 7]; // Índices dos setores vazios
        const setoresPremio = [1, 3, 5]; // Índices dos setores com prêmio
        
        // 70% chance de cair em setor vazio, 30% chance de prêmio
        if (Math.random() < 0.7) {
            setorEscolhido = setoresVazios[Math.floor(Math.random() * setoresVazios.length)];
        } else {
            setorEscolhido = setoresPremio[Math.floor(Math.random() * setoresPremio.length)];
        }
    }
    
    // Calcular ângulo final com precisão ultra-aprimorada
    const anguloSetor = setorEscolhido * roletaConfig.anguloSetor;
    const anguloAleatorioNoSetor = (Math.random() - 0.5) * roletaConfig.anguloSetor * 0.8; // Mais centrado
    const voltasAdicionais = Math.floor(Math.random() * 4 + 5) * 360; // 5-8 voltas adicionais
    
    // Ajustar para que o ponteiro aponte para o centro do setor
    const ajustePonteiro = roletaConfig.anguloSetor / 2;
    
    // Compensar a rotação atual para garantir precisão ultra-alta
    let anguloFinal = gameState.anguloAtual + voltasAdicionais + anguloSetor + anguloAleatorioNoSetor - ajustePonteiro;
    
    // Garantir que o ângulo final seja positivo e tenha voltas suficientes
    while (anguloFinal < gameState.anguloAtual + 720) { // Mínimo 2 voltas
        anguloFinal += 360;
    }
    
    const premioGanho = roletaConfig.setores[setorEscolhido].premio;
    
    console.log(`🎯 Setor escolhido: ${setorEscolhido}, Prêmio: R$ ${premioGanho}, Ângulo final: ${anguloFinal.toFixed(2)}°`);
    
    return { anguloFinal, premioGanho };
}

// APLICAR DESACELERAÇÃO ULTRA-FLUIDA COM OVERSHOOT
function aplicarDesaceleracaoUltraFluida(anguloFinal, premioGanho) {
    const anguloInicial = gameState.anguloAtual;
    const distanciaTotal = anguloFinal - anguloInicial;
    const velocidadeInicial = gameState.velocidadeAtual;
    const tempoInicio = Date.now();
    
    console.log(`🎯 Desaceleração ultra-fluida: ${distanciaTotal.toFixed(2)}° em ${roletaConfig.tempoDesaceleracao}ms`);
    
    // Cancelar animação anterior
    if (gameState.animacaoId) {
        cancelAnimationFrame(gameState.animacaoId);
        gameState.animacaoId = null;
    }
    
    // Remover classes de giro e adicionar classe de parada
    removerClassesGiroUltraFluido();
    
    let ultimoTick = 0;
    let frameCount = 0;
    
    function animarDesaceleracaoUltraFluida() {
        const tempoAtual = Date.now();
        const tempoDecorrido = tempoAtual - tempoInicio;
        const progresso = Math.min(1, tempoDecorrido / roletaConfig.tempoDesaceleracao);
        frameCount++;
        
        // Curva de desaceleração ultra-realista com overshoot
        let curvaDesaceleracao;
        if (progresso < 0.85) {
            // Desaceleração principal
            curvaDesaceleracao = easeOutQuint(progresso / 0.85);
        } else {
            // Fase de overshoot e bounce
            const progressoOvershoot = (progresso - 0.85) / 0.15;
            const overshoot = Math.sin(progressoOvershoot * Math.PI * 2) * roletaConfig.elasticidade * (1 - progressoOvershoot);
            curvaDesaceleracao = 1 + overshoot * roletaConfig.amortecimento;
        }
        
        // Calcular posição atual com base na curva ultra-suave
        const anguloAtual = anguloInicial + (distanciaTotal * curvaDesaceleracao);
        gameState.anguloAtual = anguloAtual;
        
        // Calcular velocidade atual baseada na derivada da curva
        const velocidadeAtual = velocidadeInicial * (1 - Math.pow(progresso, 2)) * 0.7;
        gameState.velocidadeAtual = Math.max(0, velocidadeAtual);
        
        // Aplicar rotação com transform3d para máxima suavidade
        if (elements.roleta) {
            elements.roleta.style.transform = `translate3d(0, 0, 0) rotate(${anguloAtual}deg)`;
        }
        
        // Atualizar indicador de velocidade
        atualizarIndicadorVelocidadeUltraFluido();
        
        // Efeito sonoro de tick com frequência decrescente ultra-suave
        const intervaloTick = Math.max(80, roletaConfig.frequenciaTick + (progresso * 300));
        if (tempoAtual - ultimoTick > intervaloTick && progresso < 0.95) {
            const volumeTick = (1 - progresso) * 0.8;
            audioSystem.playSound('tick', volumeTick);
            ultimoTick = tempoAtual;
        }
        
        // Efeito visual de desaceleração ultra-dinâmico
        aplicarEfeitosVisuaisUltraFluidos();
        
        // Efeito de "clique" nos setores durante a fase final ultra-sutil
        if (progresso > 0.8 && Math.random() < 0.08) {
            if (elements.roleta) {
                const microScale = 1 + (Math.sin(frameCount * 0.3) * 0.005);
                elements.roleta.style.transform += ` scale(${microScale})`;
            }
        }
        
        if (progresso < 1) {
            gameState.animacaoId = requestAnimationFrame(animarDesaceleracaoUltraFluida);
        } else {
            // Finalizar giro com posição ultra-exata
            gameState.anguloAtual = anguloFinal;
            if (elements.roleta) {
                elements.roleta.style.transform = `translate3d(0, 0, 0) rotate(${anguloFinal}deg)`;
            }
            finalizarGiroUltraFluido(premioGanho);
        }
    }
    
    animarDesaceleracaoUltraFluida();
}

// Funções de easing ultra-aprimoradas para animações hiper-suaves
function easeInOutQuint(t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
}

function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
}

function easeInOutElastic(t) {
    const c5 = (2 * Math.PI) / 4.5;
    return t === 0 ? 0 : t === 1 ? 1 : t < 0.5 
        ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
}

// FINALIZAR GIRO ULTRA-FLUIDO
function finalizarGiroUltraFluido(premioGanho) {
    console.log('🏁 Finalizando giro ultra-fluido com prêmio:', premioGanho);
    
    // Marcar como não girando
    gameState.roletaGirando = false;
    gameState.faseGiro = 'parado';
    
    // Limpar animações
    if (gameState.animacaoId) {
        cancelAnimationFrame(gameState.animacaoId);
        gameState.animacaoId = null;
    }
    
    // Restaurar interface dos botões
    trocarBotoesUltraFluido(false);
    
    // Remover classe de parada
    if (elements.roleta) {
        elements.roleta.classList.remove('parando-ultra');
    }
    
    // Restaurar filtros visuais gradualmente
    if (elements.roleta) {
        setTimeout(() => {
            elements.roleta.style.filter = 'none';
        }, 500);
    }
    
    // Resetar indicador de velocidade suavemente
    if (elements.velocidadeIndicator) {
        setTimeout(() => {
            elements.velocidadeIndicator.style.width = '0%';
        }, 300);
    }
    
    // Tocar som de parada ultra-realista
    audioSystem.playSound('parada', 0.9);
    
    // Atualizar estado do jogo
    gameState.girosGratis--;
    gameState.girosUsados++;
    gameState.saldo += premioGanho;
    gameState.velocidadeAtual = 0;
    gameState.velocidadeAngular = 0;
    gameState.momentoAngular = 0;
    
    // Salvar estado
    salvarEstadoJogo();
    
    // Atualizar interface
    atualizarInterface();
    
    // Mostrar resultado com delay para efeito dramático ultra-aprimorado
    setTimeout(() => {
        if (premioGanho > 0) {
            criarConfetesUltraFluidos();
            audioSystem.playSound('vitoria', 1.0);
            // Efeito de pulsação no setor vencedor ultra-sutil
            destacarSetorVencedorUltraFluido();
        } else {
            audioSystem.playSound('derrota', 0.8);
        }
        
        mostrarModalResultado(premioGanho);
    }, 1000);
}

// Destacar setor vencedor com animação ultra-fluida
function destacarSetorVencedorUltraFluido() {
    const anguloAtual = gameState.anguloAtual % 360;
    const setorIndex = Math.floor(((360 - anguloAtual + 22.5) % 360) / 45);
    const setores = document.querySelectorAll('.setor');
    
    if (setores[setorIndex]) {
        setores[setorIndex].style.animation = 'setorVencedorUltra 2s ease-in-out 2';
    }
    
    // Adicionar animação CSS ultra-fluida se não existir
    if (!document.querySelector('#setor-vencedor-ultra-animation')) {
        const style = document.createElement('style');
        style.id = 'setor-vencedor-ultra-animation';
        style.textContent = `
            @keyframes setorVencedorUltra {
                0%, 100% { 
                    transform: scale(1) rotate(var(--rotation)); 
                    box-shadow: none;
                }
                25% { 
                    transform: scale(1.05) rotate(var(--rotation)); 
                    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
                }
                50% { 
                    transform: scale(1.08) rotate(var(--rotation)); 
                    box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
                }
                75% { 
                    transform: scale(1.05) rotate(var(--rotation)); 
                    box-shadow: 0 0 30px rgba(255, 215, 0, 0.6);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Criar efeito de confetes ultra-fluidos
function criarConfetesUltraFluidos() {
    const container = document.querySelector('.confetti-container');
    if (!container) return;
    
    // Limpar confetes existentes
    container.innerHTML = '';
    
    const cores = ['#ffd700', '#ff6b6b', '#4ecdc4', '#8a2be2', '#00ff88', '#ff9f43', '#ff6b9d', '#66d9ef'];
    const formas = ['circle', 'square', 'triangle', 'star'];
    
    for (let i = 0; i < 150; i++) {
        const confete = document.createElement('div');
        const forma = formas[Math.floor(Math.random() * formas.length)];
        const cor = cores[Math.floor(Math.random() * cores.length)];
        const tamanho = Math.random() * 12 + 8;
        
        Object.assign(confete.style, {
            position: 'absolute',
            width: `${tamanho}px`,
            height: `${tamanho}px`,
            backgroundColor: cor,
            left: Math.random() * 100 + '%',
            top: '-30px',
            zIndex: '9999',
            pointerEvents: 'none',
            opacity: '0.9'
        });
        
        // Aplicar forma ultra-detalhada
        if (forma === 'circle') {
            confete.style.borderRadius = '50%';
        } else if (forma === 'triangle') {
            confete.style.width = '0';
            confete.style.height = '0';
            confete.style.backgroundColor = 'transparent';
            confete.style.borderLeft = `${tamanho/2}px solid transparent`;
            confete.style.borderRight = `${tamanho/2}px solid transparent`;
            confete.style.borderBottom = `${tamanho}px solid ${cor}`;
        } else if (forma === 'star') {
            confete.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
        }
        
        // Animação ultra-fluida personalizada
        const duracao = 4 + Math.random() * 6;
        const rotacao = Math.random() * 1440 + 720; // 2-4 voltas
        const deslocamentoX = (Math.random() - 0.5) * 400;
        const deslocamentoY = Math.random() * 200 + 100;
        
        confete.style.animation = `confettiFallUltraFluido ${duracao}s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`;
        confete.style.setProperty('--rotacao', `${rotacao}deg`);
        confete.style.setProperty('--deslocamento-x', `${deslocamentoX}px`);
        confete.style.setProperty('--deslocamento-y', `${deslocamentoY}px`);
        
        container.appendChild(confete);
    }
    
    // Adicionar animação CSS ultra-fluida se não existir
    if (!document.querySelector('#confetti-ultra-animation')) {
        const style = document.createElement('style');
        style.id = 'confetti-ultra-animation';
        style.textContent = `
            @keyframes confettiFallUltraFluido {
                0% {
                    transform: translateY(0) translateX(0) rotate(0deg) scale(1);
                    opacity: 1;
                }
                15% {
                    opacity: 1;
                    transform: translateY(var(--deslocamento-y)) translateX(calc(var(--deslocamento-x) * 0.3)) rotate(calc(var(--rotacao) * 0.2)) scale(1.1);
                }
                85% {
                    opacity: 0.7;
                }
                100% {
                    transform: translateY(calc(100vh + var(--deslocamento-y))) translateX(var(--deslocamento-x)) rotate(var(--rotacao)) scale(0.2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Mostrar modal de resultado aprimorado
function mostrarModalResultado(premioGanho) {
    // Configurar conteúdo do modal
    if (premioGanho > 0) {
        elements.resultadoTitulo.textContent = '🎉 Parabéns!';
        elements.resultadoDescricao.textContent = 'Você ganhou um prêmio incrível!';
        elements.resultadoIcon.innerHTML = '<i class="fas fa-trophy"></i>';
        elements.resultadoIcon.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
    } else {
        elements.resultadoTitulo.textContent = '😔 Que pena!';
        elements.resultadoDescricao.textContent = 'Não foi desta vez, mas continue tentando!';
        elements.resultadoIcon.innerHTML = '<i class="fas fa-heart-broken"></i>';
        elements.resultadoIcon.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)';
    }
    
    // Atualizar valores com animação
    elements.premioValor.textContent = `R$ ${premioGanho.toFixed(2).replace('.', ',')}`;
    elements.novoSaldo.textContent = gameState.saldo.toFixed(2).replace('.', ',');
    elements.girosRestantesCount.textContent = gameState.girosGratis;
    
    if (gameState.girosGratis > 0) {
        elements.girosRestantesModal.style.display = 'flex';
    } else {
        elements.girosRestantesModal.style.display = 'none';
    }
    
    // Mostrar modal
    elements.resultadoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de resultado
function fecharModalResultado() {
    elements.resultadoModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Atualizar interface ultra-aprimorada
function atualizarInterface() {
    // Atualizar saldo com animação
    if (elements.saldoAtual) {
        elements.saldoAtual.textContent = gameState.saldo.toFixed(2).replace('.', ',');
    }
    
    if (gameState.usuario && gameState.girosGratis > 0) {
        // Usuário logado com giros grátis
        if (elements.girosCount) elements.girosCount.textContent = gameState.girosGratis;
        if (elements.girosInfo) elements.girosInfo.style.display = 'block';
        if (elements.roletaContainer) elements.roletaContainer.style.display = 'block';
        if (elements.girosPremiosInfo) elements.girosPremiosInfo.style.display = 'block';
        if (elements.btnGirar) elements.btnGirar.style.display = 'block';
        
        // Manter título e subtítulo originais
        if (elements.girosTitle) elements.girosTitle.textContent = '3 Giros Grátis';
        if (elements.girosSubtitle) elements.girosSubtitle.textContent = 'Cadastre-se e ganhe até R$ 75,00!';
        
    } else if (gameState.usuario && gameState.girosGratis === 0) {
        // Usuário logado sem giros grátis
        if (elements.girosInfo) elements.girosInfo.style.display = 'none';
        if (elements.roletaContainer) elements.roletaContainer.style.display = 'none';
        if (elements.girosPremiosInfo) elements.girosPremiosInfo.style.display = 'none';
        if (elements.btnGirar) elements.btnGirar.style.display = 'none';
        if (elements.btnParar) elements.btnParar.style.display = 'none';
        
        // Alterar para estado "sem giros grátis"
        if (elements.girosTitle) elements.girosTitle.textContent = 'Sem mais giros grátis';
        if (elements.girosSubtitle) elements.girosSubtitle.textContent = 'Experimente nossas mesas com apostas abaixo!';
        
    } else {
        // Usuário não logado
        if (elements.girosInfo) elements.girosInfo.style.display = 'none';
        if (elements.roletaContainer) elements.roletaContainer.style.display = 'block';
        if (elements.girosPremiosInfo) elements.girosPremiosInfo.style.display = 'block';
        if (elements.btnGirar) elements.btnGirar.style.display = 'block';
        if (elements.btnParar) elements.btnParar.style.display = 'none';
        
        // Manter título e subtítulo originais
        if (elements.girosTitle) elements.girosTitle.textContent = '3 Giros Grátis';
        if (elements.girosSubtitle) elements.girosSubtitle.textContent = 'Cadastre-se e ganhe até R$ 75,00!';
    }
}

// Jogar mesa paga
function jogarMesaPaga(valor) {
    if (gameState.saldo < valor) {
        mostrarToast('Saldo insuficiente! Faça um depósito.', 'warning');
        return;
    }
    
    mostrarToast(`Mesa R$ ${valor},00 em desenvolvimento!`, 'info');
}

// Mostrar toast notification ultra-aprimorado
function mostrarToast(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast-ultra';
    toast.textContent = mensagem;
    
    // Aplicar estilo baseado no tipo
    switch (tipo) {
        case 'success':
            toast.style.background = 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)';
            toast.style.color = '#0a0e27';
            break;
        case 'error':
            toast.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)';
            toast.style.color = '#ffffff';
            break;
        case 'warning':
            toast.style.background = 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)';
            toast.style.color = '#0a0e27';
            break;
        default:
            toast.style.background = 'linear-gradient(135deg, #4ecdc4 0%, #26a69a 100%)';
            toast.style.color = '#ffffff';
    }
    
    elements.toastContainer.appendChild(toast);
    
    // Animar entrada ultra-suave
    setTimeout(() => {
        toast.style.transform = 'translateX(0) scale(1)';
        toast.style.opacity = '1';
    }, 100);
    
    // Remover após 5 segundos com animação ultra-suave
    setTimeout(() => {
        toast.style.transform = 'translateX(100%) scale(0.8)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 500);
    }, 5000);
}

// Criar partículas de fundo ultra-aprimoradas
function criarParticulas() {
    if (!elements.particlesBg) return;
    
    for (let i = 0; i < 75; i++) {
        const particula = document.createElement('div');
        const tamanho = Math.random() * 10 + 4;
        const cores = [
            'rgba(255, 215, 0, 0.3)', 
            'rgba(138, 43, 226, 0.25)', 
            'rgba(255, 105, 180, 0.25)', 
            'rgba(76, 205, 196, 0.25)',
            'rgba(102, 217, 239, 0.2)'
        ];
        const cor = cores[Math.floor(Math.random() * cores.length)];
        
        Object.assign(particula.style, {
            position: 'absolute',
            width: `${tamanho}px`,
            height: `${tamanho}px`,
            backgroundColor: cor,
            borderRadius: '50%',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            pointerEvents: 'none',
            filter: 'blur(1.5px)'
        });
        
        const duracao = 25 + Math.random() * 40;
        const delay = Math.random() * 20;
        particula.style.animation = `particleFloatUltraFluido ${duracao}s linear infinite`;
        particula.style.animationDelay = `${delay}s`;
        
        elements.particlesBg.appendChild(particula);
    }
    
    // Adicionar animação CSS ultra-fluida se não existir
    if (!document.querySelector('#particle-ultra-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-ultra-animation';
        style.textContent = `
            @keyframes particleFloatUltraFluido {
                0% {
                    transform: translateY(0px) translateX(0px) rotate(0deg) scale(0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                    transform: translateY(-30px) translateX(15px) rotate(90deg) scale(1);
                }
                90% {
                    opacity: 0.6;
                }
                100% {
                    transform: translateY(-120vh) translateX(200px) rotate(720deg) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Inicializar efeitos visuais ultra-aprimorados
function inicializarEfeitosVisuais() {
    // Efeito de hover ultra-sutil nos setores da roleta
    const setores = document.querySelectorAll('.setor');
    setores.forEach((setor, index) => {
        setor.addEventListener('mouseenter', () => {
            if (!gameState.roletaGirando) {
                setor.style.transform += ' scale(1.03)';
                setor.style.zIndex = '10';
                setor.style.boxShadow = '0 0 25px rgba(255, 215, 0, 0.4)';
                setor.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        });
        
        setor.addEventListener('mouseleave', () => {
            if (!gameState.roletaGirando) {
                setor.style.transform = setor.style.transform.replace(' scale(1.03)', '');
                setor.style.zIndex = 'auto';
                setor.style.boxShadow = 'none';
            }
        });
    });
    
    // Efeito de pulsação ultra-sutil no centro da roleta
    const centro = document.querySelector('.center-pulse');
    if (centro) {
        setInterval(() => {
            if (!gameState.roletaGirando) {
                centro.style.animation = 'none';
                setTimeout(() => {
                    centro.style.animation = 'centerPulseUltra 3s ease-in-out infinite';
                }, 20);
            }
        }, 6000);
    }
    
    // Adicionar animação de pulsação ultra-sutil se não existir
    if (!document.querySelector('#center-pulse-ultra-animation')) {
        const style = document.createElement('style');
        style.id = 'center-pulse-ultra-animation';
        style.textContent = `
            @keyframes centerPulseUltra {
                0%, 100% {
                    transform: scale(1);
                    opacity: 0.3;
                    box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
                }
                50% {
                    transform: scale(1.15);
                    opacity: 0.1;
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Função para resetar o jogo (para testes)
function resetarJogo() {
    gameState = {
        usuario: null,
        saldo: 0,
        girosGratis: 0,
        girosUsados: 0,
        primeiroDeposito: false,
        roletaGirando: false,
        timeoutGiro: null,
        anguloAtual: 0,
        animacaoId: null,
        velocidadeAtual: 0,
        aceleracao: 0,
        desaceleracao: 0,
        tempoInicioGiro: 0,
        faseGiro: 'parado',
        anguloAnterior: 0,
        velocidadeAngular: 0,
        momentoAngular: 0
    };
    localStorage.removeItem('roletaUser');
    atualizarInterface();
    location.reload();
}

// Expor funções para console (desenvolvimento)
window.resetarJogo = resetarJogo;
window.gameState = gameState;
window.roletaConfig = roletaConfig;

console.log('🎰 RoletaWin Ultra-Fluida carregada com sucesso!');

