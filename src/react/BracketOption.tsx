import React from 'react';
import { OptedState } from '../model/optionItemState';

interface BracketOptionProps {
    id: string;
    value: string;
    optedState: OptedState;
    isEditable: boolean;
    onOptedStateChanged: (newState: OptedState) => void;
}

const BracketOption: React.FC<BracketOptionProps> = ({ id, value, optedState, isEditable, onOptedStateChanged }) => {
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

    return (
        <span data-id={id} data-opted-state={optedState}>
            <button id={id} onClick={handleClick} className={buttonClassName}>{value}</button>
        </span>
    );
};

export default BracketOption;