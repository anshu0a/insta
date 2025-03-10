import { useState } from "react"
import "../../cssFile/form.css"
import axios from "axios"
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import Loader2 from "../collect/loader2.jsx"

import Cookies from 'js-cookie';

export default function Form({ setResponseMessage }) {
    const navigate = useNavigate();
    const [lod2, setLod2] = useState(false)
    const [info, setInfo] = useState({ username: "", password: "", pic: "" })
    const [error, setError] = useState({ userE: "", passE: "" })
    const [askon, setAskon] = useState(false)


    const handleInp = function (ev) {

        if (ev.target.name === "use") {
            setInfo((old) => { return { ...old, username: ev.target.value.trim() } })
            setError((old) => { return { ...old, userE: "" } })
        } else if (ev.target.name === "pas") {
            setInfo((old) => { return { ...old, password: ev.target.value.trim() } })
            setError((old) => { return { ...old, passE: "" } })
        } else {
            return
        }
    }

    const getUsers = () => {
        const users = Cookies.get('users');
        return users ? JSON.parse(users) : [];
    };


    const addUser = (username, pic, password) => {
        let users = getUsers();
        users.push({ username, pic, password });
        Cookies.set('users', JSON.stringify(users), { expires: 30, secure: true, sameSite: 'Strict' });
    };


    const handlewhyslct = function (wht) {
        if (wht) {
            addUser(info.username, info.pic, info.password)
        }
        setAskon(false)
        navigate('/Home');
    }

    const removeUserByUsername = (username) => {
        try {
            let users = getUsers();
            users = users.filter(user => user.username !== username);
            Cookies.set('users', JSON.stringify(users), { expires: 30, secure: true, sameSite: 'Strict' });
        } catch (error) {
            console.error("Error removing user from cookies", error);
        }
    };


    const handleSubmit = async (e) => {
        setResponseMessage((pre) => ({ ...pre, message: "" }));
        setError({ useE: null, passE: null });
        e.preventDefault();

        if (info.username === "") {
            setError((old) => ({ ...old, userE: "Username is empty" }));
        } else if (info.password === "") {
            setError((old) => ({ ...old, passE: "Password is empty" }));
        } else {
            try {
                setLod2(true);
                const response = await axios.post('https://instaserver-knen.onrender.com/checkUser', info, {
                    withCredentials: true,
                });
                setLod2(false);

                if (response.data.message === "Login successful") {
                    setInfo((pre) => ({ ...pre, pic: response.data.pic }))

                    let users = getUsers();
                    if (!users.some(user => user.username === info.username)) {
                        setAskon(true);
                    } else {
                        removeUserByUsername(info.username);
                        addUser(info.username, response.data.pic, info.password)
                        navigate('/Home');
                    }

                }

                setResponseMessage(response.data);
            } catch (error) {
                console.error(error);
                setResponseMessage({
                    message: error.response ? error.response.data : 'An error occurred',
                    color: "red"
                });
            }
        }
    };

    return (<>
        {lod2 && <Loader2 />}
        <form >
            <TextField
                className="textField"
                placeholder="Eg: who.is.anshu"
                error={Boolean(error.userE)}
                helperText={error.userE}
                label="Username"
                variant="standard"
                value={info.username}
                onChange={handleInp}
                name="use"
            />
            <TextField
                className="textField"
                placeholder="your password here"
                error={Boolean(error.passE)}
                helperText={error.passE}
                label="Password"
                variant="standard"
                value={info.password}
                onChange={handleInp}
                name="pas"
            />
            <button onClick={handleSubmit} >
                Login
            </button>
        </form>
        {askon &&
            <div className="asktologin">
                <div className="indiv">
                    <p>Hey {info.username !== "" ? info.username : "there"} 👋<br /> <span>Can we save your login information</span></p>
                    <p className="msg">By saving your login information, you'll enjoy a seamless and secure experience with instant access, no need to remember passwords, and faster logins whenever you return</p>
                    <div className="loginbtn">
                        <div onClick={() => handlewhyslct(false)}>Cancel</div>
                        <div className="sv" onClick={() => handlewhyslct(true)} >Save</div>
                    </div>
                </div>
            </div>}
    </>)
}