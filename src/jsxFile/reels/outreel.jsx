import "../../cssFile/reels-css/outreel.css";
import One from './one.jsx';
import Loader from "../collect/loader.jsx";
import React, { useEffect, useState, useRef } from 'react';

export default function Outreel({ data = [] }) {
    const [datu, setDatu] = useState(3);
    const videoRefs = useRef([]);
    const [stu, setStu] = useState(true);


    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                const video = entry.target;
                const isLast = video === videoRefs.current[videoRefs.current.length - 1];

                if (entry.isIntersecting) {
                    video.currentTime = 0
                    video.play().catch(console.error);
                    if (isLast && !video.dataset.playedLast) {
                        setTimeout(() => {
                            video.dataset.playedLast = 'true';
                            setDatu((prev) => {
                                videoRefs.current.forEach((v) => v && (v.dataset.playedLast = undefined));
                                return prev + 1;
                            });
                        }, 300)
                    }
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.3 });

        videoRefs.current.forEach((video) => video && observer.observe(video));
        const firstVideo = videoRefs.current[0];
        if (firstVideo) {
            const playFirst = () => firstVideo.play().catch(console.warn);
            firstVideo.readyState >= 2 ? playFirst() : firstVideo.addEventListener('canplay', playFirst, { once: true });

        }

        return () => videoRefs.current.forEach((video) => video && observer.unobserve(video));
    }, [datu]);

    const videoData = Array.isArray(data) ? data.slice(0, datu) : [];

    return (
        <div className="outreel">


            {videoData.map((itm, ind) => (
                <div key={ind} className="onevv">
                    {stu && <div onClick={() => setStu((pre) => !pre)} className="muum">
                        <svg fill="white" viewBox="0 0 36 36">
                            <path d="M3.61,6.41,9.19,12H4a2,2,0,0,0-2,2v8a2,2,0,0,0,2,2H9.14l7.41,7.47A2,2,0,0,0,18,32a2,2,0,0,0,.76-.15A2,2,0,0,0,20,30V22.77l5.89,5.89c-.25.15-.49.29-.75.42a1,1,0,0,0,.9,1.79,14.4,14.4,0,0,0,1.31-.75l2.28,2.28L31,31,5,5ZM18,30l-7.73-7.77A1,1,0,0,0,9.56,22H4V14H9.64a1,1,0,0,0,.71-.3l.26-.26L18,20.81Z" />
                            <path d="M24.89,6.69A12.42,12.42,0,0,1,29,26.1l1.42,1.42A14.42,14.42,0,0,0,25.76,4.88a1,1,0,1,0-.87,1.8Z"></path>
                            <path d="M22.69,12.62A6.27,6.27,0,0,1,25.8,18a6.17,6.17,0,0,1-1.24,3.71L26,23.13A8.15,8.15,0,0,0,27.8,18a8.28,8.28,0,0,0-4.1-7.11,1,1,0,1,0-1,1.73Z" />
                            <path d="M18,6v9.15l2,2V6a2,2,0,0,0-3.42-1.41L12,9.17l1.41,1.41Z" />
                        </svg>
                    </div>}
                    <One ind={ind} videoRefs={videoRefs} data={itm} stu={stu} setStu={setStu} />
                   
                </div>
            ))}
            <div className="onevv">
                <div className="invid">
                    <Loader />
                </div>
            </div>
        </div>
    );
}
