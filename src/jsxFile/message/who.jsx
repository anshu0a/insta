import { useState, useEffect } from "react"
import "../../cssFile/message-css/who.css"
import Onemsg from './onemsg.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import ContentLoader from 'react-content-loader'

export default function who({ setResponseMessage, ret,user, news }) {

    const navigate = useNavigate();
    const [min, setMin] = useState(window.document.body.clientWidth < 900);
    const [msginfos, setMsginfos] = useState([]);
    const [lod, setLod] = useState(true);

    useEffect(() => {
        if (news && news.sender) {
            setMsginfos((prev) => {
                const filteredMsginfos = prev.filter((msginfo) => msginfo.chatWith?._id !== news.sender._id);
    

                return [
                    ...filteredMsginfos,
                    { chatWith: news.sender, lastMessage: news },
                ];
            });
        }
    }, [news]);
    
    
    


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const konkon = async () => {
            try {
                const response = await axios.post("http://localhost:8080/konkon/chat", {}, { withCredentials: true, signal });
                if (response.data.message === "Login required.") {
                    navigate("/Login");
                    setResponseMessage(response.data);
                    return;
                }
                if (response.data.color === "red") {
                    setResponseMessage(response.data);
                    return;
                }
                ret(response?.data?.user);
                if (response.data?.data.length > 0) {
                    setMsginfos(response.data?.data);
                }
                setLod(false);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Request canceled:", error.message);
                } else {
                    console.log(error);
                    setResponseMessage({ message: "Something went wrong", color: "red" });
                }
            }
        };
        konkon();

        return () => {
            controller.abort();
        };
    }, []);

    useEffect(() => {
        const debounce = (func, wait) => {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => func(...args), wait);
            };
        };
    
        const updateBodyWidth = debounce(() => {
            setMin(window.document.body.clientWidth < 900);
        }, 100);
    
        window.addEventListener('resize', updateBodyWidth);
    
        return () => {
            window.removeEventListener('resize', updateBodyWidth);
        };
    }, []);
    const handleClick = (ind) => {
        console.log("Message clicked:", msginfos[ind].chatWith.username);
        setMsginfos((prev) => {

            const updatedMsginfos = [...prev];


            updatedMsginfos[ind] = {
                ...updatedMsginfos[ind],
                lastMessage: {
                    ...updatedMsginfos[ind].lastMessage,
                    seen: true
                }
            };


            return updatedMsginfos;
        });
        window.location.replace(`/Messages/${[...msginfos].reverse()[ind].chatWith.username}`)
    };

    return (
        <div className="who8">
            <div className="div1">
                <div className="bold">
                    <svg onClick={() => window.history.back()} className="bbu" viewBox="0 0 32 32">
                        <path  d="M22,29.73a1,1,0,0,1-.71-.29L9.93,18.12a3,3,0,0,1,0-4.24L21.24,2.56A1,1,0,1,1,22.66,4L11.34,15.29a1,1,0,0,0,0,1.42L22.66,28a1,1,0,0,1,0,1.42A1,1,0,0,1,22,29.73Z"></path>
                    </svg>
                    {!min && <p>Messages</p>}
                    <div className="imgdiv"><img src="/svg/Edit.svg" alt="Edit" /></div>
                </div>
                {!min && <p className="req">Request</p>}
            </div>
            <div className="div2">
                {lod ? (
                    <div className="loaderr">
                        <ContentLoader viewBox="0 0 380 600">
                            <circle cx="50" cy="70" r="40" />
                            <rect x="100" y="50" rx="5" ry="5" width="230" height="12" />
                            <rect x="100" y="80" rx="5" ry="5" width="170" height="11" />
                            <circle cx="50" cy="200" r="40" />
                            <rect x="100" y="180" rx="5" ry="5" width="230" height="12" />
                            <rect x="100" y="210" rx="5" ry="5" width="150" height="11" />
                            <circle cx="50" cy="330" r="40" />
                            <rect x="100" y="310" rx="5" ry="5" width="230" height="12" />
                            <rect x="100" y="340" rx="5" ry="5" width="150" height="11" />
                        </ContentLoader>
                    </div>
                ) : (
                    msginfos.length > 0 ? (
                        [...msginfos].reverse().map((msginfo, ind) => (
                            <div style={msginfo?.chatWith?.username === user ?{border:"1px solid rgb(235,235,235)",boxShadow: "-2px 2px 5px rgba(0, 0, 0, 0.05)"}:{}} className="onemsg" key={ind} onClick={() => handleClick(ind)}>
                                <Onemsg chatwith={msginfo.chatWith} msginfo={msginfo.lastMessage} min={min} />
                            </div>

                        ))
                    ) : (
                        <>
                            <p className="nomsgg">You have no messages</p>
                            <p className="snmsgg">message</p>
                        </>
                    )
                )}
            </div>
        </div>
    );
}
