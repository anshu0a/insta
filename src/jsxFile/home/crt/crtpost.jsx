import "../../../cssFile/home-css/crt-css/crtpost.css";

import { useState, useEffect } from "react";
import Loader2 from "../../collect/loader2.jsx"
import axios from "axios";



export default function crtpost({ setCrt, setSkolo, setResponseMessage }) {
    const [lod2, setLod2] = useState(false)
    const [info, setInfo] = useState({ mainimg: null, image: null, loc: "", des: "" });

    const getloc = async (latitude, longitude) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            return `${data.address.state_district || ""}, ${data.address.state || ""} (${data.address.country || ""})`;
        } catch (err) {
            setResponseMessage({ message: "Unable to get location", color: "red" });
            return "";
        }
    };

    useEffect(() => {
        const fetchLocation = async () => {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;

                        try {
                            const locationString = await getloc(latitude, longitude);

                            setInfo((pre) => ({ ...pre, loc: locationString }))

                        } catch (err) {
                            setResponseMessage({ message: "Failed to fetch location", color: "red" });
                        }
                    },
                    (error) => {
                        if (error.code === error.PERMISSION_DENIED) {
                            setResponseMessage({ message: "Location access denied. Please enable location permissions.", color: "red" });
                        } else if (error.code === error.POSITION_UNAVAILABLE) {
                            setResponseMessage({ message: "Location is unavailable. Please enable location services.", color: "red" });
                        } else if (error.code === error.TIMEOUT) {
                            setResponseMessage({ message: "Location request timed out. Please try again.", color: "red" });
                        } else {
                            setResponseMessage({ message: "An unknown error occurred.", color: "red" });
                        }
                    }
                );
            } else {
                console.error({ message: "Geolocation is not supported by this browser.", color: "red" });
            }
        };

        fetchLocation();
    }, []);



    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (file) => {

        if (file.type.startsWith('image/')) {


            setInfo((pre) => ({ ...pre, image: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setInfo((pre) => ({ ...pre, mainimg: reader.result }));
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload an image file.');
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };
    const handleinput = function (e) {
        const { name, value } = e.target;
        setInfo((prevInfo) => ({
            ...prevInfo,
            [name]: value
        }));

    };

    const bhezona = async function () {
        try {
            setLod2(true);

            const formData = new FormData();
            if (info.image) {
                formData.append('file', info.image);
            }
            formData.append('loc', info.loc);
            formData.append('des', info.des);

            const response = await axios.post('http://localhost:8080/postkro',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );

            if (response.data.message === 'Login required.') {
                setResponseMessage(response.data);
                await navigate('/Login');
                return;
            }
            setLod2(false);
            if (response.data.color === "green") {
                setCrt(false)
            }
            setResponseMessage(response.data);
        } catch (error) {
            console.error(error);
            setLod2(false);
            setResponseMessage({
                message: error.response?.data?.message || 'An error occurred',
                color: 'red',
            });
        }
    };



    return (<>

        <input type="file" accept="image/*" onChange={handleChange} style={{ display: 'none' }} id="imageUpload" />
        <div className="crtxpost">
            {lod2 && <Loader2 />}
            {!info.image ?
                <>
                    <svg className="cutttyf" onClick={() => setSkolo(false)} viewBox="0 0 24 24">
                        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm3.71,12.29a1,1,0,0,1,0,1.42,1,1,0,0,1-1.42,0L12,13.42,9.71,15.71a1,1,0,0,1-1.42,0,1,1,0,0,1,0-1.42L10.58,12,8.29,9.71A1,1,0,0,1,9.71,8.29L12,10.58l2.29-2.29a1,1,0,0,1,1.42,1.42L13.42,12Z" />
                    </svg>
                    <div className="addmain" onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                        <p className="titlef">Create post</p>
                        <svg viewBox="0 0 97.6 77.3" >
                            <path d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z" fill="currentColor"></path><path d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z" fill="currentColor"></path><path d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z" fill="currentColor"></path>
                        </svg>
                        <p className="drg">You can drag & drop an image here<br />or</p>
                        <label htmlFor="imageUpload" className="slct"> Select image from device</label>
                    </div>
                </> :
                <>
                    <div className="allmth">
                        <div className="ppstbbn">
                            <div onClick={() => setInfo((pre) => ({ ...pre, mainimg: null, image: null }))} className="cnpt">Back</div>
                            <div onClick={bhezona} className="svpt">  Post </div>
                        </div>
                        <img src={info.mainimg} />
                        <div className="cntn">
                            <label htmlFor="loc">Add location (optional)</label>
                            <input name="loc" value={info.loc} onInput={handleinput} id="loc" type="text" placeholder="Enter location" />
                            <label htmlFor="desr">Add Description (optional)</label>
                            <textarea name="des" value={info.dec} onInput={handleinput} id="desr" maxLength={200} rows="5" placeholder="Express your post decription"></textarea>
                        </div>
                    </div>
                </>
            }
        </div>
    </>)
}