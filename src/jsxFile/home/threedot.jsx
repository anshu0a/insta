import "../../cssFile/home-css/threedot.css";
import React, { useEffect, useState, useRef } from "react";
import More from "./svgBtn/more.jsx"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader2 from "../collect/loader2.jsx";

export default function threedot({ setResponseMessage, user, post, setRes }) {
    const [lod2, setLod2] = useState(false);
    const mydivv = useRef(null)
    const navigate = useNavigate();
    const [divon, setDivon] = useState({ ison: false, page: 0, description: post.description })

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (mydivv.current && !mydivv.current.contains(e.target)) {
                setDivon((pre) => ({ ...pre, ison: false }))
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setDivon]);


    const sendreport = async () => {
        try {
            setLod2(true)
            const mmssgg = "I am not happy with this post as it does not meet my expectations in terms of content, clarity, or overall quality."
            const response = await axios.post('http://localhost:8080/addreport', { title: "post", report: mmssgg, postid: post._id },
                { withCredentials: true });

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }

            setResponseMessage(response.data);
            setLod2(false)
            setDivon((pre) => ({ ...pre, ison: false }))

        } catch (error) {
            setLod2(false)
            if (axios.isCancel(error)) {
                console.warn('Request aborted by the user.');
            } else {
                console.error('Fetch error:', error.message);
                setResponseMessage({
                    message: error.response?.data?.message || 'An error occurred',
                    color: 'red',
                });
            }
        }
    };

    const editbio = async (typ) => {
        try {
            setLod2(true);
            const response = await axios.post(
                `http://localhost:8080/editpostbio/${typ}/${post._id}`,
                { description: divon.description },
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
            setDivon((prev) => ({ ...prev, ison: false }));
            if (setRes) {
                setRes((pre) => ({ ...pre }))
            }
        }
    };

    const deletepost = async (postid) => {
        try {
            setLod2(true);

            const response = await axios.post(
                "http://localhost:8080/deletepost",
                { postid },
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
            setDivon((prev) => ({ ...prev, ison: false }));
            if (setRes) {
                setRes((pre) => ({ ...pre }))
            }
        }
    };





    return (
        <div onClick={() => setDivon((pre) => ({ ...pre, ison: true }))} className="morevvip">
            <More width="13" />
            {divon.ison &&
                <div className=" bluck">
                    <div ref={mydivv} className=" maindiv">
                        <h3 > <img onClick={(e) => { e.stopPropagation(); if (divon.page !== 0) { setDivon((pre) => ({ ...pre, page: 0 })); } else { setDivon((pre) => ({ ...pre, ison: false })); } }} src="/svg/Back.svg" alt="Back" /> {divon.page === 1 ? "Edit description" : "Options"} </h3>

                        {
                            divon.page === 0 ?
                                <>
                                    {user._id === post.user._id ?
                                        <>

                                            <div onClick={() => !post.archieve ? editbio("arc") : editbio("notarc")} className="onepr">
                                                <img src="/svg/archive.svg" />
                                                <p>{!post.archieve ? "Archieve post" : "Unarchieve post"}</p>
                                            </div>

                                            <div onClick={() => setDivon((pre) => ({ ...pre, page: 1 }))} className="onepr">
                                                <img src="/svg/edit2.svg" />
                                                <p>Edit description</p>
                                            </div>
                                            <div onClick={() => deletepost(post._id)} className="onepr">
                                                <img src="/svg/delete.svg" />
                                                <p style={{ color: "red" }}>Delete post</p>
                                            </div>
                                        </> :
                                        <div onClick={sendreport} className="onepr">
                                            <img src="/svg/report.svg" />
                                            <p style={{ color: "red" }}>Report this post</p>
                                        </div>
                                    }
                                </> :
                                <>
                                    <textarea rows="6" placeholder="Your new description for this post ? " onChange={(e) => setDivon((pre) => ({ ...pre, description: e.target.value }))} value={divon.description}></textarea>
                                    {divon.description !== post.description && <div onClick={() => editbio("bio")} className="butclck">Save</div>}
                                </>
                        }
                    </div>
                    {lod2 && <Loader2 />}
                </div >
            }
        </div >
    );
}