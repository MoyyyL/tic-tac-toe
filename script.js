//? CODIGO SEMI-COPIADO / BASADO EN OTRO DE UN JUEGO SIMILAR
function Cell() {
    let value = 0;

    const setMove = (move) => {
        value = move;
    };

    const getValue = () => value;

    return {
        setMove,
        getValue
    };
};

function GameBoard() {
    let arrGameBoard = [];

    const ROWS = 3;
    const COLUMNS = 3;
    for (let i = 0; i < ROWS; i++) {
        arrGameBoard[i] = [];
        for (let j = 0; j < COLUMNS; j++) {
            arrGameBoard[i].push(Cell());
        }
    };

    const getBoard = () => arrGameBoard;

    const playerMove = function (row, col, player) {
        const isFree = arrGameBoard[row][col].getValue();

        if (isFree === 0){
            arrGameBoard[row][col].setMove(player)
            return true;
        }    
        else {
            return false;
        }
    };

    const printBoard = () => {
        const cellValues = arrGameBoard.map((row) => row.map((cell) => cell.getValue()));
        //console.log(cellValues);
    };

    return {
        getBoard,
        playerMove,
        printBoard
    }
}

function GameFlow() {
    const player1 = "Player 1";
    const player2 = "Player 2";

    const board = GameBoard();
    const players = [
        {
            name: player1,
            sign: "X"
        },
        {
            name: player2,
            sign: "O"
        }
    ];

    let currentPlayer = players[0];

    const PlayersTurn = () => {
        currentPlayer = (currentPlayer === players[0]) ? players[1] : players[0];
    };

    const getCurrentPlayer = () => currentPlayer;

    const printNewRound = () => {
        board.printBoard();
        //console.log(`it's ${getCurrentPlayer().name}'s turn:`)
    };

    //? CHECKWIN CREADO POR MI + GUIA / TUICION POR AI
    const checkWin = () => {
        const actuallBoard = board.getBoard();
        let cPlayer = getCurrentPlayer()
        
        let hasWinningRow = actuallBoard.some(row => row.every(cell => cell.getValue() === cPlayer.sign)); //!

        if (hasWinningRow)
            return hasWinningRow;
        
        let hasWinningCol = true;
        for (let col = 0; col < actuallBoard[0].length; col++) {
            hasWinningCol = true;
            
            for (let row = 0; row < actuallBoard.length; row++) {
                if (actuallBoard[row][col].getValue() != cPlayer.sign) {
                    hasWinningCol = false;
                    break;
                }
            }
            
            if (hasWinningCol)
                return hasWinningCol;
        }

        const size = actuallBoard.length;
        let diag1Winner = true;
        let diag2Winner = true; 

        for (let i = 0; i < size; i++) {
            if (actuallBoard[i][i].getValue() !== cPlayer.sign) {
                diag1Winner = false;
            }
            if (actuallBoard[i][size - 1 - i].getValue() !== cPlayer.sign) {
                diag2Winner = false;
            }
            if (!diag1Winner && !diag2Winner) break;
        }

        return diag1Winner || diag2Winner;
    }

    const PlayRound = (row, col) => {
        //console.log(`${getCurrentPlayer().name} selected ${row}, ${col}`);
        const isAvaliable = board.playerMove(row, col, getCurrentPlayer().sign);

        if (!isAvaliable)
            return false;

        if (checkWin()) {
            //console.log(`${getCurrentPlayer().name} has won!`);
            board.printBoard();
            return 2;
        }

        PlayersTurn();
        printNewRound();
        return true;
    };

    printNewRound();
    return {
        PlayRound,
        getCurrentPlayer,
        checkWin
    };
}

const game = GameFlow();
//? SECCION DEL DOM CREADA POR MI + GUIA/TUICION POR AI
//* DOM ------------------------------------------------------------------------------------------------
const DOMcontrol = (function () {
    const tablero = document.querySelector(".tablero");
    const dialogAdvice = document.querySelector(".advice");
    const dialogWinner = document.querySelector(".winner");
    let i = 0;
    
    const ShowDialog = (message, val) => {
        if (val === false) {
            dialogAdvice.innerHTML = `<h1 class="elpepe">${message}</h1>`;
            dialogAdvice.showModal();
        }
        else if(val === 2 || val === 9) {
            dialogWinner.innerHTML = 
            `<h1 class="elpepe">${message}</h1>
            <button class="closeDialog">Reset</button>`;

            const dialogClose = document.querySelector(".closeDialog");
            
            dialogClose.addEventListener("click", () => location.reload());
            dialogWinner.showModal();
        }
    };

    const XOchanges = (casilla, sign) => {
        if (sign === "X") {
            casilla.classList.add("x")
            casilla.innerHTML = `${sign}`;
        }
        else if (sign === "O")
            casilla.classList.add("o")
            casilla.innerHTML = `${sign}`;
    }

    const handleClick = (evento) => {
        const casilla = evento.target;
        const domRow = casilla.dataset.row;
        const domCol = casilla.dataset.col;
        let currentPlayerSign = game.getCurrentPlayer().sign;
        let currentPlayerName = game.getCurrentPlayer().name;

        let result = game.PlayRound(domRow, domCol);

        switch (result) {
            case true:
                XOchanges(casilla, currentPlayerSign);
                i++;
                break;
            case 2:
                XOchanges(casilla, currentPlayerSign);
                ShowDialog(`Gano ${currentPlayerName}`, result);
                break;
            case false:
                ShowDialog(`Casilla ocupada`, result);
                break;
            default:
                break;
        }
        if (i == 9) {
            ShowDialog(`Tie!`, i);
        }
    };

    tablero.addEventListener("click", handleClick);
    dialogAdvice.addEventListener ("click", (e) => {
        if (e.target === dialogAdvice)
            dialogAdvice.close();
    })

}) ();

