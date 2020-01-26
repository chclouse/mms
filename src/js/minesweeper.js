import { EventEmitter } from "events";
import { Viewport } from 'pixi-viewport';

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

let pixiApp;
let canvas;

export function init() {
	pixiApp = new pixi.Application({
		width: window.innerWidth,
		height: window.innerHeight,
		resizeTo: window
	});
	document.body.appendChild(pixiApp.view);
	canvas = new Viewport({
		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight,
		worldWidth: 100*SIZE,
		worldHeight: 100*SIZE,
		interaction: pixiApp.renderer.plugins.interaction
	});
	pixiApp.stage.addChild(canvas);

	canvas.drag().pinch().wheel().decelerate().bounce();

	canvas.on("drag-start", (s, w, vp) => {
		deactivate();
	});

	generateTiles();
}

function activate(r, c) {
	activeTile = tiles[r][c];
}

function deactivate(r, c) {
	if (c !== undefined && r !== undefined) {
		if (tiles[r][c] === activeTile) {
			clickTile(r, c);
		}
	}
	activeTile = null;
}

function clickTile(r, c) {
	revealTile(r, c);
	emitter.emit("reveal", r, c);
}

export function revealTile(r, c, n) {
	tiles[r][c].texture = revealedTileTextures[n];
}

function onMouseDown(e) {
	pressed = true;
	if (e.target) {
		activate(e.target.row, e.target.col);
	}
}

function onMouseUp(e) {
	deactivate(e.target.row, e.target.col);
	pressed = dragging = false;
}

function generateTiles() {
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

			sprite.on('pointerdown', onMouseDown);
			sprite.on('pointerup', onMouseUp);

			canvas.addChild(sprite);
			row.push(sprite);
		}
		tiles.push(row);
	}
}
