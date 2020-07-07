import React, { useRef, useState } from 'react';
import TagInput from './TagInput';

function Search({query, submit, options}) {
    const textField = useRef(null);
    const [innerQuery, setInnerQuery] = useState({...query});

    return (
        <div id="search-settings">
            <div>
                <h2>Title contains:</h2>
                <input type="text"
                    ref={textField}
                    value={innerQuery.title}
                    id="title-contains"
                    className="text-field"
                    name="title"
                    placeholder="The One With..."
                    onChange={() => setInnerQuery({...innerQuery, title: textField.current.value})}
                    onKeyDown={e => {
                        if (e.keyCode === 13) submit(innerQuery)}
                    }
                />
            </div>
            <div>
                <h2>Filter by characters</h2>
                <TagInput
                    data={innerQuery.onscreen}
                    handler={e => setInnerQuery({...innerQuery, onscreen: e})}
                    choices={options.characters}
                    states={options.states}
                    placeholder="gunther, janice..."
                    preventDuplicates
                />
            </div>

            <input type="submit"
                id="find-button"
                value="Find"
                onClick={() => submit(innerQuery)}
            />
        </div>
    );
}

export default Search;