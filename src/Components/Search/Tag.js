import React from 'react';
import './Tag.css';

function Tag(props) {
    const {index, state, value, handlers: {update, remove}} = props.data;

    return (
        <li className="tag">
            <p className="tag-state" onClick={() => update(index)}>
                {state}
            </p>
            <p className="tag-text" onClick={() => remove(index)}>
                {value}
            </p>
        </li>
    );
}

export default Tag;