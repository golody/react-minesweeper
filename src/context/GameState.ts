import Tile from "../models/Tile.ts";
import {GameSettings} from "./GameSettings.ts";
import {GameService} from "../services/GameService.ts";

export interface GameState {
	tiles: Tile[][],
	settings: GameSettings,
	state: 'Preview' | 'Initialized' | 'Started' | 'Win' | 'Lose',
	flagsUsed: number,
	opened: number,
}

export const defaultState = (settings: GameSettings): GameState => {return {
	flagsUsed: 0,
	settings: settings,
	state: !settings.done ? 'Preview' : 'Initialized',
	tiles: GameService.generateField(settings),
	opened: 0
}};