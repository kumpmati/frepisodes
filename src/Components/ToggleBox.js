import React, { useState, useEffect } from 'react';
import './ToggleBox.css';

function ToggleBox(props) {
    const {id, text, states, startValue } = props.props;
    const change = props.change;
    const [state, setState] = useState(startValue || states[0]);

    useEffect(() => {
        change({id, state});
    }, [state]);

    return (
        <div className={"custom-checkbox "+state} onClick={() => {
            setState(states[(states.indexOf(state) + 1) % states.length]);
        }}>
            <h1>{text}</h1>
        </div>
    );
}

export default ToggleBox;