import {Dispatch, SetStateAction, useEffect, useMemo, useState} from "react";
import {defaultState, GameState} from "../context/GameState.ts";
import {GameService} from "../services/GameService.ts";

export const useGame = (game: GameState, setGame: Dispatch<SetStateAction<GameState>>) => {
	const [flagMode, setFlagMode] = useState<boolean>(false);
	const settings = game.settings;
	const isPreview = !game.settings.done;
	
	const switchFlagMode = () => {
		setFlagMode(flag => !flag);
	}
	
	const [timer, setTimer] = useState(1);
	
	const time = useMemo(() => {
		let zeroes = Math.max(2 - Math.floor(Math.log10(timer)), 0);
		return ("0").repeat(zeroes) + timer;
	}, [timer]);
	
	if(isPreview) {
		// useEffect(() => {
		// 	// Show random mine placement
		// 	const setRandomMines = () => setGame(prevGame => GameService.initializeGame(
		// 		{...prevGame, settings, tiles: GameService.generateField(settings)},
		// 		{
		// 			row: Math.floor(Math.random() * settings.rows),
		// 			col: Math.floor(Math.random() * settings.cols),
		// 			type: 'open'
		// 		}
		// 	));
		// 	setRandomMines();
		// 	const interval = setInterval(setRandomMines, 2000);
		// 	return () => clearInterval(interval);
		// }, [settings]);
		useEffect(() => {
			setGame(GameService.generatePreview(settings));
		}, [settings]);
	}
	else {
		useEffect(() => {
			// Timer
			const incrementTime = () => {
				if(game.state == 'Lose' || game.state == 'Win') {
					return;
				}
				else if(game.state == 'Started') {
					setTimer(time => time + 1);
				}
				else if(game.state == 'Initialized') {
					setTimer(1);
				}
			}
			const interval = setInterval(() => incrementTime(), 1000);
			// Switch flag mode on f key 
			const keyDown = (e: KeyboardEvent) => {
				if(e.key == "f") {
					switchFlagMode();
				}
			}
			window.addEventListener('keydown', keyDown);
			
			return () => {
				clearInterval(interval);
				window.removeEventListener('keydown', keyDown);
			};
		}, [game.state]);
	}
	
	
	return {isPreview, flagMode, switchFlagMode, time};
}