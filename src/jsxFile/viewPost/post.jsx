import { useEffect, useRef, useState } from "react";
import "../../cssFile/viewPost-css/post.css";
import axios from "axios";
import PostIcon from '../../jsxFile/home/post-bottom-btn'
import PostBottomComment from '../../jsxFile/home/post-bottom-comment'
import { useNavigate } from "react-router-dom";
import Threedot from "../home/threedot"


export default function post({ postid, userid, setShowpost, setResponseMessage , setRes }) {
    const navigate = useNavigate();
    const crtRef = useRef(null);
    const [post, setPost] = useState()
    const [cmton, setCmton] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const crtbtn = document.querySelector(".Notifications");
            if (crtRef.current && !crtRef.current.contains(e.target) && (!crtbtn?.contains(e.target))) {
                setShowpost({ seen: false, postid: null })
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowpost]);


    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const response = await axios.post(
                    `https://instaserver-knen.onrender.com/laocmt/${postid}`,
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
                    setShowpost({ seen: false, postid: null })
                    return;
                }
                setPost(response.data);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.warn("Fetch request canceled.");
                } else {
                    setResponseMessage({
                        message: "Something went wrong",
                        color: "red",
                    });
                    setShowpost({ seen: false, postid: null })
                }
            }
        };

        fetchData();

        return () => controller.abort();
    }, [postid]);
    return (
        <div className="showonexpost">
            {cmton ? <PostBottomComment setResponseMessage={setResponseMessage} type="one" setCmton={setCmton} post={post} /> :
                <div ref={crtRef} className="postm">
                    <div className="topty">
                        <div className="prt1">
                            <img src={post?.user?.pic?.path} />
                            <div className="aboutusmn">
                                <p>{post?.user.username}</p>
                                <p className="fname">{post?.user?.fname}</p>
                            </div>
                        </div>
                        <div className="prt2">
                            {post && <Threedot setResponseMessage={setResponseMessage} setRes={setRes} post={post} user={{ _id: userid }} />}
                        </div>
                    </div>
                    <img src={post?.postimg?.path}></img>
                    <div className="ccmxmtt">
                        {post && <PostIcon post={post} type="one" userid={userid} setCmton={setCmton} setResponseMessage={setResponseMessage} cmtcount={post?.comment?.length} />}
                    </div>
                </div>}
        </div>);
}
