<template>
	<div class="viewport">
		<div id="renderer" ref="#renderer"></div>
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Application, Sprite, Texture, interaction } from "pixi.js";
import { Viewport } from "pixi-viewport";
import { EventEmitter } from "events";

/**
 * The size of a tile in pixels
 */
const TILE_SIZE = 20;

/**
 * The default cover tile texture
 */
const TEXTURE_TILE_COVORED = Texture.from('./svg/tile.png');

/**
 * Flagged tile texture
 */
const TEXTURE_TILE_FLAGGED = Texture.from('./svg/tile_flag.png');

/**
 * Mine texture
 */
const TEXTURE_TILE_MINE = Texture.from('./svg/tile_bomb.png');

/**
 * Revealed tile textures
 */
const TEXTURES_TILE_REVEALED: Texture[] = [];
for (let i = 0; i <= 8; i++) {
	TEXTURES_TILE_REVEALED.push(Texture.from(`./svg/tile_${i}.png`));
}

/**
 * Territory tile textures
 */
const TEXTURES_TILE_CLAIMED: Texture[] = [];
for (let i = 0; i <= 8; i++) {
	TEXTURES_TILE_CLAIMED.push(Texture.from(`./svg/tile_${i}.png`));
}

/**
 * Possible tile states
 */
enum TileState {
	Covered,
	Revealed,
	Claimed,
	Flagged,
	Mine,
	MineActive
}

/**
 * A struct to contain a tile's information
 */
interface ITile {
	sprite: Sprite,
	col   : number,
	row   : number,
	state : TileState
}

/**
 * Map revelaed tiles
 */
// interface IRevealedTiles {
// 	[tile: ITile]: number
// }

@Component
export default class extends Vue {

	private _activeTile?: ITile;
	private _width      : number = 100;
	private _height     : number = 100;
	private _tiles      : ITile[] = [];

	@Prop({ default: true }) canInteract: boolean;

	/**
	 * Initialize the Minesweeper board
	 */
	protected init() {
		this.pixiApp.stage.addChild(this.viewport);
		this.initEvents();
	}

	/**
	 * Setup the viewport and initialize events
	 */
	protected initEvents() {
		this.viewport
			.drag({ "mouseButtons": "left" })
			.pinch()
			.wheel()
			.decelerate()
			.bounce();
		this.viewport.on("drag-start", () => { this.onDrag() });
		$(window).resize(() => {
			this.viewport.resize(this.parent.innerWidth(), this.parent.innerHeight())
		});
	}

	/**
	 * Create a tile
	 */
	protected createTile(row: number, col: number) {
		let tile: ITile = {
			sprite: new Sprite(TEXTURE_TILE_COVORED),
			state: TileState.Covered,
			row, col
		};
		tile.sprite.x = col * TILE_SIZE;
		tile.sprite.y = row * TILE_SIZE;
		tile.sprite.width = tile.sprite.height = TILE_SIZE;
		tile.sprite.interactive = true;
		tile.sprite.on("pointerdown", (e: interaction.InteractionEvent) => {
			this.onMouseDown(tile, e.data.button) });
		tile.sprite.on("pointerup", (e: interaction.InteractionEvent) => {
			this.onMouseUp(tile, e.data.button) });
		this.viewport.addChild(tile.sprite);
		return tile;
	}

	// Vue Events ----------------------------------------------------------------------------------

	/**
	 * Invoked when the component has been mounted
	 */
	protected mounted() {
		this.init();
	}

	// Methods -------------------------------------------------------------------------------------

	/**
	 * Reveal the given tile
	 */
	public revealTile(row: number, col: number, numMines?: number) {
		let tile = this.tile(row, col);
		if (numMines == -1) {
			this.setTileState(tile, TileState.MineActive, TEXTURE_TILE_MINE);
		} else {
			this.setTileState(tile, TileState.Revealed, TEXTURES_TILE_REVEALED[numMines]);
		}
	}

	/**
	 * Claim the given tile
	 */
	public claimTile(row: number, col: number, playerIndex: number) {
		let tile = this.tile(row, col);
		this.setTileState(tile, TileState.Claimed, TEXTURES_TILE_CLAIMED[playerIndex]);
	}

	/**
	 * Flag the tile at the given position
	 */
	public flagTile(row: number, col: number) {
		let tile = this.tile(row, col);
		this.setTileState(tile, TileState.Flagged, TEXTURE_TILE_FLAGGED);
		this.emitter.emit("flag", row, col);
	}

	/**
	 * Unflag the tile at the given position
	 */
	public unflagTile(row: number, col: number) {
		this.emitter.emit("unflag", row, col);
	}

	/**
	 * Reset the board configuration
	 */
	public resetBoard(width?: number, height?: number) {
		this._width = width || this._width;
		this._height = height || this._height;
		for (let tile of this._tiles) {
			this.viewport.removeChild(tile.sprite);
		}
		this._tiles = [];
		for (let i = 0; i < this._height; i++) {
			for (let j = 0; j < this._width; j++) {
				this._tiles.push(this.createTile(i, j));
			}
		}
	}

	// User Events ---------------------------------------------------------------------------------

	/**
	 * Invoked when the user drags
	 */
	protected onDrag() {
		this.deactivate();
	}

	/**
	 * Invoked when the user presses a mouse button
	 */
	protected onMouseDown(tile: ITile, button: number) {
		if (tile) {
			this.activate(tile);
		}
	}

	/**
	 * Invoked when the user releases a mouse button
	 */
	protected onMouseUp(tile: ITile, button: number) {
		this.deactivate(tile, button);
	}

	// Utility Functions ---------------------------------------------------------------------------

	/**
	 * Get a tile from the given coordinates
	 */
	protected tile(row: number, col: number) {
		return this._tiles[this._height*row + col];
	}

	/**
	 * Activate a tile
	 */
	private activate(tile: ITile) {
		this._activeTile = tile;
	}

	/**
	 * Deactivate the tile
	 */
	private deactivate(tile?: ITile, button: number = 0) {
		if (tile != null && this.canInteract) {
			if (tile === this._activeTile) {
				this.clickTile(tile, button);
			}
		}
		this._activeTile = null;
	}

	/**
	 * Click the given tile
	 */
	private clickTile(tile: ITile, mouseButton: number = 0) {
		if (mouseButton === 0) {
			if (tile.state == TileState.Covered) {
				this.revealTile(tile.row, tile.col);
				this.emitter.emit("reveal", tile.row, tile.col);
			}
		} else {
			if (tile.state == TileState.Covered) {
				this.flagTile(tile.row, tile.col);
			} else if (tile.state == TileState.Flagged) {
				this.unflagTile(tile.row, tile.col);
			}
		}
	}

	/**
	 * Set the tile state
	 */
	private setTileState(tile: ITile, state: TileState, texture: Texture) {
		tile.sprite.texture = texture;
		tile.state = state;
	}

	// Computer Property Getters -------------------------------------------------------------------

	/**
	 * Get the event emitter
	 */
	public get emitter() {
		return new EventEmitter();
	}

	/**
	 * Get the HTML element that contains the canvas
	 */
	public get parent() {
		return $(this.$refs["renderer"]);
	}

	/**
	 * Get the Pixi application instance
	 */
	public get pixiApp() {
		return new Application({
			backgroundColor: 0xcccccc,
			resizeTo: <HTMLElement>this.parent[0]
		});
	}

	/**
	 * Get the Pixi viewport instance
	 */
	public get viewport() {
		return new Viewport({
			screenWidth: this.parent.innerWidth(),
			screenHeight: this.parent.innerHeight(),
			worldWidth: this._width * TILE_SIZE,
			worldHeight: this._height * TILE_SIZE,
			interaction: this.pixiApp.renderer.plugins.interaction,
			disableOnContextMenu: true,
		});
	}
}
</script>
