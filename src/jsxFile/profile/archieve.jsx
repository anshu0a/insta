import "../../cssFile/profile-css/archieve.css"
import React, { useEffect, useRef, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader2 from "../collect/loader2.jsx";

export default function archieve({ post, setResponseMessage,setRes, setShowarc }) {
    const [lod2, setLod2] = useState(false);
    const mydivv = useRef(null)
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mydivv.current && !mydivv.current.contains(e.target)) {
                setShowarc(false)
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowarc]);

    const unarch = async (postid) => {
        try {
            setLod2(true);
            const response = await axios.post(
                `http://localhost:8080/editpostbio/notarc/${postid}`,
                { description: "" },
                { withCredentials: true }
            );

            if (response.data.message === "Login required.") {
                setResponseMessage(response.data);
                navigate("/Login");
                return;
            }

            setResponseMessage(response.data);
        } catch (error) {
            console.error("Full error:", error);

            setResponseMessage({
                message: "An error occurred",
                color: "red",
            });
        }

        finally {
            setLod2(false);
            setRes((pre) => ({ ...pre }))
        }
    };

    return (
        <div className="myarchx">
            <div ref={mydivv} className="indiv">
                <h3><img onClick={()=>setShowarc(false)} src='/svg/Back.svg'></img>Archieve</h3>
                <div className="boxu">
                    {post.length > 0 && post.some(post => post.archieve === true) ?
                        post.slice().reverse().map((str) => {
                            return str.archieve ? (
                                <div key={str._id} className="one1">
                                    <img src={str.postimg.path} alt="Post Image" />
                                    <svg onClick={()=>unarch(str._id)} viewBox="0 0 24 24" fill="none">
                                        <path d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195" stroke="rgb(200,200,200)" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M12 2L12 15M12 15L9 11.5M12 15L15 11.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                                    </svg>
                                </div>
                            ) : null;
                        })

                        :
                        <div className="nopost">
                            <img src="/svg/camera.svg"></img>
                            <p>No archieve</p>
                        </div>
                    }

                </div>
            </div>

        </div>)
}