import "../../cssFile/home-css/post-Bottom.css";
import PostBottomBtn from "./post-bottom-btn.jsx";
import PostBottomLike from "./post-bottom-like.jsx";
import PostBottomDesc from "./post-bottom-desc.jsx";
import PostBottomComment from "./post-bottom-comment.jsx";
import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function PostBottom({ post, user, setResponseMessage, setRes }) {
    const [cmtcount, setCmtcount] = useState(post.comment.length)
    const navigate = useNavigate();
    const [cmt, setCmt] = useState("");
    const [cmton, setCmton] = useState(false);
    const [rows, setRows] = useState(1);
    const controllerRef = useRef(null);


    const handleCmt = (ev) => {
        setCmt(ev.target.value);

        const lineCount = ev.target.value.split('\n').length;
        if (lineCount < 1) {
            setRows(1);
        } else if (lineCount > 4) {
            setRows(4);
        } else {
            setRows(lineCount);
        }
    };


    async function docmt() {
        if (!cmt.trim()) return;

        if (controllerRef.current) {
            controllerRef.current.abort();
        }
        controllerRef.current = new AbortController();

        try {
            const response = await axios.post(
                `https://instaserver-knen.onrender.com/docmt/${post._id}`,
                { comment: cmt, rpid: null },
                {
                    withCredentials: true,
                    signal: controllerRef.current.signal,
                }
            );

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }
            if (response.data.color === "green") {
                setCmtcount((prev) => (prev + 1));
                setResponseMessage(response.data);
                setCmt("");
                setRows(1);
                setRes((pre) => ({ ...pre }))
            }

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
    useEffect(() => {
        if (cmton) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }


        return () => {
            document.body.style.overflow = "";
        };
    }, [cmton]);


    return (
        <div className="postBottom">
            <PostBottomBtn post={post} cmtcount={cmtcount} type="home" userid={user._id} setResponseMessage={setResponseMessage} />
            <PostBottomLike post={post} />
            <PostBottomDesc post={post} />
            {post.comment.length > 0 && (
                <p onClick={() => setCmton(true)} className="comment" title="See all comments">
                    View all {post.comment.length.toLocaleString("en-IN")} comments
                </p>
            )}
            <div className="cmtbox" title="Add comment">
                <textarea maxLength={150} id={post._id} style={cmt !== "" ? { opacity: "1", borderBottom: "1px solid grey" } : null} onChange={handleCmt} value={cmt} name="addCmt" className="addCmt" rows={rows} placeholder="Add new comment..." />
                {cmt !== "" && (<div className="postbtn" onClick={docmt}>    Post</div>)}
            </div>
            {cmton && <PostBottomComment setRes={setRes} setResponseMessage={setResponseMessage} setCmton={setCmton} post={post} />}
        </div>
    );
}



