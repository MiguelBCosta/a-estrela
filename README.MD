# Introdução
O projeto em questão faz a implementação do algoritmo A* utilizando como heuristica o cálculo Euclidiano para resolução do problema "path finding"
# Explicação Teórica
O **Algoritmo A*** (lemos A-Estrela), se trata de um algoritmo cuja finalidade é de busca entre vértices para grafos, baseado em funções heurísticas. O uso deste algoritmo representa a técnica de busca mais utilizada.
O objetivo em cada resolução de problema está na definição da função heurística que retorne um menor custo de deslocamento de um ponto de origem A até o destino B.

A fórmula de custo tem uma combinação total e é dada por:
f(x) = g(x) + h(x), onde:
- g(x): Representa uma função de custo sobre uma posição de origem até a posição
- h(x): Representa a função heurística. Proposta para estimativa da posição até o destino
# Requisitos
Para rodar o projeto é necessário ter o [NodeJs](https://nodejs.org/en/) instalado.
# Instruções
No arquivo **index.js** existem algumas variáveis de configuração, as mesmas podem ser alteradas conforme necessidade e vontade. Sendo elas:
- custoLinhaReta
  - Essa variável é utilizada para determinar o custo da operação de movimentação em linha reta (horizontal e vertical).
- custoDiagonal
  - Essa variável é utilizada para determinar o custo da operação de movimentação em diagonal.
- permiteUltrapassarObstaculoDiagonal 
  - Indica se é possivel fazer o movimento diagonal, caso um dos lados do ponto em análise sejam um obstáculo.
- pontoInicio 
  - Vetor que determina qual ponto inicial sendo (x,y)/(linha,coluna).
  - Ex: [0, 0].
- pontoFinal 
  - Vetor que determina qual ponto final sendo (x,y)/(linha,coluna).
  - Ex: [5, 5].
- mapa
  - Indica o mapa de posições no formato de matriz onde o valor 0 é um caminho livre e 1 é um obstáculo.
  - EX :[\
    [0, 0, 0, 0, 0, 0],\
    [0, 0, 0, 0, 0, 0],\
    [0, 0, 0, 0, 0, 0],\
    [0, 0, 0, 1, 0, 0],\
    [0, 0, 0, 0, 0, 0],\
    [0, 0, 0, 0, 0, 0]\
]

# Rodando o projeto
Para rodar o projeto, basta rodar o comando **npm start** ou **node index.js**

# Referencias
Referencias:
 - Amit's A* Pages: http://theory.stanford.edu/~amitp/GameProgramming/
# Autor
O projeto foi desenvolvido por mim: [Miguel Bertemes Costa](https://www.linkedin.com/in/miguel-bertemes-costa-809257171/)