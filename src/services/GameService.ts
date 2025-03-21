import Tile from "../models/Tile.ts";
import {Move} from "../models/Move.ts";
import {GameSettings} from "../context/GameSettings.ts";
import {defaultState, GameState} from "../context/GameState.ts";
import {SinglyLinkedList} from "linked-list-typed";

const offsets = [
	[1, 1],
	[1, 0],
	[1, -1],
	[0, -1],
	[0, 1],
	[-1, 1],
	[-1, 0],
	[-1, -1],
];

class TileOpener {
	private opened = 0;
	constructor(private tiles: Tile[][]) {
		
	}
	
	public openTiles(x: number, y: number): number {
		if(x >= this.tiles.length || x < 0 || y >= this.tiles[x].length || y < 0 || this.tiles[x][y].open) {
			return 0;
		}
		
		this.tiles[x][y].open = true;
		this.opened++;
		
		if(this.tiles[x][y].bombsAround == 0) {
			this.openAround(x, y);
		} else {
			this.openZeroes(x, y)
		}
		return this.opened;
	}
	
	private openZeroes(x: number, y: number): void {
		if(this.isZero(x + 1, y - 1)) 
			this.openTiles(x + 1, y - 1);
		if(this.isZero(x + 1, y + 1)) this.openTiles(x + 1, y + 1);
		if(this.isZero(x + 1, y)) this.openTiles(x + 1, y);
		if(this.isZero(x, y + 1)) this.openTiles(x, y + 1);
		if(this.isZero(x, y - 1)) this.openTiles(x, y - 1);
		if(this.isZero(x - 1, y + 1)) this.openTiles(x - 1, y + 1);
		if(this.isZero(x - 1, y - 1)) this.openTiles(x - 1, y - 1);
		if(this.isZero(x - 1, y)) this.openTiles(x - 1, y);
	}
	
	private isZero(x: number, y: number): boolean {
		if(x >= this.tiles.length || x < 0 || y >= this.tiles[x].length || y < 0) {
			return false;
		}
		return !this.tiles[x][y].isBomb && this.tiles[x][y].bombsAround == 0;
	}
	
	private openAround(x: number, y: number): void {
		this.openTiles(x + 1, y - 1);
		this.openTiles(x + 1, y + 1);
		this.openTiles(x + 1, y);
		this.openTiles(x, y + 1);
		this.openTiles(x, y - 1);
		this.openTiles(x - 1, y + 1);
		this.openTiles(x - 1, y - 1);
		this.openTiles(x - 1, y);
	}
}

export class GameService {
	public static generatePreview(settings: GameSettings): GameState {
		let field = this.generateField(settings);
		
		for(let i = 0; i < settings.mines; i++) {
			let row = Math.floor(i / settings.cols);
			let col = i % settings.cols;
			field[row][col].isBomb = true;
		}
		
		return {...defaultState(settings), tiles: field, state: 'Preview'}
	}
	public static generateField(settings: GameSettings): Tile[][] {
		let tiles: Tile[][] = [];
		
		for(let i = 0; i < settings.rows; i++) {
			tiles.push([])
			for(let j = 0; j < settings.cols; j++)
				tiles[i].push({
					bombsAround: 0,
					flagged: false,
					isBomb: false,
					key: i * settings.cols + j,
					open: false
				});
		}
		return tiles;
	}
	
	public static initializeGame(gameState: GameState, move: Move): GameState {
		const gameSettings = gameState.settings;
		const tiles = [...gameState.tiles];
		
		this.plantMines(tiles, gameSettings, move);
		
		for(let i = 0; i < tiles.length; i++) {
			for(let j = 0; j < tiles[i].length; j++) {
				if(tiles[i][j].isBomb)
					continue;
				
				tiles[i][j].bombsAround = this.countBombsAround(tiles, i, j);
			}
		}
		
		return {...gameState, tiles: tiles, state: 'Started'};
	}
	
	private static plantMines(tiles: Tile[][], gameSettings: GameSettings, move: Move): void {
		let freePlaces: SinglyLinkedList<number> = new SinglyLinkedList<number>();
		
		// Every row shoud have at least 3 empty spaces in a row
		// and 0-2 Empty spaces around the first move
		
		// Hole around the first move
		let holeLeft = move.col - Math.ceil(Math.random() * 2);
		let holeRight = move.col + Math.ceil(Math.random() * 2);
		let holeUp = move.row - Math.ceil(Math.random() * 2);
		let holeDown = move.row + Math.ceil(Math.random() * 2);
		
		for(let i = 0; i < gameSettings.rows; i++){
			// Create hole in the row
			let rowHoleStart = Number.MAX_SAFE_INTEGER;
			let rowHoleEnd = Number.MIN_SAFE_INTEGER;
			
			// If the hole around the first move doesn't affect this row
			if(i < holeUp || i > holeDown) {
				let holeCenter = Math.floor(Math.random() * gameSettings.cols - 1);
				rowHoleStart = holeCenter - 1;
				rowHoleEnd = holeCenter + 1;
			}
			for(let j = 0; j < gameSettings.cols; j++) {
				// Row hole
				if(j > rowHoleStart && j < rowHoleEnd) {
					continue
				}
				// If not in hole around the first move
				if(i < holeUp || i > holeDown || j < holeLeft || j > holeRight) {
					// Mark as a free space
					freePlaces.push(gameSettings.cols * i + j);
				}
			}
		}
		
		for(let i = 0; i < this.getMinesCount(gameSettings); i++) {
			// Get random tile from free spaces
			let ind = Math.floor(Math.random() * freePlaces.length);
			let place = freePlaces.getNodeAt(ind).value;
			
			// Convert to matrics cords
			let row = Math.floor(place / gameSettings.cols);
			let col = place % gameSettings.cols;
			
			// Bomb shoud have max. 3 bombs around
			let around = this.countBombsAround(tiles, row, col);
			
			// If there is still some place to put bombs in
			let minesLeft = gameSettings.mines - i - 1;
			if(around > 3 && minesLeft < freePlaces.length) {
				// Delete the spot
				freePlaces.delete(place);
				// Try again
				
				i--;
				continue;
			}
			
			tiles[row][col].isBomb = true;
			
			// Space is not more free
			freePlaces.delete(place);
		}
	}
	
	public static makeMove(state: GameState, move: Move): GameState {
		const tiles = [...state.tiles];
		let flags = state.flagsUsed
		let gs = state.state;
		let currentTile = tiles[move.row][move.col];
		let op = state.opened;
		
		if(currentTile.flagged) {
			currentTile.flagged = false;
			flags--;
		} 
		else if(move.type == 'flag') {
			if(!currentTile.open && state.flagsUsed < this.getMinesCount(state.settings)) {
				flags++;
				currentTile.flagged = true;
			}
		} 
		else if(move.type == "open") {
			if(currentTile.isBomb) {
				gs = 'Lose';
			} 
			else {
				let opener = new TileOpener(tiles);
				op += opener.openTiles(move.row, move.col);
				console.log(op);
				gs = this.checkWin({...state, tiles: tiles, opened: op}) ? 'Win' : gs;
			}
		}
		let ng = {...state, tiles: tiles, state: gs, flagsUsed: flags, opened: op};
		
		if(gs == 'Lose' || gs == 'Win') {
			ng = this.endGame(ng, gs == 'Win');
		}
		
		return ng;
	}
	
	public static getMinesCount(gs: GameSettings): number {
		return gs.mines;
	}
	
	private static endGame(state: GameState, win: boolean): GameState {
		// Open all tiles
		let tiles = [...state.tiles];
		
		for(let i = 0; i < tiles.length; i++)
			for(let j = 0; j < tiles[i].length; j++) {
				tiles[i][j].open = true;
				if(win && tiles[i][j].isBomb) {
					tiles[i][j].flagged = true;
				}
			}
		
		return {...state, tiles: tiles};
	}
	
	private static countBombsAround(tiles: Tile[][], row: number, col: number): number {
		let r = 0;
		
		r += this.isBomb(tiles, row + 1, col + 1);
		r += this.isBomb(tiles, row + 1, col - 1);
		r += this.isBomb(tiles, row + 1, col);
		r += this.isBomb(tiles, row, col + 1);
		r += this.isBomb(tiles, row, col - 1);
		r += this.isBomb(tiles, row - 1, col + 1);
		r += this.isBomb(tiles, row - 1, col - 1);
		r += this.isBomb(tiles, row - 1, col);
		
		return r;
	}
	
	private static isBomb(tiles: Tile[][], x: number, y: number): 0 | 1 {
		if(x >= tiles.length || x < 0 || y >= tiles[x].length || y < 0)
			return 0;
		return tiles[x][y].isBomb ? 1 : 0;
	}
	
	private static checkWin(state: GameState): boolean {
		console.log(state)
		let s = state.settings;
		console.log(s.cols * s.rows - s.mines, state.opened)
		return state.opened == s.cols * s.rows - s.mines;
	}
}