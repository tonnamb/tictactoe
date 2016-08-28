
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

    this.squares = {};
    this.turn = true; // true = 'O', false = 'X'
    this.scores = {};
    this.scoreText = '';

};

BasicGame.Game.prototype = {

    create: function () {

        console.log("Game start!");

        // Create squares
        this.squares.s11 = this.createSquareObj(1, 1);
        this.squares.s12 = this.createSquareObj(1, 2);
        this.squares.s13 = this.createSquareObj(1, 3);
        this.squares.s21 = this.createSquareObj(2, 1);
        this.squares.s22 = this.createSquareObj(2, 2);
        this.squares.s23 = this.createSquareObj(2, 3);
        this.squares.s31 = this.createSquareObj(3, 1);
        this.squares.s32 = this.createSquareObj(3, 2);
        this.squares.s33 = this.createSquareObj(3, 3);

        // Bind events
        for (var key in this.squares) {
            if (!this.squares.hasOwnProperty(key)) continue; // skip loop if the property is from prototype
            this.squares[key].spr.inputEnabled = true;
            this.squares[key].spr.events.onInputDown.add(this.clickSquare, {gameObj:this, squareObj:this.squares[key]});
        }

        // Set initial scores as zero
        this.scores.O = 0;
        this.scores.X = 0;

        // Render scoreboard
        this.scoreText = this.add.text(10, 10, "Score: O = " + this.scores.O + ", X = " + this.scores.X, 
        { font: "30px Arial", fill: "#fff" });

    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

    },

    quitGame: function (pointer) {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
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
        if (this.gameObj.turn) {
            this.squareObj.occupiedBy = 'O';
            this.gameObj.renderO(this.squareObj);
            if (this.gameObj.checkWin('O')) {
                this.gameObj.scores.O += 1;
            }
        } else {
            this.squareObj.occupiedBy = 'X';
            this.gameObj.renderX(this.squareObj);
            if (this.gameObj.checkWin('X')) {
                this.gameObj.scores.X += 1;
            }
        }

        // Render scoreboard
        this.gameObj.scoreText.setText("Score: O = " + this.gameObj.scores.O + ", X = " + this.gameObj.scores.X);

        // Unbind events to prevent duplicate cell click
        this.squareObj.spr.events.onInputDown.removeAll();

        // Change turns
        this.gameObj.turn = !(this.gameObj.turn);

    },

    renderO: function (squareObj) {
        var circle = this.add.sprite(squareObj.center[0], squareObj.center[1], 'circle');
        circle.anchor.x = 0.5;
        circle.anchor.y = 0.5;
    },

    renderX: function (squareObj) {
        var cross = this.add.sprite(squareObj.center[0], squareObj.center[1], 'cross');
        cross.anchor.x = 0.5;
        cross.anchor.y = 0.5;
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
            } else if (this.squares.s11.occupiedBy === OX && this.squares.s33.occupiedBy === OX) {
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
    }

};
