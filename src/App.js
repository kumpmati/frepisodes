import React, { useState, useLayoutEffect } from 'react';
import Season from './Components/Season';
import SelectionArea from './Components/SelectionArea';
import './App.css';
import Logo from './logo.png';

const seasonCheckBoxes = [
  {text: "1",  id: 1,  states: ["yes", "no"]},
  {text: "2",  id: 2,  states: ["yes", "no"]},
  {text: "3",  id: 3,  states: ["yes", "no"]},
  {text: "4",  id: 4,  states: ["yes", "no"]},
  {text: "5",  id: 5,  states: ["yes", "no"]},
  {text: "6",  id: 6,  states: ["yes", "no"]},
  {text: "7",  id: 7,  states: ["yes", "no"]},
  {text: "8",  id: 8,  states: ["yes", "no"]},
  {text: "9",  id: 9,  states: ["yes", "no"]},
  {text: "10", id: 10, states: ["yes", "no"]}
];

const onscreenCheckBoxes = [
  {text: "Monica",  id: "monica",   states: ["either", "yes", "no"]},
  {text: "Rachel",  id: "rachel",   states: ["either", "yes", "no"]},
  {text: "Phoebe",  id: "phoebe",   states: ["either", "yes", "no"]},
  {text: "Joey",    id: "joey",     states: ["either", "yes", "no"]},
  {text: "Chandler",id: "chandler", states: ["either", "yes", "no"]},
  {text: "Ross",    id: "ross",     states: ["either", "yes", "no"]},
  {text: "Judy",    id: "judy",     states: ["either", "yes", "no"]},
  {text: "Jack",    id: "jack",     states: ["either", "yes", "no"]},
  {text: "Marcel",  id: "marcel",   states: ["either", "yes", "no"]},
  {text: "Paolo",   id: "paolo",    states: ["either", "yes", "no"]},
  {text: "Julie",   id: "julie",    states: ["either", "yes", "no"]},
];

function App() {
  const [data, setData] = useState([]);
  const [query, setQuery] = useState({
    title: "",
    onscreen: [],
    seasons: [1,2,3,4,5,6,7,8,9]
  });

  //fetch data
  useLayoutEffect(() => {
    (async () => {
      const data = await getData(query);
      setData(data);
    })();
  },[]);

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

        <SelectionArea
          title="On-screen characters"
          id="onscreen"
          items={onscreenCheckBoxes}
          change={({id, state}) => {
            const updated = updateOnscreenCharacters({id, state, query});
            setQuery({
              ...query,
              onscreen: updated.sort()
            });
        }}/>
        
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