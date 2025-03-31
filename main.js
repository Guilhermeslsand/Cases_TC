// Enumeração dos estados da máquina
const EstadoMaquina = {
    OCIOSO: 'OCIOSO',
    CREDITO_INSERIDO: 'CREDITO_INSERIDO',
    SELECIONANDO_ITEM: 'SELECIONANDO_ITEM',
    ITEM_SELECIONADO: 'ITEM_SELECIONADO',
    DISPENSANDO: 'DISPENSANDO'
};

// Classe do Autômato da Máquina de Venda
class AutomatoMaquinaVenda {
    constructor() {
        // Estado inicial
        this.estadoAtual = EstadoMaquina.OCIOSO;
        
        // Variáveis de controle
        this.creditoTotal = 0;
        this.troco = 0;
        this.itemSelecionado = null;
        
        // Preços dos itens
        this.precosItens = {
            "Doce A": 600,
            "Doce B": 700,
            "Doce C": 800
        };
    }

    // Método para inserir crédito
    inserirCredito(valorMoeda) {
        // Transição de estado: OCIOSO -> CREDITO_INSERIDO
        if (this.estadoAtual === EstadoMaquina.OCIOSO) {
            this.creditoTotal += valorMoeda;
            this.estadoAtual = EstadoMaquina.CREDITO_INSERIDO;
            this.atualizarDisplay();
            return true;
        }
        
        // Pode adicionar crédito em outros estados de crédito inserido
        if (this.estadoAtual === EstadoMaquina.CREDITO_INSERIDO) {
            this.creditoTotal += valorMoeda;
            this.atualizarDisplay();
            return true;
        }
        
        return false;
    }

    // Método para selecionar item
    selecionarItem(nomeItem) {
        // Transição de estado: CREDITO_INSERIDO -> ITEM_SELECIONADO
        if (this.estadoAtual === EstadoMaquina.CREDITO_INSERIDO) {
            const precoItem = this.precosItens[nomeItem];
            
            // Verifica se há crédito suficiente
            if (this.creditoTotal >= precoItem) {
                this.itemSelecionado = nomeItem;
                this.estadoAtual = EstadoMaquina.ITEM_SELECIONADO;
                return true;
            }
        }
        
        return false;
    }

    // Método para dispensar item
    dispensarItem() {
        // Transição de estado: ITEM_SELECIONADO -> DISPENSANDO
        if (this.estadoAtual === EstadoMaquina.ITEM_SELECIONADO) {
            const precoItem = this.precosItens[this.itemSelecionado];
    
            // Calcula o troco
            this.troco = this.creditoTotal - precoItem;

            // Desconta o valor do item
            this.creditoTotal = 0;

            // Muda o estado para dispensando
            this.estadoAtual = EstadoMaquina.DISPENSANDO;
            
            // Animação de queda do item
            this.animarQuedaItem(this.itemSelecionado);
            
            // Reseta para estado ocioso
            this.estadoAtual = EstadoMaquina.OCIOSO;
            
            // Limpa item selecionado
            this.itemSelecionado = null;
            
            // Atualiza display
            this.atualizarDisplay();
            
            this.troco = 0;
            return true;
        }
        
        return false;
    }

    // Método para atualizar display de crédito
    atualizarDisplay() {
        const displayCredito = document.querySelector('.balance');
        if (displayCredito) {
            const creditoFormatado = `Crédito: R$${(this.creditoTotal / 100).toFixed(2).replace('.', ',')}`;
            const trocoFormatado = `Troco: R$${(this.troco / 100).toFixed(2).replace('.', ',')}`;
            displayCredito.textContent = `${creditoFormatado}.  ${trocoFormatado}.`;
        }
    }

    // Método para animar o troco saindo da máquina
    animarTroco() {
        // Seleciona a área da saída de troco
        const trocoSection = document.querySelector('.troco-section');

        // Cria o elemento imagem para o dinheiro
        const dinheiro = document.createElement('img');
        dinheiro.src = "images/money.png"; // Substitua pelo caminho correto
        dinheiro.classList.add('dinheiro-saindo');

        // Estilo inicial (saída de troco)
        dinheiro.style.cssText = `
            position: right;
            bottom: 0px;
            left: 0%;
            transform: translateX(10px) translateY(0px);
            transition: transform 0.8s ease-out;
            z-index: 10;
            width: 80px; /* Ajuste conforme o tamanho da imagem */
        `;

        // Adiciona a imagem na seção de troco
        trocoSection.appendChild(dinheiro);

        // Força o navegador a calcular o layout antes da animação
        dinheiro.offsetHeight;

        // Anima o dinheiro "saindo" da máquina
        dinheiro.style.transform = 'translateX(90%) translateY(0px)';

        // Remove o dinheiro após a animação
        setTimeout(() => {
            dinheiro.style.opacity = '0';
            dinheiro.style.transition = 'opacity 0.5s ease-out';
            setTimeout(() => dinheiro.remove(), 500);
        }, 1500);
    }

    // Método para animar queda do item
    animarQuedaItem(nomeItem) {
        const candyElements = document.querySelectorAll('.candy');
        let candyToFall;
        let candyChoice;

        switch(nomeItem) {
            case "Doce A":
            	candyChoice = 0;
                candyToFall = candyElements[0];
                break;
            case "Doce B":
            	candyChoice = 1;
                candyToFall = candyElements[1];
                break;
            case "Doce C":
            	candyChoice = 2;
                candyToFall = candyElements[2];
                break;
        }

        if (candyToFall && candyChoice == 0) {
            const productSection = document.querySelector('.product-section');
            const fallingCandy = candyToFall.cloneNode(true);
            fallingCandy.classList.add('falling-candy');
            
            fallingCandy.style.cssText = `
                position: absolute;
                top: 0;
                left: 50%;
                transform: translateX(-50%);
                transition: all 1s ease-in-out;
                z-index: 10;
            `;

            productSection.appendChild(fallingCandy);
            fallingCandy.offsetHeight;

            fallingCandy.style.top = `${productSection.clientHeight - fallingCandy.clientHeight - 10}px`;
            
            setTimeout(() => {
                fallingCandy.remove();
            }, 2000);
        }
        if (candyToFall && candyChoice == 1) {
            const productSection = document.querySelector('.product-section');
            const fallingCandy = candyToFall.cloneNode(true);
            fallingCandy.classList.add('falling-candy');
            
            fallingCandy.style.cssText = `
                position: absolute;
                top: 150px;
                left: 50%;
                transform: translateX(-50%);
                transition: all 1s ease-in-out;
                z-index: 10;
            `;

            productSection.appendChild(fallingCandy);
            fallingCandy.offsetHeight;

            fallingCandy.style.top = `${productSection.clientHeight - fallingCandy.clientHeight - 10}px`;
            
            setTimeout(() => {
                fallingCandy.remove();
            }, 2000);
        }
        if (candyToFall && candyChoice == 2) {
            const productSection = document.querySelector('.product-section');
            const fallingCandy = candyToFall.cloneNode(true);
            fallingCandy.classList.add('falling-candy');
            
            fallingCandy.style.cssText = `
                position: absolute;
                top: 300px;
                left: 50%;
                transform: translateX(-50%);
                transition: all 1s ease-in-out;
                z-index: 10;
            `;

            productSection.appendChild(fallingCandy);
            fallingCandy.offsetHeight;

            fallingCandy.style.top = `${productSection.clientHeight - fallingCandy.clientHeight - 10}px`;
            
            setTimeout(() => {
                fallingCandy.remove();
            }, 2000);
        }
        this.animarTroco();
    }
}

// Inicialização do autômato quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Cria instância do autômato
    const maquinaVenda = new AutomatoMaquinaVenda();

    maquinaVenda.atualizarDisplay();

    // Configura botões de moeda
    const botoesMoeda = document.querySelectorAll('.btn-coin');
    botoesMoeda.forEach(botao => {
        botao.addEventListener('click', () => {
            const valorMoeda = parseInt(botao.getAttribute('data-value'));
            maquinaVenda.inserirCredito(valorMoeda);
        });
    });

    // Configura botões de doces
    const botoesDoces = document.querySelectorAll('.btn-candy');
    botoesDoces.forEach(botao => {
        botao.addEventListener('click', () => {
            const nomeDoce = botao.getAttribute('data-name');
            
            // Tenta selecionar o item
            if (maquinaVenda.selecionarItem(nomeDoce)) {
                // Tenta dispensar o item
                maquinaVenda.dispensarItem();
            } else {
                alert('Crédito insuficiente ou máquina não está no estado correto.');
            }
        });
    });
});
