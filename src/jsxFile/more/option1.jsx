import "../../cssFile/more-css/option1.css";
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import Loader2 from "../collect/loader2.jsx";
import { today } from "../../../utils/today.js"
import { useNavigate } from "react-router-dom";

export default function Option1({ setResponseMessage, msg, setOpton, user }) {
    const navigate = useNavigate();
    const [swch, setSwch] = useState(0);
    const [lod2, setLod2] = useState(false);
    const [text, setText] = useState({ username: "", password: "", oldpass: "", newpass: "", newpass2: "", mobile: "", email: "", otp: "" });
    const [err, setErr] = useState({ msg: "", color: "rgb(150,150,150)" });
    const latestValueRef = useRef("");
    const remainingDays = Math.max(7 - Math.floor((new Date() - new Date(user?.lastUsernameUpdate.datex)) / (1000 * 60 * 60 * 24)), 0);
    const [myotp, setMyotp] = useState({ expire: 300, resend: 30, timer: false, otp: "ANSHU" })
    let mytym;


    useEffect(() => {
        if (myotp.timer) {
            mytym = setInterval(() => {
                setMyotp((prev) => {
                    const newResend = prev.resend > 0 ? prev.resend - 1 : prev.resend;
                    const newExpire = prev.expire > 0 ? prev.expire - 1 : prev.expire;

                    if (newExpire === 0) {
                        setMyotp({ expire: 0, resend: 0, otp: "ANSHU", timer: false });
                        clearInterval(mytym);
                    }

                    return { ...prev, resend: newResend, expire: newExpire };
                });
            }, 1000);
        }

        return () => {
            if (mytym) {
                clearInterval(mytym);
            }
        };
    }, [myotp.timer]);



    const debounce = (func, delay) => {
        let timeoutId;
        return (...args) => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    };

    const debouncedChangeHandler = useCallback(
        debounce(async (value) => {
            if (!value.trim()) return;

            latestValueRef.current = value;
            if (value.length < 4) {
                setErr({ color: "red", msg: `username must be at least 4 characters.` });
                latestValueRef.current = "";
                return;
            }
            setLod2(true);

            try {
                const result = await axios.post(`http://localhost:8080/usernameExist/${value}`);
                setLod2(false);
                if (result.data.color === "red") {
                    setResponseMessage({ color: "red", msg: "Something went wrong." });
                    return;
                }

                if (latestValueRef.current === value) {
                    setErr(result.data.exists
                        ? { color: "orange", msg: "Username already in use. Pick a new one." }
                        : { color: "green", msg: "Great choice, this username is unique" });
                }

            } catch (error) {
                setLod2(false);
                setResponseMessage({ color: "red", msg: "Something went wrong." });
                setErr({ color: "red", msg: "Something went wrong." });
            }
        }, 700),
        []
    );

    useEffect(() => {
        document.body.style.overflow = "hidden";
        if (window.innerWidth > 500) {
            document.body.style.paddingRight = "7px";
        }


        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, []);



    const handleText = (ev) => {
        const { name, value } = ev.target;

        if ((name === "username" && (!/^[a-z0-9._]+$/.test(value) || value.startsWith(".") || /\.\./.test(value) || value.length > 26)) ||
            (name === "mobile" && value.length > 10) ||
            (name === "email" && /[^a-zA-Z0-9._%+-@]/.test(value)) ||
            (name === "otp" && value.length > 5)) {
            console.log(name, value.length)
            return;
        }

        setText((pre) => ({ ...pre, [name]: value }))
        setErr({ msg: "", color: "rgb(150,150,150)" });


        if (name === "username") {
            debouncedChangeHandler(value);
        }
    };


    const chngUsernamedata = async function () {
        if (text.password.length < 6) {
            setErr({ msg: "Password must be at least 6 characters", color: "red" });
            return;
        }
        try {
            setLod2(true); 
            const response = await axios.post(`http://localhost:8080/changemyusername`,
                { username: text.username, password: text.password }, { withCredentials: true });
            setLod2(false);

            if (response.data?.message === "Login required.") {
                setResponseMessage(response.data);
                await navigate("/Login");
                return;
            }
            if (response.data?.color === "green") {
                setResponseMessage(response.data);
                setOpton({ msg: "", open: false })

                return;
            }

            setErr({ color: response.data.color, msg: response.data.message });

        } catch (error) {
            setLod2(false);
            setResponseMessage({
                message: error.response?.data?.message || "Something went wrong",
                color: "red",
            });
        }
    }

    const savepasshandle = async function () {
        if (text.oldpass !== "" && text.newpass2 !== "" && text.newpass !== "") {
            if (text.oldpass.length < 6) {
                setErr({ msg: "Old password must be at least 6 characters", name: "oldpass", color: "red" });
            } else if (text.newpass.length < 6) {
                setErr({ msg: "New password must be at least 6 characters", name: "newpass", color: "red" });
            } else if (text.oldpass === text.newpass) {
                setErr({ msg: "Try a different password from the old one.", name: "newpass", color: "red" });
                setText((pre) => ({ ...pre, newpass: "", newpass2: "" }))
            } else if (text.newpass2 !== text.newpass) {
                setErr({ msg: "New password not confirmed.", name: "newpass2", color: "red" });
                setText((pre) => ({ ...pre, newpass2: "" }))
            } else if (text.newpass2 === text.newpass) {
                setErr({ msg: "Wait, we need to check your old password.", color: "green" });
                setLod2(true)
                try {
                    setLod2(true);
                    const response = await axios.post(`http://localhost:8080/changemypassword`,
                        { text }, { withCredentials: true });
                    setLod2(false);

                    if (response.data?.message === "Login required.") {
                        setResponseMessage(response.data);
                        await navigate("/Login");
                        return;
                    }
                    if (response.data?.color === "green") {
                        setResponseMessage(response.data);
                        setOpton({ msg: "", open: false })
                        return;
                    }

                    setErr({ color: response.data.color, msg: response.data.message, name: response.data.name || "" });
                    if (response.data.name) {
                        setText((pre) => ({ ...pre, [response.data.name]: "" }))
                    }

                } catch (error) {
                    setLod2(false);
                    setResponseMessage({
                        message: error.message || "Something went wrong",
                        color: "red",
                    });
                }

            } else {
                setErr({ msg: "Invalid password.", color: "red" });
                setText((pre) => ({ ...pre, oldpass: "", newpass: "", newpass2: "" }))
            }
        }

    }

    const updatenumberhandle = async function () {
        console.log(text.mobile)
        try {
            setLod2(true);
            const response = await axios.post(`http://localhost:8080/changemymobile`,
                { mobileno: text.mobile }, { withCredentials: true });
            setLod2(false);

            if (response.data?.message === "Login required.") {
                setResponseMessage(response.data);
                await navigate("/Login");
                return;
            }
            if (response.data?.color === "green") {
                setResponseMessage(response.data);
                setOpton({ msg: "", open: false })
                return;
            }

            setErr({ color: response.data.color, msg: response.data.message });

        } catch (error) {
            setLod2(false);
            setResponseMessage({
                message: error.response?.data?.message || "Something went wrong",
                color: "red",
            });
            setText((pre) => ({ ...pre, oldpass: "", newpass: "", newpass2: "" }))
        }
    }
    const otohandle = async function () {
        try {
            setLod2(true)
            const response = await axios.post('http://localhost:8080/otp/change', { email: text.email, name: user.fname },
                { withCredentials: true });
            setLod2(false)

            if (response.data?.message === "Login required.") {
                setResponseMessage(response.data);
                await navigate("/Login");
                return;
            }
            if (response.data.color === "red") {
                setErr({ msg: response.data.message, color: response.data.color })
                return
            }
            setResponseMessage(response.data)
            setSwch(2)
            setMyotp({ expire: 300, resend: 30, timer: true, otp: response.data.otp })

        } catch (error) {
            setResponseMessage({
                message: error.message ? error.message : 'An error occurred',
                color: "red"
            });
        }
    }
    async function chngemaildata() {
        if (text.otp === myotp.otp) {
            try {
                setLod2(true);
                const response = await axios.post(`http://localhost:8080/changemyemail`,
                    { emailid: text.email }, { withCredentials: true });
                setLod2(false);

                if (response.data?.message === "Login required.") {
                    setResponseMessage(response.data);
                    await navigate("/Login");
                    return;
                }
                if (response.data?.color === "green") {
                    setResponseMessage(response.data);
                    setOpton({ msg: "", open: false })
                    return;
                }

                setErr({ color: response.data.color, msg: response.data.message });

            } catch (error) {
                setLod2(false);
                setResponseMessage({
                    message: error.response?.data?.message || "Something went wrong",
                    color: "red",
                });
                setText((pre) => ({ ...pre, otp: "" }))
            }
        } else {
            setErr({ color: "red", msg: "Invalid OTP" })
        }
    }
    return (
        <div className="option1">
            {lod2 && <Loader2 />}
            <div className="toput">
                <svg
                    className="bbu" onClick={() => {
                        if (swch === 1) { setSwch(0); setErr({ color: "green", msg: "Great choice, this username is unique" }) }
                        else if (swch === 2) { setSwch(0); setMyotp({ expire: 300, resend: 0, otp: "ANSHU", timer: false }); clearInterval(mytym); setErr({ color: "rgb(150,150,150)", msg: "" }) }
                        else { setOpton({ msg: "", open: false }); }
                    }} viewBox="0 0 32 32" >
                    <path d="M22,29.73a1,1,0,0,1-.71-.29L9.93,18.12a3,3,0,0,1,0-4.24L21.24,2.56A1,1,0,1,1,22.66,4L11.34,15.29a1,1,0,0,0,0,1.42L22.66,28a1,1,0,0,1,0,1.42A1,1,0,0,1,22,29.73Z"></path>
                </svg>
                <p>{msg}</p>
            </div>
            <div className="mainprt">
                {swch === 0 ?
                    <>
                        {
                            msg === "Change username" &&
                            <>
                                {
                                    !user?.lastUsernameUpdate?.is ? (
                                        <p className="inform">
                                            Once you change your username, you will be able to change it again after <span>one week</span>.
                                        </p>
                                    ) : <p className="inform">After changing your username, you can update it again in one week. Last changed on {today(user?.lastUsernameUpdate.datex)} and <span style={{ color: remainingDays > 0 ? "red" : "green" }}>you can update it {remainingDays > 0 ? ` again after ${remainingDays} days.` : " now."} </span>  </p>

                                }

                                <div style={remainingDays > 0 ? { opacity: ".5" } : { opacity: "1" }} className="chngusername">
                                    <label htmlFor="ijh">New username</label>
                                    <input disabled={remainingDays > 0 ? true : false} style={{ borderBottom: `1px solid ${err.color}` }} id="ijh" autoFocus className="inp1" type="text" name="username" onChange={handleText} value={text.username} placeholder="E.g: who.is.anshu" autoComplete="off" spellCheck="false" />
                                    {err.color !== "rgb(150,150,150)" &&
                                        <p style={{ color: err.color }} className="alerthai"> {err.msg} </p>
                                    }

                                </div>
                                {text.username !== "" && text.username !== user?.username && err.color === "green" && (
                                    <div onClick={() => { setSwch(1); setErr({ msg: "", color: "rgb(150,150,150)" }) }} className="clckbtn">Process</div>
                                )}
                            </>}{
                            msg === "Change password" &&
                            <>
                                <p className="inform">You can easily update your password in a few steps by entering your <span><label htmlFor="gyg">old password</label></span>, your <span><label htmlFor="ytd">new password</label></span> and then confirming the <span>  <label htmlFor="gg">new password</label></span>.</p>



                                <form className="chngusername">
                                    <label htmlFor="gyg">Old password</label>
                                    <input style={err.name === "oldpass" ? { borderBottom: `1px solid red` } : { borderBottom: `1px solid rgb(150,150,150)` }} id="gyg" autoFocus className="inp1" type="password" name="oldpass" onChange={handleText} value={text.oldpass} placeholder="Your old password ?" autoComplete="off" spellCheck="false" />
                                    <label className="gap" htmlFor="ytd">New password</label>
                                    <input style={err.name === "newpass" ? { borderBottom: `1px solid red` } : { borderBottom: `1px solid rgb(150,150,150)` }} id="ytd" className="inp1" type="password" name="newpass" onChange={handleText} value={text.newpass} placeholder="Set new password." autoComplete="off" spellCheck="false" />
                                    <label className="gap" htmlFor="gg">Confirmed password</label>
                                    <input style={err.name === "newpass2" ? { borderBottom: `1px solid red` } : { borderBottom: `1px solid rgb(150,150,150)` }} id="gg" className="inp1" type="text" name="newpass2" onChange={handleText} value={text.newpass2} placeholder="confirm your new password." autoComplete="off" spellCheck="false" />

                                    {err.color !== "rgb(150,150,150)" &&
                                        <p style={{ color: err.color }} className="alerthai"> {err.msg} </p>
                                    }

                                </form>
                                <a href="/Forgot/More" className="forgit">Forgot your password?</a>
                                {text.oldpass !== "" && text.newpass2 !== "" && text.newpass !== "" && <div onClick={savepasshandle} className="clckbtn">Update</div>}
                            </>
                        }{
                            msg === "Update phone no." &&
                            <>
                                <p className="informm">Mobile no : {user.mobile}</p>
                                <p className="inform">You can easily update  by entering your <span><label htmlFor="uyh">Phone number</label></span> and OTP which is send to your new phone number. <br />( Note: mobile must contain 10 digits. )</p>
                                <form className="chngusername">
                                    <label htmlFor="uyh">Mobile no.</label>
                                    <input style={{ borderBottom: `1px solid ${err.color}` }} id="uyh" autoFocus className="inp1" type="number" name="mobile" onChange={handleText} value={text.mobile} placeholder="Your new phone number ?" autoComplete="off" spellCheck="false" />
                                    {err.color !== "rgb(150,150,150)" &&
                                        <p style={{ color: err.color }} className="alerthai"> {err.msg} </p>
                                    }
                                </form>
                                {text.mobile.length === 10 && <div onClick={updatenumberhandle} className="clckbtn">Change</div>}
                            </>
                        }{
                            msg === "Update email" &&
                            <>
                                <p className="informm">Email : {user.email}</p>
                                <p className="inform">You can easily update  by entering your new <span><label htmlFor="jhjk">Email id</label></span> and OTP which is send to your new email id. <br /></p>
                                <form className="chngusername">
                                    <label htmlFor="jhjk">Email id</label>
                                    <input style={{ borderBottom: `1px solid ${err.color}` }} id="jhjk" autoFocus className="inp1" type="email" name="email" onChange={handleText} value={text.email} placeholder="Your new email id ?" autoComplete="off" spellCheck="false" />
                                    {err.color !== "rgb(150,150,150)" &&
                                        <p style={{ color: err.color }} className="alerthai"> {err.msg} </p>
                                    }
                                </form>
                                {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.email) && <div onClick={otohandle} className="clckbtn">Next</div>}
                            </>
                        }</>
                    : swch === 1 ?
                        <div className="passwrd">
                            <p className="myser">{text.username}</p>
                            <p>Please enter your password to proceed with changing your username.</p>
                            <input style={{ borderBottom: `1px solid ${err.color}` }} id="ijh" autoFocus className="inp1" type="text" name="password" onChange={handleText} value={text.password} placeholder="Your password ?" autoComplete="off" spellCheck="false" />
                            <a href="/Forgot/More" className="forgit">Forgot your password?</a>
                            {err.color !== "rgb(150,150,150)" &&
                                <p style={{ color: err.color }} className="alerthai"> {err.msg} </p>
                            }
                            {text.password.length >= 1 && <div onClick={chngUsernamedata} className="clckbtn">Done</div>}
                        </div>
                        : swch === 2 ?
                            <div className="passwrd">
                                <p className="myser">{text.username}</p>
                                <p>Please enter 5 digit <b><label htmlFor="uy">OTP</label></b> that was send to your email : <b>{text.email}</b></p>
                                <input style={{ borderBottom: `1px solid ${err.color}` }} id="uy" autoFocus className="inp1" type="number" name="otp" onChange={handleText} value={text.otp} placeholder="Your OTP ?" autoComplete="off" spellCheck="false" />

                                {err.color !== "rgb(150,150,150)" &&
                                    <p style={{ color: err.color }} className="alerthai"> {err.msg} </p>
                                }
                                <div style={text.otp.length >= 5 ? {} : { cursor: "no-drop", opacity: ".3" }} onClick={chngemaildata} className="clckbtn">Change</div>
                                <br />
                                <p className="otprel">Didn't receive the OTP? {myotp.resend === 0 ? <span onClick={otohandle} className="nowar">Resend</span> : <>Resend in  <b>{myotp.resend}</b> seconds.</>}</p>
                                <p className="otprel" >{myotp.expire === 0 ? <span className="war">Your OTP was expired.</span> : <>The OTP will expire in <b>{myotp.expire}</b> seconds.</>}</p>
                            </div>
                            : <></>
                }
            </div>
        </div>
    );
}
