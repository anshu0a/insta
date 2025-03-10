import { useState, useEffect } from "react";
import "../../cssFile/message-css/msgbox.css";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import Chatinfo from "./chatinfo.jsx";
import ContentLoader from "react-content-loader";

function Loader() {
  return (
    <ContentLoader viewBox="0 0 446 140">
      <circle cx="19" cy="25" r="16" />
      <rect x="39" y="12" rx="5" ry="5" width="220" height="10" />
      <rect x="40" y="29" rx="5" ry="5" width="220" height="10" />
      <circle cx="420" cy="71" r="16" />
      <rect x="179" y="76" rx="5" ry="5" width="220" height="10" />
      <rect x="179" y="58" rx="5" ry="5" width="220" height="10" />
      <circle cx="21" cy="117" r="16" />
      <rect x="45" y="104" rx="5" ry="5" width="220" height="10" />
      <rect x="45" y="122" rx="5" ry="5" width="220" height="10" />
    </ContentLoader>
  );
}

function EmptyState() {
  return (
    <div className="info">
      <svg viewBox="0 0 96 96">...</svg>
      <b className="pp">Your messages</b>
      <p>Send private photos and messages to a friend</p>
      <div className="snd">Send message</div>
    </div>
  );
}

export default function Msgbox({ setResponseMessage, news, user}) {
  const navigate = useNavigate();

  const [chatinfo, setChatinfo] = useState(null);
  const [lod, setlod] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const checkUser = async () => {
      if (user !== undefined) {
        try {
          const response = await axios.post(
            "https://instaserver-knen.onrender.com/checkUsername",
            { username: user },
            { withCredentials: true, signal }
          );
          if (response.data?.msg === "ok") {
            navigate("/Messages");
            setResponseMessage({ message: "User not exist", color: "red" });
          } else if (response.data?.msg === "no") {
            setChatinfo(response.data.user);
            setlod(false);
          } else if (response.data.message === "Login required.") {
            navigate("/Login");
            setResponseMessage(response.data);
          } else {
            setResponseMessage(response.data);
          }
        } catch (error) {
          if (axios.isCancel(error)) {
            console.log("Request canceled:", error.message);
          } else {
            setResponseMessage({ message: "Something went wrong", color: "red" });
          }
        }
      }
    };

    checkUser();
    return () => controller.abort();
  }, [user, navigate, setResponseMessage]);

  return (
    <div className="msgbox8">
      {lod && user !== undefined ? (
        <div className="lodu">
          <Loader />
          <Loader />
          <Loader />
        </div>
      ) : chatinfo ? (
        <Chatinfo news={news} user2={chatinfo} setResponseMessage={setResponseMessage} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
