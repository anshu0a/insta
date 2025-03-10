
import "../../cssFile/more-css/option2.css";
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { today } from "../../../utils/today"
import Post from '../viewPost/post'


export default function save({ setResponseMessage, setLod2, user }) {
    const navigate = useNavigate();
    const [allSave, setAllSave] = useState({ post: [], audio: [] })
    const [showpost, setShowpost] = useState({ seen: false, postid: null })

    const ononepost = (id) => {
        setShowpost({ seen: true, postid: id });
    }


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchsaved = async () => {
            try {
                setLod2(true)
                const response = await axios.post(`http://localhost:8080/savedlao`,
                    {},
                    { withCredentials: true, signal }
                );
                setLod2(false)
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
                setLod2(false)
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

    return (
        <>
            <p className="notic">Save your favorite posts, and they'll show up here just for you.</p>
            <p className="notic">Only you can view your saved collection</p>
            {allSave.post.length > 0 ?
                <div className="moresave87">

                    {allSave.post.map((onepost) => (
                        onepost.post &&
                        <div key={onepost._id} onClick={() => ononepost(onepost.post._id)} className="onebox">
                            <img src={onepost.post.postimg.path} />
                            <p className="mydat">{today(onepost.datex)}</p>
                        </div>
                    ))}

                </div>

                : <div className="nosaver">
                    <img src="/svg/saved.svg"></img>
                    <b>No saved</b>
                </div>}
            {showpost.seen && <Post setShowpost={setShowpost} setResponseMessage={setResponseMessage} userid={user?._id} postid={showpost?.postid} />}
        </>
    );
}
