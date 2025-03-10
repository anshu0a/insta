import "../../cssFile/home-css/one.css";
import React, { useEffect, useState } from "react";
import Crt from "./crt/crt.jsx";
import Notifications from "./notifications/noti.jsx";
import { handleImageError } from "../../../utils/handleImg.js";

export default function One({ name, userid, src, pic, notimsg, setNotix, userpic, setResponseMessage, alert }) {
    const [crt, setCrt] = useState(false);
    const [noti, setNoti] = useState(false);
    const [rednoti, setRednoti] = useState(false)

    useEffect(() => {
        if (setNotix) {
            setNotix(rednoti ? 1 : 0);
        }
    }, [rednoti]);


    useEffect(() => {
        if (crt || noti) {
            document.body.style.overflow = "hidden";
            if (document.body.clientWidth > 750) {
                document.body.style.marginRight = "7px";
            }
        } else {
            document.body.style.overflow = "auto";
            document.body.style.marginRight = "";
        }

        return () => {
            document.body.style.overflow = "auto";
            document.body.style.marginRight = "";
        };
    }, [crt, noti]);

    const toggleCrt = () => setCrt((prev) => !prev);
    const toggleNoti = () => setNoti((prev) => !prev);

    return (
        <>
            {name === "Create" || name === "Notifications" ? (
                <>
                    <div className={`one ${name}`} onClick={name === "Create" ? toggleCrt : toggleNoti} title={name}  >
                        <div className="outimg">
                            <img src={src} className={!pic ? `imgpic ${name}x` : null} style={crt && name === "Create" ? { transform: "rotateZ(45deg)" } : {}} onError={handleImageError} />
                            {noti ? (
                                rednoti && <div className="redukm"></div>
                            ) : (
                                alert?.startsWith("tru") && <div className="redukm"></div>
                            )}

                        </div>
                        <p className={`x${name}`}>{name}</p>

                    </div>
                    {crt && (
                        <Crt setResponseMessage={setResponseMessage} userpic={userpic} setCrt={setCrt} />
                    )}
                    {noti && !crt && (
                        <Notifications notimsg={notimsg} setRednoti={setRednoti} userid={userid} setResponseMessage={setResponseMessage} setNoti={setNoti} />
                    )}

                </>
            ) : (
                <a href={name.startsWith("@") ? `/profile/${name.slice(1)}` : `/${name.toLowerCase()}`}
                    className={`one ${name}`}
                    title={name}
                >
                    <div className="outimg">
                        <img src={src} className={!pic ? "imgpic" : null} style={pic ? { borderRadius: "50%" } : {}} onError={handleImageError} />
                        {alert?.startsWith("msg") && (
                            <div className="redu">
                                {alert.slice(3).length < 2 ? alert.slice(3) : ""}
                            </div>
                        )}
                    </div>
                    <p>{name}</p>
                </a>
            )}
        </>
    );
}
