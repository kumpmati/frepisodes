import React, { useState } from 'react';
import Season from './Components/Season';
import Search from './Components/Search';
import Logo from './logo.png';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //search query object
  const [query, setQuery] = useState({
    title: "",
    onscreen: [],
    seasons: [1,2,3,4,5,6,7,8,9,10]
  });

  const searchOptions = {
    characters: ["Gunther", "Marcel", "Janice", "Paolo", "Jack", "Judy", "Fake Monica"],
    states: ["✓", "✕"]
  }

  async function updateQuery(data) {
    const newQuery = {...data, onscreen: parseCharacters(data.onscreen)};
    console.log(newQuery);
    setIsLoading(true);
    const epData = await fetchEpisodeData(newQuery);
    setData(epData);
    setIsLoading(false);

    setQuery(data);
  }

  return (
    <div className="App">
      <img id="page-logo" alt="logo" src={Logo}></img>
      
      <Search
        options={searchOptions}
        query={query}
        submit={d => updateQuery(d)}
      />

      <div id="search-results">
        {isLoading ? <p>Loading</p> : null}
        {!data.length ? null : data.map(({season, episodes}) => (
          <Season
            key={"S"+season}
            season={season}
            episodes={episodes}
          />
        ))}
      </div>
    </div>
  );
}

export default App;

async function fetchEpisodeData(params) {
  //parse url from query object
  const uri = process.env.REACT_APP_URL + "" + objToQueryStr(params);

  //create headers
  const headers = new Headers({
    "Authorization": `Bearer ${process.env.REACT_APP_TOKEN}`
  });
  //create request
  const apiRequest = new Request(uri,{
    headers: headers
  });

  const response = await fetch(apiRequest, {headers})
  return await response.json();
}


const parseCharacters = data => data.map(c => (c.state === "✕" ? "!" : "") + c.value.toLowerCase());
const joinStr = s => Array.isArray(s) ? s.join(";") : s;
const objToQueryStr = obj => "?" + Object.keys(obj).map(key => key + "=" + joinStr(obj[key])).join("&");