
BasicGame.GameAI = function (game) {

    this.squares = {};
    this.iWillStartFirst = null;
    this.scores = {};
    this.scoreText = null;
    this.restartButton = null;
    this.nextGameButton = null;
    this.marksOX = [];
    this.winDrawText = null;
    this.turnText = null;
    this.makeThisMove = null;

    this.selectStartText = {};

};

BasicGame.GameAI.prototype = {

    create: function () {

        console.log("Game AI start!");

        // Set initial scores as zero
        this.scores.O = 0;
        this.scores.X = 0;

        // Select start first or second
        this.startFirstORSecond();

    },

    startFirstORSecond: function () {

        this.selectStartText.first = this.add.text(400, 200, " Start first ",
        { font: "65px Arial", fill: "#fff" , align: "center", backgroundColor: "#2f4f4f"});
        this.selectStartText.first.anchor.x = 0.5;
        this.selectStartText.first.anchor.y = 0.5;
        this.selectStartText.first.inputEnabled = true;
		this.selectStartText.first.events.onInputDown.add(this.startFirst, this);

        this.selectStartText.second = this.add.text(400, 400, " Start second ",
        { font: "65px Arial", fill: "#fff" , align: "center", backgroundColor: "#2f4f4f"});
        this.selectStartText.second.anchor.x = 0.5;
        this.selectStartText.second.anchor.y = 0.5;
        this.selectStartText.second.inputEnabled = true;
		this.selectStartText.second.events.onInputDown.add(this.startSecond, this);

    },

    startFirst: function () {
        console.log('Start first.');
        this.iWillStartFirst = true; // true = 'O' = Player
        this.createPhaseTwo();
    },

    startSecond: function () {
        console.log('Start second.');
        this.iWillStartFirst = false;
        this.createPhaseTwo();
    },

    createPhaseTwo: function () {

        this.destroySelectStart();

        this.createSquares();

        // scoreboard
        this.scoreText = this.add.text(10, 10, "Score: O = " + this.scores.O + ", X = " + this.scores.X, 
        { font: "30px Arial", fill: "#fff" });

        // turn text
        this.turnText = this.add.text(790, 10, "Turn: " + this.turnToOX(this.squares.turn),
        { font: "30px Arial", align: "right", fill: "#fff"});
        this.turnText.anchor.x = 1.0;

        // restart button
        this.restartButton = this.add.text(790, 590, " Restart game ",
        { font: "30px Arial", fill: "#fff", backgroundColor: "#2f4f4f"});
        this.restartButton.anchor.x = 1.0;
        this.restartButton.anchor.y = 1.0;
        this.restartButton.inputEnabled = true;
        this.restartButton.events.onInputDown.add(this.quitGame, this);

        // Bind events to squares
        this.bindAllSquares();

        // if computer's turn
        if (!this.iWillStartFirst) {
            this.callAI();
        }        

        // testing
        /*
        var newState = this.squares.getNewState({x:1, y:1});
        console.log(newState);
        console.log(newState.availMoves());

        var secondNewState = newState.getNewState({x:1, y:2});
        console.log(secondNewState);
        console.log(secondNewState.availMoves());

        var thirdState = secondNewState.getNewState({x:2, y:2});
        var fourthState = thirdState.getNewState({x:2, y:3});
        var fifthState = fourthState.getNewState({x:3, y:3});
        
        console.log(fifthState);
        console.log(this.checkWin('X', fifthState));
        console.log(this.checkWin('O', fifthState));
        */
        /*
        // O's turn first (Player)
        var state1 = this.squares.getNewState({x:1, y:1});
        var state2 = state1.getNewState({x:1, y:2});
        var state3 = state2.getNewState({x:1, y:3});
        var state4 = state3.getNewState({x:2, y:1});
        var state5 = state4.getNewState({x:2, y:2});
        var state6 = state5.getNewState({x:3, y:3});
        var state7 = state6.getNewState({x:3, y:1});
        console.log(state7);
        console.log(this.checkWin('O', state7));
        console.log(this.checkWin('X', state7));
        console.log(this.checkDraw(state7));
        */
        /*
        // X's turn first (Computer)
        var state1 = this.squares.getNewState({x:1, y:2});
        var state2 = state1.getNewState({x:1, y:1});
        var state3 = state2.getNewState({x:3, y:1});
        var state4 = state3.getNewState({x:2, y:3});
        var state5 = state4.getNewState({x:1, y:3});
        var state6 = state5.getNewState({x:3, y:3});
        console.log(state6);
        console.log(this.minimax(state6, 0));
        */

    },

    quitGame: function () {

        //  Go back to the main menu.
        this.state.start('MainMenu');

    },

    destroySelectStart: function () {
        this.selectStartText.first.destroy();
        this.selectStartText.second.destroy();
    }, 

    createSquares: function () {

        // Squares
        this.squares.s11 = this.createSquareObj(1, 1);
        this.squares.s12 = this.createSquareObj(1, 2);
        this.squares.s13 = this.createSquareObj(1, 3);
        this.squares.s21 = this.createSquareObj(2, 1);
        this.squares.s22 = this.createSquareObj(2, 2);
        this.squares.s23 = this.createSquareObj(2, 3);
        this.squares.s31 = this.createSquareObj(3, 1);
        this.squares.s32 = this.createSquareObj(3, 2);
        this.squares.s33 = this.createSquareObj(3, 3);
        this.squares.turn = this.iWillStartFirst;
        this.squares.availMovesFactory = this.availMoves;
        this.squares.availMoves = this.availMoves(this.squares);
        this.squares.getNewStateFactory = this.getNewState;
        this.squares.getNewState = this.getNewState(this.squares);
        this.squares.turnToOX = this.turnToOX;
        this.squares.createVirtualSquareObj = this.createVirtualSquareObj;

    },

    createSquareObj: function (x, y) {
        return {
            spr: this.add.sprite(165+(x-1)*160, 65+(y-1)*160, 'square'),
            x: x,
            y: y,
            center: [165+75+(x-1)*160, 65+75+(y-1)*160],
            occupiedBy: ''
        }
    },

    createVirtualSquareObj: function (x, y) {
        return {            
            x: x,
            y: y,
            occupiedBy: ''
        }
    },

    callAI: function () {

        // Make decision of which move
        var decisionMove = this.minimax(this.squares, 0).m;

        // Assign move to squares object
        this.squares['s' + decisionMove.x + decisionMove.y].occupiedBy = this.turnToOX(this.squares.turn);

        // Unbind event to prevent clicking on cells already clicked
        this.squares['s' + decisionMove.x + decisionMove.y].spr.events.onInputDown.removeAll();

        // Render
        this.renderOX(this.squares['s' + decisionMove.x + decisionMove.y], this.turnToOX(this.squares.turn));

        // Cache current turn
        var whichTurn = this.turnToOX(this.squares.turn);

        // Change turns
        this.squares.turn = !(this.squares.turn);

        // Render turnText
        this.renderTurnText();

        if (this.checkWin(whichTurn, this.squares)) {
            this.scores[whichTurn] += 1;
            this.renderScoreBoard();
            this.unbindAllSquares();
            this.createNextGameButton();
            this.renderWinDraw('win', whichTurn);
            this.hideTurnText();
        } else if (this.checkDraw(this.squares)) {
            this.unbindAllSquares();
            this.createNextGameButton();
            this.renderWinDraw('draw');
            this.hideTurnText();
        }
    },

    minimax: function (game, depth) {
        // console.log(game);
        if (this.checkWin('X', game)) {
            return {s: 10 - depth};
        } else if (this.checkWin('O', game)) {
            return {s: depth - 10};
        } else if (this.checkDraw(game)) {
            return {s: 0};
        } else {
            depth += 1;
            var scores = [];
            var moves = [];
            
            // Populate the scores array, recursing as needed
            var possibleMoves = game.availMoves();
            // console.log(possibleMoves);
            var len = possibleMoves.length;
            for (var i = 0; i < len; i += 1) {
                // console.log(possibleMoves[i]);
                var possibleGame = game.getNewState(possibleMoves[i]);
                scores.push(this.minimax(possibleGame, depth).s);
                // console.log(scores);
                moves.push(possibleMoves[i]);
            }

            // Do the min or the max calculation
            if (game.turn === false) { // false = Computer's turn
                // Max calculation
                var maxScoreIndex = scores.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0);
                this.makeThisMove = moves[maxScoreIndex];
                return {s: scores[maxScoreIndex], m: moves[maxScoreIndex], sa: scores, ma: moves};
            } else {
                // Min calculation
                var minScoreIndex = scores.reduce((iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0);
                this.makeThisMove = moves[minScoreIndex];
                return {s: scores[minScoreIndex], m: moves[maxScoreIndex]};
            }
        }
    },

    availMoves: function (game) {
        return function () {
            var possibleMoves = [];
            var keys = ['s11', 's12', 's13', 's21', 's22', 's23', 's31', 's32', 's33'];
            var len = keys.length;
            for (var i = 0; i < len; i += 1) {
                if (game[keys[i]].occupiedBy === '') {
                    possibleMoves.push({x: game[keys[i]].x, y: game[keys[i]].y});
                }
            }
            return possibleMoves;
        }
    },

    getNewState: function (game) {
        return function (move) {
            if (game['s' + move.x + move.y].occupiedBy !== '') {
                throw "Error: square is already occupied";
            }
            var newGame = {};
            newGame.s11 = game.createVirtualSquareObj(1, 1);
            newGame.s12 = game.createVirtualSquareObj(1, 2);
            newGame.s13 = game.createVirtualSquareObj(1, 3);
            newGame.s21 = game.createVirtualSquareObj(2, 1);
            newGame.s22 = game.createVirtualSquareObj(2, 2);
            newGame.s23 = game.createVirtualSquareObj(2, 3);
            newGame.s31 = game.createVirtualSquareObj(3, 1);
            newGame.s32 = game.createVirtualSquareObj(3, 2);
            newGame.s33 = game.createVirtualSquareObj(3, 3);
            var keys = ['s11', 's12', 's13', 's21', 's22', 's23', 's31', 's32', 's33'];
            var len = keys.length;
            for (var i = 0; i < len; i += 1) {
                newGame[keys[i]].occupiedBy = game[keys[i]].occupiedBy;
            }
            newGame['s' + move.x + move.y].occupiedBy = game.turnToOX(game.turn);
            newGame.turn = !(game.turn);
            newGame.availMovesFactory = game.availMovesFactory;
            newGame.availMoves = game.availMovesFactory(newGame);
            newGame.getNewStateFactory = game.getNewStateFactory;
            newGame.getNewState = game.getNewStateFactory(newGame);
            newGame.turnToOX = game.turnToOX;
            newGame.createVirtualSquareObj = game.createVirtualSquareObj;
            return newGame;
        }
    },

    bindAllSquares: function () {
        var keys = ['s11', 's12', 's13', 's21', 's22', 's23', 's31', 's32', 's33'];
        var len = keys.length;
        for (var i = 0; i < len; i += 1) {
            this.squares[keys[i]].spr.inputEnabled = true;
            this.squares[keys[i]].spr.events.onInputDown.add(this.clickSquare, {gameObj:this, squareObj:this.squares[keys[i]]});
        }
    },

    clickSquare: function () {
        // Context: {gameObj:this, squareObj:this.squares[key]}, i.e. 'this' refers to the object
        // console.log(this.gameObj.turn); // access to this.turn
        // console.log(this.squareObj); // access to this.squares[key]

        // Set occupiedBy
        // Render O and X
        // 'O': this.gameObj.turn = true
        // 'X': this.gameObj.turn = false

        // Cache current turn
        var whichTurn = this.gameObj.turnToOX(this.gameObj.squares.turn);

        this.squareObj.occupiedBy = whichTurn;
        this.gameObj.renderOX(this.squareObj, whichTurn);

        // Unbind event to prevent clicking on cells already clicked
        this.squareObj.spr.events.onInputDown.removeAll();

        if (this.gameObj.checkWin(whichTurn, this.gameObj.squares)) {
            this.gameObj.scores[whichTurn] += 1;
            this.gameObj.renderScoreBoard();
            this.gameObj.unbindAllSquares();
            this.gameObj.createNextGameButton();
            this.gameObj.renderWinDraw('win', whichTurn);
            this.gameObj.hideTurnText();
        } else if (this.gameObj.checkDraw(this.gameObj.squares)) {
            this.gameObj.unbindAllSquares();
            this.gameObj.createNextGameButton();
            this.gameObj.renderWinDraw('draw');
            this.gameObj.hideTurnText();
        } else {
            // Change turns
            this.gameObj.squares.turn = !(this.gameObj.squares.turn);
            this.gameObj.renderTurnText();
            this.gameObj.callAI();
        }

    },

    renderOX: function (squareObj, turn) {
        var xo = null;
        if (turn === 'O') {
            xo = this.add.sprite(squareObj.center[0], squareObj.center[1], 'circle');
        } else if (turn === 'X') {
            xo = this.add.sprite(squareObj.center[0], squareObj.center[1], 'cross');
        }
        xo.anchor.x = 0.5;
        xo.anchor.y = 0.5;
        this.marksOX.push(xo);
    },

    renderScoreBoard: function () {
        this.scoreText.setText("Score: O = " + this.scores.O + ", X = " + this.scores.X);
    },

    renderWinDraw: function (winOrDraw, who) {
        if (winOrDraw === 'win') {
            this.winDrawText = this.add.text(400, 590, who + " wins!",
            { font: "30px Arial", align: "center", fill: "#fff"});
            this.winDrawText.anchor.x = 0.5;
            this.winDrawText.anchor.y = 1.0;
        } else if (winOrDraw === 'draw') {
            this.winDrawText = this.add.text(400, 590, "Draw!",
            { font: "30px Arial", align: "center", fill: "#fff"});
            this.winDrawText.anchor.x = 0.5;
            this.winDrawText.anchor.y = 1.0;
        }
    },

    renderTurnText: function () {
        this.turnText.setText("Turn: " + this.turnToOX(this.squares.turn));
    },

    hideTurnText: function () {
        this.turnText.setText("");
    },

    turnToOX: function (bool) {
        var whichTurn = 'X';
        if (bool) {
            whichTurn = 'O';
        }
        
        return whichTurn; 
    },

    unbindAllSquares: function () {
        var keys = ['s11', 's12', 's13', 's21', 's22', 's23', 's31', 's32', 's33'];
        var len = keys.length;
        for (var i = 0; i < len; i += 1) {
            this.squares[keys[i]].spr.events.onInputDown.removeAll();
        }
    },

    createNextGameButton: function() {
        this.nextGameButton = this.add.text(10, 590, " Next game ",
        { font: "30px Arial", fill: "#fff", backgroundColor: "#2f4f4f"});
        this.nextGameButton.anchor.y = 1.0;
        this.nextGameButton.inputEnabled = true;
        this.nextGameButton.events.onInputDown.add(this.nextGame, this);
    },

    nextGame: function () {

        // Destroy
        this.nextGameButton.destroy();
        this.destroyOX();
        this.winDrawText.destroy();
        this.scoreText.destroy();
        
        // Destroy squares
        var keys = ['s11', 's12', 's13', 's21', 's22', 's23', 's31', 's32', 's33'];
        var len = keys.length;
        for (var i = 0; i < len; i += 1) {
            this.squares[keys[i]].spr.destroy();
        }

        // Select start first or second
        this.startFirstORSecond();

        /*
        // alternate who start
        this.startTurn = !(this.startTurn);
        this.turn = this.startTurn;

        // show turn text
        this.renderTurnText();
        */
    },

    destroyOX: function () {
        var len = this.marksOX.length;
        for (var i = 0; i < len; i += 1) {
            this.marksOX[i].destroy();
        }
    },

    checkWin: function (OX, state) {
        /*
        Win cases:
        [1, 1] [2, 1] [3, 1]
        [1, 1] [1, 2] [1, 3]
        [1, 1] [2, 2] [3, 3]

        [1, 2] [2, 2] [3, 2]

        [1, 3] [2, 3] [3, 3]
        [1, 3] [2, 2] [3, 1]

        [2, 1] [2, 2] [2, 3]

        [3, 1] [3, 2] [3, 3]
        */
        var winBool = false;
        if (state.s11.occupiedBy === OX) {
            if (state.s21.occupiedBy === OX && state.s31.occupiedBy === OX) {
                winBool = true;
            }
            if (state.s12.occupiedBy === OX && state.s13.occupiedBy === OX) {
                winBool = true;
            }
            if (state.s22.occupiedBy === OX && state.s33.occupiedBy === OX) {
                winBool = true;
            }
        }
        if (state.s12.occupiedBy === OX && state.s22.occupiedBy === OX && state.s32.occupiedBy === OX) {
            winBool = true;
        }
        if (state.s13.occupiedBy === OX) {
            if (state.s23.occupiedBy === OX && state.s33.occupiedBy === OX) {
                winBool = true;
            }
            if (state.s22.occupiedBy === OX && state.s31.occupiedBy === OX) {
                winBool = true;
            }
        }
        if (state.s21.occupiedBy === OX && state.s22.occupiedBy === OX && state.s23.occupiedBy === OX) {
            winBool = true;
        } 
        if (state.s31.occupiedBy === OX && state.s32.occupiedBy === OX && state.s33.occupiedBy === OX) {
            winBool = true;
        }

        return winBool;
    },

    checkDraw: function (state) {
        // Check if all squares are occupied
        var drawBool = true
        var keys = ['s11', 's12', 's13', 's21', 's22', 's23', 's31', 's32', 's33'];
        var len = keys.length;
        for (var i = 0; i < len; i += 1) {
            if(state[keys[i]].occupiedBy === '') {
                drawBool = false;
            }
        }
        return drawBool;
    }

};