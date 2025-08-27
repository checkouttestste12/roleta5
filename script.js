// Estado do jogo adaptado para o estilo do anexo
let gameState = {
    usuario: null,
    saldo: 0,
    girosGratis: 0,
    girosUsados: 0,
    primeiroDeposito: false,
    roletaGirando: false,
    anguloAtual: 0,
    _bis: false,
    _index: 0
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
    roletaWrapper: document.querySelector('.roleta-premium-wrapper'),
    particlesBg: document.getElementById('particles-bg')
};

// Configurações da roleta baseadas no anexo
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
    
    // Configurações baseadas no anexo
    spinDuration: 5000,  // 5 segundos como no anexo
    easing: 'easeOutQuint',
    rotacaoExtra: 1440   // 4 voltas completas como no anexo
};

// Função de easing easeOutQuint (como no anexo)
function easeOutQuint(t) {
    return 1 - Math.pow(1 - t, 5);
}

// Simulação do velocity.js para animação suave
function animateRotation(element, targetAngle, duration, easing, onComplete) {
    const startAngle = gameState.anguloAtual;
    const startTime = Date.now();
    
    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Aplicar easing
        const easedProgress = easeOutQuint(progress);
        
        // Calcular ângulo atual
        const currentAngle = startAngle + (targetAngle - startAngle) * easedProgress;
        
        // Aplicar rotação
        element.style.transform = `rotate(${currentAngle}deg)`;
        gameState.anguloAtual = currentAngle;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Animação completa
            if (onComplete) onComplete();
        }
    }
    
    animate();
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎰 RoletaWin - Estilo Anexo - Iniciando...');
    
    setTimeout(() => {
        carregarEstadoJogo();
        inicializarEventListeners();
        atualizarInterface();
        criarParticulas();
        
        // Garantir estado inicial correto dos botões
        if (elements.btnGirar && elements.btnParar) {
            elements.btnGirar.classList.remove('hidden');
            elements.btnParar.classList.add('hidden');
            console.log('✅ Estado inicial dos botões configurado');
        }
        
        console.log('🚀 Sistema inicializado com sucesso!');
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
    delete estadoParaSalvar.anguloAtual;
    delete estadoParaSalvar._bis;
    delete estadoParaSalvar._index;
    
    localStorage.setItem('roletaUser', JSON.stringify(estadoParaSalvar));
}

// Inicializar event listeners
function inicializarEventListeners() {
    if (!elements.btnGirar || !elements.btnParar) {
        console.error('❌ Elementos de botão não encontrados');
        return;
    }
    
    // Botões de controle da roleta
    elements.btnGirar.addEventListener('click', (e) => {
        criarEfeitoRipple(e, elements.btnGirar);
        handleGirarClick();
    });
    
    elements.btnParar.addEventListener('click', (e) => {
        criarEfeitoRipple(e, elements.btnParar);
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
                criarEfeitoRipple(e, btnJogar);
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
        }
    });
}

// Criar efeito ripple nos botões
function criarEfeitoRipple(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('btn-ripple');
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Handle click no botão girar
function handleGirarClick() {
    if (gameState.roletaGirando) return;
    
    if (!gameState.usuario) {
        mostrarModalCadastro();
    } else if (gameState.girosGratis > 0) {
        girarRoleta();
    } else {
        mostrarToast('Você não tem mais giros grátis disponíveis!', 'warning');
    }
}

// Handle click no botão parar (não usado no estilo do anexo)
function handlePararClick() {
    // No estilo do anexo, não há parada manual
    mostrarToast('A roleta parará automaticamente!', 'info');
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

// FUNÇÃO PRINCIPAL PARA GIRAR A ROLETA (ESTILO ANEXO)
function girarRoleta(targetIndex) {
    if (gameState.girosGratis <= 0 || gameState.roletaGirando) {
        return;
    }
    
    console.log('🎯 Iniciando giro da roleta - Estilo Anexo');
    
    // Marcar como girando
    gameState.roletaGirando = true;
    
    // Atualizar interface dos botões
    trocarBotoes(true);
    
    // Adicionar classes para animação
    adicionarClassesGiro();
    
    // Calcular índice alvo (aleatório se não especificado)
    const count = roletaConfig.setores.length;
    const delta = 360 / count;
    const index = !isNaN(parseInt(targetIndex)) ? parseInt(targetIndex) : parseInt(Math.random() * count);
    
    // Calcular ângulo final (como no anexo)
    const a = index * delta + (gameState._bis ? roletaConfig.rotacaoExtra : -roletaConfig.rotacaoExtra);
    
    // Alternar direção para próximo giro
    gameState._bis = !gameState._bis;
    gameState._index = index;
    
    // Animar rotação usando o estilo do anexo
    const roletaElement = elements.roleta;
    
    // Callback para quando a animação começar
    onAnimationBegin();
    
    // Animar usando nossa simulação do velocity.js
    animateRotation(
        roletaElement,
        a,
        roletaConfig.spinDuration,
        roletaConfig.easing,
        onAnimationComplete
    );
    
    mostrarToast('A roleta está girando...', 'info');
}

// Callback quando a animação começa
function onAnimationBegin() {
    console.log('🎬 Animação de giro iniciada');
    elements.roletaWrapper.classList.add('busy');
}

// Callback quando a animação termina
function onAnimationComplete() {
    console.log('🏁 Animação de giro finalizada');
    
    // Marcar como não girando
    gameState.roletaGirando = false;
    
    // Remover classes de animação
    removerClassesGiro();
    
    // Atualizar interface dos botões
    trocarBotoes(false);
    
    // Calcular prêmio baseado no índice
    const setorGanhador = roletaConfig.setores[gameState._index];
    const premio = setorGanhador.premio;
    
    // Processar resultado
    processarResultado(premio);
    
    console.log('🎯 Giro finalizado! Índice:', gameState._index, 'Prêmio:', premio);
}

// Trocar botões
function trocarBotoes(girando) {
    if (!elements.btnGirar || !elements.btnParar) return;
    
    if (girando) {
        elements.btnGirar.classList.add('hidden');
        elements.btnParar.classList.remove('hidden');
    } else {
        elements.btnGirar.classList.remove('hidden');
        elements.btnParar.classList.add('hidden');
    }
}

// Adicionar classes de giro
function adicionarClassesGiro() {
    if (elements.roletaWrapper) {
        elements.roletaWrapper.classList.add('girando');
    }
    if (elements.roleta) {
        elements.roleta.classList.add('girando');
    }
}

// Remover classes de giro
function removerClassesGiro() {
    if (elements.roletaWrapper) {
        elements.roletaWrapper.classList.remove('girando', 'busy');
    }
    if (elements.roleta) {
        elements.roleta.classList.remove('girando');
    }
}

// Processar resultado do giro
function processarResultado(premio) {
    gameState.girosGratis--;
    gameState.girosUsados++;
    
    if (premio > 0) {
        gameState.saldo += premio;
        mostrarResultado(true, premio);
        criarConfetes();
    } else {
        mostrarResultado(false, 0);
    }
    
    salvarEstadoJogo();
    atualizarInterface();
}

// Mostrar resultado
function mostrarResultado(ganhou, premio) {
    if (!elements.resultadoModal) return;
    
    if (ganhou) {
        elements.resultadoTitulo.textContent = '🎉 Parabéns!';
        elements.resultadoDescricao.textContent = 'Você ganhou um prêmio incrível!';
        elements.resultadoIcon.innerHTML = '<i class="fas fa-trophy"></i>';
        elements.premioValor.textContent = `R$ ${premio.toFixed(2)}`;
        elements.premioDisplay.style.display = 'block';
    } else {
        elements.resultadoTitulo.textContent = '😔 Que pena!';
        elements.resultadoDescricao.textContent = 'Não foi desta vez, mas continue tentando!';
        elements.resultadoIcon.innerHTML = '<i class="fas fa-heart-broken"></i>';
        elements.premioDisplay.style.display = 'none';
    }
    
    elements.novoSaldo.textContent = gameState.saldo.toFixed(2);
    elements.girosRestantesCount.textContent = gameState.girosGratis;
    
    if (gameState.girosGratis > 0) {
        elements.girosRestantesModal.style.display = 'block';
    } else {
        elements.girosRestantesModal.style.display = 'none';
    }
    
    elements.resultadoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Fechar modal de resultado
function fecharModalResultado() {
    elements.resultadoModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Atualizar interface
function atualizarInterface() {
    if (elements.saldoAtual) {
        elements.saldoAtual.textContent = gameState.saldo.toFixed(2);
    }
    
    if (elements.girosCount) {
        elements.girosCount.textContent = gameState.girosGratis;
    }
    
    if (gameState.usuario) {
        if (elements.girosInfo) {
            elements.girosInfo.style.display = 'block';
        }
        
        if (gameState.girosGratis > 0) {
            if (elements.girosTitle) {
                elements.girosTitle.textContent = `${gameState.girosGratis} Giros Grátis`;
            }
            if (elements.girosSubtitle) {
                elements.girosSubtitle.textContent = 'Clique em GIRAR para jogar!';
            }
        } else {
            if (elements.girosTitle) {
                elements.girosTitle.textContent = 'Giros Esgotados';
            }
            if (elements.girosSubtitle) {
                elements.girosSubtitle.textContent = 'Faça um depósito para continuar jogando!';
            }
        }
    }
}

// Jogar mesa paga
function jogarMesaPaga(valor) {
    if (gameState.saldo < valor) {
        mostrarToast('Saldo insuficiente para esta mesa!', 'error');
        return;
    }
    
    mostrarToast('Funcionalidade em desenvolvimento!', 'info');
}

// Mostrar toast
function mostrarToast(mensagem, tipo = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${tipo}`;
    
    const icon = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    }[tipo] || 'fas fa-info-circle';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${mensagem}</span>
    `;
    
    elements.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Criar partículas de fundo
function criarParticulas() {
    if (!elements.particlesBg) return;
    
    const numParticulas = 50;
    
    for (let i = 0; i < numParticulas; i++) {
        const particula = document.createElement('div');
        particula.className = 'particula';
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particula.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: rgba(255, 215, 0, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            animation: float ${duration}s ease-in-out infinite ${delay}s;
        `;
        
        elements.particlesBg.appendChild(particula);
    }
}

// Criar confetes
function criarConfetes() {
    const container = document.querySelector('.confetti-container') || document.body;
    const cores = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4'];
    
    for (let i = 0; i < 50; i++) {
        const confete = document.createElement('div');
        confete.className = 'confete';
        
        const cor = cores[Math.floor(Math.random() * cores.length)];
        const x = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        confete.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${cor};
            left: ${x}%;
            top: -10px;
            z-index: 9999;
            animation: confeteFall ${duration}s ease-in ${delay}s forwards;
        `;
        
        container.appendChild(confete);
        
        setTimeout(() => {
            confete.remove();
        }, (duration + delay) * 1000);
    }
}

// CSS para animações (será adicionado dinamicamente)
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes confeteFall {
        to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
    
    .btn-ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .toast {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 1rem 1.5rem;
        margin-bottom: 0.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    }
    
    .toast.show {
        transform: translateX(0);
    }
    
    .toast-success { background: linear-gradient(135deg, #00ff88, #00cc6a); }
    .toast-error { background: linear-gradient(135deg, #ff6b6b, #ff5252); }
    .toast-warning { background: linear-gradient(135deg, #ffd700, #ffed4e); color: #0a0e27; }
    .toast-info { background: linear-gradient(135deg, #45b7d1, #4ecdc4); }
`;
document.head.appendChild(style);

