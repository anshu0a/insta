import "../../cssFile/reels-css/one.css";
import React, { useEffect, useState } from 'react';
import PostBottomLike from "../home/post-bottom-like.jsx";

export default function One({ data, ind, stu, setStu, videoRefs }) {
    const [cnt, setCnt] = useState({ save: true, like: false })


    const postTime = new Date(data.posttime);
    const currentTime = new Date();
    const timeDifference = currentTime - postTime;
    const seconds = Math.floor((timeDifference / 1000) % 60);
    const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const years = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));


    const togglePause = () => {
        const videoElement = videoRefs.current[ind];
        if (videoElement && !videoElement.paused) {
            videoElement.pause();
        }
    };

    const togglePlay = () => {
        const videoElement = videoRefs.current[ind];
        if (videoElement && videoElement.paused) {
            videoElement.play().catch((error) => {
                console.error('Error playing video:', error);
            });
        }
    }
    return (
        <>

            <div className="invid">
                <video
                    src={data.postvideo}
                    muted={stu}
                    loop="2"
                    onMouseDown={togglePause}
                    onMouseUp={togglePlay}
                    onClick={() => setStu((pre) => !pre)}
                    playsInline
                    ref={(el) => {
                        if (el) {
                            videoRefs.current[ind] = el;
                        }
                    }}

                />
                <div className="descy">
                    <div className="usserr">
                        <img src={data.userPic}></img>
                        <b className="uui">{data.username}</b>
                        <p>{years !== 0 ? <>{years} {years === 1 ? "year" : "years"}</> :
                            days !== 0 ? <>{days} {days !== 1 ? "days" : "day"}</> :
                                hours !== 0 ? <>{hours} {hours !== 1 ? "hrs" : "hr"} </> :
                                    minutes !== 0 ? <>{minutes} {minutes !== 1 ? "mins" : "min"}</> :
                                        <>{seconds} {seconds !== 1 ? "secs" : "sec"}</>
                        } ago</p>

                    </div>
                    <div style={data.simLike.length == 1 ? { transform: "translateX(7px)" } : { transform: "translateX(-9px)"}}>
                        <PostBottomLike post={data} />
                    </div>
                    <div className="descs">{data.desc}</div>
                </div>
                <div className="cntrl">
                    <div className="vvi">
                        <div>
                            <svg viewBox="0 0 24 24" fill={cnt.like ? "red" : "white"} >
                                <path fillRule={cnt.like ? "" : "evenodd"} d="M5.62436 4.4241C3.96537 5.18243 2.75 6.98614 2.75 9.13701C2.75 11.3344 3.64922 13.0281 4.93829 14.4797C6.00072 15.676 7.28684 16.6675 8.54113 17.6345C8.83904 17.8642 9.13515 18.0925 9.42605 18.3218C9.95208 18.7365 10.4213 19.1004 10.8736 19.3647C11.3261 19.6292 11.6904 19.7499 12 19.7499C12.3096 19.7499 12.6739 19.6292 13.1264 19.3647C13.5787 19.1004 14.0479 18.7365 14.574 18.3218C14.8649 18.0925 15.161 17.8642 15.4589 17.6345C16.7132 16.6675 17.9993 15.676 19.0617 14.4797C20.3508 13.0281 21.25 11.3344 21.25 9.13701C21.25 6.98614 20.0346 5.18243 18.3756 4.4241C16.7639 3.68739 14.5983 3.88249 12.5404 6.02065C12.399 6.16754 12.2039 6.25054 12 6.25054C11.7961 6.25054 11.601 6.16754 11.4596 6.02065C9.40166 3.88249 7.23607 3.68739 5.62436 4.4241ZM12 4.45873C9.68795 2.39015 7.09896 2.10078 5.00076 3.05987C2.78471 4.07283 1.25 6.42494 1.25 9.13701C1.25 11.8025 2.3605 13.836 3.81672 15.4757C4.98287 16.7888 6.41022 17.8879 7.67083 18.8585C7.95659 19.0785 8.23378 19.292 8.49742 19.4998C9.00965 19.9036 9.55954 20.3342 10.1168 20.6598C10.6739 20.9853 11.3096 21.2499 12 21.2499C12.6904 21.2499 13.3261 20.9853 13.8832 20.6598C14.4405 20.3342 14.9903 19.9036 15.5026 19.4998C15.7662 19.292 16.0434 19.0785 16.3292 18.8585C17.5898 17.8879 19.0171 16.7888 20.1833 15.4757C21.6395 13.836 22.75 11.8025 22.75 9.13701C22.75 6.42494 21.2153 4.07283 18.9992 3.05987C16.901 2.10078 14.3121 2.39015 12 4.45873Z" ></path>
                            </svg>
                        </div>
                        <p>
                            {data?.likes?.length > 0 ? data.likes.length : "Likes"}
                        </p>
                    </div>
                    <div className="vvi">
                        <div>
                            <svg fill="white" viewBox="5 10 40 30" >
                                <path d="M15 42h-2l1.2-1.6c.8-1.1 1.3-2.5 1.6-4.2C10.8 33.9 8 29.6 8 24c0-8.6 6.5-14 17-14s17 5.4 17 14c0 8.8-6.4 14-17 14h-.7c-1.6 1.9-4.4 4-9.3 4zm10-30c-9.4 0-15 4.5-15 12 0 6.4 3.9 9.4 7.2 10.7l.7.3-.1.8c-.2 1.6-.5 3-1.1 4.2 3.3-.4 5.2-2.1 6.3-3.5l.3-.4H25c13.5 0 15-8.4 15-12C40 16.5 34.4 12 25 12z"></path>
                            </svg>
                        </div>
                        <p>
                            {data?.comment?.length > 0 ? data.comment.length : "cmts"}
                        </p>
                    </div>
                    <div className="vvi">
                        <div>
                            <svg viewBox="0 0 24 24" fill="none" >
                                <path d="M15 4H18C19.1046 4 20 4.89543 20 6L20 18C20 19.1046 19.1046 20 18 20H15M11 16L15 12M15 12L11 8M15 12H3" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </div>
                        <p>
                            share
                        </p>
                    </div>
                    <div className="vvi">
                        <div>
                            <svg viewBox="2 2.5 19 19" fill={cnt.save ? "rgb(0, 151, 252)" : "none"} >
                                <path d="M15.75 5H8.25C7.55964 5 7 5.58763 7 6.3125V19L12 15.5L17 19V6.3125C17 5.58763 16.4404 5 15.75 5Z" stroke={cnt.save ? "rgb(0, 151, 252)" : "white"} strokeLinecap="round" strokeLinejoin="round"></path>
                            </svg>
                        </div>
                        <p>
                            save
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
