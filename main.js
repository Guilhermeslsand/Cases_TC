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
            
            // Desconta o valor do item
            this.creditoTotal -= precoItem;
            
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
            
            return true;
        }
        
        return false;
    }

    // Método para atualizar display de crédito
    atualizarDisplay() {
        const displayCredito = document.querySelector('.balance');
        if (displayCredito) {
            displayCredito.textContent = `Crédito: R$${(this.creditoTotal / 100).toFixed(2).replace('.', ',')}`;
        }
    }

    // Método para animar queda do item
    animarQuedaItem(nomeItem) {
        const candyElements = document.querySelectorAll('.candy');
        let candyToFall;

        switch(nomeItem) {
            case "Doce A":
                candyToFall = candyElements[0];
                break;
            case "Doce B":
                candyToFall = candyElements[1];
                break;
            case "Doce C":
                candyToFall = candyElements[2];
                break;
        }

        if (candyToFall) {
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
    }
}

// Inicialização do autômato quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    // Cria instância do autômato
    const maquinaVenda = new AutomatoMaquinaVenda();

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