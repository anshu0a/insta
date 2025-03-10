import { useEffect, useRef, useState } from "react";
import "../../../cssFile/home-css/notifications-css/noti.css";
import Options from "./options";
import Onenoti from "./onenoti";
import Post from '../../viewPost/post'
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Noti({ notimsg, setResponseMessage, setRednoti, setNoti, userid }) {
    const navigate = useNavigate();
    const [showm, setShowm] = useState({ show: false, msg: "", img: "", ind: 0 });
    const [notilist, setNotilist] = useState([]);
    const crtRef = useRef(null);
    const [showpost, setShowpost] = useState({ seen: false, postid: null })

    useEffect(() => {
        if (notimsg !== undefined) {
            setNotilist(prev => [
                ...prev.filter(notification => 
                    !(notification.sender && 
                      notification.sender._id.toString() === notimsg.sender._id.toString() && 
                      notification.sendertype === "respond")
                ),
                notimsg
            ]);
        }
    }, [notimsg]);
    
    useEffect(() => {
        const hasUnseenNotifications = notilist.some(notification => !notification.seen);
        setRednoti(hasUnseenNotifications);
    }, [notilist]);


    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:8080/laoNoti/${userid}`,
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
                    return;
                }

                setNotilist(response.data?.data.Notifications);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.warn("Fetch request canceled.");
                } else {
                    setResponseMessage({
                        message: "Something went wrong",
                        color: "red",
                    });
                }
            }
        };

        if (userid) fetchData();

        return () => controller.abort();
    }, [userid, navigate, setResponseMessage]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            const crtbtn = document.querySelector(".Notifications");
            if (crtRef.current && !crtRef.current.contains(e.target) && !crtbtn.contains(e.target)) {
                setNoti(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setNoti]);

    const readnoti = async (type, notiid) => {
        setShowm({ show: false, msg: "", img: "", ind: 0 });
        setNotilist((prevList) => {
            const updatedList = prevList.map((noti) => {
                if (noti._id === notiid) { return { ...noti, seen: !noti.seen }; }
                return noti;
            });
            return updatedList;
        });

        try {
            const response = await axios.post(
                `http://localhost:8080/notif/${type}/${notiid}`,
                {},
                { withCredentials: true }
            );

            if (response.data.message === "Login required.") {
                navigate("/Login");
                setResponseMessage(response.data);
                return;
            }

            if (response.data.color === "red") {
                setResponseMessage(response.data);
                return;
            }



        } catch (error) {
            console.log(error)
            setResponseMessage({
                message: "Something went wrong",
                color: "red",
            });
        }
    };

    const readAll = () => {

        setNotilist((prevList) => prevList.map((noti) => ({ ...noti, seen: true })));
        readnoti("allread", "cgy")
    };

    return (
        <div ref={crtRef} className="noti">
            <div className="blm"></div>
            <div className="topu">
                <p className="notp">Notifications</p>
                {notilist?.length > 0 && notilist?.some((noti) => noti.seen === false) && (<p onClick={readAll} className="unredss">Read all</p>)}
            </div>
            <div className="part">
                {notilist?.length > 0 ? <>
                    {showm.show && <Options setShowpost={setShowpost} readnoti={readnoti} setNotilist={setNotilist} showm={showm} setResponseMessage={setResponseMessage} setShowm={setShowm} list={notilist[showm.ind]} />}
                    {[...notilist].reverse().map((list, ind) => (
                        <Onenoti setShowpost={setShowpost} readnoti={readnoti} key={ind}  ind={notilist.length - 1 - ind}  list={list} setShowm={setShowm} />
                    ))}
                </> :
                    <div className="emptynoti">
                        <img width="50%" src="/svg/sleep.svg"></img>
                        <p>Notification is empty</p>
                    </div>}
            </div>
            {showpost.seen && <Post setShowpost={setShowpost} setResponseMessage={setResponseMessage} userid={userid} postid={showpost.postid} />}
        </div>
    );
}
