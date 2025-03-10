import "../../cssFile/more-css/onemore.css"
import axios from "axios"
import { useNavigate } from "react-router-dom";

export default function onemore({ setResponseMessage, src, msg, color, setOpton, setOpton2, setOpton3, brf }) {
    const navigate = useNavigate();
    const name = src.slice(4, -4)
    const links = {
        instagram: "https://www.instagram.com/who.is.anshu/?utm_source=qr&r=nametag",
        github: "https://github.com/anshu0a",
        linkedin: "https://www.linkedin.com/in/anshu-gupta-55769628a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
        twitter: "https://x.com/Anshuku88720752?t=DvWWwqRVu4fX1VxZ9yQ23A&s=09",
        telegram: "https://t.me/+916201909837",
        youtube: "https://www.youtube.com/@xtream.dose01",
        snapchat: "https://www.snapchat.com/add/anshu.kumar01",
        whatsapp: "https://wa.me/916201909837",
        facebook: "https://www.facebook.com/share/18mXPgBMp8/",
    };

    const loginanother = async function (typ) {
        try {

            const response = await axios.post(`http://localhost:8080/logoutuser`,
                {},
                { withCredentials: true }
            );

            if (response.data.message === 'Login required.' || response.data.color === "green") {
                setResponseMessage(response.data);
                typ === "login" ? navigate("/login", { replace: true }) : navigate("/Switch", { replace: true });
                window.location.reload();
                return;
            }

            setResponseMessage(response.data);
        } catch (error) {
            console.error('Fetch error:', error.message);
            setResponseMessage({
                message: error.response?.data?.message || 'An error occurred',
                color: 'red',
            });
        }
    };


    const handleClick = () => {
        if (name === "follow" || name === "lock" || name === "phoneno" || name === "emailid") {
            setOpton({ open: true, msg: msg })
        } else if (name === "forgot") {
            window.location.href = "/Forgot/More"
        } else if (name === "save2" || name === "link" || name === "relation") {
            setOpton2({ open: true, msg: msg })
        } else if (name === "help" || name === "suggestions" || name === "feed" || name === "report" || name === "aboutus") {
            setOpton3({ open: true, msg: msg })
        } else if (name === "mail") {
            window.location.href = "mailto:anshukumargupta000@gmail.com";
        } else if (name in links) {
            window.open(links[name], "_blank");
        } else if (name === "block") {
            setResponseMessage({ color: "Orange", message: "This feature is under development" });
        } else if (name === "login") {
            loginanother("login")
        } else if (name === "logout") {
            loginanother("logout")
        }
    };

    return (
        <>
            <div className={`onePaet ${name}`} onClick={handleClick} >
                <div className="inx">
                    <img src={src || "/default-image.png"} alt="User avatar" />
                    <p style={color ? { color } : {}}>{msg}</p>
                </div>
                {!brf && <img width="16px" style={{ opacity: ".1" }} src="/svg/bref.svg" />}
            </div>

        </>
    );
}

