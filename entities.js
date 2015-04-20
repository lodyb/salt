
/**
 * player object
 */
var Player = {

	element: null,
	element_item: null,
	element_item_fx: null,
	parent: null,
	x: -1,
	y: -1,
	item: 'seed',
	salt: 100,
	water: 0,
	seeds: 2,
	seeds_ui: null,
	water_ui: null,
	display_pouring_interval: null,
	fx_text: 'goodwater',

	create: function(parent) {
		this.parent = parent;
		this.seeds_ui = document.getElementById('seeds');
		this.water_ui = document.getElementById('water');
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'player');
		this.parent.element.appendChild(this.element);
		this.element.style.position = 'absolute';
		this.element_item = document.createElement('div');
		this.element_item.setAttribute('class', 'item seeds');
		this.element.appendChild(this.element_item);
		this.element_item_fx = document.createElement('span');
		this.element_item.appendChild(this.element_item_fx);
		this.set_pos(-1, -1);
		console.log('added Player');
	},

	display_item: function(s) {
		console.log(this.element_item.getAttribute('class'));
		this.element_item.setAttribute('class', s);
	},

	switch_item: function() {
		switch (this.item) {
			case 'seed':
				this.item = 'watering_can';
				this.display_item('item water');
				break;
			case 'watering_can':
				this.item = 'salt';
				this.display_item('item salt');
				break;
			case 'salt':
				this.item = 'seed';
				this.display_item('item seed');
				break;
		}
		/* draw item */
	},

	add_salt: function(n) {
		this.salt += n;
		if (this.salt > 100) this.salt = 100;
		console.log('salt changes to ', this.salt);
	},

	add_water: function(n) {
		this.water += n;
		if (this.water > 100) this.water = 100;
		this.display_water();
		console.log('water changed to ', this.water);
	},

	display_pouring: function (b) {
		if (this.item != 'watering_can') return;
		if (b) {
			this.display_item('item water active');
			var that = this;
			var len = this.fx_text.length;
			var start = 0;
			this.display_pouring_interval = setInterval(function() {
				if (that.item == 'watering_can' && that.water >= 25 &&
					that.parent.keys.space) {
					var s = '';
					while (s.length < 6) {
						if (start == len -1) start = 0;
						s += that.fx_text[start];
						start++;
					}
					that.element_item_fx.innerHTML = s;
				}
				else {
					that.element_item_fx.innerHTML = '';
					clearInterval(that.display_pouring_interval);
				}
			}, 120);
		}
		else {
			this.display_item('item water');
			this.element_item_fx.innerHTML = '';
			clearInterval(this.display_pouring_interval);
		}
	},

	remove_water: function(n) {
		this.water -= n;
		if (this.water < 0) this.water = 0;
		this.display_water();
		console.log('water changed to ', this.water);
	},

	display_water: function() {
		this.water_ui.style.width = this.water.toString() + 'px';
	},

	display_seeds: function() {
		this.seeds_ui.innerHTML = this.seeds.toString();
	},

	remove_seeds: function(n) {
		this.seeds = this.seeds -n;
		if (this.seeds < 0) this.seeds = 0;
		this.display_seeds();
		console.log('n seeds changed to ', this.seeds);
	},

	set_pos: function(x, y) {
		if (x == -1) {
			this.x = x; this.y = y;
			this.element.style.left =
				this.parent.salt_dock.x.toString() + 'px';
			this.element.style.top =
				this.parent.salt_dock.y.toString() + 'px';
		}
		else if (x == this.parent.water_dock.grid_x && y == 0) {
			this.x = x; this.y = y;
			this.element.style.left =
				this.parent.water_dock.x.toString() + 'px';
			this.element.style.top =
				this.parent.water_dock.y.toString() + 'px';
		}
		else {
			this.x = x; this.y = y;
			this.element.style.left =
				(this.parent.plant_list[
				this.y][this.x].x -35).toString() + 'px';
			this.element.style.top =
				(this.parent.plant_list[
				this.y][this.x].y -45).toString() + 'px';
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
	health: 1,
	x: 0,
	y: 0,

	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'plant die');
		this.parent.element.appendChild(this.element);
		this.element.style.position = 'absolute';
		this.set_pos(0, 0);
		console.log('added Plant');
	},

	spawn: function() {
		this.element.setAttribute('class', 'plant spawn');
		var that = this;
		setTimeout(function() {
			that.element.setAttribute('class', 'plant hp1');
		}, 1000);
	},

	set_pos: function(x, y) {
		this.x = x; this.y = y;
		this.element.style.left = x.toString() + 'px';
		this.element.style.top = y.toString() + 'px';
	},

	get_pos: function() {
		return {x: this.x, y: this.y};
	},

	get_state: function() {
		return this.element.getAttribute('class');
	},

	heal: function(n) {
		if (this.health == 0) return;
		this.health += n;
		if (this.health > 5) this.health = 5;
		this.element.setAttribute('class', 'plant hp' + this.health.toString());
		console.log('health changed to', this.health, this.element.getAttribute('class'));
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
	nom_interval: null,

	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'enemy');
		this.parent.element.appendChild(this.element);
		this.element.style.position = 'absolute';
		this.set_pos(0, 0);
		console.log('added Enemy');
		var that = this;
		this.nom_interval = setInterval(function() {
			var p = that.parent.plant_list[that.y][that.x];
			var state = p.get_state();
			if (state != 'plant spawn' && state != 'plant die') {
				p.hurt(1);
			}
			else {
				clearInterval(that.nom_interval);
				that.move_next();
			}
		}, 1000);
	},

	move_next: function() {
		this.die();
		var that = this;
		setTimeout(function() {
			that.parent.add_snail();
		}, 1000);
	},

	die: function() {
		var r = null;
		for (var i = 0; i < this.parent.enemy_list; i++) {
			var e = this.parent.enemy_list[i];
			if (e.x == this.x && e.y == this.y) {
				r = i;
			}
		}
		this.parent.enemy_list.splice(r, 1);
		this.element.setAttribute('class', 'enemy die');
		var that = this;
		setTimeout(function() {
			that.parent.element.removeChild(that.element);
		}, 1000);
	},

	set_pos: function(x, y) {
		this.x = x; this.y = y;
		this.element.style.left =
			(this.parent.plant_list[
			this.y][this.x].x -35).toString() + 'px';
		this.element.style.top =
			(this.parent.plant_list[
			this.y][this.x].y -45).toString() + 'px';
	},


	get_pos: function() {
		return {x: this.x, y: this.y};
	},

};

