
import "../../cssFile/editProfile-css/edt4.css"

import { useState } from "react"
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import React, { useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader2 from "../collect/loader2.jsx"

export default function edt4({ data, reload , setResponseMessage}) {
    const navigate = useNavigate();
    const [lod2, setLod2] = useState(false)
    const forDate = new Date(data.birthdate.datex).toISOString().split('T')[0]
    const [war, setWar] = useState({ type: "none", msg: "username exist" })
    const [formData, setFormData] = useState({ gender: { show: data.gender.show, value: data.gender.value }, birthdate: { datex: forDate, img: data.birthdate.img } });



    useEffect(() => {

        const elements = document.querySelectorAll('.icnn');
        elements[formData.birthdate.img - 1].style.backgroundColor = "rgb(193, 193, 193)"
        elements[formData.birthdate.img - 1].style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.31)"
        elements[formData.birthdate.img - 1].style.border = "1px solid rgb(200,200,200)"


        elements.forEach((element) => {
            element.addEventListener('click', function () {
                elements.forEach((element) => {
                    element.style.transition = ".2s ease"
                    element.style.backgroundColor = ""
                    element.style.boxShadow = ""
                    element.style.border = ""
                });
                this.style.transition = ".2s ease"
                this.style.backgroundColor = "rgb(193, 193, 193)"
                this.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.31)"
                this.style.border = "1px solid rgb(200, 200,200)"
            });
        });



    }, []);


    const handleChange = (e) => {
        let { name, value, className, id , checked} = e.target;


        if (name === "gender") {
            setFormData((prevState) => ({
                ...prevState,
                gender: { ...prevState.gender, value: value }

            }));
        }
        if (name === "genderon") {
            setFormData((prevState) => ({
                ...prevState,
                gender: { ...prevState.gender, show: !prevState.gender.show }

            }));
        }
        if (name === "bday") {
            const selectedDate = new Date(value);
            const currentDate = new Date();
            setFormData((prev) => ({
                ...prev,
                birthdate: { ...prev.birthdate, datex: value }
            }));

            if (!value || value.trim() === "") {
                setWar({ type: "bday", msg: "Your birth-date is not valid." });
            } else if (isNaN(Date.parse(value))) {
                setWar({ type: "bday", msg: "Invalid date format." });
            } else if (selectedDate > currentDate) {
                setWar({ type: "bday", msg: "Your birth-date cannot be in the future." });
            } else {
                setWar({ type: "none", msg: "" });

            }


        } if (className === "icnn") {
            setFormData((prev) => ({
                ...prev,
                birthdate: { ...prev.birthdate, img: id, }

            }));
        } if (id === "hh") {
            setFormData((prev) => ({
                ...prev,
                gender: {
                    ...prev.gender,
                    show: checked, 
                },
            }));
        }
    };
    const bhezoo = async function () {
        if (formData.gender.value !== data.gender.value || formData.gender.show !== data.gender.show || forDate !== formData.birthdate.datex || formData.birthdate.img !== data.birthdate.img) {
            try {
                setLod2(true);
                const response = await axios.post(`http://localhost:8080/changeGenderBday`, formData,{withCredentials:true});
                setLod2(false);
    
                if (response.data?.message === "Login required.") {
                    setResponseMessage(response.data);
                    await navigate("/Login");
                    return;
                }
                
                setResponseMessage(response.data);
                reload.setReload(prev => !prev); 
            } catch (error) {
                setLod2(false); 
                setResponseMessage({
                    message: error.response?.data?.message || "Something went wrong",
                    color: "red",
                });
            }
        }
    }
    

    return (
        <>
            <div className="edt4">
                 {lod2 && <Loader2 />}
                <p>Update gender</p>
                <RadioGroup
                    className="gender"
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue={data.gender.value}
                    name="gender"
                    onChange={handleChange}
                >
                    <FormControlLabel value="male" control={<Radio size="small" />} label=" ♂️ Male" />
                    <FormControlLabel className="ctr" value="female" control={<Radio size="small" />} label=" ♀️ Female" />
                    <FormControlLabel value="other" control={<Radio size="small" />} label="⚧️ Other" />
                </RadioGroup>
                <div className="showon">
                    <label htmlFor="hh">Show gender on your profile </label>
                    <Switch onChange={handleChange} name="genderon" id="hh" checked={Boolean(formData?.gender?.show)}  color="warning" ></Switch>
                </div>
                <hr />
                <div className="edt5">
                    <p>Update birthday</p>
                    <div style={war.type == "bday" ? { border: "1px solid red" } : {}} className="brd">
                        <label htmlFor="bday" style={war.type == "bday" ? { color: "red" } : {}}>Birthday</label>
                        <input id="bday" name="bday" value={formData.birthdate.datex} onChange={handleChange} placeholder="your birthday ?" type="date" ></input>
                    </div>
                    <p>Icons</p>
                    <div className="allicn">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <img className="icnn" onClick={handleChange} id={i + 1} key={i} width="30px" src={"/svg/bday/birth" + (i + 1) + ".svg"} alt="birthday icon" />
                        ))}
                    </div>
                </div>

            </div>
            <div className="outwar2">
                <div className="war2" style={(war.type !== "none") ? { display: "flex" } : { display: "none" }}  >
                    <img width="20px" src="svg/warning.svg"></img>
                    <p style={{ color: "red" }} >{war.msg}</p>
                </div>
                {(formData.gender.value !== data.gender.value || formData.gender.show !== data.gender.show || forDate !== formData.birthdate.datex || formData.birthdate.img !== data.birthdate.img)
                    && <div onClick={bhezoo} style={war.type == ("bday") ? { color: "red", backgroundColor: "rgb(255,245,245)", cursor: "no-drop" } : {}} className="save">Save change</div>}

            </div>

        </>)
}