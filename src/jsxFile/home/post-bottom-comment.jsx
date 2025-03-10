import "../../cssFile/home-css/post-bottom-comment.css";
import Cut from "./svgBtn/cut.jsx"
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import Reply from './reply.jsx'
import {timedo} from '../../../utils/timedo.js'
import { mention } from '../../../utils/mention.js'


export default function PostBottomComment({post,type, setResponseMessage, setCmton , setRes}) {

    const [rp, setRp] = useState("")
    const [rpid, setRpid] = useState(null);
    const controllerRef = useRef(null);
    const formattedDesc = `<b title="${post?.user.username} " >@${post?.user.username}</b> <br/>` + post?.description.replace(/\n/g, "<br/>");


    const setrp = function (e) {
        let tex;
        if (e.target.nodeName === "svg") {
            tex = e.target.parentElement
        } else if (e.target.nodeName === "path") {
            tex = e.target.parentElement.parentElement
        } else {
            tex = e.target
        }
        setRp("@" + tex.id + " ")
        setRpid(tex.parentElement.id)
    }
    const handlerp = function (e) {
        if(e.target.value===""){
            setRpid(null)
        }
        setRp(e.target.value)
    }


    async function docmt() {
        if (!rp.trim()) return;

        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();

        try {
            const response = await axios.post(
                `https://instaserver-knen.onrender.com/docmt/${post._id}`,
                { comment: rp, rpid: rpid },
                {
                    withCredentials: true,
                    signal: controllerRef.current.signal,
                }
            );

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
            }

            setResponseMessage(response.data);
            setRp("")
            setRes((pre) => ({ ...pre }))

        } catch (error) {
            if (axios.isCancel(error)) {
                console.warn("Request was aborted!", error);
            } else {
                setResponseMessage({
                    message: error.response?.data?.message || error.message,
                    color: "red",
                });
            }
        }
    }


    useEffect(() => {
        return () => {
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
        };
    }, []);




    return (

        <div className={type === "one"?"postBottomComment postBottomComment2":"postBottomComment"}>
            <div onClick={() => setCmton(false)}> <Cut width="25" /></div>
            <div className="allcmt">
                <p title={post?.description} dangerouslySetInnerHTML={{ __html: formattedDesc }}></p>
                <h3>Comments ( {post?.comment.length} )</h3>
                {post?.comment.slice().reverse().map((one, index) => (
                    <div key={index} className="actmsg">
                        <div className="msgin">
                            <div className="inin">
                                <a href={`/Profile/${one.info.username}`}><img src={one.info.pic.path} /></a>
                                <div id={one._id} className="forreply">
                                    <div className="onecmt">
                                        <a href={`/Profile/${one.info.username}`}>{one.info.username}<span>{timedo(one.datex)}</span></a>
                                        <p dangerouslySetInnerHTML={{ __html: mention(one.dtl) }} />
                                    </div>
                                    <label title={`reply to ${one.info.username}`} htmlFor="rp" id={one.info.username} onClick={setrp} className="dorepl">
                                        <svg viewBox="0 0 24 24" fill="none" width="20px" height="20px">
                                            <path d="M20 17V15.8C20 14.1198 20 13.2798 19.673 12.638C19.3854 12.0735 18.9265 11.6146 18.362 11.327C17.7202 11 16.8802 11 15.2 11H4M4 11L8 7M4 11L8 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </label>

                                </div>
                            </div>
                        </div>
                        <Reply setrp={setrp} comment={one} />
                    </div>
                ))}
                <div className="entertt">
                    <textarea id="rp" onChange={handlerp} value={rp} rows={3} className="enter" placeholder="Add comment . . ."></textarea>
                    {rp.length > 0 && <p onClick={docmt} className="poosty">post</p>}
                </div>
            </div>


        </div>
    );
}
