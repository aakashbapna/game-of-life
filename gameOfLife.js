/*
    Script: Conway's Game of Life using Canvas and native JS
    Author: Abhinav Rastogi
    Date: Feb 22, 2013

    Sample Usage:

    var GoL = gameOfLife(10,50);
	GoL.init();

	var btnStart = document.getElementById("btnStart");
	btnStart.onclick = GoL.startAnimation;

	var btnPause = document.getElementById("btnPause");
	btnPause.onclick = GoL.stopAnimation;
*/

var gameOfLife = function(gridSize, interval) {
	var canvas, context, rows, cols, board = new Array(), ticker, changeInSystem;

	window.requestAnimFrame = (function(callback) { return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000/60); }; })();

	var init = function() {
		canvas = document.createElement("canvas");
		canvas.height = (window.innerHeight || html.clientHeight) - 20;
        canvas.width = window.innerWidth || html.clientWidth;
        var canvasStyle = canvas.style;
        body = document.getElementsByTagName('body')[0];
    	body.appendChild(canvas);
    	context = context = canvas.getContext('2d');

    	cols = Math.floor(canvas.width / gridSize);
		rows = Math.floor(canvas.height / gridSize);

    	for(var i=0; i<cols; i++) {
			var row = new Array();
			for(var j=0; j<rows; j++) {
				row.push(0);
			}
			board.push(row);
		}

    	createGrid();
		gameReady();
	};

	var gameReady = function() {
		canvas.onclick = function(e) {
			var x = Math.floor((e.pageX - this.offsetLeft)/gridSize);
			var y = Math.floor((e.pageY - this.offsetTop)/gridSize);

			if(board[x][y]==0)
				board[x][y] = 1;
			else
				board[x][y] = 0;
			updateCell(x,y);
		};
	};

	var createGrid = function () {
		context.lineWidth = 0.1;
		for(var i=0; i<cols; i++) {
			for(var j=0; j<rows; j++) {
				context.beginPath();
				context.rect(i*gridSize,j*gridSize,gridSize, gridSize);
				context.stroke();	
			    context.closePath();
			}
		}
	}; 

	var paintGrid = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		for(var i=0; i<cols; i++) {
			for(var j=0; j<rows; j++) {
				context.beginPath();
				context.rect(i*gridSize,j*gridSize,gridSize, gridSize);
				if(board[i][j]==1) {
					context.fillStyle = '#999';
						context.fill();
					}
				context.stroke();	
			    context.closePath();
			}
		}
	};

	var updateCell = function(i,j) {
		context.beginPath();
		context.rect(i*gridSize,j*gridSize,gridSize, gridSize);
		
		if(board[i][j]==3) {
			context.fillStyle = '#ddd';	
		}
		else if(board[i][j]==1) {
			context.fillStyle = '#999';
		}
		else {
			context.fillStyle = '#fff';
		}
		context.fill();	
		context.stroke();	
	    context.closePath();
	};

	var isAlive = function(x,y) {
		if(x<0) x=cols-1;
		if(y<0) y=rows-1;
		if(x>=cols) x=0;
		if(y>=rows) y=0;

		var val = board[x][y];
		if(val==0 || val==4) return false;
		else return true;
	};

	var step = function() {
		changeInSystem = false;
		var numOfAliveNeighbors;
		//counterHolder.value=counter;
		for(var i=0; i<board.length; i++) {
			for(var j=0; j<board[i].length; j++) {
				numOfAliveNeighbors = 0;

				if(isAlive(i-1,j-1)) numOfAliveNeighbors++;
				if(isAlive(i-1,j)) numOfAliveNeighbors++;
				if(isAlive(i-1,j+1)) numOfAliveNeighbors++; 
				if(isAlive(i,j-1)) numOfAliveNeighbors++; 
				if(isAlive(i,j+1)) numOfAliveNeighbors++; 
				if(isAlive(i+1,j-1)) numOfAliveNeighbors++; 
				if(isAlive(i+1,j)) numOfAliveNeighbors++;  
				if(isAlive(i+1,j+1)) numOfAliveNeighbors++;

				if(board[i][j]==1 || board[i][j]==4) {
					if(numOfAliveNeighbors<2) {
						board[i][j]=3; //under-population
						changeInSystem=true;
					}
					if(numOfAliveNeighbors>3) {
						board[i][j]=3; //over-population
						changeInSystem=true;
					}
				}
				else if(board[i][j]==0 || board[i][j]==4) {
					if(numOfAliveNeighbors==3) {
						board[i][j]=4; //reproduction
						changeInSystem=true;
					}
				}
			}
		}

		//paintGrid();

		for(var i=0; i<board.length; i++) {
			for(var j=0; j<board[i].length; j++) {
				if(board[i][j]==3) {board[i][j]=0; }
				if(board[i][j]==4) {board[i][j]=1; }
			}
		}

		paintGrid();

		if(!changeInSystem)
			stopAnimation();	
	};

	var startAnimation = function() {
		ticker = window.setInterval(step, interval);
		console.log("started");
	};

	var stopAnimation = function() {
		window.clearInterval(ticker);
	};

	var loadPattern = function() {
		var i = Math.floor(cols/2);
		var j = Math.floor(rows/2);

		board[i][j] = 1;
		board[i-1][j] = 1;
		board[i+1][j] = 1;
		board[i-1][j-1] = 1;
		board[i-1][j-2] = 1;
		board[i+1][j-1] = 1;
		board[i+1][j-2] = 1;
		paintGrid();
		window.setTimeout(startAnimation, 1000);
	};

	var clearBoard = function() {
		for(var i=0; i<board.length; i++) {
			for(var j=0; j<board[i].length; j++) {
				board[i][j]=0;
			}
		}
		paintGrid();
	};

	var getBoard = function () {
		return board;
	};

	var writeText = function(str) {
		if(/^[ a-z]+$/i.test(str)) {
			clearBoard();
			var cm = charmap();
			var x = Math.floor(cols/2) - Math.floor((str.length*6)/2);
			var y = Math.floor(rows/2) - 4;
			for(var i=0; i<str.length; i++) {
				var c = cm.getArrayFor(str.charAt(i));
				//console.log(c);
				for(var p=0; p<5; p++) {
					for(var q=0; q<7; q++) {
						board[x+p][y+q]=c[p][q];
					}
				}
				x+=6;
			}
			paintGrid();
		}
	};

	return ({
		"init": init,
		"startAnimation": startAnimation,
		"stopAnimation": stopAnimation,
		"loadPattern": loadPattern,
		"getBoard": getBoard,
		"clearBoard": clearBoard,
		"writeText": writeText
	});
};