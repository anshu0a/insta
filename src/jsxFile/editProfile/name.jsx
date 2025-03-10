
import "../../cssFile/editProfile-css/name.css"

import { useState, useCallback } from "react"
import axios from "axios";
import Loader2 from "../collect/loader2.jsx"
import { useNavigate } from "react-router-dom";

export default function name({ data, reload, setResponseMessage }) {
    const navigate = useNavigate();
    const [lod2, setLod2] = useState(false)
    const [war, setWar] = useState({ type: "none", msg: "username exist" })
    const [formData, setFormData] = useState({ fname: data.fname, lname: data.lname, username: data.username, bio: data.bio });
    const [showsv, setShowsv] = useState(false)



    function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            timeoutId = setTimeout(() => {
                func(...args);
            }, delay);
        };
    }



    const debouncedChangeHandler = useCallback(
        debounce(async (value) => {
            setLod2(true);
            try {
                const result = await axios.post(`http://localhost:8080/usernameExist/${value}`);
                setLod2(false);

                if (result.data.exists) {
                    setWar({ type: "username", msg: "Oops username exists!" });
                    setShowsv(false);
                } else {
                    setWar({ type: "gooduser", msg: "" });
                }
            } catch (error) {
                setLod2(false);
                setWar({ type: "error", msg: "Please try again later." });
            }
        }, 700),
        []
    );




    const handleChange = async function (e) {
        let { name, value } = e.target;

        if (name === "username") {
            value = value.replace(/[^a-zA-Z0-9_.]/g, "")
            value = value.toLowerCase();
        } else if (name === "fname" || name === "lname") {
            value = value.replace(/[^a-zA-Z]/g, "")
        }
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (name === "fname") {
            if (value === "") {
                setWar({ type: "firstname", msg: "Oops! first name is empty." })
                setShowsv(false);
            } else {
                if (data.fname !== value) {
                    setShowsv(true);
                } else if (data.lname !== formData.lname || data.bio !== formData.bio || data.username !== formData.username) {
                    setShowsv(true);
                } else {
                    setShowsv(false);
                }
            }
        } else if (name === "lname") {
            if (data.lname !== value) {
                setShowsv(true);
            } else if (data.fname !== formData.fname || data.bio !== formData.bio || data.username !== formData.username) {
                setShowsv(true);
            } else {
                setShowsv(false);
            }
        } else if (name === "username") {
            if (value === "") {
                setWar({ type: "username", msg: "Username is empty" })
                setShowsv(false);
            } else {
                if (data.username !== value) {
                    debouncedChangeHandler(value);
                    setShowsv(true);
                } else if (data.lname !== formData.lname || data.fname !== formData.fname || data.bio !== formData.bio) {
                    setShowsv(true);
                } else {
                    setShowsv(false);
                }
            }
        } else if (name === "bio") {
            console.log(data.bio, value)
            if (data.bio !== value) {
                setShowsv(true);
            } else if (data.fname !== formData.fname || data.lname !== formData.lname || data.username !== formData.username) {
                setShowsv(true);
            } else {
                setShowsv(false);
            }
        }

    };
    const bhezdu = async function () {

        try {
            setLod2(true);
            const response = await axios.post(`http://localhost:8080/updateName`, formData, {
                withCredentials: true,
            });
            setLod2(false);
            setShowsv(false);
        
            const { data } = response;
        
            if (data?.message === "Login required.") {
                setResponseMessage(data);
                await navigate("/Login");
                return;
            }
            
            setResponseMessage(data);
        
            reload.setReload(prev => !prev); 
        
        } catch (error) {
            setLod2(false); 
            setResponseMessage({ 
                message: error.response?.data?.message || "Something went wrong", 
                color: "red" 
            });
        } finally {
            setLod2(false); 
        }
        

    };


    return (

        <div className="edt3">
            {lod2 && <Loader2 />}
            <p>Update names</p>
            <div className="nm">
                <div style={war.type == "firstname" ? { border: "1px solid red" } : {}} className="brd">
                    <label htmlFor="fname" style={war.type == "firstname" ? { color: "red" } : {}}>First name</label>
                    <input id="fname" name="fname" value={formData.fname} onChange={handleChange} autoFocus={war.type == "firstname" ? true : false} spellCheck="false" maxLength="15" placeholder="your first name ?" type="text" ></input>
                </div>
                <div style={war.type == "lastname" ? { border: "1px solid red" } : {}} className="brd">
                    <label htmlFor="lname" style={war.type == "lastname" ? { color: "red" } : {}}>Last name</label>
                    <input id="lname" name="lname" value={formData.lname} onChange={handleChange} autoFocus={war.type == "lastname" ? true : false} spellCheck="false" maxLength="15" placeholder="your last name ?" type="text" ></input>
                </div>
            </div>
            <div style={war.type == "username" ? { border: "1px solid red" } : war.type == "gooduser" ? { border: "1px solid lightgreen" } : {opacity:".5",}} className="brd">
                <label htmlFor="username" style={war.type == "username" ? { color: "red" } : war.type == "gooduser" ? { color: "green" } : {}}>Username</label>
                <input disabled  id="username" name="username" value={formData.username} onChange={handleChange} autoFocus={war.type == "username" ? true : false} spellCheck="false" maxLength="26" placeholder="your username ?" type="text" ></input>
            </div>
            <div className="brd">
                <label htmlFor="bio" >Bio</label>
                <textarea id="bio" rows="5" name="bio" value={formData.bio} onChange={handleChange} spellCheck="false" maxLength="160" placeholder="Write somthing about yourself..." ></textarea>
            </div>
            <div className="outsave">
                <div className="war" style={(war.type !== "none" && war.type !== "gooduser") ? { display: "flex" } : { display: "none" }}  >
                    <img width="20px" src="svg/warning.svg"></img>
                    <p style={{ color: "red" }} >{war.msg}</p>
                </div>
                {showsv && <div onClick={bhezdu} className="save">Save change</div>}
            </div>
        </div>

    )
}