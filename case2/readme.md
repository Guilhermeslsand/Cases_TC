# Máquina de Venda de Doces - Autômato Finito Determinístico (AFD)

![Preview da Máquina](/readme/Case2.png)

## Descrição do Projeto

Este projeto é uma implementação interativa de um elevador baseada em um Autômato Finito Determinístico (AFD) que utiliza uma pilha. O elevador se locomove entre o térreo e os 3 andares do prédio, ele também possui animação para abrir e fechar as portas do elevador.

## Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript
   
## Representação do Autômato
![Preview da Automato](/readme/automato_2_1.png)

### Legendas para o Autômato
| Símbolo | Ação                           |
|---------|--------------------------------|
| a       | Abrir a porta do elevador      |
| f       | Fechar a porta do elevador     |
| s       | Subir                          | 
| d       | Descer                         |
| d       | Caso especial do T -> 3ºa andar|
| 0       | Selecionar o terreo            |
| 1       | Selecionar o 1º andar          |
| 2       | Selecionar o 2º andar          |
| 3       | Selecionar o 3º andar          |
| e       | Representa vazio               |

| Estado | Significado  |
|---------|--------------------------|
|F0|Estado Inicial e representa o Elevador no terreo com a porta fechada.|
|A0|Representa o Elevador no terreo com a porta aberta.                  |
|F1|Representa o Elevador no primeiro andar com a porta fechada.         |
|A1|Representa o Elevador no primeiro andar com a porta aberta.          |
|F2|Representa o Elevador no segundo andar com a porta fechada.          |
|A2|Representa o Elevador no segundo andar com a porta aberta.           |
|F3|Representa o Elevador no terceiro andar com a porta fechada.         |
|A3|Representa o Elevador no terceiro andar com a porta aberta.          |

## Representação do Autômato - Simplificado
![Preview da Automato](/readme/automato_2_2.png)

### Legendas para o Autômato
| Símbolo | Ação                           |
|---------|--------------------------------|
| a       | Abrir a porta do elevador      |
| f       | Fechar a porta do elevador     |
| s       | Subir                          | 
| d       | Descer                         |
| d       | Caso especial do T -> 3ºa andar|
| 0       | Selecionar o terreo            |
| 1       | Selecionar o 1º andar          |
| 2       | Selecionar o 2º andar          |
| 3       | Selecionar o 3º andar          |
| e       | Representa vazio               |

| Estado | Significado  |
|---------|--------------------------|
|0|Estado Inicial e representa o Elevador no terreo com a porta fechada.|
|1|Representa o Elevador no primeiro andar com a porta fechada.         |
|2|Representa o Elevador no segundo andar com a porta fechada.          |
|3|Representa o Elevador no terceiro andar com a porta fechada.         |
|F|Representa a ação do elevador de fechar as portas.                   |
|A|Representa a ação do elevador de abrir as portas.                    |

## Integrantes
| Nome      |  RA  |
|---------|--------------------------|
| Bruno grassi R M C | 822160906 |
| Victor de Lima Reis | 822156460 |
| Matheus Barbosa Pereira | 822161770 |
| João Carlos Bonfim | 822163325 |
| Victor Ulysses monteiro de Oliveira | 822166074 |
| Lucas da Silva | 822161395 |
| Guilherme Sales de Andrade | 825125938 |

