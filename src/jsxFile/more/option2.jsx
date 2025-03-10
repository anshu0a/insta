import "../../cssFile/more-css/option1.css";
import "../../cssFile/more-css/option2.css";

 
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";

import Loader2 from "../collect/loader2.jsx";
import AskSave from "./asksave.jsx"
import AskLink from "./asklink.jsx"
import Askrelation from "./askrelation.jsx"


export default function Option2({ setResponseMessage, msg, setOpton2, user }) {
    const [lod2, setLod2] = useState(false);
    const [tab, setTab] = useState(1)
    useEffect(() => {
        document.body.style.overflow = "hidden";
        if (window.innerWidth > 500) {
            document.body.style.paddingRight = "7px";
        }


        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, []);


    const clckback = function () {
        if (msg === "Attach Link" && (tab === 2 || tab === 3)) {
            setTab(1)
        } else {

            setOpton2({ msg: "", open: false });
        }
    }

    return (
        <div className="option2">
            {lod2 && <Loader2 />}
            <div className="toput">
                <svg
                    className="bbu" onClick={clckback} viewBox="0 0 32 32" >
                    <path d="M22,29.73a1,1,0,0,1-.71-.29L9.93,18.12a3,3,0,0,1,0-4.24L21.24,2.56A1,1,0,1,1,22.66,4L11.34,15.29a1,1,0,0,0,0,1.42L22.66,28a1,1,0,0,1,0,1.42A1,1,0,0,1,22,29.73Z"></path>
                </svg>
                <p>{msg}</p>
            </div>
            <div className="mainprt">
                {msg === "Saved" ?
                    < AskSave setLod2={setLod2} user={user} setResponseMessage={setResponseMessage} />
                    : msg === "Attach Link" ?
                        <AskLink setLod2={setLod2} tab={tab} setTab={setTab} user={user} setResponseMessage={setResponseMessage} />
                        : msg === "Update relationship status" ?
                            <Askrelation setLod2={setLod2} setOpton2={setOpton2} user={user} setResponseMessage={setResponseMessage} />
                            : <></>
                }
            </div>
        </div>
    );
}
