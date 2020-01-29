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
let revealedTiles = {};
let flags = new Set();

let coveredTileTexture = pixi.Texture.from('./svg/tile.png');
let revealedTileTextures = [];
for (let i = 0; i <= 8; i++) {
	revealedTileTextures.push(pixi.Texture.from(`./svg/tile_${i}.png`));
}

let claimedTileTextures = [];
for (let i = 0; i < 4; i++) {
	claimedTileTextures.push(pixi.Texture.from(`./svg/tile_claim_${i}.png`));
}

let flaggedTileTexture = pixi.Texture.from('./svg/tile_flag.png');
let mineTileTexture = pixi.Texture.from('./svg/tile_bomb.png');

let pixiApp;
let canvas;

export function enableInteraction(enabled = true) {
	canInteract = enabled;
}

export function getFlags() {
	return flags;
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
		interaction: pixiApp.renderer.plugins.interaction,
		disableOnContextMenu: true
	});
	pixiApp.stage.addChild(canvas);

	canvas
		.drag({"mouseButtons": "left"})
		.pinch()
		.wheel({
			percent: 0.1
		})
		.clampZoom({
			minWidth: 1*100,
			minHeight: 1*100,
			maxWidth: 30*100,
			maxHeight: 30*100
		})
		.decelerate()
		.bounce();

	canvas.on("drag-start", (s, w, vp) => {
		deactivate();
	});

	generateTiles();
}

function activate(r, c) {
	activeTile = tiles[r][c];
}

function deactivate(r, c, click=0) {
	if (c !== undefined && r !== undefined && canInteract) {
		if (tiles[r][c] === activeTile) {
			if (click === 0) {
				clickTile(r, c);
			} else if (!(hashTile(r, c) in revealedTiles)) {
				if (!flags.has(hashTile(r, c))) {
					flagTile(r, c);
				} else {
					unflagTile(r, c);
				}
			}
		}
	}
	activeTile = null;
}

function hashTile(r, c) {
	return `${r},${c}`;
}

function clickTile(r, c, chord=true) {
	if (!hashTile(r, c) in revealedTiles) {
		revealTile(r, c);
	}
	emitter.emit("reveal", r, c);
}

export function revealTile(r, c, n = null) {
	revealedTiles[hashTile(r, c)] = n;
	if (n == -1) {
		tiles[r][c].texture = mineTileTexture;
	} else {
		tiles[r][c].texture = revealedTileTextures[n];
	}
}

export function claimTile(r, c, playerIndex) {
	revealedTiles[hashTile(r, c)] = -1;
	tiles[r][c].texture = claimedTileTextures[playerIndex];
}

function onMouseDown(e) {
	pressed = true;
	if (e.target) {
		activate(e.target.row, e.target.col);
	}
}

function onMouseUp(e) {
	deactivate(e.target.row, e.target.col, e.data.button);
	pressed = dragging = false;
}

function flagTile(row, col) {
	flags.add(hashTile(row, col));
	tiles[row][col].texture = flaggedTileTexture;
	emitter.emit("flag", row, col);
}

function unflagTile(row, col) {
	flags.delete(hashTile(row, col));
	tiles[row][col].texture = coveredTileTexture;
	emitter.emit("unflag", row, col);
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
