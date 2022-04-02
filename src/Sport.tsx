import { useState } from "react";
import { ISportsData } from "./App";

const Sport = (props: {teamsBeaten: ISportsData, team: string, setTeam: React.Dispatch<React.SetStateAction<string>>, back: () => void}) => {
    const [currentTeam, setCurrentTeam] = useState(props.team);

    const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextCurrentTeam = e.target.value;
        setCurrentTeam(nextCurrentTeam);
        if(props.teamsBeaten.hasOwnProperty(nextCurrentTeam)) {
            props.setTeam(nextCurrentTeam);
        }
    }

    const teamsBeatenDisplay = props.teamsBeaten[props.team].map(team => <div>{team}</div>);

    return (
        <div className="module">
            <div className="sportModule">
                <h1 className="topLeftTitle">Champion's League Challenge</h1>
                <div className="sportContent">
                    <input type="text" className="inputTeam" placeholder="These teams you won against" value={currentTeam}/>
                    {props.team !== "" ? <div>These teams you won against</div> : ""}
                    <div className="teamsBeaten">
                        {teamsBeatenDisplay}
                    </div>
                </div>
            </div>
            <div className="back" onClick={props.back}>Back</div>
        </div>
    );
};

export default Sport;
