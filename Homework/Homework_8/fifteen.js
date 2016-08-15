/*
	Grant Yuzon Hughes
	ID: 1233759
	CSE 154 AL
	HW #8 (fifteen.js)
	5/28/2014

	This homework contains extra feature 5.
	This adds the tiles to the puzzle area and sets the game's properties and functions.
*/

(function() {
	"use strict";
	var missingrow = 3;
	var missingcol = 3;
	var GRIDDIM = 4;
	var DIMENSION = 100;

	// Checks if a square is movable. If it is, then it is given the "movable" class.
	function setmovable() {
		// Only selects squares touching that square.
		// (upX, upY, downX, downY, leftX, leftY, rightX, rightY)
		var nextto = [-DIMENSION, 0, DIMENSION, 0, 0, -DIMENSION, 0, DIMENSION];
		var squares = document.getElementsByClassName("square");
		for (var i = 0; i < squares.length; i++) {
			var square = squares[i];
			for (var index = 0; index < nextto.length; index += 2) {
				var nexttop = parseInt(square.style.top) + nextto[index];
				var nextleft = parseInt(square.style.left) + nextto[index + 1];
				// Checks if coordinates are valid and no square exists at that coordinate.
				if (nexttop >= 0 && nexttop < GRIDDIM * DIMENSION &&
					nextleft >= 0 && nextleft < GRIDDIM * DIMENSION &&
					document.getElementsByClassName(nexttop + "_" + nextleft).length == 0) {
					square.classList.add("movable");
				}
			}
		}
	}

	// Moves the piece to the open spot.
	// Sets and Unsets movable squares.
	function move() {
		if (this.classList.contains("movable")) {
			this.classList.remove(parseInt(this.style.top) + "_" + parseInt(this.style.left));
			var empty = emptylocation(parseInt(this.style.top), parseInt(this.style.left));
			var emptysplit = empty.split("_");
			this.style.top = emptysplit[0] + "px";
			this.style.left = emptysplit[1] + "px";
			this.classList.add(empty);
			resetmovable();
			setmovable();
		}
	}

	// Finds and returns the coordinates of the missing piece
	function emptylocation(top, left) {
		for (var row = 0; row < GRIDDIM; row++) {
			for (var col = 0; col < GRIDDIM; col++) {
				var element = document.getElementsByClassName((row * DIMENSION) + "_" + (col * DIMENSION));
				if (element.length != 1 && (col * DIMENSION != left || row * DIMENSION != top)) {
					return (row * DIMENSION) + "_" + (col * DIMENSION);
				}
			}
		}
	}

	// Removes each square's "movable" class.
	function resetmovable() {
		var allmovable = document.getElementsByClassName("square");
		for (var i = 0; i < allmovable.length; i++) {
			allmovable[i].classList.remove("movable");
		}
	}

	// Shuffles the pieces. Does 1000 moves.
	function shuffle() {
		for (var i = 0; i < 1000; i++) {
			var possible = document.getElementsByClassName("movable");
			var index = Math.floor(Math.random() * possible.length);
			possible[index].click();
		}
	}

	// Adds menu to select the background image.
	function addbackgroundchanger() {
		var title = document.createElement("h2");
		document.getElementById("controls").appendChild(title);
		title.innerHTML = "V Change the picture here! V";
		var menu = document.createElement("select");
		document.getElementById("controls").appendChild(menu);
		menu.id = "menu";
		menu.onchange = changebackground;
		var url = ["background0.jpg", "background1.jpg", "background2.jpg", "background3.gif"];
		var name = ["Dogepet", "Cobert", "Mario", "Dizzy Dogs"];
		for (var i = 0; i < name.length; i++) {
			var pic = document.createElement("option");
			document.getElementById("menu").appendChild(pic);
			pic.innerHTML = name[i];
			pic.value = "backgrounds/" + url[i];
		}
	}

	// Changes the background image of the puzzle.
	function changebackground() {
		var squares = document.getElementsByClassName("square");
		for (var i = 0; i < squares.length; i++) {
			squares[i].style.backgroundImage = "url(./" + document.getElementById("menu").value + ")";
		}
	}

	// Runs on load. Sets each square with its properties.
	window.onload = function() {
		for (var row = 0; row < GRIDDIM; row++) {
			for (var col = 0; col < GRIDDIM; col++) {
				// Makes sure the board has a missing piece at the bottom-right.
				if (row != missingrow || col != missingcol) {
					var square = document.createElement("div");
					document.getElementById("puzzlearea").appendChild(square);
					square.classList.add("square");
					// Used to see where the square currently is.
					square.classList.add((row * DIMENSION) + "_" + (col * DIMENSION));
					square.id = row + "_" + col; // Used for checking if the game is done.
					square.onclick = move;
					square.style.left = col * DIMENSION + "px";
					square.style.top = row * DIMENSION + "px";
					square.style.backgroundPosition = (col * -DIMENSION) + "px " + (row * -DIMENSION) + "px";
					square.innerHTML = (row * GRIDDIM) + col + 1;
				}
			}
		}
		setmovable();
		document.getElementById("shufflebutton").onclick = shuffle;
		addbackgroundchanger();
	};

})();
