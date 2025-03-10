import "../../cssFile/home-css/post-Bottom-btn.css";
import Like from "./svgBtn/like.jsx";
import Comment from "./svgBtn/comment.jsx";
import Share from "./svgBtn/share.jsx";
import Save from "./svgBtn/save.jsx";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export default function PostBottomBtn({ post, userid, type, setCmton, setResponseMessage, cmtcount }) {
    const navigate = useNavigate();
    const [like, setLike] = useState(post?.likes?.some((like) => like._id?.toString() === userid?.toString()) || false);
    const [likeCount, setLikeCount] = useState(post?.likes?.length);
    const [isave, setIsave] = useState(post?.isSave);
    const likeControllerRef = useRef(null);
    const saveControllerRef = useRef(null);



    const dolike = async () => {
        if (post) {
            setLike((prev) => !prev);
            setLikeCount((prev) => (like ? prev - 1 : prev + 1));
        }

        if (likeControllerRef.current) {
            likeControllerRef.current.abort();
        }
        likeControllerRef.current = new AbortController();

        try {
            const response = await axios.post(
                `http://localhost:8080/dolike/${post._id}`,
                {},
                {
                    withCredentials: true,
                    signal: likeControllerRef.current.signal,
                }
            );

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }

            if (response.data.color === 'red') {
                setResponseMessage(response.data);
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
    };

    const savekro = async () => {
        setIsave((prev) => !prev);

        if (saveControllerRef.current) {
            saveControllerRef.current.abort();
        }
        saveControllerRef.current = new AbortController();

        try {
            const response = await axios.post(
                `http://localhost:8080/savepost/${post._id}`,
                {},
                {
                    withCredentials: true,
                    signal: saveControllerRef.current.signal,
                }
            );

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }
            setResponseMessage(response.data);
        } catch (error) {
            if (!axios.isCancel(error)) {
                setResponseMessage({ message: error.message, color: "red" });
            }
        }
    };

    useEffect(() => {
        return () => {
            if (likeControllerRef.current) likeControllerRef.current.abort();
            if (saveControllerRef.current) saveControllerRef.current.abort();
        };
    }, []);

    return (
        <div className="postBottomBtn">
            <div className="onesection">
                <div onClick={dolike} className="like nn btn" title="Like">
                    <Like like={like} width="23" />
                </div>
                <p>{likeCount}</p>
                <label onClick={() => { if (type === "one") { setCmton(true); } }} htmlFor={type === "home" ? post._id : ""} className="comment btn" title="Comments">
                    <Comment width="23" />
                </label>
                <p>{cmtcount || 0}</p>
                <div className="share btn" title="Share">
                    <Share width="23" />
                </div>
            </div>
            <div className="twosection">
                <div onClick={savekro} className={isave ? "save btn " : "btn"} title={isave ? "Un-save" : "Save"}>
                    <Save width="23" />
                </div>
            </div>
        </div>
    );
}
