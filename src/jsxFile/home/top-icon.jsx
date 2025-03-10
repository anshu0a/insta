import React, { useEffect, useState } from 'react';

import "../../cssFile/home-css/top-icon.css"
import One from "./one.jsx"
import axios from 'axios'
import { useNavigate } from 'react-router-dom';


export default function topIcon({userData, notimsg, setResponseMessage}) {
    const [notix ,setNotix] = useState(0)
    const navigate = useNavigate();

     useEffect(() => {
            if (notimsg !== undefined ){
                setNotix((pre) => pre+1);
    
            }
        }, [notimsg]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:8080/laoNoti/${userData?._id}`,
                    {},
                    { withCredentials: true, signal: controller.signal }
                );

                if (response.data.message === "Login required.") {
                    navigate("/Login");
                    setResponseMessage(response.data);
                    return;
                }

                if (response.data.color === "red") {
                    setResponseMessage(response.data);
                    return;
                }

                setNotix(response.data?.no);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.warn("Fetch request canceled.");
                } else {
                    setResponseMessage({
                        message: "Something went wrong",
                        color: "red",
                    });
                }
            }
        };

        if (userData?._id) fetchData();

        return () => controller.abort();
    }, [userData?._id]);

    return (<>
        <div className="topIcon">
        <One name="Search" src="/svg/Search.svg" />
            <One name="Notifications" setNotix={setNotix} notimsg={notimsg} userid={userData?._id} alert={notix > 0 ? "tru":"fal"} src="/svg/Notifications.svg" setResponseMessage={setResponseMessage}/>
            
            <One name="More" src="/svg/More.svg" />
        </div>
    </>)
}