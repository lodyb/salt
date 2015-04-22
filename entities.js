
/**
 * player object
 */
var Player = {

	/**
	 * this's dom elements - div
	 */
	element: null,
	element_item: null,
	element_item_fx: null,

	/**
	 * parent object - Game
	 */
	parent: null,

	/**
	 * location relative to Game's plant list
	 */
	x: -1,
	y: -1,

	/**
	 * active item
	 */
	item: 'seed',

	/**
	 * item resource count
	 */
	salt: 100,
	water: 0,
	seeds: 2,

	/**
	 * dom elements for the hud/item resource count display
	 */
	seeds_ui: null,
	water_ui: null,
	salt_ui: null,

	/**
	 * used for water pour effect
	 */
	display_pouring_interval: null,
	fx_text: 'goodwater',

	/**
	 * init
	 */
	create: function(parent) {
		this.parent = parent;
		this.seeds_ui = document.getElementById('seeds');
		this.water_ui = document.getElementById('water');
		this.salt_ui = document.getElementById('salt');
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
	},

	/**
	 * reset this back to init condition given any state
	 */
	reset: function() {
		clearInterval(this.display_pouring_interval);
		this.element_item_fx.innerHTML = '';
		this.seeds = 2;
		this.water = 0;
		this.salt = 100;
		this.item = 'seed';
		this.display_item('item seeds');
		this.display_salt();
		this.display_water();
		this.display_seeds();
	},

	/**
	 * set active item css display
	 */
	display_item: function(s) {
		this.element_item.setAttribute('class', s);
	},

	/**
	 * rotate through items
	 */
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
				this.display_item('item seeds');
				break;
		}
	},

	/**
	 * add to the salt resource count and display on hud
	 */
	add_salt: function(n) {
		this.salt += n;
		if (this.salt > 100) this.salt = 100;
		this.display_salt();
	},

	/**
	 * add to the water resource count and display on hud
	 */
	add_water: function(n) {
		this.water += n;
		if (this.water > 100) this.water = 100;
		this.display_water();
	},

	/**
	 * effect for dropping a seed to the ground
	 */
	display_seed_drop: function() {
		if (this.item != 'seed') return;
		this.display_item( 'item seeds active');
		var that = this;
		setTimeout(function() {
			if (that.item == 'seed') {
				that.display_item('item seeds');
			}
		}, 600);
	},

	/**
	 * effect for pouring salt
	 */
	display_salt_pouring: function(b) {
		if (b) {
			this.display_item('item salt active');
		}
		else {
			this.display_item('item salt');
		}
	},

	/**
	 * effect for pouring water - including scrolling text
	 */
	display_pouring: function (b) {
		if (this.item != 'watering_can') return;
		if (b) {
			this.display_item('item water active');
			var that = this;
			var len = this.fx_text.length;
			var start = 0;
			this.display_pouring_interval = setInterval(function() {
				if (that.item == 'watering_can' &&
					that.water >= 25 &&
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

	/**
	 * remove from salt resource count and display on hud
	 */
	remove_salt: function(n) {
		this.salt -= n;
		if (this.salt < 0) this.salt = 0;
		this.display_salt();
	},

	/**
	 * remove from water resource count and display on hud
	 */
	remove_water: function(n) {
		this.water -= n;
		if (this.water < 0) this.water = 0;
		this.display_water();
	},

	/**
	 * hud display - salt
	 */
	display_salt: function() {
		this.salt_ui.style.width = this.salt.toString() + 'px';
	},

	/**
	 * hud display - water
	 */
	display_water: function() {
		this.water_ui.style.width = this.water.toString() + 'px';
	},

	/**
	 * hud display - seeds
	 */
	display_seeds: function() {
		this.seeds_ui.innerHTML = this.seeds.toString();
	},

	/**
	 * remove from seed resource count and display on hud
	 */
	remove_seeds: function(n) {
		this.seeds = this.seeds -n;
		if (this.seeds < 0) this.seeds = 0;
		this.display_seeds();
	},

	/**
	 * set position of player, by relation or absolutely
	 * depending on input x, y
	 */
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

	/**
	 * obsolete
	 */
	get_pos: function() {
		return {x: this.x, y: this.y};
	},

};

/**
 * friendly plant object
 */
var Plant = {

	/**
	 * this's dom element - div
	 */
	element: null,

	/**
	 * parent object - Game
	 */
	parent: null,

	/**
	 * health - 0-5
	 */
	health: 1,

	/**
	 * location in pixels
	 */
	x: 0,
	y: 0,

	/**
	 * init
	 */
	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'plant die');
		this.parent.element.appendChild(this.element);
		this.element.style.position = 'absolute';
		this.set_pos(0, 0);
	},

	/**
	 * reset this back to init condition given any state
	 */
	reset: function() {
		this.element.setAttribute('class', 'plant die');
		this.health = 1;
	},

	/**
	 * spawn fade effect
	 */
	spawn: function() {
		this.element.setAttribute('class', 'plant spawn');
		var that = this;
		setTimeout(function() {
			that.element.setAttribute('class', 'plant hp1');
		}, 1000);
	},

	/**
	 * set location absolutely in pixels
	 */
	set_pos: function(x, y) {
		this.x = x; this.y = y;
		this.element.style.left = x.toString() + 'px';
		this.element.style.top = y.toString() + 'px';
	},

	/**
	 * obsolete
	 */
	get_pos: function() {
		return {x: this.x, y: this.y};
	},

	/**
	 * return the class of object - used to determine dead/alive states
	 */
	get_state: function() {
		return this.element.getAttribute('class');
	},

	/**
	 * heal the plant by n hit points
	 */
	heal: function(n) {
		if (this.health == 0) return;
		this.health += n;
		if (this.health > 5) this.health = 5;
		this.element.setAttribute('class', 'plant hp' + this.health.toString());
	},

	/**
	 * damage the plant by n hit points
	 * the plants are not really damaged they are just hiding more
	 */
	hurt: function(dmg) {
		this.health -= dmg;
		if (this.health < 1) this.die();
		else this.element.setAttribute('class', 'plant hp' + this.health.toString());
	},

	/**
	 * the plants never die - don't beleive this!
	 */
	die: function() {
		this.element.setAttribute('class', 'plant die');
	}

};

/**
 * enemy snail object
 */
var Enemy = {

	/**
	 * this's dom element - div
	 */
	element: null,

	/**
	 * parent object - Game
	 */
	parent: null,

	/**
	 * location relative to Game's plant list
	 */
	x: 0,
	y: 0,

	/**
	 * interval for damage dealing
	 */
	nom_interval: null,

	/**
	 * init
	 */
	create: function(parent) {
		this.parent = parent;
		this.element = document.createElement('div');
		this.element.setAttribute('class', 'enemy');
		this.parent.element.appendChild(this.element);
		this.element.style.position = 'absolute';
		this.set_pos(0, 0);
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

	/**
	 * move to next plant - very lazily
	 */
	move_next: function() {
		this.die();
		var that = this;
		setTimeout(function() {
			that.parent.add_snail();
		}, 1000);
	},

	/**
	 * when salt effects the snail - they don't really die!
	 * just not hungry anymore - despawn
	 */
	die: function() {
		clearInterval(this.nom_interval);
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
			/**
 			 * please forgive me for this polution
 			 */
			that.element.setAttribute('class', '');
			that.element.style.display = 'none';
		}, 1000);
	},

	/**
	 * set location relative to Game's plant list
	 */
	set_pos: function(x, y) {
		this.x = x; this.y = y;
		this.element.style.left =
			(this.parent.plant_list[
			this.y][this.x].x -35).toString() + 'px';
		this.element.style.top =
			(this.parent.plant_list[
			this.y][this.x].y -45).toString() + 'px';
	},

	/**
	 * obsolete
	 */
	get_pos: function() {
		return {x: this.x, y: this.y};
	},

};

