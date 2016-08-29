
BasicGame.Preloader = function (game) {

	console.log("Preloading assets.");

	// 'this' refers to 'BasicGame.Preloader' state object

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		// 'this' refers to 'BasicGame.Preloader' state object
		
		this.load.image('square', 'images/white_square.png')
		this.load.image('circle', 'images/circle.png')
		this.load.image('cross', 'images/cross.png')

	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		//  this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		/*
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}
		*/

		this.ready = true;
		this.state.start('MainMenu');

	}

};
