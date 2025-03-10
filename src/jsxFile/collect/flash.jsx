import { useEffect, useState, useRef } from 'react';
import "../../cssFile/collect-css/flash.css";

export default function Flash({ mymsg,color }) {
    const [text, setText] = useState("");
    const flashRef = useRef(null); 

    useEffect(() => {
        if (mymsg) {
            setText(mymsg);

            const fadeOutTimeout = setTimeout(() => {
                if (flashRef.current) {
                    flashRef.current.style.transition = ".5s";
                    flashRef.current.style.opacity = "0";
                }
            }, 3500);

            const clearTextTimeout = setTimeout(() => {
                setText("");
            }, 4100);
            return () => {
                clearTimeout(fadeOutTimeout);
                 clearTimeout(clearTextTimeout);
            };
        }
    }, [mymsg]);

    return (
        <>
            {text && (
                <div ref={flashRef} style={{color:color}} className='flash ffluto'>
                    {text}
                </div>
            )}
        </>
    );
}
