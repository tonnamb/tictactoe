
BasicGame.MainMenu = function (game) {

	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		console.log("Loading main menu.");

		var playText = this.add.text(400, 300, " Click to play with a friend ", 
		{ font: "65px Arial", fill: "#fff" , align: "center", backgroundColor: "#2f4f4f"});
		
		playText.anchor.x = 0.5;
		playText.anchor.y = 0.5;

		playText.inputEnabled = true;
		playText.events.onInputDown.add(this.startGame, this);

	},

	startGame: function (pointer) {

		this.state.start('Game');

	}

};
