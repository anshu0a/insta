import React, { useEffect, useState } from "react";
import "../../cssFile/home-css/index.css";
import One from "./one.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Index({ userData, notimsg, news, setResponseMessage }) {
    const navigate = useNavigate();
    const [bodywide, setBodywide] = useState(window.innerWidth);
    const [ms, setMs] = useState({ data: [], len: 0 });
    const [notix, setNotix] = useState(0);


    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }


    useEffect(() => {
        const handleResize = debounce(() => setBodywide(window.innerWidth), 200);
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);


    useEffect(() => {
        if (news && !ms.data.some(item => item.lastMessage?.sender?._id === news.sender._id)) {
            setMs(prev => ({
                ...prev,
                data: [...prev.data, { chatWith: news.sender, lastMessage: news }],
                len: prev.len + 1,
            }));
        }
    }, [news]);


    useEffect(() => {
        if (notimsg) setNotix(prev => prev + 1);
    }, [notimsg]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchMessages = async () => {
            try {
                const response = await axios.post(
                    "https://instaserver-knen.onrender.com/konkon/indx",
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

                setMs(response.data);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error("Error occurred:", error);
                    setResponseMessage({ message: "Something went wrong", color: "red" });
                }
            }
        };

        fetchMessages();

        return () => controller.abort();
    }, [navigate, setResponseMessage]);


    useEffect(() => {
        const controller = new AbortController();

        const fetchNotifications = async () => {
            try {
                const response = await axios.post(
                    `https://instaserver-knen.onrender.com/laoNoti/${userData?._id}`,
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

                setNotix(response.data?.no);
            } catch (error) {
                if (!axios.isCancel(error)) {
                    setResponseMessage({ message: "Something went wrong", color: "red" });
                }
            }
        };

        if (userData?._id) fetchNotifications();

        return () => controller.abort();
    }, [userData?._id, navigate, setResponseMessage]);


    const menuItems = [
        { setResponseMessage: setResponseMessage, name: "Home", src: "/svg/Home.svg" },
        ...(bodywide > 500 ? [{ setResponseMessage: setResponseMessage, name: "Search", src: "/svg/Search.svg" }] : []),
        ...(bodywide > 500 ? [{ setResponseMessage: setResponseMessage, name: "Filter", src: "/svg/filter0.svg" }] : []),
        { setResponseMessage: setResponseMessage, name: "Reels", src: "/svg/Reels.svg" },
        { setResponseMessage: setResponseMessage, name: "Messages", alert: ms?.len > 0 ? `msg${Math.min(ms?.len, 9)}` : "false", src: "/svg/Messages.svg" },
        ...(bodywide > 500 ? [{ name: "Notifications", alert: notix > 0 ? "tru" : "fal", src: "/svg/Notifications.svg", setNotix, notimsg, setResponseMessage, userid: userData?._id, },] : []),
        { setResponseMessage: setResponseMessage, name: "Create", src: "/svg/Create.svg", userpic: userData?.pic },
        { setResponseMessage: setResponseMessage, name: `@${userData?.username}`, src: userData?.pic, pic: "yes" },
        ...(bodywide > 500 ? [{ setResponseMessage: setResponseMessage, name: "More", src: "/svg/More.svg" }] : []),
    ];

    return (
        <div className="index">
            {menuItems.map((item, index) => (
                <One key={index} {...item} />
            ))}
        </div>
    );
}
