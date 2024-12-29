let boxes = document.querySelectorAll(".box"); //attaining the values of all boxes.
let resetBtn = document.querySelector("#reset-btn"); //attaining the value of reset button.
let newGameBtn = document.querySelector("#new-btn"); //attaining the value of new button.
let msgContainer = document.querySelector(".msg-container"); //attaining the value of message container.
let msg = document.querySelector("#msg"); //attaining the value of message.
let scoreOElement = document.querySelector("#score-o"); //attaining the value of scoreO.
let scoreXElement = document.querySelector("#score-x"); //attaining the value of scoreX.
let modeBtn = document.querySelector("#mode-btn"); //attaining the value of ai button.

let turnO = true; //playerX, playerO
let count = 0; //To track draw
let scoreO = 0; //Player O score
let scoreX = 0; //Player X score
let playWithAI = false;

const saveGameState = () => {
    const gameState = {
        boxes: Array.from(boxes).map((box) => box.innerText), // Save box values
        turnO,
        count,
        scoreO,
        scoreX,
        playWithAI,
    };
    localStorage.setItem("ticTacToeState", JSON.stringify(gameState));
};

const loadGameState = () => {
    const savedState = JSON.parse(localStorage.getItem("ticTacToeState"));
    if (savedState) {
        savedState.boxes.forEach((value, index) => {
            boxes[index].innerText = value;
            boxes[index].disabled = value !== ""; // Disable boxes with existing values
        });
        turnO = savedState.turnO;
        count = savedState.count;
        scoreO = savedState.scoreO;
        scoreX = savedState.scoreX;
        playWithAI = savedState.playWithAI;

        scoreOElement.innerText = scoreO;
        scoreXElement.innerText = scoreX;
        modeBtn.innerText = playWithAI ? "Play with player" : "Play with AI";
    }
};

const updateGameState = () => {
    saveGameState();
};

modeBtn.addEventListener("click", () => {
    playWithAI = !playWithAI;
    modeBtn.innerText = playWithAI ? "Play with player" : "Play with AI";
    resetGame();
    updateGameState();
});

const aiMove = () => {
    // Helper function to find winning move
    const findWinningMove = (player) => {
        for (let pattern of winPatterns) {
            let [a, b, c] = pattern;
            let values = [boxes[a].innerText, boxes[b].innerText, boxes[c].innerText];
            let countPlayer = values.filter((val) => val === player).length;
            let countEmpty = values.filter((val) => val === "").length;

            if (countPlayer === 2 && countEmpty === 1) {
                return pattern[values.indexOf("")]; // Return the empty spot in the pattern
            }
        }
        return null;
    };

    // Try to win first
    let move = findWinningMove("X");
    if (move === null) {
        // Block opponent's win
        move = findWinningMove("O");
    }
    if (move === null) {
        // Prioritize center, then corners, then edges
        if (boxes[4].innerText === "") {
            move = 4; // Center
        } else {
            const corners = [0, 2, 6, 8];
            const emptyCorners = corners.filter((index) => boxes[index].innerText === "");
            if (emptyCorners.length > 0) {
                move = emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
            } else {
                const edges = [1, 3, 5, 7];
                const emptyEdges = edges.filter((index) => boxes[index].innerText === "");
                if (emptyEdges.length > 0) {
                    move = emptyEdges[Math.floor(Math.random() * emptyEdges.length)];
                }
            }
        }
    }

    if (move !== null) {
        let chosenBox = boxes[move];
        chosenBox.innerText = "X";
        chosenBox.disabled = true;
        turnO = true;
        count++;
        let isWinner = checkWinner();

        if (count === 9 && !isWinner) {
            gameDraw();
        }
        updateGameState();
    }
};

const winPatterns = [
    [0, 1, 2], //checking row wise winner.
    [0, 3, 6], //checking col wise winner.
    [0, 4, 8], //checking diagonal wise winner.
    [1, 4, 7], //checking col wise winner.
    [2, 5, 8], //checking col wise winner.
    [2, 4, 6], //checking diagonal wise winner.
    [3, 4, 5], //checking row wise winner
    [6, 7, 8], //checking row wise winner.
];

const resetGame = () => {
    turnO = true;
    count = 0;
    enableBoxes();
    msgContainer.classList.add("hide");
    updateGameState();
};

const resetAll = () => {
    resetGame();
    scoreO = 0;
    scoreX = 0;
    scoreOElement.innerText = scoreO;
    scoreXElement.innerText = scoreX;
    localStorage.removeItem("ticTacToeState"); // Clear saved state
};

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (playWithAI && turnO) {
            box.innerText = "O";
            box.style.color = "black";
            turnO = false;
            box.disabled = true;
            count++;
            let isWinner = checkWinner();

            if (count === 9 && !isWinner) {
                gameDraw();
            } else if (!isWinner) {
                setTimeout(aiMove, 500); // AI makes its move after a short delay
            }
        } else if (!playWithAI) {
            // Normal Player vs Player logic
            if (turnO) {
                box.innerText = "O";
                box.style.color = "black";
                turnO = false;
            } else {
                box.innerText = "X";
                turnO = true;
            }
            box.disabled = true;
            count++;
            let isWinner = checkWinner();

            if (count === 9 && !isWinner) {
                gameDraw();
            }
        }
        updateGameState();
    });
});

const gameDraw = () => {
    msg.innerText = `Game was a Draw`;
    msgContainer.classList.remove("hide");
    disableBoxes();
    updateGameState();
};

const disableBoxes = () => {
    for (let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for (let box of boxes) {
        box.disabled = false;
        box.innerText = "";
        box.style.color = "";
    }
};

const showWinner = (winner) => {
    msg.innerText = `Congratulations, Winner is Player ${winner}`;
    msgContainer.classList.remove("hide");
    disableBoxes();

    if (winner === "O") {
        scoreO++;
        scoreOElement.innerText = scoreO;
    } else if (winner === "X") {
        scoreX++;
        scoreXElement.innerText = scoreX;
    }
    updateGameState();
};

const checkWinner = () => {
    for (let pattern of winPatterns) {
        let post1Val = boxes[pattern[0]].innerText;
        let post2Val = boxes[pattern[1]].innerText;
        let post3Val = boxes[pattern[2]].innerText;

        if (post1Val != "" && post2Val != "" && post3Val != "") {
            if (post1Val === post2Val && post2Val === post3Val) {
                showWinner(post1Val);
                return true;
            }
        }
    }
};

newGameBtn.addEventListener("click", () => {
    resetGame();
    updateGameState();
});
resetBtn.addEventListener("click", resetAll);

// Load the game state on page load
window.addEventListener("load", loadGameState);

