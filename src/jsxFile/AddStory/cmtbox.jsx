
import "../../cssFile/AddStory-css/cmtbox.css";
import { useState, useEffect, useRef } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { timedo } from '../../../utils/timedo'


export default function cmtbox({ setResponseMessage, userid, fname, storyid, user, commentonstory }) {
    const navigate = useNavigate();
    const [data, setData] = useState([])

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const markStorySeen = async () => {
            try {
                const response = await axios.post('https://instaserver-knen.onrender.com/fetchstorycomment', { userid, storyid }, { withCredentials: true, signal });

                if (response.data.message === 'Login required.') {
                    await navigate('/Login');
                    setResponseMessage(response.data);
                    return;
                }

                if (response.data.color && response.data.color === 'red') {
                    setResponseMessage(response.data);
                    return;
                }
                setData(response.data.data)
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

        markStorySeen();


        return () => {
            console.log('Cleanup: Request aborted');
            controller.abort();
        };
    }, [storyid, userid]);

    return (<div className="cmtbox6">
        <div className="inbox">
            <h3>Comments ({data.length})</h3>
            <div className="allcmtbox">
                {data.length > 0 ?
                    data.map((one) => (
                        <div key={one.user._id} className="oneuser">
                            <div className="forpic">
                                <img src={one.user.pic.path}></img>
                            </div>
                            <div className="middle">
                                <p> <a href={"/profile/" + one.user.username} className="us">{one.user.username}</a> <span>{timedo(one.comment.datex)}</span></p>
                                <p className="cm">{one.comment?.msg}</p>
                            </div>
                            <div className="mor">
                                {one.user._id === user._id  && <img onClick={commentonstory} src="/svg/delete.svg" />}
                            </div>
                        </div>)) :
                    <p>Be the first to share your thoughts on  {fname}'s story</p>}
            </div>
            <p>Only last comment of one user will appear here.</p>
        </div>
    </div>)
}
