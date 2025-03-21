export const maxWidth = 30;
export const maxHeight = 30;
export const minWidth = 6;
export const minHeight = 6;
export const getMaxMines = (w: number, h: number) => 
	Math.ceil((w * h) * 0.4)
export const getMinMines = (w: number, h: number) => 
	Math.ceil((w + h) / 2)