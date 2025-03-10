
import "../../cssFile/editProfile-css/edt6.css"


import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import React from "react";
import Switch from '@mui/material/Switch';
import Loader2 from "../collect/loader2.jsx"

export default function edt6({ data, reload,setResponseMessage }) {
    const [lod2, setLod2] = useState(false)
    const [sv, setSv] = useState(false)
    const [formData, setFormData] = useState({ search: "", badge: { color: data.badge.color, msg: data.badge.msg, show: data.badge.show } });
    const [search, setSearch] = useState([]);
    const colorx = { dark: ["rgb(25, 25, 112)", "rgb(0, 0, 139)", "rgb(85, 107, 47)", "rgb(139, 0, 0)", "rgb(128, 0, 128)", "rgb(72, 61, 139)", "rgb(0, 100, 0)", "rgb(139, 69, 19)", "rgb(105, 105, 105)", "rgb(70, 130, 180)", "rgb(46, 139, 87)", "rgb(60, 179, 113)", "rgb(34, 139, 34)", "rgb(128, 0, 0)", "rgb(0, 0, 128)"], light: ["rgb(255, 0, 0)", "rgb(0, 255, 0)", "rgb(0, 0, 255)", "rgb(255, 192, 203)", "rgb(255, 105, 180)", "rgb(255, 165, 0)", "rgb(144, 238, 144)", "rgb(173, 216, 230)", "rgb(250, 128, 114)", "rgb(152, 251, 152)", "rgb(255, 218, 185)", "rgb(221, 160, 221)", "rgb(176, 224, 230)", "rgb(255, 160, 122)", "rgb(175, 238, 238)", "rgb(240, 128, 128)", "rgb(255, 222, 173)", "rgb(189, 183, 107)", "rgb(238, 232, 170)", "rgb(127, 255, 212)", "rgb(0,0,0)", "rgb(50,50,50)"] }
    const sugg = ["influencer", "manager", "coder", "advisor", "farmer", "super hero", "hacker", "insta user", "doctor", "pilot", "doctor", "actor", "teacher", "house wife", "engineer", "doctor", "artist", "chef", "musician", "writer"]



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
            if (value !== "") {
                try {
                    const result = await axios.post(`https://instaserver-knen.onrender.com/badge/${value}`);
                    if (result.data.length !== 0) {
                        setSearch(result.data);

                    } else {
                        setSearch([]);
                    }
                } catch (error) {
                    setSearch([]);
                    setResponseMessage({color:"red",message:(error.response?.data?.message || error.message)});
                }
            } else {
                setSearch([]);
                setResponseMessage(null);
            }
        }, 700),
        []
    );
    



    const handleChange = (e) => {
        let { value } = e.target;
        value = value.replace(/[^a-zA-Z _.]/g, "")
        value = value.toLowerCase();

        setFormData((prev) => ({
            ...prev,
            search: value,
            badge: {
                ...prev.badge,
                msg: value,
            },
        }));
        debouncedChangeHandler(value);


    };


    function colorConverter(color) {
        if (color.startsWith('rgb')) {
            const match = color.match(/\d{1,3}/g);
            if (!match || match.length !== 3) {
                throw new Error('Invalid RGB format. Use rgb(r, g, b) with values between 0–255.');
            }

            const [r, g, b] = match.map(Number);
            if ([r, g, b].some(value => value < 0 || value > 255)) {
                throw new Error('RGB values must be between 0 and 255.');
            }

            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        }

        else if (color.startsWith('#')) {
            if (!/^#([A-Fa-f0-9]{6})$/.test(color)) {
                throw new Error('Invalid HEX format. Use #rrggbb.');
            }
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            return `rgb(${r}, ${g}, ${b})`;
        }

        else {
            throw new Error('Invalid format. Use rgb(r, g, b) or #rrggbb.');
        }
    }


    const handlePr = function (e) {
        const { className, id, innerText, value } = e.target
        if (className === "vv") {
            setFormData((prev) => ({
                ...prev,
                search: innerText,
                badge: {
                    ...prev.badge,
                    msg: innerText,
                },
            }));

        } if (className === "cc") {
            setFormData((prev) => ({
                ...prev,
                badge: {
                    ...prev.badge,
                    color: id,
                },
            }));
        } if (id === "ss") {

            setFormData((prev) => ({
                ...prev,
                badge: {
                    ...prev.badge,
                    show: !prev.badge?.show,
                },
            }));
        } if (className === "ii") {
            setFormData((prev) => ({
                ...prev,
                badge: {
                    ...prev.badge,
                    color: colorConverter(value)
                },
            }));
        }
    }





    const addbdge = async function (e) {
        const { className } = e.target;
    
        if ((formData.search !== data.badge.msg) && className === "adsh") {
            setLod2(true);
            try {
                const response = await axios.post(`https://instaserver-knen.onrender.com/changeBadge`, formData.badge, { withCredentials: true });
    
                if (response.data?.message === "Login required.") {
                    setResponseMessage(response.data);
                    await navigate("/Login");
                    return;
                }
    
                setResponseMessage(response.data);
    

                reload.setReload((prev) => !prev);
    
            } catch (error) {
                console.error("Error while changing badge:", error);
                setResponseMessage({
                    color: "red",
                    message: "Went wrong while updating your badge.",
                });
            } finally {
                setLod2(false);  
            }
        }

        setFormData((prev) => ({ ...prev, search: "" }));
    };
    

    return (
        <div className="edt6">
            {lod2 && <Loader2 />}
            <p>Update badge </p>
            <div className="swsw">
                <label htmlFor="ss">Show badge on your profile</label>
                <Switch onInput={handlePr} id="ss" checked={Boolean(formData?.badge?.show)} color="warning" ></Switch>
            </div>
            <div className="outclr">
                {<div style={{ backgroundColor: formData.badge.color, boxShadow: '0px 0px 15px rgba(' + formData.badge.color.split("(")[1].slice(0, -1) + ',.5)' }} className="edtbdge">{formData.badge.msg === "" ? data.badge.msg : formData.badge.msg}</div>}
                {(formData.search !== "" || formData.badge.color !== data.badge.color || formData.badge.show !== data.badge.show) && <div className="adsh" onClick={addbdge}>Add</div>}
            </div>
            <div className="bod">
                <div className="imgbox">
                    <input autoComplete="off" name="search" value={formData.search} onChange={handleChange} spellCheck="false" maxLength="20" placeholder="Search badge name . . ." type="text" />
                </div>
                <div onClick={handlePr} className="bdgebox">
                    {search.slice(0, 6).map((ind, cnt) => (
                        <div className="vv" key={cnt}>{ind.badge.msg}</div>
                    ))}
                </div>
                <p>or</p>
                <div onClick={handlePr} className="cntn">
                    {sugg.map((ind, cnt) => (<div className="vv" key={cnt}>{ind}</div>))}
                </div>
            </div>
            <p>Badge color </p>

            <div className="clrbox">
                <input className="ii" value={colorConverter(formData.badge.color)} onChange={handlePr} type="color" />
                {colorx.light.map((itm, ind) => (<div key={ind} id={itm} className="cc" onClick={handlePr} style={{ backgroundColor: itm }} ></div>))}
                {colorx.dark.map((itm, ind) => (<div key={ind} id={itm} className="cc" onClick={handlePr} style={{ backgroundColor: itm }} ></div>))}
            </div>

        </div>)
}