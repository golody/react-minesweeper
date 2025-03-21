import {Dispatch, FormEvent, SetStateAction, useMemo} from "react";
import {GameService} from "../services/GameService.ts";
import {GameSettings} from "../context/GameSettings.ts";
import {getMaxMines, getMinMines} from "../constants/settingsConstatnts.ts";

export const useSettings = (settings: GameSettings, setSettings: Dispatch<SetStateAction<GameSettings>>) => {
	const setRows = (e: FormEvent<HTMLInputElement>) => {
		// Prevent from changing if game is started
		if(settings.done)
			return
		let rows = parseInt(e.currentTarget.value);
		setSettings(prev => ({...prev, rows: rows}));
	}
	
	const setCols = (e: FormEvent<HTMLInputElement>) => {
		if(settings.done)
			return
		let val = parseInt(e.currentTarget.value);
		setSettings(prev => ({...prev, cols: val}));
	}
	
	const setMines = (e: FormEvent<HTMLInputElement>) => {
		if(settings.done)
			return
		let val = parseInt(e.currentTarget.value);
		setSettings(prev => ({...prev, mines: val}));
	}
	
	const maxMines = useMemo(() =>
			getMaxMines(settings.rows, settings.cols),
		[settings.rows, settings.cols]
	);
	
	const minMines = useMemo(
		() => getMinMines(settings.rows, settings.cols),
		[settings.rows, settings.cols]
	);
	
	useMemo(() => {
		let m = settings.mines;
		m = m > maxMines ? maxMines : m;
		m = m < minMines ? minMines : m;
		
		setSettings(prev => ({...prev, mines: m}));
	}, [minMines, maxMines]);
	
	const mines = useMemo(
		() => GameService.getMinesCount(settings),
		[settings.mines]
	);
	
	return {mines, maxMines, minMines, setCols, setRows, setMines};
}