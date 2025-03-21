export interface Move {
	type: 'flag' | 'open';
	row: number,
	col: number
}