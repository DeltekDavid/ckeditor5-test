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

    let buttonStyle = {};
    if (optedState === OptedState.OptedIn) {
        buttonStyle = { backgroundColor: 'green' };
    } else if (optedState === OptedState.OptedOut) {
        buttonStyle = { backgroundColor: 'white' };
    } else {
        buttonStyle = { backgroundColor: 'lightgray' };
    }

    return (
        <span data-id={id} data-opted-state={optedState}>
            <button id={id} onClick={handleClick} style={buttonStyle}>{value}</button>
        </span>
    );
};

export default BracketOption;