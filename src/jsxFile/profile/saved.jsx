import "../../cssFile/profile-css/saved.css"
import React, { useEffect, useState } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { timedo } from "../../../utils/timedo"
import Post from '../viewPost/post'

export default function saved({userid, setResponseMessage }) {
    const navigate = useNavigate();
    const [allSave, setAllSave] = useState({ post: [], audio: [] })
    const [saveon, setSaveon] = useState(false)
    const [showpost, setShowpost] = useState({ seen: false, postid: null })

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchsaved = async () => {
            try {
                const response = await axios.post(`https://instaserver-knen.onrender.com/savedlao`,
                    {},
                    { withCredentials: true, signal }
                );
                if (response.data.message === 'Login required.') {

                    setResponseMessage(response.data);
                    await navigate('/Login');
                    return;
                }
                if (response.data.color === 'red') {
                    setResponseMessage(response.data);
                    return;
                }
                if (response.data.length > 0) {
                    const post = Array.isArray(response.data) ? response.data.filter((one) => one.type === "post") : []
                    const audio = Array.isArray(response.data) ? response.data.filter((one) => one.type === "audio") : []
                    setAllSave({ post: post, audio: audio })
                }

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

        fetchsaved();

        return () => {
            controller.abort();
        };
    }, []);


    return (<div className="saved">
        <p>Only you can see what you have saved</p>
        {allSave.post.length > 0 || allSave.audio.length > 0 ?
            <div className="outsaved">
                {allSave.post.length > 0 &&
                    <div onClick={() => setSaveon(true)} className="saved1">
                        {allSave.post.slice(0, 4).map((str, ind) => (
                            <img key={ind} className="ones" width="100%" src={str?.post?.postimg?.path}></img>
                        ))}
                        <p>All post</p>
                        <b>{allSave.post.length - 4 > 0 ? (`+ ${allSave.post.length - 4} `) : ("")}</b>
                    </div>
                }
                {allSave.audio.length > 0 &&
                    <div className="saved1">
                        {allSave.audio.slice(0, 4).map((str, ind) => (
                            <img key={ind} className="ones" width="100%" src={str?.audio?.audioimg?.path}></img>
                        ))}
                        <p>All audio</p>
                        <b>{allSave.audio.length - 4 > 0 ? (`+ ${allSave.audio.length - 4} `) : ("")}</b>
                    </div>
                }
            </div> :
            <div className="nosaved">
                <img src="/svg/saved.svg"></img>
                <b>No saved</b>
                <p> When you saved somthing, they will appear on your profile.</p>

            </div>

        }
        {saveon &&
            <div className="outopensave">
                <div className="toph">
                    <p>All Post ({allSave.post.length})</p>
                    <svg onClick={() => setSaveon(false)} viewBox="0 0 24 24" >
                        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.71,12.29a1,1,0,0,1,0,1.42,1,1,0,0,1-1.42,0L12,13.42,9.71,15.71a1,1,0,0,1-1.42,0,1,1,0,0,1,0-1.42L10.58,12,8.29,9.71A1,1,0,0,1,9.71,8.29L12,10.58l2.29-2.29a1,1,0,0,1,1.42,1.42L13.42,12Z" />
                    </svg>
                </div>
                <div className="opensave">
                    {
                        allSave?.post.slice().reverse().map((one) =>
                            <div key={one._id} className="onebox">
                                <img onClick={()=>setShowpost({seen: true, postid: one.post._id})} src={one.post?.postimg?.path} />
                                <p className="timep">{"Saved " + timedo(one.datex) + " ago"}</p>
                            </div>
                        )
                    }
                </div>
            </div>
        }
        {showpost.seen && <Post setShowpost={setShowpost} setResponseMessage={setResponseMessage} userid={userid} postid={showpost?.postid} />}

    </div>)
}