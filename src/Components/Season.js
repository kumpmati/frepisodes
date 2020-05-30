import React, { useState } from 'react'
import Episode from './Episode';

function Season({ season, episodes }) {
    const [hidden, setHidden] = useState(false);
    return (
        <div id={`s${season}`} className="season">

            <h1 className="season-title" onClick={e => {
                e.target.classList.toggle("hidden");
                setHidden(!hidden);
                document.getElementById(`s${season}-episodes`).classList.toggle("hide");
            }
            }>{hidden ? "+" : "–"} SEASON {season}</h1>

            <ul id={`s${season}-episodes`} className="season-episodes-container">
                {episodes.map(ep => <Episode key={ep.title} episode={ep} season={season} />)}
            </ul>

        </div>
    );
}

export default Season;