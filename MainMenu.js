
BasicGame.MainMenu = function (game) {

	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		console.log("Loading main menu.");

		var aiText = this.add.text(400, 200, " Play with a computer ", 
		{ font: "65px Arial", fill: "#fff" , align: "center", backgroundColor: "#2f4f4f"});

		aiText.anchor.x = 0.5;
		aiText.anchor.y = 0.5;

		aiText.inputEnabled = true;
		aiText.events.onInputDown.add(this.startAIGame, this);

		var playText = this.add.text(400, 400, " Play with a friend ", 
		{ font: "65px Arial", fill: "#fff" , align: "center", backgroundColor: "#2f4f4f"});
		
		playText.anchor.x = 0.5;
		playText.anchor.y = 0.5;

		playText.inputEnabled = true;
		playText.events.onInputDown.add(this.startGame, this);

	},

	startGame: function (pointer) {

		this.state.start('Game');

	},

	startAIGame: function (pointer) {

		this.state.start('GameAI');

	}

};
