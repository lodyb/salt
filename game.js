+function(){
	console.log('ready');

	var game = document.getElementsByTagName('main')[0];
	var hero = document.createElement("div");
	hero.setAttribute("class","player");
	game.appendChild(hero);


}()

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

function ent_create(ent) {

}

function is_touching(ent) {

}

function move_to(ent, dx, dy) {

}