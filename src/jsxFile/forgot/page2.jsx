
import { useEffect, useState, useRef } from "react"
import Oneuser from "./oneuser"
import "../../cssFile/forgot-css/page2.css"

export default function page2({ user, setUer, setMyOtp }) {


    return <div className="page2">
        {user.all.map((oneus, ind) => (<Oneuser setMyOtp={setMyOtp} user={user} setUer={setUer} ind={ind} key={oneus._id} oneuser={oneus} />))}
    </div>

}