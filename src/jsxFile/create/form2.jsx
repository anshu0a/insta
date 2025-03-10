import { useEffect, useState, useRef } from "react"
import "../../cssFile/form.css"
import "../../cssFile/create-css/form2.css"
import axios from "axios"

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

import Loader2 from "../collect/loader2.jsx"

export default function Form({ setResponseMessage }) {
    const navigate = useNavigate();
    const [lod2, setLod2] = useState(false)
    const [info, setInfo] = useState({ fname: "", lname: "", email: "", mobile: "", otp: "", user: "", pass: "", pass2: "", birthdate: "", gender: "male" })

    const [error, setError] = useState({})
    const [formno, setFormno] = useState({ no: 1 });
    const [resend, setResend] = useState({ second: 60, show: false, startTimer: false });
    const id = useRef(null);
    const [otp, setOtp] = useState({ no: null, timer: 300, show: false, loading: false, startTimer: false })
    const id2 = useRef(null);

    const handleInp = function (ev) {
        const { name, value } = ev.target;
        const trimmedValue = value.trim();
        setInfo((old) => ({ ...old, [name]: trimmedValue }));

    };



    const handleSubmit = async function (e) {
        e?.preventDefault();

        try {
            setLod2(true);

            const response = await axios.post('https://instaserver-knen.onrender.com/newUser', info, { withCredentials: true, });

            setResponseMessage(response.data);

            if (response.data?.color === "green") {
                await navigate('/Login');
            }

        } catch (error) {
            console.log(error);
            setResponseMessage({
                message: error.response?.data || 'An error occurred',
                color: "red"
            });
        } finally {
            setLod2(false);
        }
    };



    const handlecheck1 = async (e) => {
        if (e.target.innerText === "Back") {
            setFormno((old) => {
                if (old.no === 4) {
                    return { ...old, no: old.no - 2 }
                } else { return { ...old, no: old.no - 1 } }
            })
        }

        setError({ lnameE: null, fnameE: null, emailE: null, mobileE: null, otpE: null, userE: null, passE: null, pass2: null })

        const isnumber = /^[\p{L}]+$/u;

        if (formno.no === 1) {
            if (info.fname === "") {
                setError((old) => { return { ...old, fnameE: "First name is empty" } })
            } else if (info.lname != "" && !isnumber.test(info.lname)) {
                setError((old) => { return { ...old, lnameE: "Last name must be alphabet" } })
            } else if (!isnumber.test(info.fname)) {
                setError((old) => { return { ...old, fnameE: "first name must be alphabet" } })
            } else {
                setFormno((old) => { return { ...old, no: 2 } })
            }
        } else if (formno.no === 2) {

            if (info.email === "") {
                setError((old) => { return { ...old, emailE: "Email is empty" } })
            } else if (info.email.slice(-10) !== "@gmail.com") {
                setError((old) => { return { ...old, emailE: "Enter valid email" } })
            } else if ((info.mobile.length !== 10)) {
                setError((old) => { return { ...old, mobileE: "Enter valid Mobile no." } })
            } else if (e.target.innerText === "Next") {

                try {
                    setLod2(true);

                    const response = await axios.post('https://instaserver-knen.onrender.com/otp/create', {
                        email: info.email,
                        name: info.fname
                    });

                    setResponseMessage(response.data);

                    setFormno((old) => ({ ...old, no: 3 }));
                    setOtp((old) => ({ ...old, no: response.data.otp, startTimer: true }));
                    setResend((old) => ({ ...old, startTimer: true }));

                } catch (error) {
                    setResponseMessage({
                        message: error.response?.data || 'An error occurred',
                        color: "red"
                    });
                } finally {
                    setLod2(false);
                }


            }
        } else if (formno.no === 3) {
            const validButtons = ["Back", "Change"];
            if (validButtons.includes(e.target.innerText)) {
                clearInterval(id.current);
                setResend({ second: 60, show: false, startTimer: false });
                clearInterval(id2.current);
                setOtp({ timer: 300, no: null, show: false, loading: false, startTimer: false });
                setFormno((old) => { return { ...old, no: 2 } })
            }
            if (e.target.innerText === "Next" && info.otp === "") {
                setError((old) => { return { ...old, otpE: "Enter your 5 digit opt from email" } })
            } else if (e.target.innerText === "Next" && otp.no != info.otp) {
                setError((old) => { return { ...old, otpE: "Wrong otp code" } })
                setInfo((old) => { return { ...old, otp: "" } })
            } else if (e.target.innerText === "Next" && otp.no == info.otp) {
                setFormno((old) => { return { ...old, no: 4 } })
            }

        } else if (formno.no === 4) {


            if (e.target.innerText === "Next" && info.user === "") {
                setError((old) => { return { ...old, userE: "Username is empty" } })
            } else if (e.target.innerText === "Next" && info.user.length < 5) {
                setError((old) => { return { ...old, userE: "Username length must be greater then 4 digit" } })
            } else if (e.target.innerText === "Next" && info.user !== "") {

                try {
                    setLod2(true)
                    const response = await axios.post('https://instaserver-knen.onrender.com/checkUsername', { username: info.user });
                    setLod2(false)

                    if (response.data?.msg === "ok") {
                        if (e.target.innerText === "Next" && info.pass === "") {
                            setError((old) => { return { ...old, passE: "Password is empty" } })
                        } else if (e.target.innerText === "Next" && info.pass.length < 5) {
                            setError((old) => { return { ...old, passE: "Password length must be greater then 5 digit" } })
                        } else if (e.target.innerText === "Next" && info.pass2 === "") {
                            setError((old) => { return { ...old, pass2E: "You have to re-enter password" } })
                        } else if (e.target.innerText === "Next" && info.pass2 !== info.pass) {
                            setError((old) => { return { ...old, pass2E: "Password not match" } })
                            setInfo((old) => { return { ...old, pass2: "" } })
                        } else {
                            setFormno((old) => { return { ...old, no: 5 } })
                        }
                    } else {
                        setError((old) => { return { ...old, userE: "Username exist ( try another username )" } })
                    }


                } catch (error) {
                    setResponseMessage({
                        message: error.response ? error.response.data : 'An error occurred',
                        color: "red"
                    });
                }
            }
        } else if (formno.no === 5) {

            if (e.target.innerText === "Next" && info.birthdate === "") {
                setError((old) => { return { ...old, dateE: "Birthday is empty" } })
            } else if (e.target.innerText === "Next" && info.birthdate !== "") {
                setFormno((old) => { return { ...old, no: 6 } })
            }
        } else if (formno.no === 6) {
            if (e.target.innerText === "Create") {
                handleSubmit();
            }
        }
    };
    const reSendCode = async function () {
        setResend((old) => ({ ...old, show: false, startTimer: true }));
        setOtp((old) => ({ ...old, timer: 300, no: null, show: false, loading: true, startTimer: true }));

        try {
            setLod2(true)
            const response = await axios.post('https://instaserver-knen.onrender.com/otp/create', { email: info.email, name: info.fname });
            setLod2(false)
            setResponseMessage(response.data);
            setOtp((old) => ({ ...old, no: response.data.otp, loading: false, }));

        } catch (error) {
            setResponseMessage({
                message: error.response ? error.response.data : 'An error occurred',
                color: "red"
            });
        }
    };

    useEffect(() => {
        if (formno.no !== 3) return;

        if (resend.startTimer) {
            id.current = setInterval(() => {
                setResend((prev) => {
                    if (prev.second < 1) {
                        clearInterval(id.current);
                        return { ...prev, second: 60, startTimer: false, show: true };
                    }
                    return { ...prev, second: prev.second - 1 };
                });
            }, 1000);
        }

        return () => clearInterval(id.current);
    }, [resend.startTimer]);

    useEffect(() => {
        if (formno.no !== 3) return;

        if (otp.startTimer) {
            id2.current = setInterval(() => {
                setOtp((prev) => {
                    if (prev.timer < 1) {
                        clearInterval(id2.current);
                        return { ...prev, timer: 300, startTimer: false, show: true };
                    }
                    return { ...prev, timer: prev.timer - 1 };
                });
            }, 1000);
        }

        return () => clearInterval(id2.current);
    }, [otp.startTimer]);






    return (<>
        {lod2 && <Loader2 />}
        <form onSubmit={handleSubmit} className="form2">
            {formno.no === 1 ? (
                <>
                    <TextField
                        autoComplete="off"
                        spellCheck={false}
                        className="textField"
                        placeholder="Eg: hellen"
                        error={Boolean(error.fnameE)}
                        helperText={error.fnameE}
                        label="First name"
                        variant="standard"
                        value={info.fname}
                        onChange={handleInp}
                        name="fname"
                    />
                    <TextField
                        spellCheck={false}
                        className="textField"
                        placeholder="Eg : keller"
                        error={Boolean(error.lnameE)}
                        helperText={error.lnameE}
                        label="Last name (optional)"
                        variant="standard"
                        value={info.lname}
                        onChange={handleInp}
                        name="lname"
                    />
                </>
            ) : formno.no === 2 ? (
                <>
                    <TextField
                        spellCheck={false}
                        className="textField"
                        placeholder="Eg: exampl000@gmail.com"
                        error={Boolean(error.emailE)}
                        helperText={error.emailE}
                        label="Email "
                        variant="standard"
                        value={info.email}
                        onChange={handleInp}
                        name="email"
                    />
                    <TextField
                        type="number"
                        spellCheck={false}
                        className="textField"
                        placeholder="Eg : 9876543210"
                        error={Boolean(error.mobileE)}
                        helperText={error.mobileE}
                        label="Mobile no."
                        variant="standard"
                        value={info.mobile}
                        onChange={handleInp}
                        name="mobile"

                    />
                </>
            ) : formno.no === 3 ? (
                <>
                    <p className="emailp">We have send 5 digit otp code<br />on your email <span className="email">{info.email}</span> <span onClick={handlecheck1} className="chgemail">Change</span></p>

                    <TextField
                        spellCheck={false}
                        className="textField"
                        placeholder="Eg: xxxxx"
                        error={Boolean(error.otpE)}
                        helperText={error.otpE}
                        label="Enter OTP"
                        variant="standard"
                        value={info.otp}
                        onChange={handleInp}
                        name="otp"
                    />
                    <p className="emailp">{resend.show ? (<><span onClick={reSendCode} className="resend" >Re-send</span></>) : (<><span className="timer"> ( wait  {resend.second} sec for resend otp )</span></>)}</p>
                    <p className="emailwar">{otp.show ? <span>Code is expired re-send code again</span> : <span>code will <b>expire</b> in {otp.timer} sec , don't refresh the page.</span>}</p>
                </>
            ) : (formno.no === 4) ? (
                <>
                    <TextField
                        spellCheck={false}
                        className="textField"
                        placeholder="Eg : hellen87"
                        error={Boolean(error.userE)}
                        helperText={error.userE}
                        label="Create Username"
                        variant="standard"
                        value={info.user}
                        onChange={handleInp}
                        name="user"
                    />
                    <TextField
                        spellCheck={false}
                        autoComplete="ufgjhvjkbkj65"
                        type="password"
                        className="textField"
                        placeholder="Set strong password"
                        error={Boolean(error.passE)}
                        helperText={error.passE}
                        label="Password"
                        variant="standard"
                        value={info.pass}
                        onChange={handleInp}
                        name="pass"
                    />
                    <TextField
                        spellCheck={false}
                        type="text"
                        autoComplete="ufgjhvjkbkj65"
                        className="textField"
                        placeholder="Must be same password"
                        error={Boolean(error.pass2E)}
                        helperText={error.pass2E}
                        label="Re-enter password"
                        variant="standard"
                        value={info.pass2}
                        onChange={handleInp}
                        name="pass2"
                    />
                </>
            ) : (formno.no === 5) ? (
                <>
                    <RadioGroup
                        className="gender"
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="male"
                        name="gender"
                        onChange={handleInp}
                    >
                        <p>Your gender ?</p>
                        <FormControlLabel value="female" control={<Radio size="small" />} label="Female" />
                        <FormControlLabel value="male" control={<Radio size="small" />} label="Male" />
                        <FormControlLabel value="other" control={<Radio size="small" />} label="Other" />
                    </RadioGroup>
                    <TextField
                        focused
                        spellCheck={false}
                        type="date"
                        className="textField"
                        error={Boolean(error.dateE)}
                        helperText={error.dateE}
                        label="Your date of birth (Birthday)"
                        variant="standard"
                        value={info.birthdate}
                        onChange={handleInp}
                        name="birthdate"
                    />
                </>
            ) : (formno.no === 6) ? (
                <>
                    <div className="overview">
                        <h2>Account overview</h2>
                        <p><b>name : </b>{info.fname} {info.lname}</p>
                        <p><b>Email : </b>{info.email}</p>
                        <p><b>Mobile no. : </b>{info.mobile}</p>
                        <p><b>username : </b>{info.user}</p>
                        <p><b>Gender : </b>{info.gender}</p>
                        <p><b>Date of birth : </b>{info.birthdate}</p>
                    </div>
                </>
            ) : null}
            <div className="outbtn">
                {formno.no != 1 && (
                    <button type="button" className="btn1" onClick={handlecheck1}>Back</button>
                )}
                <button type="button" onClick={handlecheck1}>{formno.no === 6 ? "Create" : "Next"}</button>

            </div>
        </form>
    </>
    )
}