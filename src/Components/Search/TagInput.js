import React, { useState, useRef, useLayoutEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Tag from './Tag';
import DropDown from './DropDown';
import './TagInput.css';

function TagInput(props) {
    //destructure defaults
    const {
        initialTags = [],
        states = [],
        handler,
        choices = [],
        maxItems = -1
    } = props;
    
    //states
    const [text, setText] = useState("");
    const [tags, setTags] = useState(initialTags);
    //matching choices for dropdown list
    const [matches, setMatches] = useState({items: [], selected: 0});
    const textInput = useRef(null);

    //update data in parent component when tag state changes
    useLayoutEffect(() => handler(tags), [tags]);

    //determine if component should allow more tags and show dropdown autocomplete
    const canAdd = maxItems === -1 || tags.length < maxItems;

    //removes tag from tags by index
    function remove(index) {
        //if index is -1 get last item of array
        let i = index === -1 ? tags.length - 1 : index;
        let copy = tags.slice();
        //remove item at index and update tags
        copy.splice(i, 1);
        setTags(copy);

    }

    //cycles state of tag by index
    function update(index) {
        let copy = tags.slice();
        let tag = copy[index];

        //switch tag to next state, wrapping back to first state if at the last
        let nextStateIndex = (states.indexOf(tag.state) + 1) % states.length;
        tag.state = states[nextStateIndex];

        copy[index] = tag;
        setTags(copy);
    }
    
    //adds tag with given text as value
    function add(s) {
        //reject if empty string of number of tags exceed maximum
        if(s === "" || !canAdd) return;

        let tagText = s;
        
        //if given choices, restrict string to those choices
        if (choices.length > 0) {
            //add selected item
            if (matches.items.length > 0) tagText = matches.items[matches.selected];
            //don't add new tag if it doesn't
            else return;
        }

        let copy = tags.slice();

        //create new tag
        let tag = {
            value: tagText,
            state: states[0]
        };

        setTags([...copy, tag]);
        setText("");
        setMatches({items: [], selected: 0});
    }

    //handles updating text field value and autocomplete dropdown
    const handleChange = e => {
        const t = e.target.value.trim();
        
        //update matching characters
        let newItems = !!t ? choices.filter(c => c.toLowerCase().startsWith(t.toLowerCase())) : [];
        if(props.preventDuplicates) {
            //if duplicates aren't allowed, filter out suggestions that are already present
            newItems = newItems.filter(c => !tags.find(t => t.value === c));
        }

        let newMatches = {
            items: newItems,
            selected: 0
        };
        setMatches(newMatches);
        setText(t);
    }

    //calls given action for every key press in the input field
    const handleKeyDown = e => {
        //get the action associated with the keycode
        const action = keyActions[e.keyCode] || keyActions[0] || null;
        //run action with current input text
        if(action) {
            if(action.preventDefault) e.preventDefault();
            if (action.func) action.func(text);
        }
    };

    //cycles which dropdown item is selected
    function cycle(n) {
        let newMatches = {...matches};
        newMatches.selected = (newMatches.selected + n) % newMatches.items.length;
        if (newMatches.selected < 0) newMatches.selected = newMatches.items.length - 1;
        setMatches(newMatches);
    }

    //define actions for different keys
    const keyActions = {
        //enter
        13: {
            func: s => add(s),
        },
        //spacebar
        32: {
            func: s => add(s),
        },
        //up arrow cycles dropdown
        38: {
            func: s => cycle(-1),
            preventDefault: true
        },
        //down arrow cycles dropdown
        40: {
            func: s => cycle(1),
            preventDefault: true
        }
    };

    //tag handlers
    const tagHandlers = {
        update: i => update(i),
        remove: i => remove(i)
    }

    //dropdown handlers
    const dropdownHandlers = {
        click: add,
        hover: i => setMatches({items: matches.items, selected: i})
    };

    return (
        <div className="tag-input">
            <div className="input-div">
                <input
                    className="text-field"
                    ref={textInput}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    type="text"
                    value={text}
                    placeholder={props.placeholder || null}
                />

                <DropDown
                    items={canAdd ? matches.items : []}
                    selectedIndex={matches.selected}
                    handlers={dropdownHandlers}
                />
            </div>
            <div className="tags">
                {tags.map((tag, index) => (
                    <Tag
                    key={uuidv4()}
                    data={{...tag, handlers: tagHandlers, index}}
                    />
                ))}
            </div>
            
        </div>
    );
}

export default TagInput;