
/**
 * player object
 */
var Player = {

	element: null,
	parent: null,
	x: -1,
	y: -1,
	item: 'seed',
	water: 0,
	seeds: 2,

	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'player');
		this.parent.element.appendChild(this.element);
		this.element.style.position = 'absolute';
		this.set_pos(-1, -1);
		console.log('added Player');
	},

	switch_item: function() {
		switch (this.item) {
			case 'seed':
				this.item = 'watering_can';
				break;
			case 'watering_can':
				this.item = 'salt';
				break;
			case 'salt':
				this.item = 'seed';
				break;
		}
		/* draw item */
	},

	remove_seeds: function(n) {
		this.seeds = this.seeds -n;
		if (this.seeds < 0) this.seeds = 0;
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
	health: 5,
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

