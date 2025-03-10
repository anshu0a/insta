import { useEffect, useState, useRef } from "react"
import "../../cssFile/form.css"
import "../../cssFile/forgot-css/searchopt.css"


export default function OptOpt({ setMyOtp, sendotp, user, myemail }) {
    const myboxRef2 = useRef(null);
   

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (myboxRef2.current && !myboxRef2.current.contains(e.target)) {
                setMyOtp((pre) => ({ ...pre, otpOpt: false }))
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setMyOtp]);


    return <>
        <div className="ooppttyt">
            <div ref={myboxRef2} className="outlayer">
                <h3>Where we can send you OTP ? </h3>
                <p onClick={() => sendotp("email id")} > {"Email - " + myemail}</p>
                <p onClick={() => sendotp("Whatsapp number")} >{"Whatsapp no - ***" + user.selected.mobile.toString().slice(-2)} </p>

            </div>
        </div>
    </>

}