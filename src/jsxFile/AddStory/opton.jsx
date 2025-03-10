
import "../../cssFile/AddStory-css/opton.css";
import { useState, useEffect, useRef } from "react";
import axios from 'axios'
import Views from './views'
import Likes from './likes'
import { useNavigate } from "react-router-dom";
import Loader2 from "../collect/loader2.jsx"


export default function opton({ setResponseMessage, opt, setOpt, user, userid, storyid }) {
    const navigate = useNavigate();
    const [lod2, setLod2] = useState(false)



    const fetchData = async () => {
        try {
            setLod2(true);

            const response = await axios.post('http://localhost:8080/deletestry',
                { userid, storyid }, { withCredentials: true });

            if (response.data.message === 'Login required.') {
                setResponseMessage(response.data);
                navigate('/Login');
                return;
            }

            navigate(-1);
            setResponseMessage(response.data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.warn('Request aborted by the user.');
            } else {
                console.error('Fetch error:', error.message);
                setResponseMessage({
                    message: error.response?.data?.message || 'An error occurred',
                    color: error.response?.data?.color || 'red',
                });
            }
        } finally {
            setLod2(false);
        }
    };


    return (<div className="opton">
        {lod2 && <Loader2 />}
        {
            opt.page === 0 ?
                <div className="inopton">
                    <h3> Options</h3>
                    <div className="mydiv" onClick={() => setOpt(pre => ({ ...pre, page: 1 }))}>
                        <img src="/svg/eye.svg"></img>
                        <span>Views of story</span>
                    </div>
                    <div className="mydiv" onClick={() => setOpt(pre => ({ ...pre, page: 2 }))} >
                        <img style={{ filter: "brightness(.3" }} src="/svg/Notifications.svg"></img>
                        <span>All likes</span>
                    </div>
                    {userid === user._id &&
                        <div onClick={fetchData} className="mydiv" >
                            <img src="/svg/delete.svg"></img>
                            <span>Delete story</span>
                        </div >}
                    <div className="mydiv" >
                        <img src="/svg/edit2.svg"></img>
                        <span>Report a problem</span>
                    </div>
                </div>
                :
                opt.page === 1 ?
                    <Views userid={userid} storyid={storyid} opt={opt} setOpt={setOpt} setResponseMessage={setResponseMessage} />
                    : opt.page === 2 ?
                        <Likes userid={userid} storyid={storyid} opt={opt} setOpt={setOpt} setResponseMessage={setResponseMessage} />
                        :
                        <>
                            <div className="inopton">
                                <p>Options not avaliable</p>
                            </div>

                        </>
        }
    </div>)
}
