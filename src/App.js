import React, { useState, useLayoutEffect } from 'react';
import Season from './Components/Season';
import SelectionArea from './Components/SelectionArea';
import TagInput from './Components/TagInput';
import './App.css';
import Logo from './logo.png';

import seasonCheckBoxes from './Data/seasonCheckBoxes';
import onscreenCheckBoxes from './Data/onscreenCheckBoxes';
function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState({
    title: "",
    onscreen: [],
    seasons: [1,2,3,4,5,6,7,8,9]
  });


  return (
    <div className="App">
      <img id="page-logo" src={Logo}></img>
      
      <div id="search-settings">

        <h2>Title contains:</h2>
        <br></br>
        <input type="text"
            id="title-contains"
            className="text-field"
            name="title"
            placeholder=""
            onKeyDown={async e => {
              if(e.keyCode === 13) {
                const data = await getData(query);
                setData(data);
                e.preventDefault();
              }
            }}
            onChange={e => setQuery({...query, title: e.target.value.toLowerCase()})}
        />
        <br></br>

        <SelectionArea
          title="Seasons"
          id="seasons"
          items={seasonCheckBoxes}
          change={({id, state}) => {
            const updated = updateSeasons({id, state, query});
            setQuery({
              ...query,
              seasons: updated.sort()
            });
        }}/>

        <br></br>
        <h1>On-screen characters</h1>
        <TagInput states={["include", "exclude"]}/>
        
      </div>

      <br></br>
      <input type="submit"
            id="find-button"
            value="Find"
            onClick={async e => setData(await getData(query))}
        />
      <div id="search-results">
        {data.map(({season, episodes}) => <Season key={"S"+season} season={season} episodes={episodes}/>)}
      </div>
    </div>
  );
}

export default App;

const joinStr = s => Array.isArray(s) ? s.join(";") : s;

const queryFromObj = obj => "?" + Object.keys(obj).map(key => key + "=" + joinStr(obj[key])).join("&");

const updateSeasons = ({id, state, query}) => {
  let seasons = [...query.seasons];

  if(state === "yes") {
    seasons.push(id);
  } else if(state === "no") {
    if(seasons.indexOf(id) > -1) {
      seasons.splice(seasons.indexOf(id), 1);
    }
  }
  return seasons;
};

const updateOnscreenCharacters = ({id, state, query}) => {
  let onscreen = [...query.onscreen];
            
  const i = onscreen.indexOf(id) > -1 ? onscreen.indexOf(id) : onscreen.indexOf(`!${id}`);

  switch(state) {
    case "either":
      if(i > -1) onscreen.splice(i, 1);
    break;

    case "no":
      if(i > -1) onscreen[i] = `!${id}`;
      else onscreen.push(`!${id}`);
      break;

    case "yes":
      if(i > -1) onscreen[i] = `${id}`;
      else onscreen.push(`${id}`);
      break;

    default:
      break;
  }
  return onscreen;
};

async function getData(params) {
  //create headers
  const headers = new Headers({
    "Authorization": `Bearer ${process.env.REACT_APP_TOKEN}`
  });

  const uri = process.env.REACT_APP_URL + "" + queryFromObj(params);
  //create request
  const apiRequest = new Request(uri,{
    headers: headers
  });

  const data = await fetch(apiRequest, {headers});

  return await data.json();
}