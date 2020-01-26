import { EventEmitter } from "events";
const pixi = require("pixi.js");

const SIZE = 20

export let emitter = new EventEmitter();
let dragging = false;
let pressed = false;
let activeTile = null;
let tiles = [];

let coveredTileTexture = pixi.Texture.from('./svg/tile.png');
let revealedTileTextures = [];
for (let i = 0; i <= 8; i++) {
	revealedTileTextures.push(pixi.Texture.from(`./svg/tile_${i}.png`));
}

//temp
let flaggedTileTexture = pixi.Texture.from('./svg/tile_flag.png');
let mineTileTexture = pixi.Texture.from('./svg/tile_bomb.png');

let pixiApp = new pixi.Application({
	width: window.innerWidth,
	height: window.innerHeight,
	resizeTo: window
});
document.body.appendChild(pixiApp.view);
let canvas = new pixi.Container();
pixiApp.stage.addChild(canvas);

function activate(r, c) {
	activeTile = tiles[r][c];
}

function deactivate(r, c) {
	if (c !== undefined && r !== undefined) {
		if (tiles[r][c] === activeTile) {
			revealTile(r, c);
		}
	}
	activeTile = null;
}

function revealTile(r, c) {
	tiles[r][c].texture = revealedTileTextures[0];
	emitter.emit("reveal", r, c);
}


function onTileDown(e) {
	console.log("mouse down");
	pressed = true;
	if (e.target) {
		activate(e.target.row, e.target.col);
	}
}

function onTileUp(e) {
	console.log("mouse up");
	if (!dragging) {
		if (e.target) {
			deactivate(e.target.row, e.target.col);
		} else {
			deactivate();
		}
	}
	pressed = dragging = false;
}

setTimeout(() => {
	for (let i = 0; i < 100; i++) {
		let row = [];
		for (let j = 0; j < 100; j++) {

			let sprite = new pixi.Sprite(coveredTileTexture);
			sprite.x = j*SIZE;
			sprite.y = i*SIZE;
			sprite.width = sprite.height = SIZE;

			sprite.row = i;
			sprite.col = j;

			sprite.interactive = true;

			sprite.on("click", (e) => {
				revealTile(e.target.row, e.target.col);
			});
			sprite.on("tap", (e) => {
				revealTile(e.target.row, e.target.col);
			});

			canvas.addChild(sprite);
			row.push(sprite);
		}
		tiles.push(row);
	}
}, 0);
