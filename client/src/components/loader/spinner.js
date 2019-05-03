import React from 'react';
import {PacmanLoader} from 'react-spinners';

const spinner = () => {
    return (
        <div className='spinner'>
            <PacmanLoader color={`#85cef3`} margin={`0.5rem`} />
        </div>
    )
}

export default spinner;