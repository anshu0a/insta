import { useEffect, useRef, useState } from "react";
import "../../../cssFile/home-css/notifications-css/noti.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { handleImageError} from "../../../../utils/handleImg.js"


export default function Optt({ setShowm,setShowpost,  showm, list, setNotilist, readnoti, setResponseMessage }) {
    const navigate = useNavigate();
    const crtRefx = useRef(null);
    const [respo, setRespo] = useState({ msg: "", show: false });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (crtRefx.current && !crtRefx.current.contains(e.target)) {
                setShowm({ show: false, msg: "", img: "", ind: 0 });
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowm]);

    const viwehandle = () => {
        if (list.sendertype === "team") {
            window.location.href = list?.url
        } else if (list.sendertype === "user") {
            setShowpost({ seen: true, postid: list.postid })
        }
        if (!list.seen) {
            readnoti("read", list._id);
        }else{
            setShowm({ show: false, msg: "", img: "", ind: 0 });
        }
        
    };

    const dealhandle = () => {
        setNotilist((prev) => prev.filter((item) => item._id !== list._id));
        setShowm({ show: false, msg: "", img: "", ind: 0 });

        const controller = new AbortController();

        const deleteNotification = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:8080/dealnoti/${list._id}`,
                    {},
                    { withCredentials: true, signal: controller.signal }
                );

                if (response.data.message === "Login required.") {
                    navigate("/Login");
                }
                setResponseMessage(response.data);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    setResponseMessage({ message: "Something went wrong", color: "red" });
                }
            }
        };

        deleteNotification();
        return () => controller.abort();
    };

    const sndrespo = () => {
        if (!respo.msg) return;

        const controller = new AbortController();

        const sendResponse = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:8080/addNoti/${list.sender._id}`,
                    { msg: respo.msg },
                    { withCredentials: true, signal: controller.signal }
                );

                if (response.data.message === "Login required.") {
                    navigate("/Login");
                }
                setResponseMessage(response.data);
                
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.log(error)
                    setResponseMessage({ message: "Something went wrong", color: "red" });
                }
            }
        };

        setRespo({ msg: "", show: false });
        setShowm({ show: false, msg: "", img: "", ind: 0 });
        sendResponse();
        return () => controller.abort();
    };

    return (
        <div ref={crtRefx} className="optnx">
            <svg className="cutmtyf" onClick={() => setShowm({ show: false, msg: "", img: "", ind: 0 })} viewBox="0 0 24 24">
                <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.71,12.29a1,1,0,0,1,0,1.42,1,1,0,0,1-1.42,0L12,13.42,9.71,15.71a1,1,0,0,1-1.42,0,1,1,0,0,1,0-1.42L10.58,12,8.29,9.71A1,1,0,0,1,9.71,8.29L12,10.58l2.29-2.29a1,1,0,0,1,1.42,1.42L13.42,12Z" />
            </svg>
            <img onError={handleImageError} src={showm.img} alt="Notification" />
            <p className="poi">{showm.msg}</p>
            <div className="oopp">
                <div className="noxx" onClick={viwehandle}>
                    <img className="imxy" src="/svg/eye.svg" alt="View" />
                    <p>View</p>
                </div>
                {!list?.seen ? (
                    <div className="noxx" onClick={() => readnoti("read", list._id)}>
                        <img className="imxy" src="/svg/read.svg" alt="Mark as read" />
                        <p>Mark as read</p>
                    </div>
                ) : (
                    <div className="noxx" onClick={() => readnoti("unread", list._id)}>
                        <img className="imxy" src="/svg/unread.svg" alt="Mark as unread" />
                        <p>Mark as unread</p>
                    </div>
                )}
                <div className="noxx" onClick={dealhandle}>
                    <img className="imxy" src="/svg/delete.svg" alt="Delete" />
                    <p className="ddul">Delete </p>
                </div>
                {
                   ( list.sendertype ==="user"|| list.sendertype ==="respond" )&&
                    <label htmlFor="vghve" className="noxx" onClick={() => setRespo((prev) => ({ ...prev, show: !prev.show }))}>
                    <img className="imxy" src="/svg/respond.svg" alt="Respond" />
                    <p>Respond</p>
                </label>
                }
                {respo.show && (
                    <div className="inm">
                        <input id="vghve" type="text" autoComplete="off" maxLength={100}  onKeyDown={(e)=>{if(e.key==="Enter"){sndrespo()}}}  value={respo.msg} onChange={(e) => setRespo((prev) => ({ ...prev, msg: e.target.value }))}  placeholder="Respond message . . ."  />
                        {respo.msg && <p onClick={sndrespo}>Send</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
