import React, { useState, useEffect } from 'react';
import '../../cssFile/collect-css/loader.css';


export default function ColorfulLoader({ msg }) {
    const [timeoutMsg, setTimeoutMsg] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeoutMsg(true);
        }, 6000);

        return () => clearTimeout(timer); // Cleanup on unmount
    }, []);

    return (
        <div className="loader">
            <div className="anim">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
            </div>
            <p className="text">  {msg} </p>
           {timeoutMsg &&<b>Patience is key, we’re almost there!</b>}
        </div>
    );
}

