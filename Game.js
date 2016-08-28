
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    //  this.game;      //  a reference to the currently running game (Phaser.Game)
    //  this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    //  this.camera;    //  a reference to the game camera (Phaser.Camera)
    //  this.cache;     //  the game cache (Phaser.Cache)
    //  this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    //  this.load;      //  for preloading assets (Phaser.Loader)
    //  this.math;      //  lots of useful common math operations (Phaser.Math)
    //  this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    //  this.stage;     //  the game stage (Phaser.Stage)
    //  this.time;      //  the clock (Phaser.Time)
    //  this.tweens;    //  the tween manager (Phaser.TweenManager)
    //  this.state;     //  the state manager (Phaser.StateManager)
    //  this.world;     //  the game world (Phaser.World)
    //  this.particles; //  the particle manager (Phaser.Particles)
    //  this.physics;   //  the physics manager (Phaser.Physics)
    //  this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    this.squares = {};
    this.turn = true; // true = 'O', false = 'X'
    this.startTurn = true; // allows alternating start turns
    this.scores = {};
    this.scoreText = null;
    this.restartButton = null;
    this.nextGameButton = null;
    this.marksOX = [];
    this.winDrawText = null;
    this.turnText = null;

};

BasicGame.Game.prototype = {

    create: function () {

        console.log("Game start!");

        // Set initial scores as zero
        this.scores.O = 0;
        this.scores.X = 0;

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

        // Bind events to squares
        for (var key in this.squares) {
            if (!this.squares.hasOwnProperty(key)) continue; // skip loop if the property is from prototype
            this.squares[key].spr.inputEnabled = true;
            this.squares[key].spr.events.onInputDown.add(this.clickSquare, {gameObj:this, squareObj:this.squares[key]});
        }

        // scoreboard
        this.scoreText = this.add.text(10, 10, "Score: O = " + this.scores.O + ", X = " + this.scores.X, 
        { font: "30px Arial", fill: "#fff" });

        // restart button
        this.restartButton = this.add.text(790, 590, " Restart game ",
        { font: "30px Arial", fill: "#fff", backgroundColor: "#2f4f4f"});
        this.restartButton.anchor.x = 1.0;
        this.restartButton.anchor.y = 1.0;
        this.restartButton.inputEnabled = true;
        this.restartButton.events.onInputDown.add(this.quitGame, this);

        // turn text
        this.turnText = this.add.text(790, 10, "Turn: " + this.turnToOX(),
        { font: "30px Arial", align: "right", fill: "#fff"});
        this.turnText.anchor.x = 1.0;

    },

    quitGame: function (pointer) {

        //  Go back to the main menu.
        this.state.start('MainMenu');

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

    clickSquare: function () {
        // Context: {gameObj:this, squareObj:this.squares[key]}, i.e. 'this' refers to the object
        // console.log(this.gameObj.turn); // access to this.turn
        // console.log(this.squareObj); // access to this.squares[key]

        // Set occupiedBy
        // Render O and X
        // 'O': this.gameObj.turn = true
        // 'X': this.gameObj.turn = false

        // Cache current turn
        var whichTurn = this.gameObj.turnToOX()

        // Change turns
        this.gameObj.turn = !(this.gameObj.turn);
        this.gameObj.renderTurnText();

        this.squareObj.occupiedBy = whichTurn;
        this.gameObj.renderOX(this.squareObj, whichTurn);
        if (this.gameObj.checkWin(whichTurn)) {
            this.gameObj.scores[whichTurn] += 1;
            this.gameObj.renderScoreBoard();
            this.gameObj.unbindAllSquares();
            this.gameObj.createNextGameButton();
            this.gameObj.renderWinDraw('win', whichTurn);
            this.gameObj.hideTurnText();
        } else if (this.gameObj.checkDraw()) {
            this.gameObj.unbindAllSquares();
            this.gameObj.createNextGameButton();
            this.gameObj.renderWinDraw('draw');
            this.gameObj.hideTurnText();
        }

        // Unbind event to prevent clicking on cells already clicked
        this.squareObj.spr.events.onInputDown.removeAll();

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
        this.turnText.setText("Turn: " + this.turnToOX());
    },

    hideTurnText: function () {
        this.turnText.setText("");
    },

    turnToOX: function () {
        var whichTurn = 'X';
        if (this.turn) {
            whichTurn = 'O';
        }
        
        return whichTurn; 
    },

    unbindAllSquares: function () {
        for (var key in this.squares) {
            if (!this.squares.hasOwnProperty(key)) continue; // skip loop if the property is from prototype
            this.squares[key].spr.events.onInputDown.removeAll();
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
        // Bind events to squares
        for (var key in this.squares) {
            if (!this.squares.hasOwnProperty(key)) continue; // skip loop if the property is from prototype
            this.squares[key].spr.inputEnabled = true;
            this.squares[key].spr.events.onInputDown.add(this.clickSquare, {gameObj:this, squareObj:this.squares[key]});
            this.squares[key].occupiedBy = '';
        }

        // Destroy
        this.nextGameButton.destroy();
        this.destroyOX();
        this.winDrawText.destroy();

        // alternate who start
        this.startTurn = !(this.startTurn);
        this.turn = this.startTurn;

        // show turn text
        this.renderTurnText();
    },

    destroyOX: function () {
        var len = this.marksOX.length;
        for (var i = 0; i < len; i += 1) {
            this.marksOX[i].destroy();
        }
    },

    checkWin: function (OX) {
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
        
        if (this.squares.s11.occupiedBy === OX) {
            if (this.squares.s21.occupiedBy === OX && this.squares.s31.occupiedBy === OX) {
                winBool = true;
            } else if (this.squares.s12.occupiedBy === OX && this.squares.s13.occupiedBy === OX) {
                winBool = true;
            } else if (this.squares.s22.occupiedBy === OX && this.squares.s33.occupiedBy === OX) {
                winBool = true;
            }
        } else if (this.squares.s12.occupiedBy === OX && this.squares.s22.occupiedBy === OX && this.squares.s32.occupiedBy === OX) {
            winBool = true;
        } else if (this.squares.s13.occupiedBy === OX) {
            if (this.squares.s23.occupiedBy === OX && this.squares.s33.occupiedBy === OX) {
                winBool = true;
            } else if (this.squares.s22.occupiedBy === OX && this.squares.s31.occupiedBy === OX) {
                winBool = true;
            }
        } else if (this.squares.s21.occupiedBy === OX && this.squares.s22.occupiedBy === OX && this.squares.s23.occupiedBy === OX) {
            winBool = true;
        } else if (this.squares.s31.occupiedBy === OX && this.squares.s32.occupiedBy === OX && this.squares.s33.occupiedBy === OX) {
            winBool = true;
        }

        return winBool;
    },

    checkDraw: function () {
        // Check if all squares are occupied
        var drawBool = true

        for (var key in this.squares) {
            if (!this.squares.hasOwnProperty(key)) continue; // skip loop if the property is from prototype
            if (this.squares[key].occupiedBy === '') {
                drawBool = false;
            }
        }

        return drawBool;
    }

};
