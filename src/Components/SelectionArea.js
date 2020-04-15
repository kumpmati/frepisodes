import React from 'react';
import './SelectionArea.css';
import ToggleBox from './ToggleBox';

function SelectionArea({title, id, items, change}) {
        return (
        <div id={"selection-area-"+id} className="selection-area">
            <h2>{title}</h2>

            <div className="selection-area-items">
                {items.map(item => {
                    return (<ToggleBox
                        key={"checkbox-"+item.text}
                        props={item}
                        change={e => change(e)}
                    />)
                })}
            </div>
            
        </div>
    );
}

export default SelectionArea;