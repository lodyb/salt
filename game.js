
var Game = {

	element: null,
	player: null,
	plant_list: [],
	enemy_list: [],

	create: function() {
		console.log('init game');
		this.element = document.getElementsByTagName('main')[0];
		this.player = Object.create(Player); this.player.create(this);
	}

};

// things to do:
// initialise world (bg, foreground, ui)
// initialise hero (with keyboard controls)
// initialise other entities (plants, regen)
// initialise triggers (loop to see if we are touching ents?)
// initialise enemies (snails)

// html/js is event based so i dont think it will need a main loop
// we should just use the event handlers (keyboard, timers, touchtriggers)
// and let the DOM do our painting for us

// here's how i think it will go:
// game is started
// plant a few seeds to start to create plants in garden
// then snails will come on a timer and you have to salt them hold space
// need to keep recharging salt at the salt well
// every 30s survived gives another seed to plant
// time survived before all plants dead is score


var Player = {

	element: null,
	parent: null,

	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'Player_Default');
		this.parent.element.appendChild(this.element);
		console.log('added Player');
	}

};


var Plant = {

	element: null,
	parent: null,

	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'Plant_Default');
		this.parent.element.appendChild(this.element);
		console.log('added Plant');
	}

};

var Enemy = {

	element: null,
	parent: null,

	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'Enemy_Default');
		this.parent.element.appendChild(this.element);
		console.log('added Enemy');
	}

};

+function() {
	console.log('ready');
	var game = Object.create(Game);
	game.create();
}();


