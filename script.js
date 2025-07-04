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
        console.log(cellValues);
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
        console.log(`it's ${getCurrentPlayer().name}'s turn:`)
    };

    //!
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
        console.log(`${getCurrentPlayer().name} selected ${row}, ${col}`);
        const isAvaliable = board.playerMove(row, col, getCurrentPlayer().sign);

        if (!isAvaliable)
            return false;

        if (checkWin()) {
            console.log(`${getCurrentPlayer().name} has won!`);
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

//for (let i = 0; i < 9; i++) {
//    let x = prompt("select x place");
//    let y = prompt("select y place");
//
//    let elpepe = game.PlayRound(y, x, i)
//    if (!elpepe && elpepe != 2) {
//        i--;
//        alert("That place is already taken!");
//    }
//    else if (elpepe == 2) {
//        break
//    }
//    console.log(i)
//}


//* DOM ------------------------------------------------------------------------------------------------

const DOMcontrol = (function () {
    const tablero = document.querySelector(".tablero");
    const dialog = document.querySelector(".winner")

    tablero.addEventListener("click", (casilla) => {
        casilla.target.textContent = game.getCurrentPlayer().sign;
    })
    
    tablero.addEventListener("click", (casilla) => {
        const domRow = casilla.target.dataset.row;
        const domCol = casilla.target.dataset.col;
        let winner = game.PlayRound(domRow, domCol);

        if (winner === 2) {
            dialog.showModal();
        }
    })
}) ();

