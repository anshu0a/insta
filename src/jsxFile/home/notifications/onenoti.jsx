import "../../../cssFile/home-css/notifications-css/noti.css";
import { handleImageError } from "../../../../utils/handleImg.js"

export default function Onenoti({ setShowm, setShowpost, list, ind, readnoti }) {
    const senderImg =
        list.sendertype === "team" || list.sendertype === "msg"
            ? `/svg/team/${Math.ceil(Math.random() * 16)}.svg`
            : list.sendertype === "user" || list.sendertype === "respond" || list.sendertype === "follow" ?
                list.sender.pic.path
                : "";

    const handleNotificationClick = (e) => {
        const { className, nodeName } = e.target;

        if (
            nodeName === "svg" ||
            nodeName === "line" ||
            (nodeName === "DIV" && className === "ri")
        ) {

            setShowm({ show: true, msg: list.msg, img: senderImg, ind: ind, });
        } else if (nodeName === "IMG") {
            if (list.sendertype === "user" || list.sendertype === "respond" || list.sendertype === "follow") {
                window.location.href = "/profile/" + list?.sender.username
            }
        } else {
            if (list.sendertype === "team") {
                window.location.href = list?.url
            } else if (list.sendertype === "user") {
                setShowpost({ seen: true, postid: list.postid })
            } else if (list.sendertype === "follow") {
                window.location.href = "/profile/" + list?.sender.username
            }
            if (list.seen === false) {
                readnoti("read", list._id);
            }
        }
    };


    return (
        <div
            onClick={handleNotificationClick}
            className={list.seen ? "onexlist listseen" : "onexlist"}
        >
            <div className="le">
                <img onError={handleImageError} src={senderImg} alt="Sender" />
                <p className="msgn">{list.msg}</p>
            </div>
            <div className="ri">
                <svg viewBox="2 9.5 7 8">
                    <line strokeLinecap="round" strokeWidth="1.5" x1="5" x2="5" y1="9" y2="9" ></line>
                    <line strokeLinecap="round" strokeWidth="1.5" x1="5" x2="5" y1="14" y2="14" ></line>
                    <line strokeLinecap="round" strokeWidth="1.5" x1="5" x2="5" y1="19" y2="19" ></line>
                </svg>
            </div>
        </div>
    );
}
