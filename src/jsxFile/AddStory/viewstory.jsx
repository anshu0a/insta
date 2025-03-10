import { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../../cssFile/AddStory-css/viewstory.css";
import Like from "../home/svgBtn/like";
import Share from "../home/svgBtn/share";
import Commentbox from "./cmtbox"
import Myotp from "./opton"
import Comment from "../home/svgBtn/comment";
import axios from "axios"

export default function ViewStory({ setResponseMessage, user }) {
    const navigate = useNavigate();
    const { userid, storyid } = useParams();
    const [hasSentRequest, setHasSentRequest] = useState(false);
    const location = useLocation();
    const [story, setStory] = useState(location.state || []);
    const userIndex = story.findIndex(item => item.info._id === userid);
    const storyIndex = userIndex !== -1 && Array.isArray(story[userIndex]?.story) ? story[userIndex].story.findIndex(story => story._id === storyid) : -1;

    const [inp, setInp] = useState({ msg: "", like: false, cmton: false });
    const [opt, setOpt] = useState({ on: false, page: 0 })
    const timeoutRef = useRef(null);
    const videoRef = useRef(null);
    const [progress, setProgress] = useState(0);
    const [animationType, setAnimationType] = useState("");
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(() => {
        return JSON.parse(localStorage.getItem("muteState") || "false");

    });


    useEffect(() => {
        if (userIndex !== -1 && storyIndex !== -1) {
            setInp((pre) => ({ ...pre, msg: "", like: story[userIndex].story[storyIndex].isLike }));
        }
    }, [storyid, userIndex, storyIndex]);


    useEffect(() => {
        localStorage.setItem("muteState", JSON.stringify(isMuted));
    }, [isMuted]);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;
        }
    }, [isMuted]);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;

            const handlePlay = () => setIsPaused(false);
            const handlePause = () => setIsPaused(true);

            video.addEventListener("play", handlePlay);
            video.addEventListener("pause", handlePause);

            return () => {
                video.removeEventListener("play", handlePlay);
                video.removeEventListener("pause", handlePause);
            };
        }
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            video.muted = isMuted;

            const playPromise = video.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPaused(false);
                    })
                    .catch(error => {
                        console.log("Autoplay blocked:", error);
                        setIsPaused(true);
                    });
            }
        }
    }, [story, userIndex, storyIndex, isMuted]);




    useEffect(() => {
        if (userIndex === -1 || storyIndex === -1) return;

        const currentStory = story[userIndex].story[storyIndex];

        if (currentStory.type === "photo") {
            let startTime = Date.now();
            let duration = 10000;

            const updateProgress = () => {
                if (isPaused) return;
                const elapsed = Date.now() - startTime;
                setProgress((elapsed / duration) * 100);
                if (elapsed >= duration) {
                    clearInterval(timeoutRef.current);
                    switchStory();
                }
            };

            timeoutRef.current = setInterval(updateProgress, 50);
        } else {
            if (videoRef.current) {
                const video = videoRef.current;
                video.muted = isMuted;

                const updateProgress = () => {
                    if (!isPaused) {
                        setProgress((video.currentTime / video.duration) * 100);
                    }
                };

                timeoutRef.current = setInterval(updateProgress, 50);

                video.onended = () => {
                    clearInterval(timeoutRef.current);
                    switchStory();
                };
            }
        }

        return () => {
            clearInterval(timeoutRef.current);
            setProgress(0);
        };
    }, [story, userIndex, storyIndex, isPaused]);


    const handleImageClick = () => {
        setIsPaused((prev) => !prev);
    };
    useEffect(() => {
        setIsPaused((inp.msg !== "" || inp.cmton || opt.on) ? true : (inp.msg === "" && isPaused && !inp.cmton) ? false : isPaused);
    }, [inp, opt]);



    const switchStory = () => {
        let nextUserIndex = userIndex;
        let nextStoryIndex = storyIndex + 1;

        let isSameUser = nextStoryIndex < story[userIndex]?.story.length;

        if (!isSameUser) {
            nextUserIndex += 1;
            nextStoryIndex = 0;
        }

        if (nextUserIndex < story.length) {
            const newAnimationType = !isSameUser ? "slide" : "flip";
            setAnimationType(newAnimationType);


            setTimeout(() => {
                navigate(
                    `/story/${story[nextUserIndex].info._id}/${story[nextUserIndex].story[nextStoryIndex]._id}`,
                    { state: story, replace: true }
                );
                setAnimationType("");
            }, 400);
        } else {
            window.history.back();
        }
    };




    useEffect(() => {
        if (!storyid || story[userIndex].story[storyIndex].isSeen) return;
    
        const controller = new AbortController();
        const signal = controller.signal;
    
        const debounceTimer = setTimeout(async () => {
            try {
                setHasSentRequest(true); 
    
                const response = await axios.post(
                    "http://localhost:8080/seenstory",
                    { userid, storyid },
                    { withCredentials: true, signal }
                );
    
                if (response.data.message === "Login required.") {
                    navigate("/Login");
                    return;
                }
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("Fetch error:", error.message);
                }
            }
        }, 500);
    
        return () => {
            clearTimeout(debounceTimer);
            controller.abort();
            setHasSentRequest(false); 
        };
    }, [storyid, navigate]); 
    


    const likeordislike = async () => {
        setInp((pre) => ({ ...pre, like: !pre.like }));
        try {
            const response = await axios.post(`http://localhost:8080/likestory/${!inp.like}`, { userid, storyid }, { withCredentials: true });

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }

            if (response.data.color && response.data.color === 'red') {
                setResponseMessage(response.data);
                return;
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

    const commentonstory = async () => {

        setInp((pre) => ({ ...pre, msg: "" }))
        try {
            const response = await axios.post(`http://localhost:8080/commentonstory`, { userid, storyid, msg: inp.msg }, { withCredentials: true });

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }
            setResponseMessage(response.data);

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



    const renderStoryPreview = (indexOffset) => {
        const newIndex = userIndex + indexOffset;
        if (newIndex >= 0 && newIndex < story.length && story[newIndex]?.info?.pic?.path) {
            const unseenStory = story[newIndex].story.find(s => !s.isSeen);
            const storyToShow = unseenStory || story[newIndex].story[0];
            return (<>
                {storyToShow?.type === "photo" ? (
                    <motion.img
                        src={storyToShow.content.path}
                        alt="Story photo"
                        {...getAnimationProps()}
                    />
                ) : (
                    <motion.video
                        src={storyToShow.content.path}
                        alt="Story Video"
                        {...getAnimationProps()}
                    />
                )}
                <motion.img className="inf6" src={story[newIndex].info.pic.path}></motion.img>

            </>)
        }
        return null;
    };

    const clckstory = (indexOffset) => {
        const newIndex = userIndex + indexOffset;

        if (newIndex >= 0 && newIndex < story.length && story[newIndex]?.info?.pic?.path) {
            const unseenStory = story[newIndex].story.find(s => !s.isSeen);
            const storyToShow = unseenStory || story[newIndex].story[0];

            setAnimationType(indexOffset > 0 ? "slide" : "slideReverse");

            setTimeout(() => {
                navigate(`/story/${story[newIndex].info._id}/${storyToShow._id}`, { state: story, replace: true });
                setAnimationType("");
            }, 500);
        }
    };



    const timeago = (inputTime) => {
        const now = Date.now();
        const future = new Date(inputTime).getTime();
        let diffMs = 24 * 60 * 60 * 1000 - future + now;

        const isPast = diffMs < 0;
        diffMs = Math.abs(diffMs);

        const seconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const day = Math.floor(hours / 24);

        if (day > 0) return isPast ? `${day} day` : `${day} day`;
        if (hours > 0) return isPast ? `${hours} hr` : `${hours} hr`;
        if (minutes > 0) return isPast ? `${minutes} min` : `${minutes} min`;
        return isPast ? `${seconds} sec` : `${seconds} sec`;
    }


    const getAnimationProps = (animationType = "") => {
        if (typeof animationType !== "string") {
            animationType = "";
        }

        if (animationType.startsWith("slide")) {
            const slideAmount = parseInt(animationType.replace("slide", ""), 10) || 1;
            return {
                initial: { x: slideAmount * 200, opacity: 0 },
                animate: { x: 0, opacity: 1 },
                exit: { x: -slideAmount * 200, opacity: 0 },
                transition: { duration: 0.4, ease: "easeInOut" }
            };
        }

        if (animationType === "flip") {
            return {
                initial: { rotateY: 90, opacity: 0 },
                animate: { rotateY: 0, opacity: 1 },
                exit: { rotateY: -90, opacity: 0 },
                transition: { duration: 0.4, ease: "easeInOut" }
            };
        }

        return {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
            transition: { duration: 0.3, ease: "easeOut" }
        };
    };





    return (
        <motion.div className="viewstory6">
            <img className="cutt" onClick={inp.cmton ? () => setInp((pre) => ({ ...pre, cmton: false })) : opt.on ? () => setOpt((pre) => ({ ...pre, page: 0, on: false })) : () => window.history.back()} src="/svg/Cut.svg"></img>
            <div onClick={() => clckstory(-3)} className="div0">{renderStoryPreview(-3)}</div>
            <div onClick={() => clckstory(-2)} className="div0">{renderStoryPreview(-2)}</div>
            <div onClick={() => clckstory(-1)} className="div0">{renderStoryPreview(-1)}</div>

            <motion.div className="div2 div0" {...getAnimationProps(animationType)}>
                {story[userIndex].story[storyIndex].type === "photo" ? (
                    <motion.img
                        key={story[userIndex].story[storyIndex].content.path}
                        src={story[userIndex].story[storyIndex].content.path}
                        alt="Current Story"
                        onClick={handleImageClick}
                        {...getAnimationProps(animationType)}
                    />
                ) : (
                    <motion.video
                        key={story[userIndex].story[storyIndex].content.path}
                        ref={videoRef}
                        src={story[userIndex].story[storyIndex].content.path}
                        autoPlay
                        muted={isMuted}
                        loop={false}
                        onClick={() => {
                            if (videoRef.current?.paused) {
                                videoRef.current.play();
                            } else {
                                videoRef.current.pause();
                            }
                        }}
                        {...getAnimationProps(animationType)}
                    />

                )}
                {story[userIndex].story[storyIndex].type === "video" && isPaused && (<img className="play6" src="/svg/play.svg" alt="Play" onClick={() => videoRef.current?.play()} />)}
                <div className="ceny" >
                    <div className="outbar">
                        {story[userIndex].story.map((one, ind) => (
                            <div
                                style={one.sharewith === "friends" ? { backgroundColor: "rgba(0, 255, 51, 0.3)" } : { backgroundColor: "rgba(237, 237, 237, 0.2)" }}
                                key={ind}
                                onClick={() => navigate(`/story/${story[userIndex].info._id}/${one._id}`, { state: story, replace: true })}
                                className="bar"
                            >
                                {story[userIndex].story[storyIndex]._id === one._id && (
                                    <motion.div
                                        className="colored"
                                        style={story[userIndex].story[storyIndex].sharewith === "friends" ? { backgroundColor: "rgb(0, 255, 51)" } : { backgroundColor: "rgb(255, 85, 0)" }}
                                        initial={{ width: "0%" }}
                                        animate={{ width: `${progress}%` }}
                                        transition={{ duration: 0.1, ease: "linear" }}
                                    ></motion.div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="outprt">
                        <div className="prt1">
                            <img onClick={() => navigate("/profile/" + story[userIndex].info.username)} src={story[userIndex].info.pic.path} alt="User Pic"></img>
                            <div className="infowla">
                                <a href={"/profile/" + story[userIndex].info.username}>{story[userIndex].info.username}</a>
                                <p>{story[userIndex].info.fname}</p>
                            </div>
                        </div>
                        <div className="prt2">
                            <p>{timeago(story[userIndex].story[storyIndex].datex)}</p>
                            {story[userIndex].story[storyIndex].type === "video" && (
                                <img
                                    src={isMuted ? "/svg/mute.svg" : "/svg/unmute.svg"}
                                    onClick={() => setIsMuted(prev => !prev)}
                                    alt="Mute Toggle"
                                />
                            )}
                            <svg onClick={() => setOpt((pre) => ({ ...pre, on: true }))} width="10px" viewBox="0 4 9 20">
                                <line stroke="white" strokeLinecap="round" strokeWidth="2" x1="5" x2="5" y1="9" y2="9"></line>
                                <line stroke="white" strokeLinecap="round" strokeWidth="2" x1="5" x2="5" y1="14" y2="14"></line>
                                <line stroke="white" strokeLinecap="round" strokeWidth="2" x1="5" x2="5" y1="19" y2="19"></line>
                            </svg>
                        </div>
                    </div>
                </div>
                {story[userIndex].story[storyIndex].msg && <p className="pp">{story[userIndex].story[storyIndex].msg}</p>}
                <div className="viewcntrl">
                    <div onClick={likeordislike} className="bord"> <Like color="white" like={inp.like} /></div>
                    <input maxLength={100} autoFocus value={inp.msg} onChange={(e) => setInp((pre) => ({ ...pre, msg: e.target.value }))} placeholder={"Comment to " + story[userIndex].info.fname + " . . ."} type="text" />
                    {inp.msg !== "" ? <div onClick={commentonstory} className="bord"> <Share color="white" /></div> : <div onClick={() => setInp((pre) => ({ ...pre, cmton: true }))} className="bord"> <Comment color="white" /></div>}
                </div>

            </motion.div>

            <div onClick={() => clckstory(1)} className="div0">{renderStoryPreview(1)}</div>
            <div onClick={() => clckstory(2)} className="div0">{renderStoryPreview(2)}</div>
            <div onClick={() => clckstory(3)} className="div0">{renderStoryPreview(3)}</div>
            {inp.cmton && <Commentbox user={user} commentonstory={commentonstory} inp={inp} setInp={setInp} fname={story[storyIndex]?.info?.fname} userid={userid} storyid={storyid} setResponseMessage={setResponseMessage} />}
            {opt.on && <Myotp user={user} userid={userid} storyid={storyid} opt={opt} setOpt={setOpt} setResponseMessage={setResponseMessage} />}
        </motion.div>

    );
}
