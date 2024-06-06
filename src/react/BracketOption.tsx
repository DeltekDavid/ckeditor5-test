import React from 'react';
import { OptedState } from '../model/optionItemState';
import { BracketContentElement, BracketContentElementType } from '../model/bracketContentElement';

interface BracketOptionProps {
    id: string;
    contentElements: BracketContentElement[];
    optedState: OptedState;
    isEditable: boolean;
    onOptedStateChanged: (newState: OptedState) => void;
}

const BracketOption: React.FC<BracketOptionProps> = ({ id, contentElements, optedState, isEditable, onOptedStateChanged }) => {
    const handleClick = React.useCallback(() => {
        const newState = optedState === OptedState.OptedIn ? OptedState.OptedOut : OptedState.OptedIn;
        onOptedStateChanged?.(newState);

    }, [onOptedStateChanged, optedState]);

    let buttonClassName = 'option-item ';
    if (optedState === OptedState.OptedIn) {
        buttonClassName += 'option-item-opted-in';
    } else if (optedState === OptedState.OptedOut) {
        buttonClassName += 'option-item-opted-out';
    } else {
        buttonClassName += 'option-item-undecided';
    }

    if (isEditable) {
        buttonClassName += ' option-item-editable';
    }

    const childElements = React.useMemo(() => contentElements.map(el => el.type === BracketContentElementType.Text ? <span>{el.text}</span> : <span><span className='imperial'>{el.imperialUnits}</span><span className='metric'> {el.metricUnits}</span></span>),
        [contentElements]);
    return (
        <span data-id={id} data-opted-state={optedState}>
            <button id={id} onClick={handleClick} className={buttonClassName}>
                {childElements}
            </button>
        </span>
    );
};

export default BracketOption;