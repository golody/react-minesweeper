import {Dispatch, FormEvent, SetStateAction, useMemo, useState} from "react";
import {GameSettings} from "../context/GameSettings.ts";
import {GameService} from "../services/GameService.ts";
import './Settings.css'
import {Board} from "./Board.tsx";
import {useSettings} from "../hooks/SettingsHooks.ts";
import {maxHeight, maxWidth, minHeight, minWidth} from "../constants/settingsConstatnts.ts";

type SettingsState = {
	settings: GameSettings;
	setSettings: Dispatch<SetStateAction<GameSettings>>;
};

function Settings({settings, setSettings}: SettingsState) {
	let {
		mines,
		maxMines, 
		minMines, 
		setCols, 
		setRows, 
		setMines
	} = useSettings(settings, setSettings);
	
	return <section id="settings">
		<div className="settings-container">
			<h1>Settings</h1>
			<h3>Height</h3>
			<div className="parameter">
				<span className="min-value">{settings.rows}</span>
				<input type="range" className="slider"
					   min={minHeight} max={maxHeight}
					   value={settings.rows} onInput={setRows}/>
				{maxHeight}
			</div>
			<h3>Width</h3>
			<div className="parameter">
				<span className="min-value">{settings.cols}</span>
				<input type="range" className="slider"
					   min={minWidth} max={maxWidth} step={2}
					   value={settings.cols} onInput={setCols}/>
				{maxWidth}
			</div>
			<h3>Bombs</h3>
			<div className="parameter">
				<span className="min-value">{mines}</span>
				<input type="range" className="slider"
					   min={minMines} max={maxMines}
					   value={settings.mines} onInput={setMines}/>
				{maxMines}
			</div>
			<button className={"play"} onClick={() => setSettings(st => ({
				...st,
				done: !st.done
			}))}>{!settings.done ? "Play" : "Restart"}</button>
		</div>
	</section>;
}

export default Settings;