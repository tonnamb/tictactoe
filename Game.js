
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

};

BasicGame.Game.prototype = {

    create: function () {

        console.log("Game start!");

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

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
            this.squares[key].spr.events.onInputDown.add(this.clickSquare, {gameObj:this, squareObj:this.squares[key]})
        }

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

    createSquareObj: function (row, col) {
        return {
            spr: this.add.sprite(165+(row-1)*160, 65+(col-1)*160, 'square'),
            row: row,
            col: col,
            center: [165+75+(row-1)*160, 65+75+(col-1)*160],
            occupiedBy: ''
        }
    },

    clickSquare: function () {
        // console.log(this.gameObj.turn);
        // console.log(this.squareObj);

        // Set occupiedBy
        // Render O and X
        if (this.gameObj.turn) {
            this.squareObj.occupiedBy = 'O';
            this.gameObj.renderO(this.squareObj);
        } else {
            this.squareObj.occupiedBy = 'X';
            this.gameObj.renderX(this.squareObj);
        }

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
    }

};
