import React from 'react';
import { OptedState } from '../model/optionItemState';

interface BracketOptionProps {
    id: string;
    value: string;
    initialOptedState: OptedState;
    onOptedStateChanged: (newState: OptedState) => void;
}

const BracketOption: React.FC<BracketOptionProps> = ({ id, value, initialOptedState, onOptedStateChanged }) => {
    const [optedState, setOptedState] = React.useState<OptedState>(initialOptedState);
    const handleClick = React.useCallback(() => {
        const newState = optedState === OptedState.OptedIn ? OptedState.OptedOut : OptedState.OptedIn;
        setOptedState(newState);
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

    return (
        <span data-id={id} data-opted-state={optedState}>
            <button id={id} onClick={handleClick} className={buttonClassName}>{value}</button>
        </span>
    );
};

export default BracketOption;