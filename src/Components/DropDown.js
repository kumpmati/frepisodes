import React from 'react';
import {v4} from 'uuid';
import './DropDown.css';

function DropDown({items, selectedIndex: index, handlers}) {
    if (items.length === 0) return null;

    //destructure props
    const { hover, click } = handlers;

    //do callback only when switching elements
    function handleHover(i) {
        if(i !== index) hover(i);
    }

    const getClassName = i => `dropdown-item ${index === i ? "selected" : ""}`;
    return (
        <div className="dropdown">
            {items.map((item, i) => (
                <li className={getClassName(i)} key={v4()} onMouseOver={() => handleHover(i)} onClick={() => click(item)}>
                    {item}
                </li>
            ))}
        </div>
    );
}

export default DropDown;