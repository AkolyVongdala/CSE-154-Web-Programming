/*
	Grant Yuzon Hughes
	ID: 1233759
	CSE 154 AL
	HW #7 (ascii.js)
	5/21/2014

	This homework contains extra feature 2.
	All the functions used to change ascii.html.
		On load, buttons are assigned their functions.
*/

"use strict";

// To avoid using global variables.
(function() {
	var timer = null;
	var interval = 250;
	var frame;
	var art;

	// Starts asciimation.
	// Disables/enables certain buttons.
	function startani() {
		frame = 0;
		art = document.getElementById("mytextarea").innerHTML.split("=====\n");

		document.getElementById("start").disabled = true;
		document.getElementById("animation").disabled = true;
		document.getElementById("stop").disabled = false;

		timer = setInterval(nextani, interval);
	}

	// Changes the frame of the asciimation being displayed. Loops.
	function nextani() {
		document.getElementById("mytextarea").innerHTML = art[frame];
		frame++;
		if (frame == art.length) {
			frame = 0;
		}
	}

	// Stops animation and restores textarea and buttons.
	function stopani() {
		clearInterval(timer);
		timer = null;
		document.getElementById("start").disabled = false;
		document.getElementById("animation").disabled = false;
		document.getElementById("stop").disabled = true;
		anichange();
	}

	// Changes asciimation to be displayed.
	function anichange() {
		document.getElementById("mytextarea").innerHTML = ANIMATIONS[document.getElementById("animation").value];
	}

	// Changes the size of the asciimation.
	// If the custom size is selected, the user is prompted to type in a custom text size.
	function sizechange() {
		if (document.getElementById("size").value == "custom") {
			var customsize = prompt("Font size to use? (e.g. 10pt)");
			document.getElementById("mytextarea").style.fontSize = customsize;
		} else {
			document.getElementById("mytextarea").style.fontSize = document.getElementById("size").value;
		}
	}

	// Changes the speed of the asciimation.
	function speedchange() {
		var radios = document.getElementsByName("speed");
		for (var i = 0; i < radios.length; i++) {
			if (radios[i].checked) {
				interval = radios[i].value;
				if (timer) { // Changes speed while the asciimation is playing.
					clearInterval(timer);
					timer = null;
					timer = setInterval(nextani, interval);
				}
			}
		}
	}

	// Sets each id with its function.
	window.onload = function() {
		var mytextarea = document.getElementById("mytextarea");
		mytextarea.innerHTML = ANIMATIONS["Blank"];
		var start = document.getElementById("start");
		start.onclick = startani;
		var stop = document.getElementById("stop");
		stop.onclick = stopani;
		stop.disabled = true; // Stop button is initially disabled.
		var animation = document.getElementById("animation");
		animation.onchange = anichange;
		var size = document.getElementById("size");
		size.onchange = sizechange;
		var radios = document.getElementsByName("speed");
		for (var i = 0; i < radios.length; i++) { // Gives function to each radio button.
			radios[i].onchange = speedchange;
		}
	}

;})();