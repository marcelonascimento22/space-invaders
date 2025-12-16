
const gameData = {
    score: 0,
    level: 1,
    high: 0
}

const rankArray = [
    {nome: "AAA", score: 10},
    {nome: "BBB", score: 20},
    {nome: "CCC", score: 30},
    {nome: "DDD", score: 40}
];


const isTop5 = (score) => {
    let i = 0;
    rankArray.forEach((value, key) => {
        console.log(`Nª:  ${key} | Nome: ${value.nome} | Score: ${value.score} `);

        if(score > value.score && i == 0){
            console.log(`O jogador ${player} entrou no rank nº ${key}com ${score} pontos!`);
            //rankArray.push({ nome: player, score });
            i++;
        }

    });
    rankArray.sort((a, b) => b.score - a.score);
    rankArray.splice(5);

    console.table(rankArray);

/*


    // ainda não tem 5 jogadores
    if (rank.length < 5) return true;

    // compara com o 5º colocado
    return gameData.score > rank[4].score;
    */
};

//drawRank();
console.table(rankArray);

console.log("====================================");

isTop5("Marcelo", 25);
isTop5("Rhuan", 50);
isTop5("Derick", 45);
isTop5("Dayra", 10);