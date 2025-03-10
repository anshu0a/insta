import { useEffect, useState } from "react"
import "../../cssFile/form.css"
import "../../cssFile/forgot-css/formForgot.css"
import axios from "axios"
import Loader2 from "../collect/loader2.jsx"
import SearchOpt from './searchopt'
import Otpoptions from './otpoptions'
import Page2 from './page2'
import TextField from '@mui/material/TextField';
import { useNavigate , useParams} from "react-router-dom";


export default function Form({ setResponseMessage }) {
    const navigate = useNavigate();
    const { whereigo } = useParams();
    const [lod2, setLod2] = useState(false)
    const [info, setInfo] = useState({ username: "", email: "", mobile: "", otp: "", newpass: "", newpass2: "" })
    const [error, setError] = useState({})
    const [page, setPage] = useState({ no: 1, type: 1 })
    const [searchOpt, setSearchOpt] = useState(false)
    const [myotp, setMyOtp] = useState({ otp: "", on: "", otpOpt: false, resend: false, timer: false })
    const [user, setUer] = useState({ selected: {}, all: [] })
    let [count, setCount] = useState({ resend: 30, expire: 300 })
    let mytym;
    useEffect(() => {


        if (myotp.timer) {
            mytym = setInterval(() => {
                setCount((prev) => {
                    const newResend = prev.resend > 0 ? prev.resend - 1 : prev.resend;
                    const newExpire = prev.expire > 0 ? prev.expire - 1 : prev.expire;

                    if (newResend === 0 && !myotp.resend) {
                        setMyOtp((prevOtp) => ({ ...prevOtp, resend: true }));
                    }

                    if (newExpire === 0) {
                        setMyOtp((prevOtp) => ({ ...prevOtp, otp: "", timer: false }));
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
    }, [myotp.timer, myotp.resend]);



    const handleInp = function (ev) {
        const { name, value } = ev.target;

        if (
            (name === "otp" && (!/^[0123456789]*$/.test(value) || value.length > 5)) ||
            (name === "username" && !/^[a-z_.0-9]*$/.test(value)) ||
            (name === "email" && /[^a-zA-Z0-9._%+-@]/.test(value))
        ) {
            return;
        }

        setInfo((old) => ({ ...old, [name]: value.trim() }));


        if (value.length === 5 && name === "otp") {
            if (value === myotp.otp) {
                setPage((prev) => ({ ...prev, no: 4 }));
                setMyOtp((pre) => ({ ...pre, timer: false }))
                clearInterval(mytym);
            } else if (!myotp.timer) {
                setError((old) => ({ ...old, otpError: "OTP was expired." }));
            } else {
                setError((old) => ({ ...old, otpError: "Wrong OTP." }));
            }
        }


    };


    const handleClick = async function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let requests = page.type === 1 ? "username" : page.type === 2 ? "email" : page.type === 3 ? "mobile" : undefined
        let errortype = page.type === 1 ? "usernameError" : page.type === 2 ? "emailError" : page.type === 3 ? "mobileError" : page.no === 3 ? "otpError" : undefined

        if (info.username === "" && page.type === 1) {
            setError((old) => { return { ...old, usernameError: "Username is empty" } })
        } else if (info.email === "" && page.type === 2) {
            setError((old) => { return { ...old, emailError: "Email id is empty" } })
        } else if (info.mobile === "" && page.type === 3) {
            setError((old) => { return { ...old, mobileError: "Mobile number is empty" } })
        } else if (!emailRegex.test(info.email) && page.type === 2) {
            setError((old) => { return { ...old, emailError: "Email is not valid" } })
        } else {
            try {
                const response = await axios.post(`https://instaserver-knen.onrender.com/forgot/${requests}`, { info });

                if (response.data.color === "red") {
                    setError((old) => { return { ...old, [errortype]: response.data.message } })
                } else {
                    setUer((pre) => ({ ...pre, all: response.data }))
                    setPage((old) => { return { ...old, no: 2 } })
                }

            } catch (error) {
                setResponseMessage(error.response ? error.response.data : 'An error occurred');
            }
        }

    }

    async function sendotp(letter) {
        if (letter === "Whatsapp number") {
            setResponseMessage({ color: "red", message: "This feature is only for premium user." })
            return
        } else if (letter === "email id") {
            try {
                setLod2(true)
                const response = await axios.post('https://instaserver-knen.onrender.com/otp/change', { email: user?.selected?.email, name: user?.selected?.fname },
                    { withCredentials: true });
                setLod2(false)
                setResponseMessage(response.data);
                if (response.data.color === "red") { return }
                setCount({ resend: 30, expire: 300 })
                setMyOtp({ otpOpt: false, on: letter, otp: response.data?.otp, timer: true })
                setPage((pre) => ({ ...pre, no: 3 }))

            } catch (error) {
                setResponseMessage({
                    message: error.message ? error.message : 'An error occurred',
                    color: "red"
                });
            }
        }



    }

    function myemail(email) {
        const [name, domain] = email.split("@");
        if (name.length < 3) {
            return (name.slice(0, 2) + "@" + domain)
        } else if (name.length < 5) {
            return (name.slice(0, 2) + "**@" + domain)
        }
        const maskedName = name.slice(0, 2) + "***" + name.slice(-2);
        return `${maskedName}@${domain}`;
    }

    async function setnewpassword() {
        setError({});
        if (info.newpass === "") {
            setError((old) => ({ ...old, newpassError: "Password is empty" }));
        } else if (info.newpass2 === "") {
            setError((old) => ({ ...old, newpass2Error: "Enter the same password again" }));
        } else if (info.newpass.length < 6) {
            setError((old) => ({ ...old, newpassError: "Password must be greater than 5 characters" })); // Correct field
        } else if (info.newpass2 !== info.newpass) {
            setError((old) => ({ ...old, newpass2Error: "Both passwords do not match" }));
        } else {
            try {
                setLod2(true)
                const response = await axios.post('https://instaserver-knen.onrender.com/changepassword', { newpass: info.newpass, newpass2: info.newpass2, _id: user?.selected?._id }
                    , { withCredentials: true });
                setLod2(false)
                setResponseMessage(response.data);
                if (response.data.color === "green") {
                    if(whereigo ==="login"){
                        await navigate("/Home");
                    }else{
                        await navigate(-1);
                    }
                    setPage({ page: 1, no: 1 })
                }


            } catch (error) {
                setResponseMessage({
                    message: error.message ? error.message : 'An error occurred',
                    color: "red"
                });
            }

        }
    }
    return (
        <>
            {lod2 && <Loader2 />}
            {page.no === 1 ?

                <> {
                    page.type === 1 ? <>
                        <h2 className="what">Search by username</h2>
                        <TextField
                            autoComplete="off"
                            spellCheck={false}
                            className="textField"
                            placeholder="Your username ?"
                            error={Boolean(error.usernameError)}
                            helperText={error.usernameError}
                            label="Username"
                            variant="standard"
                            value={info.username}
                            onChange={handleInp}
                            name="username"
                            onKeyDown={(event) => event.key === "Enter" && handleClick()}
                        />

                    </> : page.type === 2 ? <>
                        <h2 className="what">Search by Email id</h2>
                        <TextField
                            autoComplete="off"
                            spellCheck={false}
                            className="textField"
                            placeholder="Your email id ?"
                            error={Boolean(error.emailError)}
                            helperText={error.emailError}
                            label="Email id"
                            variant="standard"
                            value={info.email}
                            onChange={handleInp}
                            name="email"
                            onKeyDown={(event) => event.key === "Enter" && handleClick()}
                        />
                    </> : page.type === 3 ? <>
                        <h2 className="what">Search by Mobile no.</h2>
                        <TextField
                            autoComplete="off"
                            spellCheck={false}
                            className="textField"
                            placeholder="Eg: 9876543210"
                            error={Boolean(error.mobileError)}
                            helperText={error.mobileError}
                            label="Mobile no. (+91)"
                            variant="standard"
                            value={info.mobile}
                            onChange={handleInp}
                            name="mobile"
                            onKeyDown={(event) => event.key === "Enter" && handleClick()}
                        />
                    </> :
                        <></>
                }
                    <div className="outbtn">
                        <button className="btn2" type="button" onClick={handleClick}>Search</button>
                    </div>
                    <p className="another" onClick={() => { setSearchOpt(true); setError({}); setInfo({ username: "", email: "", mobile: "", otp: "", newpass: "", newpass2: "" }) }}>Try another way to forgot your password</p>
                </>


                : page.no === 2 ?
                    <>
                        <div className="outwhat">
                            <img onClick={() => setPage((pre) => ({ ...pre, no: 1 }))} src="/svg/Back.svg" />
                            <h2 className="what">Choose your Account</h2>
                        </div>
                        <Page2 user={user} setMyOtp={setMyOtp} setUer={setUer} />
                    </>
                    : page.no === 3 ?
                        <>
                            <div className="outwhat">
                                <img onClick={() => setPage((pre) => ({ ...pre, no: 2 }))} src="/svg/Back.svg" />
                                <h2 className="what">Enter 6 digit otp </h2>
                            </div>
                            <p className="someinfo">we have send you 5-digit OTP on your {myotp.on} {myotp.on === "email id" ? myemail(user.selected?.email) : "ending with **" + user.selected?.mobile.toString().slice(-2)} </p>
                            <TextField
                                autoComplete="off"
                                spellCheck={false}
                                className="textField"
                                placeholder="Your OTP ?"
                                error={Boolean(error.otpError)}
                                helperText={error.otpError}
                                label="Enter OTP"
                                variant="standard"
                                value={info.otp}
                                onChange={handleInp}
                                name="otp"
                                onKeyDown={(event) => event.key === "Enter" && handleClick()}
                            />
                            <p className="my5resend">did't get otp ? {count.resend === 0 ? <span onClick={() => sendotp("email id")}>Resend</span> : <>{"don't worry you can resend in " + count.resend + " seconds"}</>}</p>
                            <p className="my5expire">{count.expire === 0 ? "Your otp was expired" : "Your otp will expire in " + count.expire + " seconds"}</p>
                        </>
                        : page.no === 4 ?
                            <>
                                <div className="outwhat">
                                    <img onClick={() => setPage((pre) => ({ ...pre, no: 2 }))} src="/svg/Back.svg" />
                                    <h2 className="what">Create new password </h2>
                                </div>
                                <TextField
                                    autoComplete="off"
                                    spellCheck={false}
                                    className="textField"
                                    placeholder="Set new password."
                                    error={Boolean(error.newpassError)}
                                    helperText={error.newpassError}
                                    label="New Password"
                                    variant="standard"
                                    value={info.newpass}
                                    onChange={handleInp}
                                    name="newpass"
                                />
                                <TextField
                                    autoComplete="off"
                                    spellCheck={false}
                                    className="textField"
                                    placeholder="verify New password"
                                    error={Boolean(error.newpass2Error)}
                                    helperText={error.newpass2Error}
                                    label="Re-enter new password"
                                    variant="standard"
                                    value={info.newpass2}
                                    onChange={handleInp}
                                    name="newpass2"
                                    onKeyDown={(event) => event.key === "Enter" && setnewpassword()}
                                />
                                <div className="outbtn">
                                    <button className="btn2" type="button" onClick={setnewpassword}>Save</button>
                                </div>

                            </>
                            : null}
            {searchOpt && <SearchOpt setSearchOpt={setSearchOpt} oldchoose={page.type} setError={setError} setPage={setPage} setInfo={setInfo} />}
            {myotp.otpOpt && <Otpoptions setResponseMessage={setResponseMessage} sendotp={sendotp} myemail={myemail(user.selected?.email)} setMyOtp={setMyOtp} user={user} />}
        </>
    )
}