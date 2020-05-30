import React, { useState } from 'react';
import SingleTag from './Tag';
import './TagInput.css';

function TagInput(props) {
    const {
        defaultItems = [],
        states = [""],
    } = props;

    const [tags, setTags] = useState(defaultItems);

    function handleChange(event) {
        let splitStr = event.target.value.split(" ");

        if (splitStr.length > 1) {
            const tagText = splitStr[0].trim();

            //check that tag is not empty string and does not already exist
            if (tagText !== "" && !tags.find(t => t.value === tagText)) {

                //create a new tag object
                const tag = {
                    value: tagText,
                    currentState: states[0]
                };

                setTags([...tags, tag]);
            }
            
            //reset textbox text
            event.target.value = "";
        }
    }

    //check for backspace
    function handleKeyPress(event) {
        //check that the keypress is a backspace and that the input is empty
        if (event.keyCode === 8 && event.target.value === "" && tags.length) {
            //delete last tag
            const [lastItem] = tags.slice(-1); 
            deleteTag(lastItem.value);
        }
    }

    function updateTag(val) {
        const copy = tags.slice();
        const i = copy.findIndex(t => t.value === val);

        if (i > -1) {
            //get index of current state
            const stateIndex = states.indexOf(copy[i].currentState);
            //get next state index with wraparound
            const nextIndex = (stateIndex + 1) % states.length;
            //update state
            copy[i].currentState = states[nextIndex];

            setTags(copy);
        }
    }

    function deleteTag(val) {
        //find tag in tags
        const i = tags.findIndex(t => t.value === val);

        //delete if found
        if (i > -1) {
            const copy = tags.slice();
            copy.splice(i, 1);
            setTags(copy);
        }
    }

    return (
        <div className="tag-input-container">
            <ul className="tags">
                {tags.map(i => <SingleTag data={i} key={i.value} deleteHandler={e => deleteTag(e)} updateHandler={e => updateTag(e)}/>)}
            </ul>
            <input type="text" className="tag-input" onChange={handleChange} onKeyDownCapture={handleKeyPress}/>
        </div>
    );
}

export default TagInput;