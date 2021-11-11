/* Index Map
    0   1   2
    3   4   5
    6   7   8
*/

var DEBUG = true;

var combinations = 
[
    // Horizontal Combinations
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Vertical Combinations
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonal Combinations
    [0, 4, 8],
    [2, 4, 6]
];

// Declare js Variables
var tilesElemArr = [];
var players = [];
var currentPlayer;
var tilesFilled = 0;
var maxTilesCapacity = 9;
var startingPlayerName = "X";

// Declare Elem Variables
var currentPlayerElem;
var messageElem;
var table;

function init() {
    //******** Init Elem Variables /********/
    currentPlayerElem = document.getElementById("current_player_name");
    messageElem =  document.getElementById("messager_header");
    table = document.getElementById("game_table");

    /******** Init js Variables /********/

    // Init Players List
    players.push(new Player(0, "O", "red", 0));
    players.push(new Player(1, "X", "blue", 0));
    
    // Init Current Player
    setPlayerByName(startingPlayerName);

    // Create Tiles
    createTiles();

    // Refresh Scores
    refreshScores();
}

function createTiles() {
    var tilesElemArrIndex = 0;
    for(var i=0;i<3;i++) {
        // Create each row
        var row = document.createElement("tr");

        // Create each td in a row
        for(var j=0;j<3;j++) {
            // Create tile element
            var tile = document.createElement("td");

            // Fill id, class, and onClick attributes
            tile.id = tilesElemArrIndex;
            tile.className = "tile";
            tile.onclick = function () {
                fillTile(this.id);
            };

            // Add each td to the row
            row.appendChild(tile);

            // Add tile element in the array of tiles and increment index
            tilesElemArr[tilesElemArrIndex++] = tile;
        }
        
        // Add each row  to table
        table.appendChild(row);
    }
}

function fillTile(id) {
    // Fetch Tile Element
    var tileElem = tilesElemArr[id];

    // Check for existing message to delete
    messageElem.innerHTML = "";

    // Check if Tile is already filled
    if(tileElem.innerHTML) {
        // Show Error Message
        messageElem.style.color = "red";
        messageElem.innerHTML = "Tile already filled !!";
        return;
    }

    // Show Current Player in console
    if(DEBUG) console.log("Current Player: " + currentPlayer.name);

    // Fill Tile Value by Player
    fillTileElemValueByCurrentPlayer(tileElem);

    // Check for Draw
    var isDraw = checkForDraw();

    // Exit function if Draw
    if(isDraw) return;

    // Check for winner
    var hasWon = checkForWinner();

    // Switch Players
    if(!hasWon) switchPlayers();
}

function fillTileElemValueByCurrentPlayer(tileElem) {
    // Fill the value and color of the tile by player
    tileElem.innerHTML = currentPlayer.name;
    tileElem.style.color = currentPlayer.color;

    // Increment the number of tiles filled
    tilesFilled++;
}

function switchPlayers() {
    // Switch Player
    if(currentPlayer.id === players[0].id) 
        setPlayerByName(players[1].name);
    else
        setPlayerByName(players[0].name);
    
    // Show Switched Player in console
    if(DEBUG) console.log("Switched to Player: " + currentPlayer.name);
    if(DEBUG) console.log("-----------------------");
}

function fetchPlayerByName(name) {
    // Declare return variable
    var result = null;

    // Iterate Players
    for(var i=0;i<players.length;i++) {
        // Fetch Each Player
        var player = players[i];

        // Check if this is the target Player
        if(player.name === name) {
            // Assign player to variable and exit loop
            result = player;
            break;
        }
    }

    // Return result
    return result;
}

function setPlayerByName(name) {
    // Set Player
    currentPlayer = fetchPlayerByName(name);

    // Update Player Turn
    currentPlayerElem.innerHTML = currentPlayer.name;
    currentPlayerElem.style.color = currentPlayer.color;
}

function refreshScores() {
    // Iterate Players
    for(var i=0;i<players.length;i++) {
        // Fetch Each Player
        var player = players[i];

        // Fetch Player Score Element
        var playerScoreElem = document.getElementById("score_" + player.id );

        // Fill and Color Player Score Element
        playerScoreElem.innerHTML = player.score;
        playerScoreElem.style.color = player.color;
    }
}

function checkForWinner() {
    // Init winning status
    var hasWon = false;

    var winningCombinations = [];

    // Iterate Combinations
    for(var i=0;i<combinations.length;i++) {
        // Fetch Combination
        var combination = combinations[i];
        
        // Init Combination Status
        var combinationSuccess = true;

        // Iterate Combination Indexes
        for(var j=0;j<combination.length;j++) {
            //  Fetch Combination index
            var combinationIndex = combination[j];

            // Check if one of the combination's indexes is missing to exit combination loop
            if(tilesElemArr[combinationIndex].innerHTML !== currentPlayer.name){
                combinationSuccess = false;
                break;
            }
        }

        // Set win variable to true but don't break yet to check for other winning combinations
        if(combinationSuccess) {
            if(!hasWon) hasWon = true;
            winningCombinations.push(combination);
        }
    }

    // Exit Function if no combinations were successfull
    if(!hasWon) return;

    // Disable Tiles
    disableTiles();

    // Update Winning Combinations Tiles
    updateWinningCombinationsTiles(winningCombinations);

    // Update Scores
    currentPlayer.score += 1;

    // Refresh Scores
    refreshScores();

    // Show Winning Message
    messageElem.style.color = "green";
    messageElem.innerHTML = "Player <span class=\"player_name\" style=\"color: " + currentPlayer.color + "\">" + currentPlayer.name + "</span> has won !!";

    // Show Winning Player in Console
    if(DEBUG) console.log("Player: " + currentPlayer.name + " has won !!");
    if(DEBUG) console.log("-----------------------");

    // Return hasWon status
    return hasWon;
}

function updateWinningCombinationsTiles(winningCombinations) {
    // Iterate Combinations
    for(var i=0;i<winningCombinations.length;i++) {
        // Fetch Combination
        var combination = winningCombinations[i];

        // Iterate Combination Indexes
        for(var j=0;j<combination.length;j++) {
            //  Fetch Combination index
            var combinationIndex = combination[j];

            // Fetch Tile Element
            var tile = tilesElemArr[combinationIndex];

            // Update Background Color
            tile.style.backgroundColor = "rgb(0, 255, 0)";
        }
    }
}

function newGame() {
    // Reset Tiles Filled Value
    tilesFilled = 0;

    // Empty Existing Tiles
    tilesElemArr = [];
    
    // Empty HTML Tiles
    table.innerHTML = "";

    // Empty Message
    messageElem.innerHTML = "";

    // Create Tiles
    createTiles();
    
    // Show in Console
    if(DEBUG) console.log("New Game");
    if(DEBUG) console.log("-----------------------");
}

function disableTiles() {
    for(var i=0;i<tilesElemArr.length;i++) {
        // Fetch Tile
        var tile = tilesElemArr[i];

        // Disable Tile
        tile.onclick = function(){};
        tile.style.cursor = "not-allowed";
    }
}

function checkForDraw() {
    // Init return variable
    var isDraw = false;

    // Check for max capacity
    if(tilesFilled === maxTilesCapacity) {
        isDraw = true;
        
        // Show Draw Message
        messageElem.style.color = "yellowgreen";
        messageElem.innerHTML = "Draw !!";

        // Disable Tiles
        disableTiles();
        
        // Show in Console
        if(DEBUG) console.log("Draw");
        if(DEBUG) console.log("-----------------------");
    }
    
    // return result
    return isDraw;
}