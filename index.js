const custoLinhaReta = 10; //Indica o peso dos movimentos em linha reta;
const custoDiagonal = 14; //Indica o peso dos movementos em diagonal;
const permiteUltrapassarObstaculoDiagonal = false; //Indica se é possivel fazer o movimento diagonal, caso um dos seus lados sejam obstáculo;

var listaAberta = [];  //Lista com as coordenadas que não tiveram seus vizinhos verificados;
var listaFechada = []; //Lista com as coordenadas que tiveram seus vizinhos verificados;
var posicoesCalculadas = []; //Armazena as posicoes já calculadas e seu custo;

//Vetores que determina qual ponto inicial e final do caminho sendo (x,y)/(linha,coluna);
//O vetor inicia e o final, não podem ser um obstáculo;
var pontoInicio = [0, 0];
var pontoFinal = [5, 5];

//Mapa onde 0 representa um caminho aberto e 1 representa um obstáculo;
var mapa = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0]
];

function IniciarBusca() {
    Reset();
    VerificarIntegridadeMapa();
    VerificarIntegridadePontoDeInicioEFinal();
    try {
        BuscarCaminho();
    }
    catch (e) {
        console.log(e);
    }
}

function Reset() {
    NoAtual = [];
    listaAberta = [];
    listaFechada = [];
}

function BuscarCaminho() {
    let encontrou = false;//Indica se já foi encontrado algum caminho;
    listaAberta.push(pontoInicio);//Inicia a lista de pontos a serem verificados com o ponto de partida;

    while (listaAberta.length > 0 && !encontrou) {//Enquanto houver pontos a serem análisado e nenhum caminho encontrado. intera os ponto;
        let NoAtual = listaAberta[0];//Pega o primeiro item da listaAberta que sempre está ordenada pelo item de menor custo;
        let vizinhos = BuscarVizinhos(NoAtual);//Realiza a busca dos vizinhos do nó sendo eles na diagonal,horizontal e vertical;
        CalcularCusto(NoAtual, vizinhos);//Cálculo o custo de movimentação para cada vizinho, levando em consideração a distancia até o objetivo;
        for (let i = 0; i < vizinhos.length; i++) {//Adiciona os vizinhos na lista de pontos a serem análisados;
            if (!listaAberta.find(item => arrayEquals(item, vizinhos[i])))
                listaAberta.push(vizinhos[i].posicao);
        }
        listaAberta = listaAberta.filter(item => !arrayEquals(item, NoAtual));//Remove a posição atual da lista de posições a serem análizadas;
        listaFechada.push(NoAtual);//Adiciona a posição atual na lista de pontos já análizados;
        if (listaFechada.find(item => arrayEquals(item, pontoFinal))) {//Verifica se já encontrou um caminho;
            encontrou = true;
            let caminho = RecuperarCaminho(NoAtual);//Monta o caminho do ponto inicial até o ponto final.;
            DesenharMapa(caminho);
        }
        OrdernarPorCusto();//Ordena a lista de posições a serem análisada, se baseando em custo;
    }
    if (!encontrou)
        throw 'Nenhum caminho encontrado';
}

function RecuperarCaminho(NoAtual) {
    let caminho = [];//Armazena o caminho percorrido;
    let pontoOrigem;
    if (arrayEquals(NoAtual, pontoInicio))//Verifica se ponto inicial é igual a ultima posição análisada;
        pontoOrigem = pontoInicio;
    else
        pontoOrigem = posicoesCalculadas.find(item => arrayEquals(item.No.posicao, NoAtual)).NoPai;//Busca o ponto "pai" do ultimo ponto análisado;

    caminho.push(NoAtual);//Faz o caminho reverso. iniciando pelo ponto final até chegar no ponto inicial;
    while (!arrayEquals(pontoOrigem, pontoInicio)) {//Verifica se o ponto atual é o ponto inicial;
        caminho.push(pontoOrigem);//Adiciona o ponto atual na lista de caminhos;
        pontoOrigem = posicoesCalculadas.find(item => arrayEquals(item.No.posicao, pontoOrigem)).NoPai;//Atualiza o nó atual com o pai do ultimo ponto no caminho;
    }
    caminho.push(pontoInicio);//Adiciona o ponto inicial ao fim da lista;
    caminho.reverse();//Reverse da lista para ir do sentido ponto inicial -> ponto final;
    return caminho; //Retorna as coordenadas do ponto inicial até o ponto final;
}

function OrdernarPorCusto() {
    let listaAberta_Aux = [];//Lista temporaria para atualizar a lista aberta;
    for (let i = 0; i < listaAberta.length; i++) {
        listaAberta_Aux.push(posicoesCalculadas.find(item => arrayEquals(listaAberta[i], item.No.posicao)));//Adiciona à lista auxiliar os pontos já adicionados com seu custo e herustica;
    }
    //Ordena a lista auxiliar do menor custo ao maior custo de movimento. considerando custo atual + heuristica;
    listaAberta_Aux = listaAberta_Aux.sort((itemA, itemB) => (itemA.custo + itemA.heuristica) - (itemB.custo + itemB.heuristica));

    listaAberta = [];//Limpa a lista de pontos a serem análisados;
    for (let i = 0; i < listaAberta_Aux.length; i++) {
        listaAberta.push(listaAberta_Aux[i].No.posicao);//Adiciona na lista aberta os pontos ordenados do menor custo -> maior;
    }
}

function BuscarVizinhos(atual) {
    let vizinhos = [];//Lista com os pontos vizinhos;
    let linha_matriz = atual[0];//Coordenada X do ponto atual;
    let coluna_matriz = atual[1];//Cooordenada Y do ponto atual;
    //(atual[0]-1),(atual[1]-1) Busca o vizinho na Diagonal superior Esquerda|Caso o vizinho do lado esquerdo seja um obstáculo. só irá adicionar caso permiteUltrapassarObstaculoDiagonal seja True;
    if ((linha_matriz - 1 >= 0 && coluna_matriz - 1 >= 0) && mapa[linha_matriz - 1][coluna_matriz - 1] !== 1 && (permiteUltrapassarObstaculoDiagonal || coluna_matriz - 1 >= 0 && mapa[linha_matriz][coluna_matriz - 1] !== 1)) {
        let vizinho_diagonal_esquerda = [linha_matriz - 1, coluna_matriz - 1];
        let itemFechado = listaFechada.find(item => arrayEquals(item, vizinho_diagonal_esquerda));
        if (!itemFechado)
            vizinhos.push({ posicao: vizinho_diagonal_esquerda, custo: custoDiagonal });
    }
    //(atual[0]-1),(atual[1])   Busca o vizinho de cima;
    if (linha_matriz - 1 >= 0 && mapa[linha_matriz - 1][coluna_matriz] !== 1) {
        let vizinho_cima = [linha_matriz - 1, coluna_matriz];
        let itemFechado = listaFechada.find(item => arrayEquals(item, vizinho_cima));
        if (!itemFechado)
            vizinhos.push({ posicao: vizinho_cima, custo: custoLinhaReta });
    }
    //(atual[0]-1),(atual[1]+1) Busca o vizinho na diagonal superior Direit|Caso o vizinho do lado direito seja um obstáculo. só irá adicionar caso permiteUltrapassarObstaculoDiagonal seja True;
    if ((linha_matriz - 1 >= 0 && coluna_matriz + 1 <= mapa[0].length - 1) && mapa[linha_matriz - 1][coluna_matriz + 1] !== 1 && (permiteUltrapassarObstaculoDiagonal || (coluna_matriz + 1 <= mapa[0].length - 1 && mapa[linha_matriz][coluna_matriz + 1] !== 1))) {
        let vizinho_diagonal_direita = [linha_matriz - 1, coluna_matriz + 1];
        let itemFechado = listaFechada.find(item => arrayEquals(item, vizinho_diagonal_direita));
        if (!itemFechado)
            vizinhos.push({ posicao: vizinho_diagonal_direita, custo: custoDiagonal });
    }
    //(atual[0]),(atual[1]-1)   Busca o vizinho da Esquerda;
    if (coluna_matriz - 1 >= 0 && mapa[linha_matriz][coluna_matriz - 1] !== 1) {
        let vizinho_esquerda = [linha_matriz, coluna_matriz - 1];
        let itemFechado = listaFechada.find(item => arrayEquals(item, vizinho_esquerda));
        if (!itemFechado)
            vizinhos.push({ posicao: vizinho_esquerda, custo: custoLinhaReta });
    }
    //(atual[0]),(atual[1]+1)  Busca o vizinho da Direita;
    if (coluna_matriz + 1 <= mapa[0].length - 1 && mapa[linha_matriz][coluna_matriz + 1] !== 1) {
        let vizinho_direita = [linha_matriz, coluna_matriz + 1];
        let itemFechado = listaFechada.find(item => arrayEquals(item, vizinho_direita));
        if (!itemFechado)
            vizinhos.push({ posicao: vizinho_direita, custo: custoLinhaReta });
    }
    //(atual[0]+1),(atual[1]-1) Busca o vizinho da Diagonal Inferior Esquerda|Caso o vizinho do lado esquerdo seja um obstáculo. só irá adicionar caso permiteUltrapassarObstaculoDiagonal seja True;
    if ((linha_matriz + 1 <= mapa.length - 1 && coluna_matriz - 1 >= 0) && mapa[linha_matriz + 1][coluna_matriz - 1] !== 1 && (permiteUltrapassarObstaculoDiagonal || coluna_matriz - 1 >= 0 && mapa[linha_matriz][coluna_matriz - 1] !== 1)) {
        let vizinho_inferior_esquerda = [linha_matriz + 1, coluna_matriz - 1];
        let itemFechado = listaFechada.find(item => arrayEquals(item, vizinho_inferior_esquerda));
        if (!itemFechado)
            vizinhos.push({ posicao: vizinho_inferior_esquerda, custo: custoDiagonal });
    }
    //(atual[0]+1),(atual[1])  Busca o vizinho de baixo;
    if (linha_matriz + 1 <= mapa.length - 1 && mapa[linha_matriz + 1][coluna_matriz] !== 1) {
        let vizinho_baixo = [linha_matriz + 1, coluna_matriz];
        let itemFechado = listaFechada.find(item => arrayEquals(item, vizinho_baixo));
        if (!itemFechado)
            vizinhos.push({ posicao: vizinho_baixo, custo: custoLinhaReta });
    }
    //(atual[0]+1),(atual[1]+1) Busca o vizinho da Diagonal Inferior Direita|Caso o vizinho do lado direito seja um obstáculo. só irá adicionar caso permiteUltrapassarObstaculoDiagonal seja True
    if ((linha_matriz + 1 <= mapa.length - 1 && coluna_matriz + 1 <= mapa[0].length - 1) && mapa[linha_matriz + 1][coluna_matriz + 1] !== 1 && (permiteUltrapassarObstaculoDiagonal || (coluna_matriz + 1 <= mapa[0].length - 1 && mapa[linha_matriz][coluna_matriz + 1] !== 1))) {
        let vizinho_inferior_direita = [linha_matriz + 1, coluna_matriz + 1];
        let itemFechado = listaFechada.find(item => arrayEquals(item, vizinho_inferior_direita));
        if (!itemFechado)
            vizinhos.push({ posicao: vizinho_inferior_direita, custo: custoDiagonal });
    }
    return vizinhos;
}

function CalcularCusto(NoAtual, Vizinhos) {
    for (let i = 0; i < Vizinhos.length; i++) {//Percorre todos os vizinhos para ver seu custo;
        let heuristica = DistanciaEuclidiana(Vizinhos[i], pontoFinal)//Calcula a heuristica utilizando a DistanciaEuclidiana;
        let custo = posicoesCalculadas.find(item => arrayEquals(item.No.posicao, NoAtual))?.custo;//Verifica se o ponto já possui um custo agregado;
        if (custo)//Caso já possua um custo incrementa com o ponto vizinho;
            custo += Vizinhos[i].custo;
        else//Caso não possua, utiliza o custo do movimento vizinho;
            custo = Vizinhos[i].custo;
        posicoesCalculadas.push({ No: Vizinhos[i], custo, heuristica, NoPai: NoAtual });//Adiciona à lista de posições já calculadas com suas informações adicionais;
    }
}

//Realiza o calculo de custo por meio da formula Euclideana
function DistanciaEuclidiana(NoRelativo, NoFinal) {
    let dx = Math.abs(NoRelativo.posicao[0] - NoFinal[0]);//Calcula a distancia em X
    let dy = Math.abs(NoRelativo.posicao[1] - NoFinal[1]);//Calcula a distancia em Y
    return Math.round(NoRelativo.custo * Math.sqrt(dx * dx + dy * dy));//Calcula a distancia euclidiana
}

//Método para verificar a integridade do mapa;
function VerificarIntegridadeMapa() {
    //Verifica se o mapa possui ao menos duas linhas
    if (mapa.length < 2)
        throw 'O mapa deve possuir ao menos duas linhas';
    //Verifica se todas as linhas do mapa possuem o memso número de colunas
    let tamanhoUltimoVetor = 0;//Armazena o numer de itens dentro do ultimo vetor;
    for (let i = 0; i < mapa.length; i++) {
        if (tamanhoUltimoVetor == 0)
            tamanhoUltimoVetor = mapa[i].length;
        if (mapa[i].length != tamanhoUltimoVetor)
            throw 'Todas as linhas do mapa devem possuir o mesmo número de colunas';
    }
    //Verifica se o mapa possui ao menos uma coluna em cada linha
    if (tamanhoUltimoVetor <= 0)
        throw 'O mapa deve possuir ao menos uma coluna em cada linha';
}

//Método para verificar a integridade dos vetores de inicio e final
function VerificarIntegridadePontoDeInicioEFinal() {
    let vetorInicial = mapa[pontoInicio[0], pontoInicio[1]];
    let vetorFinal = mapa[pontoFinal[0], pontoFinal[1]];
    if (vetorInicial === undefined)//Caso a posição inicial não foi preenchida, ou está for da matriz do mapa
        throw 'Posição Inicial Inválida';
    else if (vetorInicial == 1)//Caso a posição inicial é um obstaculo
        throw 'O Vetor Inicial não pode ser um obstáculo'
    if (vetorFinal === undefined)//Caso a posição final não foi preenchida, ou está for da matriz do mapa
        throw 'Posição Final Inválida';
    else if (vetorFinal == 1)//Caso a posição final é um obstaculo
        throw 'O Vetor Final não pode ser um obstáculo';
}

//Desenha o mapa sendo
// I: ponto inicial
// F: ponto final
// ■: Obstáculo
// @: caminho percorrido=
function DesenharMapa(caminho) {
    let coordenadas = '';
    for (let x = 0; x < mapa.length; x++) {
        if (x == 0)
            console.log(' _'.repeat(mapa[x].length))
        let lineToDraw = '|'
        for (let y = 0; y < mapa[x].length; y++) {
            let pontoAtual = [x, y];
            let pontoNoMapa = mapa[x][y];
            if (pontoNoMapa == 1)
                lineToDraw += '■';
            else if (arrayEquals(pontoAtual, pontoInicio)) {
                lineToDraw += 'I';
                coordenadas += '[' + x + ',' + y + '] ';
            }
            else if (arrayEquals(pontoAtual, pontoFinal)) {
                lineToDraw += 'F';
                coordenadas += '[' + x + ',' + y + '] ';
            }
            else if (caminho.find(item => arrayEquals(item, pontoAtual))) {
                lineToDraw += '@';
                coordenadas += '[' + x + ',' + y + '] ';
            }
            else
                lineToDraw += ' ';
            lineToDraw += '|'
        }
        console.log(lineToDraw);
        if (x == mapa.length - 1)
            console.log(' ‾'.repeat(mapa[x].length))
    }
    console.log("Coordenadas : " + coordenadas)
}

//Método auxiliar para verificar se dois arrays são iguais
function arrayEquals(a, b) {
    return Array.isArray(a) &&
        Array.isArray(b) &&
        a.length === b.length &&
        a.every((val, index) => val === b[index]);
}
//Inicia a busca pelo caminho;
IniciarBusca();