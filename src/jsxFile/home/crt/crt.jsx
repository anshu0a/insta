import { useEffect, useRef, useState } from "react";
import "../../../cssFile/home-css/crt-css/crt.css";
import Crtpost from './crtpost'
export default function Crt({ setCrt, userpic,setResponseMessage }) {
    const [kholo, setSkolo] = useState(false)
    const crtRef = useRef(null);

    useEffect(() => {

        const handleClickOutside = (e) => {
            const crtbtn = document.querySelector('.Create');
            if (!crtRef.current.contains(e.target)  && !crtbtn.contains(e.target) && !kholo) {
                    setCrt(false);
            }
        }; 

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [setCrt,kholo]);

    return (
        <>
            <div ref={crtRef} className="crtx">
                <div onClick={()=>window.location.href="/AddStory"}  className="whicOp">
                    <img width="20" style={{ borderRadius: "50%" }} src={userpic} />
                    <p>Add story</p>
                </div>
                <div onClick={()=>setSkolo(true)} className="whicOp">
                    <img width="20px" src='/svg/post.svg' />
                    <p> Create post</p>
                </div>
                <div className="whicOp">
                    <img width="20px" style={{ filter: "brightness(0)" }} src='/svg/Reels.svg' />
                    <p> Upload reel</p>
                </div>
            </div>
            {kholo && <Crtpost setCrt={setCrt} setResponseMessage={setResponseMessage} setSkolo={setSkolo}/>}
        </>
    );
}
