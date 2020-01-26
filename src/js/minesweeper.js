import { parallel } from "async";
import { fabric } from "fabric";

const SIZE = 20

// let board = new fabric.Canvas("game", { selection: false });


// let rect = new fabric.Rect({
// 	top: 100,
// 	left: 100,
// 	width: 60,
// 	height: 70,
// 	fill: '#ff0000'
// });

// board.add(rect);

fabric.Object.prototype.objectCaching = true;

let dragging = false;
let pressed = false;
let activeTile = null;
let tiles = [];

var canvas = new fabric.Canvas('game', {
	selection: false,
	width: window.innerWidth,
	height: window.innerHeight
});

canvas.on("mouse:down", (e) => {
	pressed = true;
	if (e.target) {
		activate(e.target.x, e.target.y);
	}
});

canvas.on("mouse:up", (e) => {
	if (!dragging) {
		if (e.target) {
			deactivate(e.target.x, e.target.y);
		} else {
			deactivate();
		}
	}
	pressed = dragging = false;
});

canvas.on("mouse:move", (e) => {
	if (pressed && !dragging && e.target != activeTile) {
		dragging = true;
		deactivate();
	}
});

function activate(x, y) {
	activeTile = tiles[y][x];
}

function deactivate(x, y) {
	if (x !== undefined && y !== undefined) {
		if (tiles[y][x] === activeTile) {
			revealTile(x, y);
		}
	}
	activeTile = null;
}

function revealTile(x, y) {
	let tile = tiles[y][x];
	tiles[y][x] = new fabric.Rect({
		selectable: false,
		left: tile.left,
		top: tile.top,
		width: tile.width,
		height: tile.height,
		fill: 'red'
	});
	canvas.remove(tile);
	canvas.add(tiles[y][x]);
}

function initTile(obj, x, y) {
	obj.scaleToHeight(SIZE);
	obj.selectable = false;
	obj.hoverCursor = "default";
	obj.x = x;
	obj.y = y;
}

setTimeout(() => {
	fabric.Image.fromURL('./svg/tile.png', function (obj) {
		initTile(obj, 0, 0);
		for (let i = 0; i < 100; i++) {
			let row = [];
			for (let j = 0; j < 100; j++) {
				obj.clone(function (i, j) {
					return function (clone) {
						initTile(clone, j, i);
						clone.set({
							left: j*SIZE,
							top: i*SIZE
						});
						canvas.add(clone);
						row.push(clone);
					};
				}(i, j));
			}
			tiles.push(row);
		}
		canvas.add(obj);
	});
}, 0);

function cache() {
	fabric.Object.prototype.objectCaching = !fabric.Object.prototype.objectCaching;
	canvas.forEachObject(function (obj, i) {
		obj.set('dirty', true);
	});
}

$(window).resize(() => {
	canvas.setWidth(window.innerWidth);
	canvas.setHeight(window.innerHeight);
});

let createTile = () => {

}

// let create = (left) => {
// 	let rect = new fabric.Rect({
// 		top: 0,
// 		left,
// 		width: 60,
// 		height: 70,
// 		fill: '#ff0000'
// 	});
// 	rect.selectable = false;
// 	rect.hoverCursor = "default";
// 	return rect;
// };

// let rect1 = create(0);
// let rect2 = create(80);
// rect1.on('mousedown', () => {
// 	console.log("Clicked 1");
// });
// rect2.on('mousedown', () => {
// 	console.log("Clicked 2");
// });
// canvas.add(rect1);
// canvas.add(rect2);
