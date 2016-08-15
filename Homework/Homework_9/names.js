/*
	Grant Yuzon Hughes
	ID: 1233759
	CSE 154 AL
	HW #9 (names.js)
	5/30/2014

	This homework contains extra feature 4.
	This page contacts Webster's baby name page to
		display certain information to the user.
*/

(function() {
	"use strict";

	// Puts the baby names in the dropdown box and enables the box.
	function setnamelist() {
		var list = this.responseText;
		var lines = list.split("\n");
		var box = document.getElementById("allnames");
		for (var line = 0; line < lines.length; line++) {
			var name = document.createElement("option");
			name.innerHTML = lines[line];
			box.appendChild(name);
		}
		document.getElementById("nameslist").disabled = false;
		document.getElementById("loadingnames").style.display = "none";
	}

	// Sends in a request for meaning, ranking, and celebrity data.
	function searchclick() {
		var name = document.getElementById("nameslist").value;
		// Stops if the user doesn't pick a name.
		if (name.trim() != "") {
			if (document.getElementById("genderm").checked) {
				var gender = document.getElementById("genderm").value;
			} else {
				var gender = document.getElementById("genderf").value;
			}
			resetscreen();
			var loadfunctions = [meaning, rank, celeb];
			var requests = ["?type=meaning&name=" + name,
							"?type=rank&name=" + name + "&gender=" + gender,
							"?type=celebs&name=" + name + "&gender=" + gender];
			for (var i = 0; i < loadfunctions.length; i++) {
				var ajax = new XMLHttpRequest();
				ajax.onload = loadfunctions[i];
				ajax.open("GET", "https://webster.cs.washington.edu/cse154/babynames.php" + requests[i], true);
				ajax.send();
			}
			document.getElementById("resultsarea").style.display = "inline";
		}
	}

	// Shows loading features and erases old data.
	function resetscreen() {
		document.getElementById("meaning").innerHTML = "";
		document.getElementById("graph").innerHTML = "";
		document.getElementById("celebs").innerHTML = "";
		document.getElementById("errors").innerHTML = "";
		document.getElementById("loadingmeaning").style.display = "inline";
		document.getElementById("loadinggraph").style.display = "inline";
		document.getElementById("loadingcelebs").style.display = "inline";
		document.getElementById("norankdata").style.display = "none";
	}

	// Prints an error at the bottom of the page with the status code and text.
	function errorhandler(status, statusText) {
		document.getElementById("errors").innerHTML = 
			"Something when wrong with your request. Please refresh the page and try again. Error Code: " + 
			status + " " + statusText;
		document.getElementById("loadingmeaning").style.display = "none";
		document.getElementById("loadinggraph").style.display = "none";
		document.getElementById("loadingcelebs").style.display = "none";
	}

	// Inserts the meaning of the name into the page.
	// Inserts an error if there is no meaning.
	// Produces an error message if an error occurs.
	function meaning() {
		if (this.status != 200) {
			errorhandler(this.status, this.statusText);
		} else {
			var meaning = this.responseText;
			document.getElementById("meaning").innerHTML = meaning;
			document.getElementById("loadingmeaning").style.display = "none";
		}
	}

	// Creates a bar graph of the popularity of the baby name by decade.
	// Produces an error message if an error occurs.
	function rank() {
		if (this.status == 410) {
			rankerror();
		} else if (this.status != 200) {
			errorhandler(this.status, this.statusText);
		} else {
			var tree = this.responseXML;
			var pairs = tree.querySelectorAll("rank");
			var years = document.createElement("tr");
			document.getElementById("graph").appendChild(years);
			var ranks = document.createElement("tr");
			document.getElementById("graph").appendChild(ranks);
			for (var i = 0; i < pairs.length; i++) {
				var year = document.createElement("th");
				year.innerHTML = pairs[i].getAttribute("year");
				years.appendChild(year);
				var rank = document.createElement("td");
				var bar = document.createElement("div");
				bar.innerHTML = pairs[i].innerHTML;
				bar.className = "bar";
				bar.style.height = parseInt(((1000 - pairs[i].innerHTML) % 1000) / 4) + "px";
				if (pairs[i].innerHTML > 0 && pairs[i].innerHTML <= 10) {
					bar.className += " topten";
				}
				ranks.appendChild(rank);
				rank.appendChild(bar);
			}
		}
		document.getElementById("loadinggraph").style.display = "none";
	}

	// Shows an error if there is no rank data for the baby name.
	function rankerror() {
		document.getElementById("norankdata").style.display = "inline";
		document.getElementById("loadinggraph").style.display = "none";
	}

	// Adds the celebrities' name and filmcount.
	// Produces an error message if an error occurs.
	function celeb() {
		if (this.status != 200) {
			errorhandler(this.status, this.statusText);
		} else {
			var data = JSON.parse(this.responseText);
			for (var i = 0; i < data.actors.length; i++) {
				var actor = document.createElement("li");
				actor.innerHTML = data.actors[i].firstName + " " + data.actors[i].lastName +
								" (" + data.actors[i].filmCount + " films)";
				document.getElementById("celebs").appendChild(actor);
			}
			document.getElementById("loadingcelebs").style.display = "none";
		}
	}

	// Runs when the page loads. Finds the list of baby names.
	window.onload = function() {
		document.getElementById("search").onclick = searchclick;
		var ajaxlist = new XMLHttpRequest();
		ajaxlist.onload = setnamelist;
		ajaxlist.onerror = errorhandler;
		ajaxlist.open("GET", "https://webster.cs.washington.edu/cse154/babynames.php?type=list", true);
		ajaxlist.send();
	};

})();