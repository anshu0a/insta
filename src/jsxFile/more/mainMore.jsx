import "../../cssFile/more-css/mainmore.css"
import { useState } from "react"

import OneMore from "./oneMore"
import Option1 from "./option1"
import Option2 from "./option2"
import Option3 from "./option3"

export default function mainMore({ setResponseMessage, user }) {
    const [opton, setOpton] = useState({ open: false, msg: "" })
    const [opton2, setOpton2] = useState({ open: false, msg: "" })
    const [opton3, setOpton3] = useState({ open: false, msg: "" })

    return (
        <div className="mainmore">
            <div className="toput">
                <svg className="bbu" onClick={() => window.history.back()} viewBox="0 0 32 32">
                    <path d="M22,29.73a1,1,0,0,1-.71-.29L9.93,18.12a3,3,0,0,1,0-4.24L21.24,2.56A1,1,0,1,1,22.66,4L11.34,15.29a1,1,0,0,0,0,1.42L22.66,28a1,1,0,0,1,0,1.42A1,1,0,0,1,22,29.73Z"></path>
                </svg>
                <p>More Options</p>
            </div>
            <div className="middlePart">
                <div className="edtusrinfo">
                    <img onClick={() => window.location.href = `/Profile/${user?.username}`} src={user?.pic.path}></img>
                    <a href={`/List?B=${user?.badge.msg}`} style={{ backgroundColor: user?.badge.color, boxShadow: '0px 0px 15px rgba(' + user?.badge.color.split("(")[1].slice(0, -1) + ',.5)' }} className="badgx">{user?.badge.msg}</a>

                </div>
                <p className="infom">Edit info</p>
                <div className="layerd">
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/follow.svg"} msg="Change username" setOpton={setOpton} />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/lock.svg"} msg="Change password" setOpton={setOpton} />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/phoneno.svg"} msg="Update phone no." setOpton={setOpton} />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/emailid.svg"} msg="Update email" setOpton={setOpton} />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/forgot.svg"} msg="Forgot password" setOpton={setOpton} />
                </div>
                <p className="infom">My activity</p>
                <div className="layerd">
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/save2.svg"} msg="Saved" setOpton2={setOpton2} />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/link.svg"} msg="Attach Link" setOpton2={setOpton2} />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/relation.svg"} msg="Update relationship status" setOpton2={setOpton2} />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/block.svg"} msg="Block list" color="red" setOpton2={setOpton2} />
                </div>

                <p className="infom">In trouble?</p>
                <div className="layerd">
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/help.svg"} msg="Help" setOpton3={setOpton3} />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/suggestions.svg"} msg="Suggestions" setOpton3={setOpton3} />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/report.svg"} msg="Report a problem" color="red" setOpton3={setOpton3} />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/aboutus.svg"} msg="About me" setOpton3={setOpton3} />
                </div>

                <p className="infom">Reach us on socal media</p>
                <div className="layerd">
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/instagram.svg"} msg="Instagram" brf="true" />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/github.svg"} msg="Github" brf="true" />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/linkedin.svg"} msg="Linkedin" brf="true" />

                    <details>
                        <summary>
                            <OneMore setResponseMessage={setResponseMessage} src={"svg/mobile.svg"} msg="More Socal media" />
                        </summary>
                        <OneMore setResponseMessage={setResponseMessage} src={"svg/whatsapp.svg"} msg="Whatsapp" brf="true" />
                        <OneMore setResponseMessage={setResponseMessage} src={"svg/facebook.svg"} msg="Facebook" brf="true" />
                        <OneMore setResponseMessage={setResponseMessage} src={"svg/twitter.svg"} msg="Twitter" brf="true" />
                        <OneMore setResponseMessage={setResponseMessage} src={"svg/telegram.svg"} msg="Telegram" brf="true" />
                        <OneMore setResponseMessage={setResponseMessage} src={"svg/mail.svg"} msg="Mail" brf="true" />
                        <OneMore setResponseMessage={setResponseMessage} src={"svg/snapchat.svg"} msg="Snapchat" brf="true" />
                        <OneMore setResponseMessage={setResponseMessage} src={"svg/youtube.svg"} msg="Youtube" brf="true" />
                    </details>
                </div>
                <p className="infom">Logs</p>
                <div className="layerd">
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/login.svg"} msg="Login another account" brf="true" />
                    <OneMore setResponseMessage={setResponseMessage} src={"svg/logout.svg"} msg="Logout" color="red" brf="true" />
                </div>
                {opton.open && <Option1 user={user} setOpton={setOpton} msg={opton.msg} setResponseMessage={setResponseMessage} />}
                {opton2.open && <Option2 user={user} setOpton2={setOpton2} msg={opton2.msg} setResponseMessage={setResponseMessage} />}
                {opton3.open && <Option3 user={user} setOpton3={setOpton3} msg={opton3.msg} setResponseMessage={setResponseMessage} />}
            </div>
        </div>
    );
}
