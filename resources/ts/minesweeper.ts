import { EventEmitter } from "events";
import { Viewport } from 'pixi-viewport';
import { interaction, Application, Sprite, Texture } from "pixi.js";

const SIZE = 20

interface IRevealedTiles {
	[key: string]: number
}

interface ITile {
	sprite: Sprite,
	col: number,
	row: number
}

/**
 * Event handler
 */
export let emitter = new EventEmitter();

let pixiApp: Application;
let canvas: Viewport;
let pressed: boolean = false;
let dragging: boolean = false;
let canInteract: boolean = true;
let tiles: ITile[][] = [];
let activeTile: ITile|null = null;
let revealedTiles: IRevealedTiles = {};
let flags = new Set();

let coveredTileTexture = Texture.from('./svg/tile.png');
let revealedTileTextures: Texture[] = [];
for (let i = 0; i <= 8; i++) {
	revealedTileTextures.push(Texture.from(`./svg/tile_${i}.png`));
}

let claimedTileTextures: Texture[] = [];
for (let i = 0; i < 4; i++) {
	claimedTileTextures.push(Texture.from(`./svg/tile_claim_${i}.png`));
}

let flaggedTileTexture = Texture.from('./svg/tile_flag.png');
let mineTileTexture = Texture.from('./svg/tile_bomb.png');

export function enableInteraction(enabled = true) {
	canInteract = enabled;
}

export function getFlags() {
	return flags;
}

export function init() {
	let w = $("#renderer").innerWidth();
	let h = $("#renderer").innerHeight();
	console.log(w, h);
	pixiApp = new Application({
		backgroundColor: 0xcccccc,
		resizeTo: $("#renderer")[0]
	});
	$("#renderer").append(pixiApp.view);
	canvas = new Viewport({
		screenWidth: w,
		screenHeight: h,
		worldWidth: 100 * SIZE,
		worldHeight: 100 * SIZE,
		interaction: pixiApp.renderer.plugins.interaction,
		disableOnContextMenu: true,
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

	generateTiles(100, 100);

	// When the screen resizes, fix the Pixi viewport
	$(window).on('resize', () => {
		canvas.screenWidth = $("#renderer").innerWidth();
		canvas.screenHeight = $("#renderer").innerHeight();
	});
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

function generateTiles(width: number, height: number) {
	for (let i = 0; i < height; i++) {
		let row: ITile[] = [];
		for (let j = 0; j < width; j++) {

			let sprite = new Sprite(coveredTileTexture);
			sprite.x = j * SIZE;
			sprite.y = i * SIZE;
			sprite.width = sprite.height = SIZE;
			sprite.interactive = true;

			let tile: ITile = {
				sprite,
				col: j,
				row: i
			};

			sprite.on('pointerdown', () => onMouseDown(tile));
			sprite.on('pointerup', (e: interaction.InteractionEvent) => {
				onMouseUp(tile, e.data.button)});

			canvas.addChild(sprite);
			row.push(tile);
		}
		tiles.push(row);
	}
}
