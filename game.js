
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
	/* grid_x/grid_y is the location relative to the plant list */
	salt_dock: {x: 20, y: 200, grid_x: -1, grid_y: -1},
	keys: {
		up: false, down: false, left: false, right: false,
		space: false, q: false,
	},

	create: function() {
		console.log('init game');
		this.element = document.getElementsByTagName('main')[0];
		this.player = Object.create(Player); this.player.create(this);
		this.player.set_pos(this.salt_dock.grid_x, this.salt_dock.grid_y);

		this.add_plants([
			[{x: 150, y: 245}, {x: 400, y: 228}, {x: 650, y: 233}],
			[{x: 106, y: 378}, {x: 329, y: 356}, {x: 550, y: 363}, {x: 758, y: 390}],
			[{x: 152, y: 486}, {x: 375, y: 476}, {x: 589, y: 491}, {x: 790, y: 532}],,
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

	/**
	 * input
	 */

	move_up: function() {
		console.log('move_up');
	},

	move_down: function() {
		console.log('move_down');
		var pos = this.player.get_pos();
		if (pos.x == -1) return;
		if (pos.y < this.plant_list.length - 1) {
			pos.y += 1;
			if (this.keys.left) {
				/* shortest path down left */
				if (pos.x == -1) return;
				if (pos.x == 0) {
					this.player.set_pos(pos.x, pos.y);
					return;
				}
				pos.x -= 1;
				this.player.set_pos(pos.x, pos.y);
			}
			else if (this.keys.right) {
				/* shortest path down right */
				if (pos.x > this.plant_list[pos.y].length -1) {
					this.player.set_pos(pos.x -1, pos.y);
				}
				else if (pos.x == this.plant_list[pos.y].length -1) {
					this.player.set_pos(pos.x, pos.y);
				}
				else {
					if (this.plant_list[pos.y -1][pos.x].x <= this.plant_list[pos.y][pos.x].x) {
						this.player.set_pos(pos.x, pos.y);
						return;
					}
					else this.player.set_pos(pos.x + 1, pos.y);
				}
			}
			else {
				/* shortest path down */
				if (pos.x > this.plant_list[pos.y].length -1) {
					this.player.set_pos(pos.x - 1, pos.y);
				}
				else if (pos.x == 0) {
					this.player.set_pos(pos.x, pos.y);
				}
				else if (this.plant_list[pos.y -1][pos.x].x <= this.plant_list[pos.y][pos.x].x) {
					this.player.set_pos(pos.x, pos.y);
					return;
				}
				else this.player.set_pos(pos.x + 1, pos.y);
			}
		}
	},

	move_left: function() {
		var pos = this.player.get_pos();
		if (pos.x == 0 && pos.y == 0) {
			this.player.set_pos(-1, -1);
		}
		else if (pos.x > 0) {
			this.player.set_pos(pos.x - 1, pos.y);
		}
	},

	move_right: function() {
		console.log('move_right');
		var pos = this.player.get_pos();
		if (pos.x == -1) {
			this.player.set_pos(0, 0);
		}
		else if (pos.x < this.plant_list[pos.y].length - 1) {
			this.player.set_pos(pos.x + 1, pos.y);
		}
	},

	do_space: function() {
		console.log('do_space');
	},

	do_q: function() {
		console.log('do_q');
	},

	on_keydown: function(e) {
		if (e.repeat) return;
		var c = (e.keyCode ? e.keyCode : e.which);
		if (c == KeyCodes.w || c == KeyCodes.up) {
			if (!this.keys.up) {
				this.keys.up = true;
				// move up
				this.move_up();
			}
			else this.keys.up = false;
		}
		else if (c == KeyCodes.a || c == KeyCodes.left) {
			if (!this.keys.left) {
				this.keys.left = true;
				// move left
				this.move_left();
			}
			else this.keys.left = false;
		}
		else if (c == KeyCodes.s || c == KeyCodes.down) {
			if (!this.keys.down) {
				this.keys.down = true;
				// move down
				this.move_down();
			}
			else this.keys.down = false;
		}
		else if (c == KeyCodes.d || c == KeyCodes.right) {
			if (!this.keys.right) {
				this.keys.right = true;
				// move right
				this.move_right();
			}
			else this.keys.right = false;
		}
		else if (c == KeyCodes.space) {
			if (!this.keys.space) {
				this.keys.space = true;
				// space
				this.do_space();
			}
			else this.keys.space = false;
		}
		else if (c == KeyCodes.q) {
			if (!this.keys.q) {
				this.keys.q = true;
				// q
				this.do_q();
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
	x: -1,
	y: -1,

	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'player');
		this.parent.element.appendChild(this.element);
		this.element.style.position = 'absolute';
		this.set_pos(-1, -1);
		console.log('added Player');
	},

	set_pos: function(x, y) {
		if (x == -1) {
			this.x = x; this.y = y;
			this.element.style.left = this.parent.salt_dock.x.toString() + 'px';
			this.element.style.top = this.parent.salt_dock.y.toString() + 'px';
		}
		else {
			this.x = x; this.y = y;
			this.element.style.left = this.parent.plant_list[this.y][this.x].x.toString() + 'px';
			this.element.style.top = this.parent.plant_list[this.y][this.x].y.toString() + 'px';
		}
	},

	get_pos: function() {
		return {x: this.x, y: this.y};
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
	x: 0,
	y: 0,

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
		this.x = x; this.y = y;
		this.element.style.left = x.toString() + 'px';
		this.element.style.top = y.toString() + 'px';
	},

	get_pos: function() {
		return {x: this.x, y: this.y};
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
	x: 0,
	y: 0,

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
		this.x = x; this.y = y;
		this.element.style.left = x.toString() + 'px';
		this.element.style.top = y.toString() + 'px';
	},

	get_pos: function() {
		return {x: this.x, y: this.y};
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

