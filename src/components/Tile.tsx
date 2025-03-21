import "./Tile.css"
import TileModel from "../models/Tile.ts";
import FlagIcon from '../assets/flag.svg'
import Bomb from "../assets/bomb.svg";

type TileParams = {
	tile: TileModel,
	preview: boolean,
	row: number
}

export function Tile({tile, preview, row}: TileParams) {
	let classes = "tile";
	
	if(tile.flagged && tile.isBomb && tile.open) {
		classes += " defused";
	}
	else if(tile.isBomb && (tile.open || preview))
		classes += " bomb";
	else if(tile.open) {
		classes += " open n" + tile.bombsAround;
	}
	else if(tile.flagged) {
		classes += " flag";
	}
	else {
		classes += " closed";
	}
	
	if((tile.key + 1) % 2 == row % 2) {
		classes += " d";
	}
	
	return <div className={classes}>
		{!tile.isBomb && !tile.flagged && tile.open && 
			tile.bombsAround
		}
		{tile.flagged && 
			<img className={"flag-icon"} src={FlagIcon} alt={""}/>
		}
		{tile.isBomb && tile.open && !tile.flagged && !preview &&
			<img className={"flag-icon"} src={Bomb} alt={""}/>
		}
	</div>
}