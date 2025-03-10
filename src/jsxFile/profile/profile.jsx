import "../../cssFile/profile-css/profile.css"
import AllProfile from "../../jsxFile/profile/allProfile.jsx"


import Navbar from "../home/navbar.jsx"
import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import ContentLoader from 'react-content-loader'


export default function profile({ setResponseMessage,news,notimsg }) {
    const navigate = useNavigate();
    const { user } = useParams()
    const [res, setRes] = useState(1)
    const [data, setData] = useState({})


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                const response = await axios.post(`https://instaserver-knen.onrender.com/updateData/${user}`,
                    {},
                    { withCredentials: true, signal } 
                );
                if (response.data.message === 'Login required.') {

                    setResponseMessage(response.data);
                    await navigate('/Login');
                    return;
                }

                if (response.data.message === 'User not found') {
                    await navigate('/Home');
                    setResponseMessage(response.data);
                    return;
                }

                setData(response.data);

            } catch (error) {
                if (axios.isCancel(error)) {
                    console.warn('Request aborted by the user.');
                } else {
                    console.error('Fetch error:', error.message);
                    setResponseMessage({
                        message: error.response?.data?.message || 'An error occurred',
                        color: 'red',
                    });
                }
            }
        };

        fetchData();

        return () => {
            controller.abort();
        };
    }, [res]);



    const detail = {
        hilight: [{ img: "/user/user8.jpeg", name: "sunshine" }, { img: "/user/user9.jpeg", name: "party" }, { img: "/user/user5.jpeg", name: "memo" }, { img: "/user/user4.jpeg", name: "fav" }, { img: "/user/user3.jpeg", name: "filter" }, { img: "/user/user2.jpeg", name: "clg" }, { img: "/user/user6.jpeg", name: "heart" },],
        tagged: [{ img: "/img/pic1.jpg", user: "/user/user2.jpeg" }, { img: "/img/pic2.jpg", user: "/user/user5.jpeg" }, { img: "/img/pic7.jpg", user: "/user/user4.jpeg" }, { img: "/img/pic4.jpg", user: "/user/user2.jpeg" },],
    }


    return (<div className="profile">

        <Navbar news={news} notimsg={notimsg} userData={data?.user}  setResponseMessage={setResponseMessage}/>
        {data?.data && Array.isArray(data.data) && data.data[0]?.username ? <>
            <AllProfile setRes={setRes} detail={detail} setResponseMessage={setResponseMessage} data={data.data[0]} user={data.user} />
        </> :
            <div className="outld">
                <div className="inld">
                    <ContentLoader viewBox="0 0 260 130" >
                        <circle cx="50" cy="30" r="30" />
                        <rect x="10" y="70" rx="3" ry="3" width="40" height="10" />
                        <rect x="60" y="70" rx="3" ry="3" width="70" height="10" />
                        <rect x="140" y="70" rx="3" ry="3" width="20" height="10" />
                        <rect x="10" y="90" rx="3" ry="3" width="90" height="10" />
                        <rect x="110" y="90" rx="3" ry="3" width="70" height="10" />
                        <rect x="10" y="110" rx="3" ry="3" width="70" height="10" />
                        <rect x="90" y="110" rx="3" ry="3" width="60" height="10" />
                    </ContentLoader>
                    <ContentLoader viewBox="0 0 400 120" >
                        <circle cx="20" cy="22" r="8" />
                        <rect x="35" y="15" rx="5" ry="5" width="320" height="15" />
                        <circle cx="20" cy="52" r="8" />
                        <rect x="35" y="45" rx="5" ry="5" width="300" height="15" />
                        <circle cx="20" cy="82" r="8" />
                        <rect x="35" y="75" rx="5" ry="5" width="330" height="15" />
                        <circle cx="20" cy="112" r="8" />
                        <rect x="35" y="105" rx="5" ry="5" width="270" height="15" />
                    </ContentLoader>
                </div>
            </div>
        }
    </div>)
}