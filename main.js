// Selecionando elementos do DOM
const coinButtons = document.querySelectorAll(".btn-coin"); // Botões de moedas
const candyButtons = document.querySelectorAll(".btn-candy"); // Botões de doces
const balanceDisplay = document.querySelector(".balance"); // Exibição do crédito

// Variáveis de estado
let credit = 0; // Crédito atual
let selectedCandy = null; // Doce selecionado

// Preços dos doces
const candyPrices = {
    "Doce A": 600,
    "Doce B": 700,
    "Doce C": 800,
};

// Função para formatar valores em reais
function formatCurrency(value) {
    return `R$${(value / 100).toFixed(2).replace(".", ",")}`;
}

// Atualiza o display do crédito
function updateBalance() {
    balanceDisplay.textContent = `Crédito: ${formatCurrency(credit)}`;
}

// Adiciona crédito quando uma moeda é inserida
coinButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const coinValue = parseInt(button.dataset.value); // Valor da moeda
        credit += coinValue; // Adiciona ao crédito
        updateBalance(); // Atualiza o display
    });
});

// Seleciona e compra um doce
candyButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const candyName = button.dataset.name; // Nome do doce
        const candyPrice = candyPrices[candyName]; // Preço do doce
        let troco = 0;

        if (credit >= candyPrice) {
            // Libera o doce
            troco = credit - candyPrice; // Subtrai o preço do crédito
            credit = 0;
        
            // Atualiza o display do crédito
            updateBalance();

            // Feedback para o usuário
            alert(`Doce liberado: ${candyName}, \nTroco: ${formatCurrency(troco)} `);
        } else {
            alert("Crédito insuficiente. Insira mais moedas."); // Alerta de crédito insuficiente
        }
    });
});