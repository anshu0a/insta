import "../../cssFile/message-css/msg.css";
import Allmsg from "./allmsg.jsx";
import Navbar from "../home/navbar.jsx";
import React, { useEffect, useState } from "react";



export default function Msg({ setResponseMessage ,notimsg, news }) {
    const [userdata, setUserdata] = useState(null);
    const [wind, setWind] = useState(window.document.body.clientWidth);




    useEffect(() => {
        const updateBodyWidth = () => {
            setWind(window.document.body.clientWidth);
        };


        window.addEventListener("resize", updateBodyWidth);


        return () => {
            window.removeEventListener("resize", updateBodyWidth);
        };
    }, []);

    const ret = (user) => {
        setUserdata(user);
    };

    return (
        <div className="msgyy">
            {wind > 500 && ( <Navbar setResponseMessage={setResponseMessage} notimsg={notimsg} news={news} userData={{username:userdata?.username , _id:userdata?._id ,pic:userdata?.pic?.path}}  /> )}
            <div className="allmsg">
                <Allmsg  news={news} ret={ret} setResponseMessage={setResponseMessage} />
            </div>
        </div>
    );
}
