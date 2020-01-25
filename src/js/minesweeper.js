import { fabric } from "fabric";

// let board = new fabric.Canvas("game", { selection: false });


// let rect = new fabric.Rect({
// 	top: 100,
// 	left: 100,
// 	width: 60,
// 	height: 70,
// 	fill: '#ff0000'
// });

// board.add(rect);

var canvas = new fabric.Canvas('game', { selection: false });

fabric.loadSVGFromURL('./svg/tile.svg', function (objects, options) {
	// var obj = fabric.util.groupSVGElements(objects, options);
	console.log(objects);
	// canvas.add(objects);
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
