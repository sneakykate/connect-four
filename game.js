var gameBoard = document.getElementById('game');

/*
* Initialize game state vars
*/
// the board is 6 rows tall
var rowsCount = 6;
// the board is 7 columns wide
var columnsCount = 7;
// winning patterns are
var blackWins = 'bbbb';
var redWins = 'rrrr';
var winner = null;
var blackPlayerTurn = true; // will flip between true and false


/*
*  Make the board DOM elements
*/

var gameSlot = document.createElement('div');
gameSlot.classList.add('slot');

function initializeBoard(){
    for(var i = 0; i < rowsCount; i++){
        // create a div for each row and append to the board
        var rowDiv = document.createElement('div')
        rowDiv.id = i.toString()
        gameBoard.appendChild(rowDiv)
        for(var l = 0; l < columnsCount; l++ ){
            // create a slot for each column and append to the row
            var slot = rowDiv.appendChild(gameSlot.cloneNode(true));
            slot.id = (rowsCount-i).toString() + l.toString();
            slot.addEventListener('click', function(e){playChip(e.target)})
        }
    }
}

// make the chip shapes
var blackChip = document.createElement('span');
blackChip.classList.add('blackDot');

var redChip = document.createElement('span');
redChip.classList.add('redDot');

var playAgainBtn = document.getElementById('playAgain')
playAgainBtn.addEventListener('click', playAgain)


/*
*  Taking turns
*/

function switchPlayerTurn(isBlackTurn){
    var whoseTurn = isBlackTurn ? 'black' : 'red';
    var turnsText = `It's ${whoseTurn}'s turn.`
    // console.log(turnsText);
    var turn = document.getElementById('turn')
    turn.textContent = turnsText;
};

// initialize turnsText on load of page.
switchPlayerTurn(blackPlayerTurn);



/*
* Board game data and logic
*/

var boardData = []

function initializeBoardData() {
    boardData = []
    for(var i = 0; i < columnsCount; i++ ){
        // for each column make an array for the data.
        // when a chip gets added to a column we will add to
        // these arrays.
        boardData.push([]);

    }
}

function playChip(cellClicked){
    if(cellClicked.tagName.toLowerCase() === 'span'){
        cellClicked = cellClicked.parentNode;
    };
    // if someone already won, nothing should happen.
    if(winner){
        alert('Game has been won, click Play Again button to play!');
        return;
    };
    // figure out which column was clicked
    console.log('cellClicked', cellClicked.id);
    var columnNumber = +cellClicked.id.charAt(1);
    // console.log('columnNumber', columnNumber);
    // if you click a column that is full, nothing should happen.
    if(boardData[columnNumber].length === rowsCount){
        alert('that column is full! pick another one.');
        return;
    }

    // put a chip in the column selected
    var chipColor = blackPlayerTurn ? 'b' : 'r';

    // update the underlying data
    var newColumnLength = boardData[columnNumber].push(chipColor)
    // console.log(boardData);

    // display the chip in the correct place
    var slotId = newColumnLength + '' + columnNumber
    var slotNode = document.getElementById(slotId)
    var chip = blackPlayerTurn ? blackChip : redChip;
    slotNode.appendChild(chip.cloneNode(true));

    //see if someone has won
    checkIfWinner();

    // switch to next player's turn
    blackPlayerTurn = !blackPlayerTurn;
    switchPlayerTurn(blackPlayerTurn);

}

function checkIfWinner(){

    // horizontal win
    checkHorizontalWin()

    // vertical win
    checkVerticalWin()

    // diagonal win
    checkDiagonalWin()
}


function checkVerticalWin(){
    // check each column
    for(const col of boardData){
        // console.log('col', col)
        // if there are fewer than 4 chips in the column, nobody won vertically.
        if(col.length < 4){
           continue;
        }
        // see if there are 4 of the same color in a row
        for(let i = 3; i < col.length; i ++){
            var fourChips = col[i] + col[i-1]+ col[i-2] + col[i-3]
            if (fourChips === redWins){
                winner = 'red'
                alert('The winner is: ' + winner);
            }
            else if (fourChips === blackWins){
                winner = 'black'
                alert('The winner is: ' + winner);
            }
        }
    }
}

function checkHorizontalWin(){
    // check the i index of each column to see if values are redWins or blackWins
    for(let i = 0; i < rowsCount; i++){
        var rowString = ''
        for(const col of boardData){
            rowString += col[i]
        }
        if(rowString.indexOf(blackWins) > -1){
            winner = 'black'
            alert('The winner is: ' + winner);
        }
        else if(rowString.indexOf(redWins) > -1){
            winner = 'red'
            alert('The winner is: ' + winner);
        }
    }
}

function checkDiagonalWin(){
    // check for diagonal wins high-low
    for(var i = 0; i < boardData.length-3; i++ ){
        var col = boardData[i]
        for(var x = 3; x < col.length; x++){
            // for example column 0/row 4 is a diagonal win if col 1/row3, col2/row2, col3/row1 match
            var fourChips = col[x] + boardData[i+1][x-1]+ boardData[i+2][x-2] + boardData[i+3][x-3]

            if (fourChips === redWins){
                winner = 'red'
                alert('The winner is: ' + winner);
                return;
            }
            else if (fourChips === blackWins){
                winner = 'black'
                alert('The winner is: ' + winner);
                return;
            }
        }
        // console.log('chckkk')
        // console.log(col)

        // check left to right diagonal
        for(var y = 3; y < columnsCount; y++){
            var fourChips = col[y-3] + boardData[i+1][y-2]+ boardData[i+2][y-1] + boardData[i+3][y]
            // console.log(fourChips)
            if (fourChips === redWins){
                winner = 'red'
                alert('The winner is: ' + winner);
            }
            else if (fourChips === blackWins){
                winner = 'black'
                alert('The winner is: ' + winner);
            }
        }
    }

}


function clearTheBoard(){
    var slots = document.getElementsByClassName('slot')
    for(const s of slots){
        // some slots are already empty
        if(s.firstChild){
            s.removeChild(s.firstChild);
        }
    }
    return;
}

function playAgain(){
    initializeBoardData();
    clearTheBoard();
    winner = null;
}

// initialize the board on load
initializeBoard();
initializeBoardData();
