
import { useEffect, useState, useRef } from "react"

import "../../cssFile/forgot-css/page2.css"



export default function page2({ oneuser, ind, setUer, user, setMyOtp }) {

    
    const handleclck = function () {
        setUer((pre) => ({ ...pre, selected: user.all[ind] }))
        setMyOtp({ otp: "", on: "", otpOpt: true })
    }

    return <div onClick={handleclck} className="oneuser">
        <img className="onepic" src={oneuser.pic.path}></img>
        <p className="pup"> {oneuser.username}</p>
    </div>

}