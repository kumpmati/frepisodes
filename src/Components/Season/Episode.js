import React from 'react';

function Episode({episode, season}) {
    return (
      <li className="episode">
        <h3 className="episode-title">{"S"+season+"E"+episode.episode+" - " + episode.title.toUpperCase()}</h3>
        <p>{new Date(episode.air_date).toDateString()}</p>
      </li>
    );
}

export default Episode;