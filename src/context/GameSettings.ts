export interface GameSettings {
	rows: number,
	cols: number,
	mines: number,
	done: boolean
}

export const defaultSettings: GameSettings = {
	rows: 8,
	cols: 8,
	mines: 16,
	done: false
};