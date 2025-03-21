import {GameService} from "../services/GameService.ts";
import ShovelIcon from '../assets/shovel.svg'
import FlagIcon from '../assets/flag.svg'
import Clock from '../assets/clock.svg'
import {Tile} from "./Tile.tsx";
import './Board.css'
import {useGame} from "../hooks/GameHooks.ts";
import {Dispatch, SetStateAction} from "react";
import {GameState} from "../context/GameState.ts";

type SettingsState = {
	game: GameState;
	setGame: Dispatch<SetStateAction<GameState>>;
};

export function Board({game, setGame}: SettingsState) {
	const {
		isPreview,
		flagMode,
		switchFlagMode,
		time
	} = useGame(game, setGame);
	
	function click(x: number, y: number, isFlag: boolean) {
		if(isPreview)
			return false;
		
		if(game.state == 'Initialized') {
			let init = GameService.initializeGame(game, {row: x, col: y, type: 'open'});
			setGame(GameService.makeMove(init, {row: x, col: y, type: 'open'}));
		}
		if(game.state == 'Started') {
			setGame(GameService.makeMove(game, {row: x, col: y, type: isFlag ? 'flag' : 'open'}));
		}
		
		return false;
	}
	
	return <div className="game">
		<div className={"info"}>
				<span>
					<img src={Clock} alt={""}/>
					<p> {time} </p>
				</span>
			<img className={"mode"}
				 src={flagMode ? FlagIcon : ShovelIcon} alt={""}
				 onClick={() => switchFlagMode()}
			/>
			<span>
					<p> {game.settings.mines - game.flagsUsed} / {game.settings.mines} </p>
					<img src={FlagIcon} alt={""}/>
				</span>
		</div>
		
		<div className={"board"}>
			{game.tiles.map((row, ri) =>
				<div className="board-row" key={"r" + ri}>
					{row.map((tile, ci) =>
						<div onClick={() => click(ri, ci, flagMode)}
							 onContextMenu={() => click(ri, ci, !flagMode)}
							 key={tile.key}>
							<Tile tile={tile} preview={isPreview} row={ri}></Tile>
						</div>
					)}
				</div>
			)}
		</div>
	</div>;
}