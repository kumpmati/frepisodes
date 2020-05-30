import React from 'react';
import './Tag.css';

function SingleTag(props) {
    //destructure props
    const { deleteHandler, updateHandler, data: {currentState, value}} = props;

    const text = `${currentState} ${value}`;

    return (
        <li className={`tag`}>
            <p className="tag-text" onClick={e => updateHandler(value)}>{text}</p>
            <button className="tag-delete" onClick={e => deleteHandler(value)}>X</button>
        </li>
    );
}

export default SingleTag;