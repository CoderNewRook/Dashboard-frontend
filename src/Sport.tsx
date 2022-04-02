import { useState } from "react";
import { ISportsData } from "./App";

const Sport = (props: {teamsBeaten: ISportsData, team: string, setTeam: React.Dispatch<React.SetStateAction<string>>, back: JSX.Element}) => {
    const [currentTeam, setCurrentTeam] = useState(props.team);

    const titleCase = (str: string) => {
        if(str === "") return "";
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }

    // const hasTeam = (key: string) => {
    //     const titleCaseKey = titleCase(key);
    //     const matchingKey = Object.keys(props.teamsBeaten).find(k => k === titleCaseKey);
    //     return matchingKey !== undefined;
    // }

    // const hasTeamLowerCase = (key: string) => {
    //     const keyLowerCase = key.toLowerCase();
    //     const matchingKey = Object.keys(props.teamsBeaten).find(k => k.toLowerCase() === keyLowerCase);
    //     return matchingKey !== undefined;
    // }

    const handleTeamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextCurrentTeam = titleCase(e.target.value);
        setCurrentTeam(nextCurrentTeam);
        if(props.teamsBeaten.hasOwnProperty(nextCurrentTeam)) {
        // if(hasTeam(nextCurrentTeam)) {
            props.setTeam(nextCurrentTeam);
        }
    }

    const teamsBeatenDisplay = () => {
        // if(props.team === "") {
        if(!props.teamsBeaten.hasOwnProperty(currentTeam)) {
        // if(!hasTeam(currentTeam)) {
            return "";
        }
        return props.teamsBeaten[props.team].map((team, i) => <div className="beatenTeam" key={`team${i}`}>{team}</div>);
    }

    // const teamsBeatenDisplay = props.teamsBeaten[props.team].map(team => <div>{team}</div>);

    return (
        <div className="module">
            <div className="sportModule">
                <h1 className="topLeftTitle">Champion's League Challenge</h1>
                <div className="sportContent">
                    <input type="text" className="inputTeam" onChange={handleTeamChange} placeholder="Input winning team" value={currentTeam}/>
                    {props.teamsBeaten.hasOwnProperty(currentTeam) ? <div className="teamsBeatenDescription">These teams you won against:</div> : ""}
                    <div className="teamsBeaten">
                        {teamsBeatenDisplay()}
                    </div>
                </div>
            </div>
            {/* <div className="back" onClick={props.back}>Back</div> */}
            {props.back}
        </div>
    );
};

export default Sport;
