import { useEffect, useState, useRef } from "react"
import "../../cssFile/form.css"
import "../../cssFile/forgot-css/searchopt.css"



export default function searchOpt({ setSearchOpt, oldchoose, setPage }) {

    const myboxRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (myboxRef.current && !myboxRef.current.contains(e.target)) {
                setSearchOpt(false)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setSearchOpt]);

    function handleclck(letter) {
        setPage({ no:1, type: letter });
        setSearchOpt(false)
       
    
}
return <>
    <div className="ooppttyt">
        <div ref={myboxRef} className="outlayer">
            <h3>Search Your Account Using</h3>
            <p onClick={() => handleclck(1)} style={oldchoose === 1 ? { color: "green" } : {}}>Username</p>
            <p onClick={() => handleclck(2)} style={oldchoose === 2 ? { color: "green" } : {}}>Email id</p>
            <p onClick={() => handleclck(3)} style={oldchoose === 3 ? { color: "green" } : {}}>Mobile no.</p>

        </div>
    </div>
</>

}