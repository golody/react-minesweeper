import {useEffect, useMemo, useState} from 'react'
import './App.css'
import Settings from "./components/Settings.tsx";
import {defaultSettings, GameSettings} from "./context/GameSettings.ts";
import {Board} from "./components/Board.tsx";
import {defaultState, GameState} from "./context/GameState.ts";

function App() {
	const [settings, setSettings] = useState<GameSettings>(
		{...defaultSettings, done: false}
	);
	const [game, setGame] = useState<GameState>(defaultState(settings));
	
	useEffect(() => {
		if(!settings.done) 
			setGame(defaultState(settings))
	}, [settings]);
	
	useEffect(() => {
		setGame(defaultState(settings))
	}, [settings.done]);
	
	return (
		<>
			<div className={"main"}>
				<Settings setSettings={setSettings} settings={settings}></Settings>
				<Board game={game} setGame={setGame}></Board>
			</div>
		</>
	)
}

export default App
