import "../../cssFile/more-css/more.css"
import Navbar from "../home/navbar.jsx";
import MainMsg from "./mainMore.jsx"
import React, {  useEffect, useState } from 'react';
import axios from 'axios';

export default function more({user, setResponseMessage, news, notimsg, }) {


    return (<div className="mymore">
        <Navbar setResponseMessage={setResponseMessage} notimsg={notimsg} news={news} userData={{ username: user?.username, _id: user?._id, pic: user?.pic?.path }} />
        <MainMsg news={news} user={user} setResponseMessage={setResponseMessage} />

    </div>)
}