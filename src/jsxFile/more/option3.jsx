
import "../../cssFile/more-css/option3.css";
import { useEffect, useState } from "react";

import Loader2 from "../collect/loader2.jsx";
import Askhelp from "./askhelp.jsx"
import Asksuggest from "./asksuggest.jsx"
import Askreport from "./askreport.jsx"



export default function Option2({ setResponseMessage, msg, setOpton3, user }) {
    const [lod2, setLod2] = useState(false);
    useEffect(() => {
        document.body.style.overflow = "hidden";
        if (window.innerWidth > 500) {
            document.body.style.paddingRight = "7px";
        }


        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, []);


    const clckback = function () {
        setOpton3({ msg: "", open: false });
    }

    return (
        <div className="option2">
            {lod2 && <Loader2 />}
            <div className="toput">
                <svg
                    className="bbu" onClick={clckback} viewBox="0 0 32 32" >
                    <path d="M22,29.73a1,1,0,0,1-.71-.29L9.93,18.12a3,3,0,0,1,0-4.24L21.24,2.56A1,1,0,1,1,22.66,4L11.34,15.29a1,1,0,0,0,0,1.42L22.66,28a1,1,0,0,1,0,1.42A1,1,0,0,1,22,29.73Z"></path>
                </svg>
                <p>{msg}</p>
            </div>
            <div className="mainprt">
                {msg === "Help" ?
                    <Askhelp setLod2={setLod2} setResponseMessage={setResponseMessage} />
                    : msg === "Suggestions" ?
                        <Asksuggest setLod2={setLod2} user={user} setResponseMessage={setResponseMessage} />
                        : msg === "Report a problem" ?
                            <Askreport setLod2={setLod2} user={user} setResponseMessage={setResponseMessage} />
                            : msg === "About me" ?
                                <div className="allaboutme">
                                    <div className="myinfo">
                                        <img src="/svg/anshu.gif"></img>
                                        <div className="dtl">
                                            <a href="mailto:anshukumargupta000@gmail.com">anshukumargupta000@gmail.com</a>
                                            <a href="tel:+916201909837">+91 6201909837</a>
                                            <p>Hey! I'm <b>Anshu Kumar Gupta </b>(devloper of this website). I love tech, coding, and building cool projects. In my free time, I enjoy painting.</p>
                                        </div>

                                    </div>
                                    <p>This social media platform connects people in a fun and meaningful way, offering seamless interaction and an intuitive experience for effortless sharing and exploration.</p>
                                    <h3>My other projects</h3>
                                    <div className="mypro">
                                        <a href="https://visit-osz7.onrender.com/home" target="_blank" rel="noopener noreferrer">
                                            <img src="/svg/compass.svg"></img>
                                            <b>Visit</b>
                                        </a>
                                        <p>Book your perfect stay with ease—explore top hotels, compare deals, and reserve in just a few clicks. A seamless experience for stress-free travel</p>
                                    </div>
                                    <div className="mypro">
                                        <a href="https://anshu0a.github.io/simon/si.html" target="_blank" rel="noopener noreferrer">
                                            <img src="/svg/game.svg"></img>
                                            <b>Simon</b>
                                        </a>
                                        <p>Test your memory and reflexes with the classic Simon Game! Follow the light and sound patterns, repeat them correctly, and see how far you can go</p>
                                    </div>
                                    <div className="mypro">
                                        <a href="https://anshu0a.github.io/myWeather/" target="_blank" rel="noopener noreferrer">
                                            <img src="/svg/weather.svg"></img>
                                            <b>weather</b>
                                        </a>
                                        <p>Stay ahead of the weather—search any city and get real-time forecasts instantly. A fast, reliable way to plan your day with confidence</p>
                                    </div>
                                    <div className="mypro">
                                        <a href="https://me0anshu.github.io/gallery/two.html" target="_blank" rel="noopener noreferrer">
                                            <img src="/svg/music.svg"></img>
                                            <b>Music</b>
                                        </a>
                                        <p>Discover, stream, and enjoy your favorite tunes anytime, anywhere. A seamless music experience designed for true music lovers</p>
                                    </div>
                                    <div className="mypro">
                                        <a href="https://me0anshu.github.io/gallery/one.html" target="_blank" rel="noopener noreferrer">
                                            <img src="/svg/gallery.svg"></img>
                                            <b>Gallery</b>
                                        </a>
                                        <p>Explore, organize, and showcase your photos effortlessly. A beautifully designed gallery for storing and viewing your favorite memories</p>
                                    </div>
                                    <div className="mypro">
                                        <a href="https://anshu0a.github.io/todo/todo.html" target="_blank" rel="noopener noreferrer">
                                            <img src="/svg/edit2.svg"></img>
                                            <b>Todo</b>
                                        </a>
                                        <p>Stay organized and boost productivity with a simple and intuitive to-do list. Easily add, track, and complete tasks to stay on top of your day</p>
                                    </div>
                                </div>
                                : <p>Options not found.</p>

                }
            </div>
        </div>
    );
}
