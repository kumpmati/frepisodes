import React, { useState } from 'react'
import {v4} from 'uuid';
import Episode from './Episode';

function Season({ season, episodes }) {
    const [hidden, setHidden] = useState(true);
    return (
        <div className="season">
            <h1 className={`season-title ${hidden ? "hidden" : ""}`} onClick={e => setHidden(!hidden)}>
                {hidden ? "+" : "–"} SEASON {season}
            </h1>
            <ul id={`s${season}-episodes`} className={`season-episodes-container ${hidden ? "hide" : ""}`}>
                {episodes.map(ep => <Episode key={v4()} episode={ep} season={season} />)}
            </ul>

        </div>
    );
}

export default Season;