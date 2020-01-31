import { EventEmitter } from "events";
import { Viewport } from 'pixi-viewport';
import * as pixi from "pixi.js";

const SIZE = 20

interface IRevealedTiles {
	[key: string]: number
}

interface ITile {
	sprite: pixi.Sprite,
	col: number,
	row: number
}

export let emitter = new EventEmitter();
let pressed: boolean = false;
let dragging: boolean = false;
let canInteract: boolean = true;
let activeTile: ITile|null = null;
let tiles: ITile[][] = [];
let revealedTiles: IRevealedTiles = {};
let flags = new Set();

let coveredTileTexture = pixi.Texture.from('./svg/tile.png');
let revealedTileTextures: pixi.Texture[] = [];
for (let i = 0; i <= 8; i++) {
	revealedTileTextures.push(pixi.Texture.from(`./svg/tile_${i}.png`));
}

let claimedTileTextures: pixi.Texture[] = [];
for (let i = 0; i < 4; i++) {
	claimedTileTextures.push(pixi.Texture.from(`./svg/tile_claim_${i}.png`));
}

let flaggedTileTexture = pixi.Texture.from('./svg/tile_flag.png');
let mineTileTexture = pixi.Texture.from('./svg/tile_bomb.png');

let pixiApp: pixi.Application;
let canvas: Viewport;

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
		worldWidth: 100 * SIZE,
		worldHeight: 100 * SIZE,
		interaction: pixiApp.renderer.plugins.interaction,
		disableOnContextMenu: true
	});
	pixiApp.stage.addChild(canvas);

	canvas
		.drag({ "mouseButtons": "left" })
		.pinch()
		.wheel()
		.decelerate()
		.bounce();

	canvas.on("drag-start", () => {
		deactivate();
	});

	generateTiles();
}

function activate(tile: ITile) {
	activeTile = tile;
}

function deactivate(tile ?: ITile, click: number = 0) {
	if (tile != null && canInteract) {
		if (tile === activeTile) {
			if (click === 0) {
				clickTile(tile.row, tile.col);
			} else if (!(hashTile(tile.row, tile.col) in revealedTiles)) {
				if (!flags.has(hashTile(tile.row, tile.col))) {
					flagTile(tile.row, tile.col);
				} else {
					unflagTile(tile.row, tile.col);
				}
			}
		}
	}
	activeTile = null;
}

function hashTile(r: number, c: number) {
	return `${r},${c}`;
}

function clickTile(r: number, c: number, chord = true) {
	if (!flags.has(hashTile(r, c))) {
		if (!(hashTile(r, c) in revealedTiles)) {
			revealTile(r, c);
		}
		emitter.emit("reveal", r, c);
	}
}

export function revealTile(r: number, c: number, n: number = null) {
	revealedTiles[hashTile(r, c)] = n;
	if (n == -1) {
		tiles[r][c].sprite.texture = mineTileTexture;
	} else {
		tiles[r][c].sprite.texture = revealedTileTextures[n];
	}
}

export function claimTile(r: number, c: number, playerIndex: number) {
	revealedTiles[hashTile(r, c)] = -1;
	tiles[r][c].sprite.texture = claimedTileTextures[playerIndex];
}

function onMouseDown(tile?: ITile) {
	pressed = true;
	if (tile) {
		activate(tile);
	}
}

function onMouseUp(tile: ITile, button: number) {
	deactivate(tile, button);
	pressed = dragging = false;
}

function flagTile(row: number, col: number) {
	flags.add(hashTile(row, col));
	tiles[row][col].sprite.texture = flaggedTileTexture;
	emitter.emit("flag", row, col);
}

function unflagTile(row: number, col: number) {
	flags.delete(hashTile(row, col));
	tiles[row][col].sprite.texture = coveredTileTexture;
	emitter.emit("unflag", row, col);
}

function generateTiles() {
	for (let i = 0; i < 100; i++) {
		let row: ITile[] = [];
		for (let j = 0; j < 100; j++) {

			let sprite = new pixi.Sprite(coveredTileTexture);
			sprite.x = j * SIZE;
			sprite.y = i * SIZE;
			sprite.width = sprite.height = SIZE;

			let tile: ITile = {
				sprite,
				col: j,
				row: i
			};

			sprite.interactive = true;

			sprite.on('pointerdown', () => onMouseDown(tile));
			sprite.on('pointerup', (e: any) => onMouseUp(tile, <number>e.data.button));

			canvas.addChild(sprite);
			row.push(tile);
		}
		tiles.push(row);
	}
}
