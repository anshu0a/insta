import { useState, useEffect } from "react";
import "../../cssFile/message-css/chatinfo.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { am_pm } from "../../../utils/am_pm.js";
import { today } from "../../../utils/today.js";
import { handleImageError } from "../../../utils/handleImg.js"



export default function ChatInfo({ setResponseMessage, user2, news }) {
    const navigate = useNavigate();
    const [kyamsg, setKyamsg] = useState({ photo: "", showphoto: "", val: "", msg: "" });
    const [showm, setShowm] = useState();
    const [kaha, setKaha] = useState(false);
    const [count, setCount] = useState(null);
    const [loo, setLoo] = useState(false)

    useEffect(() => {
        if (news !== undefined && user2._id === news.sender._id) {
            const old = document.querySelector(".yeextra2")
            let newp = document.createElement("div");
            newp.setAttribute("class", "extr")
            newp.innerHTML = old.innerHTML
            old.parentElement.appendChild(newp)

            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    }, [news]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const msglao = async () => {
            try {
                const response = await axios.post(
                    `https://instaserver-knen.onrender.com/chatlao/${user2._id}`,
                    {},
                    {
                        withCredentials: true,
                        signal,
                    }
                );

                if (response.data.message === "Login required.") {
                    setResponseMessage(response.data);
                    navigate("/Login");
                    return;
                }
                if (response.data.color === "red") {
                    setResponseMessage(response.data);
                    return;
                }

                setShowm(response.data);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                    console.error("Error occurred:", error);
                    setResponseMessage({ message: "Something went wrong", color: "red" });
                }
            }
        };

        msglao();

        return () => {
            controller.abort();
        };
    }, [user2, navigate, setResponseMessage]);

    useEffect(() => {
        setCount(() => Math.max((showm?.msgs?.length || 0) - 15, 0))
    }, [showm])

    const setimg = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setKyamsg(prev => ({ ...prev, showphoto: previewURL, photo: file }));
        }
    };

    function tempMsg() {
        const old = document.querySelector(".yeextra")
        let newp = document.createElement("div");
        newp.setAttribute("class", "extr")
        newp.innerHTML = old.innerHTML
        old.parentElement.appendChild(newp)

        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }


    const bhezomsg = async () => {
        if (kyamsg.msg !== "" || kyamsg.photo !== "") {

            setLoo(true)
            setKyamsg({ photo: "", showphoto: "", val: "", msg: "" });
            try {
                tempMsg()
                const formData = new FormData();
                if (kyamsg.photo) {
                    formData.append("photo", kyamsg.photo);
                }
                formData.append("user2", user2._id);
                formData.append("msg", kyamsg.msg);

                const response = await axios.post(`https://instaserver-knen.onrender.com/bhezomsg`,
                    formData,
                    {
                        withCredentials: true,
                        headers: { 'Content-Type': 'multipart/form-data' },
                    }
                );

                if (response.data.message === "Login required.") {
                    setResponseMessage(response.data);
                    navigate("/Login");
                    return;
                }
                if (response.data.color === "red") {
                    setResponseMessage(response.data);
                    return;
                }

            } catch (error) {
                console.error("Error occurred:", error);
                setResponseMessage({ message: "Something went wrong", color: "red" });
            } finally {
                setLoo(false)
            }
        }
    };

    useEffect(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

        const handleScroll = () => {
            if (document.documentElement.scrollTop < document.documentElement.scrollHeight - window.innerHeight - 130) {
                setKaha(true);
            } else {
                setKaha(false);
            }

            if (document.documentElement.scrollTop < 200) {
                setCount((prev) => Math.max(prev - 10, 0));
            }
        };

        const timeoutId = setTimeout(() => {
            window.addEventListener('scroll', handleScroll);
        }, 500);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [showm]);

    const timm = function (ind) {

        if (ind === 0) {
            return today(showm?.msgs[ind].msgtime)
        } else if (today(showm?.msgs[ind - 1].msgtime) !== today(showm?.msgs[ind].msgtime)) {
            return today(showm?.msgs[ind].msgtime)
        }
        return
    }


    return (
        <div className="chatinfoe">
            <div className="ttop">
                <div className="block1">
                    <img src={user2?.pic?.path} onError={handleImageError} />
                    <div className="namew">
                        <p className="usn">{user2.fname} ( {user2.username} )</p>
                        {true ?
                            <p className="sts" style={{ color: "green" }}>online</p> :
                            <p className="sts" style={{ color: "grey" }}>1 hr</p>}
                    </div>

                </div>
                <div className="block2">
                    <div className="svgdiv">
                        <svg viewBox="5 5 15 15" fill="none">
                            <path d="M6.24033 8.16795C6.99433 7.37295 7.26133 7.14995 7.58233 7.04695C7.80482 6.98843 8.03822 6.98499 8.26233 7.03695C8.55733 7.12295 8.63433 7.18795 9.60233 8.15095C10.4523 8.99695 10.5363 9.08895 10.6183 9.25095C10.7769 9.54253 10.8024 9.88825 10.6883 10.1999C10.6043 10.4349 10.4803 10.5909 9.96533 11.1089L9.62933 11.4459C9.54093 11.5356 9.51997 11.6719 9.57733 11.7839C10.3232 13.0565 11.3812 14.1179 12.6513 14.8679C12.7978 14.9465 12.9783 14.921 13.0973 14.8049L13.4203 14.4869C13.6199 14.2821 13.8313 14.0891 14.0533 13.9089C14.4015 13.6935 14.8362 13.6727 15.2033 13.8539C15.3823 13.9379 15.4423 13.9929 16.3193 14.8669C17.2193 15.7669 17.2483 15.7959 17.3493 16.0029C17.5379 16.3458 17.536 16.7618 17.3443 17.1029C17.2443 17.2949 17.1883 17.3649 16.6803 17.8839C16.3733 18.1979 16.0803 18.4839 16.0383 18.5259C15.6188 18.8727 15.081 19.043 14.5383 19.0009C13.5455 18.9101 12.5847 18.6029 11.7233 18.1009C9.81416 17.0894 8.18898 15.6155 6.99633 13.8139C6.73552 13.4373 6.50353 13.0415 6.30233 12.6299C5.76624 11.7109 5.48909 10.6638 5.50033 9.59995C5.54065 9.04147 5.8081 8.52391 6.24033 8.16795Z" stroke="#000000" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                    </div>
                    <div className="svgdiv">
                        <svg viewBox="0 0 24 24" fill="none">
                            <path d="M16 12C16 11.1555 15.0732 10.586 13.2195 9.44695C11.3406 8.29234 10.4011 7.71504 9.70056 8.13891C9 8.56279 9 9.70853 9 12C9 14.2915 9 15.4372 9.70056 15.8611C10.4011 16.285 11.3406 15.7077 13.2195 14.5531C15.0732 13.414 16 12.8445 16 12Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                    </div>
                    <div className="svgdiv">
                        <svg viewBox="3 2.5 19 19" fill="none" >
                            <circle cx="12" cy="7" r="0.5" transform="rotate(90 12 7)" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="12" r="0.5" transform="rotate(90 12 12)" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="12" cy="17" r="0.5" transform="rotate(90 12 17)" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>
            <div className="cen">
                {showm?.msgs === "no msg" && news === undefined ? <>
                    <p className="hel" onClick={() => setKyamsg((pre) => ({ ...pre, msg: "hello👋" }))} >Say <span>hello👋</span> to {user2.name}</p>
                </> : <>
                    <p className="war">We are trying to secure all of your messages and photos, so be safe while chatting.</p>
                    {showm?.msgs !== "no msg" && showm?.msgs.reverse().slice(count, showm?.msgs?.length).map((msg, ind) => (
                        <div className="extr" key={ind}>
                            <div className="ddaat">{timm(ind)}</div>
                            <div className={msg.sender === showm?.user._id ? "myy mm" : "mm hiss"}>
                                <div>
                                    {msg?.photo?.path && <img src={msg?.photo?.path}></img>}
                                    {msg?.msg !== "" && <p className="pph">{msg.msg}</p>}
                                </div>
                                {!msg?.seen && msg?.sender !== user2._id && <svg title="Un-seen" viewBox="-12 -12 60 60"><circle fill="#DD2E44" cx="18" cy="18" r="18"></circle></svg>}
                                <p className="tty">{am_pm(msg.msgtime)}</p>
                            </div>
                        </div>
                    ))}
                </>}
                <div className="extr yeextra" style={{ display: "none" }}>
                    <div className="myy mm">
                        <div>
                            {kyamsg.showphoto && <img src={kyamsg.showphoto}></img>}
                            {kyamsg.msg !== "" && <p className="pph">{kyamsg.msg}</p>}
                        </div>
                        <svg title="Un-seen" viewBox="-12 -12 60 60"><circle fill="#DD2E44" cx="18" cy="18" r="18"></circle></svg>
                        <p className="tty">{am_pm(Date.now())}</p>
                    </div>
                </div>
                {news !== undefined && <div className="extr yeextra2" style={{ display: "none" }}>
                    <div className="mm hiss">
                        <div>
                            {news?.photo?.path && <img src={news?.photo?.path}></img>}
                            {news?.msg !== "" && <p className="pph">{news.msg}</p>}
                        </div>
                        <p className="tty">{am_pm(news.msgtime)}</p>
                    </div>
                </div>}

            </div>
            {kaha && <svg onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="nichee" viewBox="0 0 24 24"  >
                <path d="M12 6V18M12 18L7 13M12 18L17 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>}
            <div className="sendu">
                <div className="insendu">
                    <input id="iix" onInput={setimg} value={kyamsg.val} type="file" hidden accept="image/*" />
                    {kyamsg.photo === "" ?
                        <label htmlFor="iix" className="sseenndt sl">
                            <svg viewBox="1.5 3 22 19" fill="none" >
                                <circle cx="12" cy="13" r="3" stroke="black" strokeWidth="1" />
                                <path d="M10.0001 19.9999H14.0001C16.809 19.9999 18.2135 19.9999 19.2224 19.3258C19.6591 19.0339 20.0341 18.6589 20.326 18.2222C21.0001 17.2133 21.0001 15.8088 21.0001 12.9999C21.0001 10.191 21 8.78673 20.3258 7.77783C20.034 7.34107 19.659 6.96607 19.2222 6.67423C18.2133 6.00011 16.8089 6.00011 14 6.00011H9.99995C7.19103 6.00011 5.78656 6.00011 4.77767 6.67423C4.34091 6.96607 3.96591 7.34107 3.67407 7.77783C3.0001 8.7865 3.0001 10.1903 3.0001 12.998L3.0001 12.9999C3.0001 15.8088 3.0001 17.2133 3.67422 18.2222C3.96605 18.6589 4.34106 19.0339 4.77782 19.3258C5.78671 19.9999 7.19117 19.9999 10.0001 19.9999Z" stroke="black" strokeWidth="1"></path>
                                <path d="M18 10H17.5" stroke="black" strokeWidth="1" strokeLinecap="round"></path>
                            </svg>
                        </label> :
                        <div onClick={() => setKyamsg((pre) => ({ ...pre, photo: "", val: "", showphoto: "" }))} className="sseenndt sl">
                            <div>
                                <svg className="vv" viewBox="0 0 24 24"  >
                                    <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.71,12.29a1,1,0,0,1,0,1.42,1,1,0,0,1-1.42,0L12,13.42,9.71,15.71a1,1,0,0,1-1.42,0,1,1,0,0,1,0-1.42L10.58,12,8.29,9.71A1,1,0,0,1,9.71,8.29L12,10.58l2.29-2.29a1,1,0,0,1,1.42,1.42L13.42,12Z" />
                                </svg>
                            </div>
                            <img src={kyamsg.showphoto} />
                        </div>
                    }
                    <input onKeyDown={(event) => { if (event.key === "Enter") {  bhezomsg(); } }} autoComplete="off" autoFocus name="kyamsg" value={kyamsg.msg} onChange={(e) => setKyamsg((pre) => ({ ...pre, msg: e.target.value }))} type="text" placeholder="Start messaging . . ."></input>

                    <div onClick={bhezomsg}  className={!loo ? "sseenndt sr" : "sseenndt sr2"}>
                        <svg viewBox="4 2 18 18" >
                            <path fill={kyamsg !== "" ? "rgb(0, 153, 255)" : "black"} d="M18.2102 5.19087C17.7865 5.26625 17.2074 5.45789 16.3634 5.73923L9.8724 7.90289C9.05034 8.17692 8.45218 8.37646 8.01771 8.54598C7.56626 8.72212 7.36818 8.8387 7.28522 8.91842C6.671 9.50865 6.671 10.4913 7.28522 11.0815C7.36818 11.1613 7.56626 11.2778 8.01771 11.454C8.45218 11.6235 9.05034 11.823 9.8724 12.0971C9.88546 12.1014 9.89835 12.1057 9.91107 12.11C10.203 12.2072 10.4046 12.2743 10.5876 12.3711C11.0314 12.6058 11.3942 12.9686 11.6288 13.4124C11.7256 13.5954 11.7928 13.7969 11.89 14.0889C11.8943 14.1016 11.8986 14.1145 11.9029 14.1276C12.1769 14.9496 12.3765 15.5478 12.546 15.9823C12.7221 16.4337 12.8387 16.6318 12.9184 16.7148C13.5087 17.329 14.4913 17.329 15.0816 16.7148C15.1613 16.6318 15.2779 16.4337 15.454 15.9823C15.6235 15.5478 15.8231 14.9496 16.0971 14.1276L18.2607 7.6366C18.5421 6.79257 18.7337 6.21349 18.8091 5.78975C18.8851 5.36239 18.8101 5.2653 18.7724 5.22757C18.7347 5.18983 18.6376 5.11485 18.2102 5.19087ZM18.0351 4.20633C18.5449 4.11564 19.0802 4.12118 19.4795 4.52046C19.8788 4.91974 19.8843 5.45511 19.7937 5.96489C19.7039 6.46966 19.4875 7.11879 19.2231 7.91194L19.2094 7.95283L17.0458 14.4438L17.0408 14.4586C16.7728 15.2629 16.5654 15.885 16.3856 16.3458C16.2113 16.7924 16.0355 17.1653 15.8026 17.4076C14.8189 18.4314 13.1811 18.4314 12.1974 17.4076C11.9645 17.1653 11.7886 16.7924 11.6144 16.3457C11.4346 15.885 11.2273 15.2629 10.9592 14.4587L10.9542 14.4438C10.8392 14.0987 10.7982 13.9807 10.7448 13.8799C10.604 13.6136 10.3864 13.3959 10.1201 13.2551C10.0192 13.2018 9.90132 13.1608 9.55617 13.0458L9.54128 13.0408C8.73709 12.7727 8.11498 12.5654 7.65423 12.3856C7.20762 12.2113 6.83468 12.0355 6.59233 11.8026C5.56863 10.8189 5.56863 9.1811 6.59233 8.19737C6.83468 7.96448 7.20762 7.78863 7.65423 7.61438C8.11499 7.4346 8.73712 7.22723 9.54133 6.95916L9.55617 6.95421L16.0472 4.79055L16.088 4.77693C16.8812 4.51252 17.5303 4.29612 18.0351 4.20633Z" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>)
}

