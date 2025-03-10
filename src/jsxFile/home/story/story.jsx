import "../../../cssFile/home-css/story-css/story.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Onenoti({ setResponseMessage, user }) {
    const [data, setData] = useState({ mystory: null, allinonestory: null });
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                const response = await axios.post('https://instaserver-knen.onrender.com/fetchStory',
                    {}, { withCredentials: true, signal });

                if (response.data.message === 'Login required.') {
                    await navigate('/Login');
                    setResponseMessage(response.data);
                    return;
                }

                if (response.data.color === 'red') {
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
            console.log('Cleanup: Request aborted');
            controller.abort();
        };
    }, [navigate]);

    return (
        <div className="mystory">
            <div className="onebox1">
                <div className="outimgg">
                    <img
                        onClick={() => {
                            if (data?.mystory?.length > 0) {
                                const myStory = data.mystory[0];
                                const unseenStory = myStory.story.find(story => !story.isSeen);
                                navigate(`/story/${myStory.info._id}/${unseenStory ? unseenStory._id : myStory.story[0]._id}`, { state: [...data.mystory, ...data.allinonestory] });
                            }
                        }}
                        className={
                            data?.mystory?.length > 0
                                ? data.mystory[0].story.at(-1).isSeen
                                    ? "pers stortexist persseen"
                                    : "pers stortexist"
                                : "pers"
                        }
                        style={{ opacity: ".8" }}
                        src={user?.pic}
                    />

                    <img onClick={() => window.location.href = "/AddStory"} className="addme" src="/svg/add.svg" />
                </div>
                <p className="namer">Add story</p>
            </div>

            {data?.allinonestory?.length > 0 &&
                data.allinonestory.map((oneuserstory) => (
                    <div key={oneuserstory.info._id} className="onebox1">
                        <div className="outimgg">
                            <img className={oneuserstory.story.at(-1).isSeen ? "pers stortexist persseen" : "pers stortexist"}
                                onClick={() => {
                                    const unseenStory = oneuserstory.story.find(story => !story.isSeen);
                                    navigate(`/story/${oneuserstory.info._id}/${unseenStory ? unseenStory._id : oneuserstory.story[0]._id}`, { state: [...data.mystory, ...data.allinonestory] });
                                }}

                                src={oneuserstory.info.pic.path} alt="User" />

                        </div>
                        <p className="namer">{oneuserstory.info.username}</p>
                    </div>
                ))
            }
        </div>
    );
}
