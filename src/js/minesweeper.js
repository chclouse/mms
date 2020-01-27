import { EventEmitter } from "events";
import { Viewport } from 'pixi-viewport';

const pixi = require("pixi.js");

const SIZE = 20

export let emitter = new EventEmitter();
let canInteract = true;
let dragging = false;
let pressed = false;
let activeTile = null;
let tiles = [];
let revealedTiles = new Set();

let coveredTileTexture = pixi.Texture.from('./svg/tile.png');
let revealedTileTextures = [];
for (let i = 0; i <= 8; i++) {
	revealedTileTextures.push(pixi.Texture.from(`./svg/tile_${i}.png`));
}

let claimedTileTextures = [];
for (let i = 0; i < 4; i++) {
	claimedTileTextures.push(pixi.Texture.from(`./svg/tile_claim_${i}.png`));
}

//temp
let flaggedTileTexture = pixi.Texture.from('./svg/tile_flag.png');
let mineTileTexture = pixi.Texture.from('./svg/tile_bomb.png');

let pixiApp;
let canvas;

export function enableInteraction(enabled = true) {
	canInteract = enabled;
}

export function init() {
	let barHeight = $(".bar").outerHeight();
	console.log(barHeight);
	pixiApp = new pixi.Application({
		width: window.innerWidth,
		height: window.innerHeight - barHeight,
		// resizeTo: window
	});
	document.body.appendChild(pixiApp.view);
	canvas = new Viewport({
		screenWidth: window.innerWidth,
		screenHeight: window.innerHeight - barHeight,
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

function hashTile(r, c) {
	return `${r},${c}`;
}

function clickTile(r, c) {
	console.log("Can Interact:", canInteract);
	if (!revealedTiles.has(hashTile(r, c)) && canInteract) {
		revealTile(r, c);
		emitter.emit("reveal", r, c);
	}
}

export function revealTile(r, c, n = null) {
	revealedTiles.add(hashTile(r, c));
	if (n == -1) {
		tiles[r][c].texture = mineTileTexture;
	} else {
		tiles[r][c].texture = revealedTileTextures[n];
	}
}

export function claimTile(r, c, playerIndex) {
	revealedTiles.add(hashTile(r, c));
	tiles[r][c].texture = claimedTileTextures[playerIndex];
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

function flagTile(row, col) {
	tiles[row][col].flagged = true;
	tiles[row][col].texture = flaggedTileTexture;
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
