export default interface Tile {
	key: number
	isBomb: boolean,
	bombsAround: number,
	open: boolean,
	flagged: boolean
}