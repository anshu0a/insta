import '../../../cssFile/profile-css/follow-css/follow.css';
import React, { useRef, useEffect, useState } from 'react';


export default function Options({ setOnopt, setResponseMessage }) {
    const crtRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const morbtn = document.querySelector('.moris');
            if (crtRef.current && !crtRef.current.contains(e.target) && !morbtn.contains(e.target)) {
                setOnopt(false)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setOnopt]);
    return (
        <>
            <div  ref={crtRef} className='optuions'>
                hello
            </div>
        </>
    );
}

