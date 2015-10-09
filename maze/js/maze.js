var MAZE = {};
var stkX = [];
var stkY = [];

function init() {
	MAZE = {
		array: {
			html: "",
			nums: "",
			visited: ""
		},
		properties: {
			rows: "",
			cols: ""
		},
		output: "",
		delayAmount: "250",
		start: {
			x: "0",
			y: "0"
		},
		end: {
			x: "9",
			y: "9"
		}
	};

	return MAZE;
}

function reset() {
	MAZE.array.html = "";
	MAZE.array.nums = "";
	MAZE.array.visited = "";
	MAZE.properties.rows = "";
	MAZE.properties.cols = "";

	return MAZE;
}

//easily creates an mxn matrix
Array.matrix = function (m, n, initial) {
	"use strict";
	var a, i, j, mat = [];
	for (i = 0; i < m; i += 1) {
		a = [];
		for (j = 0; j < n; j += 1) {
			a[j] = initial;
		}
		mat[i] = a;
	}
	return mat;
};

//easily creates a row of size m
Array.dim = function (m, initial) {
	"use strict";
	var a = [],
		i;

	for (i = 0; i < m; i += 1) {
		a[i] = initial;
	}

	return a;
};

//create new integer array
function CreateIntArray(rows, cols, val) {
	"use strict";
	var arr = Array.matrix(rows, cols, val);
	return arr;
}

//create new array populated with html
function CreateHtmlArr(rows, cols) {
	"use strict";
	var i, j,
		arr = Array.matrix(rows, cols, "");

	for (i = 0; i < rows; i += 1) {
		for (j = 0; j < cols; j += 1) {
			arr[i][j] = "<td id=\"cell" + i + j + "\" title=\"unvisited\" class=\"off\"></td>";
		}
	}

	return arr;
}

//adds a border to the maze
function createHorizontalBorder(cols) {
	"use strict";

	var i,
		border = new Array.matrix(1, cols, "");

	for (i = 0; i < cols; i += 1) {
		border[i] = "<td id=\"cell\" title=\"visited\" class=\"border\"></td>";
	}

	return border;
}

//adds vertical borders to both sides of the maze
function createVerticalBorder(rows) {
	"use strict";

	var i, border;

	//add border to beginning of each row in maze array
	border = "<td id=\"cell\" title=\"visited\" class=\"border\"></td>";

	return border;
}

//prints the maze to the document
function printMaze(rows, cols) {
	"use strict";

	var i, j,
		mazeOutput = "<table>",
		mazeArr = MAZE.array.html;

	for (i = 0; i < Number(rows) + 2; i += 1) {
		mazeOutput += "<tr>";
		for (j = 0; j < Number(cols) + 2; j += 1) {
			mazeOutput += mazeArr[i][j];
		}
		mazeOutput += "</tr>";
	}

	mazeOutput += "</table>";
	MAZE.output = mazeOutput;

	document.getElementById("display").innerHTML = mazeOutput;
}

//add start and end point to maze
function addStartOrEnd(x, y, type) {
	"use strict";

	var curr;

	if (type === "start") {
		type = document.getElementById("cell" + x + y);
		type.className = "start";
		type.style.backgroundColor = "blue";
		type.setAttribute("title", "visited");
	}
	if (type === "end") {
		type = document.getElementById("cell" + x + y);
		type.className = "end";
		type.style.backgroundColor = "blue";
		type.setAttribute("title", "unvisited");
	}

	//update maze array with new start and end point
	curr = MAZE.array.html[x + 1][y + 1];
	curr.setAttribute("class", type.className);
	curr.setAttribute("title", type.title);
}

//changes the color of the current cell and updates MAZE html array
function changeColor(cell) {
	"use strict";

	var i, j, rows, cols, locationOfCell, curr;

	rows = MAZE.properties.rows;
	cols = MAZE.properties.cols;

	if (cell.className === "on") {
		cell.setAttribute("class", "off");
		cell.setAttribute("title", "unvisited");
		cell.style.backgroundColor = "darkgrey";
	} else if (cell.className === "off") {
		cell.setAttribute("class", "on");
		cell.style.backgroundColor = "red";
		cell.setAttribute("title", "visited");
	}

	locationOfCell = document.getElementById(cell.getAttribute("ID")).getAttribute("ID");
	//console.log(locationOfCell);

	for (i = 0; i <= rows; i += 1) {
		for (j = 0; j <= cols; j += 1) {
			curr = MAZE.array.html[i][j];
			if (curr.getAttribute("id") === locationOfCell) {
				curr = cell;
			}
			MAZE.array.html[i][j] = curr;
		}
	}
}

//converts html array to DOM for easier manipulation
function convertToDOM() {
	"use strict";
	var i, j, rows, cols, xmlString, parser, doc;

	rows = MAZE.properties.rows;
	cols = MAZE.properties.cols;

	for (i = 0; i < Number(rows) + 2; i += 1) {
		for (j = 0; j < Number(cols) + 2; j += 1) {
			xmlString = MAZE.array.html[i][j];
			parser = new DOMParser();
			doc = parser.parseFromString(xmlString, "text/xml");
			MAZE.array.html[i][j] = doc.firstChild;
		}
	}
}

//updates the visited array for DFS algorithm
function updateVisitedArray() {

	"use strict";
	var rows, cols, i, j;

	rows = MAZE.properties.rows;
	cols = MAZE.properties.cols;

	for (i = 0; i < Number(rows) + 2; i += 1) {
		for (j = 0; j < Number(cols) + 2; j += 1) {
			if (MAZE.array.html[i][j].getAttribute("title") === "visited") {
				MAZE.array.visited[i][j] = 1;
			}
		}
	}
}

function callback(i, j) {
	"use strict";
	return function () {
		dfs(i, j);
	};
}

function pushAndChangeCell(i, j) {
	stkX.push(i);
	stkY.push(j);
	MAZE.array.html[i][j].setAttribute("title", "visited");
	temp = document.getElementById("cell" + (i - 1) + (j - 1));
	temp.style.backgroundColor = "green";
	setTimeout(callback(i, j), MAZE.delayAmount);
}

function popAndChangeCell(i, j) {
	var tempj, temp, t;

	tempi = stkX.pop();
	tempj = stkY.pop();
	temp = document.getElementById("cell" + (tempi - 1) + (tempj - 1));
	temp.style.backgroundColor = "purple";
	var t = stkX.length;
	i = stkX[t - 1];
	j = stkY[t - 1];
	setTimeout(callback(i, j), MAZE.delayAmount);
}

//BUG -- maze does not traverse dead ends -- need to introduce stack
//maze traversal ingnores cell in last column
//maze 
//implement DFS to solve the maze
function dfs(i, j) {
	"use strict";
	var temp, tempi, tempj;

	if (MAZE.array.html[i][j].className === "end") {
		console.log("END FOUND");
		var p = document.createElement("p");
		p.className = "alert alert-success ";
		p.id = "prompt";
		var text = document.createTextNode("Solution found!");
		p.appendChild(text);
		document.getElementById("result").appendChild(p);
		return true; // reached end of maze
	}

	if (i > 0 && (MAZE.array.html[i - 1][j].getAttribute("title") === "unvisited")) { //north
		pushAndChangeCell(i - 1, j);
	} else if (MAZE.array.html[i][j + 1].getAttribute("title") === "unvisited") { //east
		pushAndChangeCell(i, j + 1);
	} else if (MAZE.array.html[i + 1][j].getAttribute("title") === "unvisited") { //south
		pushAndChangeCell(i + 1, j);
	} else if (j > 0 && (MAZE.array.html[i][j - 1].getAttribute("title") === "unvisited")) { //west
		pushAndChangeCell(i, j - 1);
	} else if (stkX.length > 1 && stkY.length > 1) { //must back track
		popAndChangeCell(i, j);
	} else if (stkX.length === 1) {
		i = stkX.pop();
		j = stkY.pop();
		temp = document.getElementById("cell" + (i - 1) + (j - 1));
		temp.style.backgroundColor = "purple";
		setTimeout(callback(i, j), MAZE.delayAmount);
	} else {
		temp = document.getElementById("cell" + MAZE.start.x + MAZE.start.y);
		temp.style.backgroundColor = "purple";
		console.log("NO SOLUTION");
		var p = document.createElement("p");
		p.className = "alert alert-danger ";
		p.id = "prompt";
		var text = document.createTextNode("There is no solution to this maze... :(");
		p.appendChild(text);
		document.getElementById("result").appendChild(p);
		return false;
	}
}

document.getElementById("create").addEventListener("click", function () {
	"use strict";

	document.getElementById("display").style.display = "block";

	MAZE = init();
	MAZE = reset();

	MAZE.properties.rows = document.getElementById("cols").value;
	MAZE.properties.cols = document.getElementById("rows").value;
	MAZE.delayAmount = document.getElementById("speed").value;

	var i,
		rows = MAZE.properties.rows,
		cols = MAZE.properties.cols,
		newNumsArray = new CreateIntArray(rows + 2, cols + 2, 0),
		newVisitedArray = new CreateIntArray(rows + 2, cols + 2, 0),
		newHtmlArray = new CreateHtmlArr(rows, cols),
		topBorder = createHorizontalBorder(cols),
		bottomBorder = createHorizontalBorder(cols),
		leftBorder = createVerticalBorder(rows),
		rightBorder = createVerticalBorder(rows);

	//console.log(rows);
	//console.log(cols);
	//console.log(newNumsArray);
	//console.log(newVisitedArray);
	//console.log(newHtmlArray);
	//console.log(topBorder);
	//console.log(bottomBorder);
	//console.log(leftBorder);
	//console.log(rightBorder);

	MAZE.array.nums = newNumsArray;
	MAZE.array.visited = newVisitedArray;
	MAZE.array.html = newHtmlArray;

	//console.log(MAZE.array.nums);
	//console.log(MAZE.array.visited);
	//console.log(MAZE.array.html);

	//add horizontal borders
	MAZE.array.html.unshift(topBorder);
	MAZE.array.html.push(bottomBorder);

	//console.log(MAZE.array.html);

	//add vertical borders
	for (i = 0; i <= Number(rows) + 1; i += 1) {
		MAZE.array.html[i].unshift(leftBorder);
		MAZE.array.html[i].push(rightBorder);
	}

	//console.log(MAZE.array.html);

	//print the maze to the page
	printMaze(rows, cols);

	convertToDOM();

	//add start and end points
	MAZE.start.x = 0;
	MAZE.start.y = 0;
	addStartOrEnd(MAZE.start.x, MAZE.start.y, "start");
	MAZE.end.x = MAZE.properties.rows - 1;
	MAZE.end.y = MAZE.properties.cols - 1;
	addStartOrEnd(MAZE.end.x, MAZE.end.y, "end");

	//show solve button
	document.getElementById("solve-container").style.display = "block";

});

document.getElementById("solve-btn").addEventListener('click', function () {
	"use strict";

	document.getElementById("solve-btn").disabled = true;
	document.getElementById("create").disabled = true;

	var start;

	updateVisitedArray();
	start = document.getElementById("cell" + MAZE.start.x + MAZE.start.y);
	start.style.backgroundColor = "green";

	dfs(1, 1);
});

document.addEventListener('click', function (e) {
	"use strict";
	e = e || window.event;
	var target = e.target || e.srcElement;

	if (target.tagName === "TD") {
		changeColor(target);
	}
}, false);