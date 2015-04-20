
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
	difficulty: 1,
	plant_list: [],
	enemy_list: [],
	started: false,
	/* grid_x/grid_y is the location relative to the plant list */
	salt_dock: {x: 20, y: 200, grid_x: -1, grid_y: -1},
	water_dock: {x: 790, y: 220, grid_x: 3, grid_y: 0},
	keys: {
		up: false, down: false, left: false, right: false,
		space: false, q: false,
	},

	/**
	 * setInterval items
	 */
	water_interval: null,
	water_use_interval: null,
	salt_interval: null,
	salt_use_interval: null,

	create: function() {
		console.log('init game');
		this.element = document.getElementsByTagName('main')[0];
		this.player = Object.create(Player); this.player.create(this);
		this.player.set_pos(this.salt_dock.grid_x, this.salt_dock.grid_y);

		this.add_plants([
			[{x: 150, y: 245}, {x: 400, y: 228}, {x: 650, y: 233}],
			[{x: 106, y: 378}, {x: 329, y: 356}, {x: 550, y: 363}, {x: 758, y: 390}],
			[{x: 152, y: 486}, {x: 375, y: 476}, {x: 589, y: 491}, {x: 790, y: 532}],
		]);
	},

	add_plants: function(arr) {
		for (var i = 0; i < arr.length; i++) {
			this.plant_list.push([]);
			for (var y = 0; y < arr[i].length; y++) {
				var obj = arr[i][y];
				var n = this.plant_list[i].push(Object.create(Plant));
				this.plant_list[i][n - 1].create(this);
				this.plant_list[i][n - 1].set_pos(obj.x, obj.y);
			}
		}
	},

	has_snail: function(x, y) {
		for (var i = 0; i < this.enemy_list.length; i++) {
			if (this.enemy_list[i].x == x && this.enemy_list[i].y == y) {
				return true;
			}
		}
		return false;
	},

	get_snail: function(x, y) {
		for (var i = 0; i < this.enemy_list.length; i++) {
			if (this.enemy_list[i].x == x && this.enemy_list[i].y == y) {
				return this.enemy_list[i];
			}
		}
		return null;
	},

	add_snail: function() {
		pos_l = [];
		console.log('game started');
		for (var y = 0; y < this.plant_list.length; y++) {
			for (var x = 0; x < this.plant_list[0].length; x++) {
				var p = this.plant_list[y][x];
				var state = p.get_state();
				if (state == 'plant spawn' || state == 'plant die')
					continue;
				if (!this.has_snail(x, y)) {
					pos_l.push({x: x, y: y});
				}
			}
		}
		if (pos_l.length > 0) {
			var r = pos_l[Math.floor(Math.random() * pos_l.length)];
			var snail = Object.create(Enemy);
			snail.create(this);
			snail.set_pos(r.x, r.y);
		}
	},

	use_seed: function() {
		console.log('use seed');
		if (this.player.x == -1 ||
			(this.player.x == this.water_dock.grid_x &&
			this.player.y == this.water_dock.grid_y))
			return;
		if (this.player.seeds > 0) {
			var p = this.plant_list[this.player.y][this.player.x];
			if (p.get_state() == 'plant die') {
				p.spawn();
				this.player.display_seed_drop();
				if (!this.started) {
					this.started = true;
					var that = this;
					setTimeout(function() { that.add_snail(); },
						10000);
				}
				this.player.remove_seeds(1);
			}
		}
	},

	use_salt_dock: function() {
		if (this.player.salt >= 100) return;
		console.log('refil salt');
		var that = this;
		clearInterval(this.salt_interval);
		this.salt_interval = setInterval(function() {
			if (that.player.x == that.salt_dock.grid_x &&
				that.player.y == that.salt_dock.grid_y) {
				if (that.player.item == 'salt' &&
					that.player.salt < 100) {
					that.player.add_salt(1);
				}
			}
			else {
				clearInterval(that.salt_interval);
			}
		}, 25);
	},

	use_water_dock: function() {
		if (this.player.water >= 100) return;
		console.log('refill water');
		var that = this;
		clearInterval(this.water_interval);
		this.water_interval = setInterval(function() {
			if (that.player.x == that.water_dock.grid_x &&
				that.player.y == that.water_dock.grid_y) {
				if (that.player.item == 'watering_can' && 
					that.player.water < 100) {
					that.player.add_water(1);
				}
			}
			else {
				clearInterval(that.water_interval);
			}
		}, 25);
	},

	use_water: function() {
		console.log('use water');
		//var p = this.plant_list[this.player.y][this.player.x];
		//var state = p.get_state();
		//if (state != 'plant die' &&
		//	state != 'plant spawn' &&
		//	state != 'plant hp5') {
		//	var x = this.player.x;
		//	var y = this.player.y;
		var that = this;
		this.player.display_pouring(true);
		clearInterval(this.water_use_interval);
		this.water_use_interval = setInterval(function() {
			if (that.keys.space && that.player.item == 'watering_can') {
				if (that.player.water >= 25 && that.player.x !== -1 &&
					(that.player.x != that.water_dock.grid_x ||
					that.player.y != that.water_dock.grid_y)) {
					var p = that.plant_list[
						that.player.y][
						that.player.x];
					var state = p.get_state();
					if (state != 'plant die' &&
						state != 'plant spawn') {
							p.heal(1);
					}
				}
				that.player.remove_water(25);
			}
			else {

				that.player.display_pouring(false);
				clearInterval(that.water_use_interval);
			}
		}, 1000);
	},

	use_salt: function() {
		console.log('use salt');
		var that = this;
		this.player.display_salt_pouring(true);
		clearInterval(this.salt_user_interval);
		this.salt_use_interval = setInterval(function() {
			if (that.keys.space && that.player.item == 'salt') {
				if (that.player.salt >= 25 &&
					that.player.x != -1 &&
					(that.player.x != that.water_dock.grid_x ||
					that.player.y != that.water_dock.grid_y)) {
					if (that.has_snail(that.player.x,
						that.player.y)) {
						that.get_snail.die();
					}
				}
				that.player.remove_salt(25);
			}
			else {
				that.player.display_salt_pouring(false);
				clearInterval(that.water_use_interval);
			}
		}, 1000);
	},

	/**
	 * input
	 */

	move_up: function() {
		console.log('move_up');
		var pos = this.player.get_pos();
		if (pos.x == -1 || pos.y == 0 ||
			(pos.x == this.water_dock.grid_x && pos.y == 0))
			 return;
		pos.y -= 1;
		if (this.keys.left) {
			/* shortest path up left */
			if (pos.x == 0) {
				this.player.set_pos(pos.x, pos.y);
				return;
			}
			pos.x -= 1;
			this.player.set_pos(pos.x, pos.y);
		}
		else if (this.keys.right) {
			/* shortest path up right */
			if (pos.x > this.plant_list[pos.y].length -1) {
				this.player.set_pos(pos.x -1, pos.y);
			}
			else if (pos.x == this.plant_list[pos.y].length - 1) {
				this.player.set_pos(pos.x, pos.y);
			}
			else {
				if (this.plant_list[pos.y +1][pos.x] <=
					this.plant_list[pos.y][pos.x].x) {
					this.player.set_pos(pos.x, pos.y);
					return;
				}
				else this.player.set_pos(pos.x + 1, pos.y);
			}
		}
		else {
			/* shortest path up */
			if (pos.x > this.plant_list[pos.y].length -1) {
				this.player.set_pos(pos.x - 1, pos.y);
			}
			else { this.player.set_pos(pos.x, pos.y); }
		}
	},

	move_down: function() {
		console.log('move_down');
		var pos = this.player.get_pos();
		if (pos.x == -1 ||
			(pos.x == this.water_dock.grid_x && pos.y == 0) ||
			pos.y >= this.plant_list.length - 1)
			return;
		pos.y += 1;
		if (this.keys.left) {
			/* shortest path down left */
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
				if (this.plant_list[pos.y -1][pos.x].x <=
					this.plant_list[pos.y][pos.x].x) {
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
			else this.player.set_pos(pos.x, pos.y);
		}
	},

	move_left: function() {
		var pos = this.player.get_pos();
		if (pos.x == this.water_dock.grid_x) {
			this.player.set_pos(pos.x - 1, pos.y);
		}
		if (pos.x == 0 && pos.y == 0) {
			this.player.set_pos(-1, -1);
			this.use_salt_dock();
		}
		else if (pos.x > 0) {
			this.player.set_pos(pos.x - 1, pos.y);
		}
	},

	move_right: function() {
		console.log('move_right');
		var pos = this.player.get_pos();
		if (pos.x == this.water_dock.grid_x) return;
		if (pos.x == -1) {
			this.player.set_pos(0, 0);
		}
		else if (pos.x < this.plant_list[pos.y].length - 1) {
			this.player.set_pos(pos.x + 1, pos.y);
		}
		else if (pos.x != this.water_dock.grid_x && pos.y == 0) {
			this.player.set_pos(this.water_dock.grid_x, this.water_dock.grid_y);
			this.use_water_dock();
		}
	},

	do_space: function() {
		console.log('do_space');
		switch (this.player.item) {
			case 'seed':
				this.use_seed();
				break;
			case 'watering_can':
				this.use_water();
				break;
			case 'salt':
				this.use_salt();
				break;
		}
	},

	do_q: function() {
		console.log('do_q');
		this.player.switch_item();
		console.log('current_item: ', this.player.item);
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
		}
		else if (c == KeyCodes.a || c == KeyCodes.left) {
			if (!this.keys.left) {
				this.keys.left = true;
				// move left
				this.move_left();
			}
		}
		else if (c == KeyCodes.s || c == KeyCodes.down) {
			if (!this.keys.down) {
				this.keys.down = true;
				// move down
				this.move_down();
			}
		}
		else if (c == KeyCodes.d || c == KeyCodes.right) {
			if (!this.keys.right) {
				this.keys.right = true;
				// move right
				this.move_right();
			}
		}
		else if (c == KeyCodes.space) {
			if (!this.keys.space) {
				this.keys.space = true;
				// space
				this.do_space();
			}
		}
		else if (c == KeyCodes.q) {
			if (!this.keys.q) {
				this.keys.q = true;
				// q
				this.do_q();
			}
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
 * init game after all resources have loaded
 */
window.onload = function() {
	console.log('ready');
	document.getElementById('loading').innerHTML = '';
	var game = Object.create(Game);
	game.create();
	document.addEventListener('keydown', function(e) { game.on_keydown(e); });
	document.addEventListener('keyup', function(e) { game.on_keyup(e); });
};

/**
 * load/inject resources
 */
console.log('loading');

