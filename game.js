
/**
 * keycode constants
 */
var KeyCodes = {

	w: 87, a: 65, s: 83, d: 68,
	up: 38, down: 40, left: 37, right: 39,
	space: 32, q: 81,

}

/**
 * game object
 */
var Game = {

	element: null,
	player: null,
	plant_list: [],
	enemy_list: [],
	keys: {
		up: false, down: false, left: false, right: false,
		space: false, q: false,
	},

	create: function() {
		console.log('init game');
		this.element = document.getElementsByTagName('main')[0];
		this.player = Object.create(Player); this.player.create(this);
		this.player.set_pos(50, 50);
		this.add_plants([
			[{x: 150, y: 50}, {x: 400, y: 50}, {x: 650, y: 50}],
			[{x: 270, y: 200}, {x: 530, y: 200}],
			[{x: 150, y: 350}, {x: 400, y: 350}, {x: 650, y: 350}],
			[{x: 270, y: 500}, {x: 530, y: 500}],
		]);
	},

	add_plants: function(arr) {
		for (var i = 0; i < arr.length; i++) {
			this.plant_list.push([]);
			for (var y = 0; y < arr[i].length; y++) {
				var obj = arr[i][y];
				var n = this.plant_list[i].push(Object.create(Plant));
				this.plant_list[i][n - 1].create(this);
				this.plant_list[i][n - 1].set_pos(obj.x, obj.y)
			}
		}
	},

	on_keydown: function(e) {
		if (e.repeat) return;
		var c = (e.keyCode ? e.keyCode : e.which);
		if (c == KeyCodes.w || c == KeyCodes.up) {
			if (!this.keys.up) {
				this.keys.up = true;
				// move up
				console.log('move_up');
			}
			else this.keys.up = false;
		}
		else if (c == KeyCodes.a || c == KeyCodes.left) {
			if (!this.keys.left) {
				this.keys.left = true;
				// move left
				console.log('move_left');
			}
			else this.keys.left = false;
		}
		else if (c == KeyCodes.s || c == KeyCodes.down) {
			if (!this.keys.down) {
				this.keys.down = true;
				// move down
				console.log('move_down');
			}
			else this.keys.down = false;
		}
		else if (c == KeyCodes.d || c == KeyCodes.right) {
			if (!this.keys.right) {
				this.keys.right = true;
				// move right
				console.log('move_right');
			}
			else this.keys.right = false;
		}
		else if (c == KeyCodes.space) {
			if (!this.keys.space) {
				this.keys.space = true;
				// space
				console.log('do space');
			}
			else this.keys.space = false;
		}
		else if (c == KeyCodes.q) {
			if (!this.keys.q) {
				this.keys.q = true;
				// q
				console.log('do q');
			}
			else this.keys.q = false;
		}
	},

	on_keyup: function(e) {
		if (e.repeat) return;
		var c = (e.keyCode ? e.keyCode : e.which);
		if (c == KeyCodes.w || c == KeyCodes.up)
			this.keys.up = false;
		else if (c == KeyCodes.a || c == KeyCodes.left) {
			this.keys.left = false;
		}
		else if (c == KeyCodes.s || c == KeyCodes.down) {
			this.keys.down = false;
		}
		else if (c == KeyCodes.d || c == KeyCodes.right) {
			this.keys.right = false;
		}
		else if (c == KeyCodes.space) {
			this.keys.space = false;
		}
		else if (c == KeyCodes.q) {
			this.keys.q = false;
		}
	}

};

/**
 * player object
 */
var Player = {

	element: null,
	parent: null,

	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'player');
		this.parent.element.appendChild(this.element);
		this.element.style.position = 'absolute';
		this.set_pos(0, 0);
		console.log('added Player');
	},

		set_pos: function(x, y) {
		this.element.style.left = x.toString() + 'px';
		this.element.style.top = y.toString() + 'px';
	},

	happy: function() {
		this.element.setAttribute('class', 'player happy');
	},

	die: function() {
		this.element.setAttribute('class', 'player die');
	},

	full_salt: function() {
		this.element.setAttribute('class', 'player full_salt');
	},

	plant: function() {
		this.element.setAttribute('class', 'player plant');
	},

	worry: function() {
		this.element.setAttribute('class', 'player worry');
	}

};

/**
 * friendly plant object
 */
var Plant = {

	element: null,
	parent: null,
	health: 5,

	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'plant spawn');
		this.parent.element.appendChild(this.element);
		this.element.style.position = 'absolute';
		this.set_pos(0, 0);
		console.log('added Plant');
	},

	set_pos: function(x, y) {
		this.element.style.left = x.toString() + 'px';
		this.element.style.top = y.toString() + 'px';
	},


	hurt: function(dmg) {
		this.health -= dmg;
		if (this.health < 1) this.die();
		else this.element.setAttribute('class', 'plant hp' + this.health.toString());
	},

	die: function() {
		this.element.setAttribute('class', 'plant die');
	}

};

/**
 * enemy snail object
 */
var Enemy = {

	element: null,
	parent: null,

	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'enemy');
		this.parent.element.appendChild(this.element);
		this.element.style.position = 'absolute';
		this.set_pos(0, 0);
		console.log('added Enemy');
	},

	set_pos: function(x, y) {
		this.element.style.left = x.toString() + 'px';
		this.element.style.top = y.toString() + 'px';
	},

};

/**
 * init game after all resources have loaded
 */
window.onload = function() {
	console.log('ready');
	var game = Object.create(Game);
	game.create();
	document.addEventListener('keydown', function(e) { game.on_keydown(e); });
	document.addEventListener('keyup', function(e) { game.on_keyup(e); });
};

/**
 * load/inject resources
 */
console.log('loading');

