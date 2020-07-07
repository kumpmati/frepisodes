import React, { useState, useLayoutEffect } from 'react';
import Season from './Components/Season';
import TagInput from './Components/TagInput';
import './App.css';
import Logo from './logo.png';

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState({
    title: "",
    onscreen: [],
    seasons: [1,2,3,4,5,6,7,8,9,10]
  });

  let [characterData, setCharacterData] = useState([]);
  const characters = ["Gunther", "Marcel", "Janice", "Paolo", "Jack", "Judy"];
  const states = ["✓", "✕"];

  async function updateData(params) {
    setIsLoading(true);
    const data = await getData(params);
    setIsLoading(false);
    return data;
  }

  //update query when character data is updated
  useLayoutEffect(() => {
    const newOnscreen = parseCharacters(characterData);
    setQuery({...query, onscreen: newOnscreen});
  }, [characterData]);

  return (
    <div className="App">
      <img id="page-logo" alt="logo" src={Logo}></img>
      
      <div id="search-settings">
        <div>
          <h1>Title contains:</h1>
          <br></br>
          <input type="text"
              id="title-contains"
              className="text-field"
              name="title"
              placeholder=""
              onKeyDown={async e => {
                if(e.keyCode === 13) {
                  const data = await updateData(query);
                  setData(data);
                  e.preventDefault();
                }
              }}
              onChange={e => setQuery({...query, title: e.target.value.toLowerCase()})}
          />
        </div>
        <div>
          <h1>On-screen characters</h1>
          <TagInput
              data={characterData}
              handler={e => setCharacterData(e)}
              choices={characters}
              states={states}
              placeholder="gunther, janice..."
              preventDuplicates
          />
        </div>
      </div>
        <input type="submit"
            id="find-button"
            value="Find"
            onClick={async () => setData(await updateData(query))}
        />

      <br></br>
      <div id="search-results">
        {isLoading ? <p>Loading</p> : null}
        {data.map(({season, episodes}) => <Season key={"S"+season} season={season} episodes={episodes}/>)}
      </div>
    </div>
  );
}

export default App;

/*
        <div>
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
        </div>

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
*/

function parseCharacters(data) {
  return data.map(c => (c.state === "✕" ? "!" : "") + c.value.toLowerCase());
}

async function getData(params) {
  //create headers
  const headers = new Headers({
    "Authorization": `Bearer ${process.env.REACT_APP_TOKEN}`
  });
  
  //parse url from query object
  const uri = process.env.REACT_APP_URL + "" + objToQueryStr(params);
  //create request
  const apiRequest = new Request(uri,{
    headers: headers
  });
  
  return await (await fetch(apiRequest, {headers})).json();
}

const joinStr = s => Array.isArray(s) ? s.join(";") : s;
const objToQueryStr = obj => "?" + Object.keys(obj).map(key => key + "=" + joinStr(obj[key])).join("&");