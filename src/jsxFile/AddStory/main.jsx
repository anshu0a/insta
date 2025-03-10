import "../../cssFile/AddStory-css/main.css";
import { useRef, useState, useEffect } from "react";
import ResizeOpt from "./resizeopt";
import Setting from "./setting"
import axios from "axios"
import { useNavigate } from "react-router-dom";
import Loader2 from "../collect/loader2.jsx"


export default function Main({ setResponseMessage, user }) {
    const [lod2, setLod2] = useState(false)
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const mediaStreamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const [mydata, setMydata] = useState({ setting: false, type: "photo", filetype: "", preview: null, facingMode: "user", msg: "", sharewith: "public" });
    const [resize, setResize] = useState({ ratio: 9 / 16, is: false });
    const [errorMessage, setErrorMessage] = useState("");
    const [recording, setRecording] = useState(false);
    const [timer, setTimer] = useState(0);


    useEffect(() => {
        let interval;
        if (recording) {
            interval = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [recording]);



    useEffect(() => {
        if (mydata.preview === null) {
            startCamera();
        } else {
            stopCamera();
        }
        return () => stopCamera();
    }, [mydata.preview, resize.ratio, mydata.facingMode]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mydata.facingMode, aspectRatio: resize.ratio },
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    if (videoRef.current) {
                        videoRef.current.play();
                    }
                };
            }
            mediaStreamRef.current = stream;
        } catch (error) {
            console.error("Error accessing camera:", error);
            setErrorMessage("Unable to access the camera. Please ensure permissions are granted and no other application is using the camera.");
        }
    };




    const stopCamera = () => {
        if (mediaStreamRef.current) {
            mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        }
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
        }
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");

            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            context.save();
            context.translate(canvas.width / 2, canvas.height / 2);
            context.scale(-1, 1);
            context.translate(-canvas.width / 2, -canvas.height / 2);
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            context.restore();

            const photoDataUrl = canvas.toDataURL("image/png");
            setMydata((prev) => ({ ...prev, preview: photoDataUrl }));
        }
    };


    const startRecording = async () => { 
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: mydata.facingMode, aspectRatio: resize.ratio },
                audio: true,
            });
            mediaStreamRef.current = stream;
    
            const video = document.createElement("video");
            video.srcObject = stream;
            video.muted = true;
    
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
    
            video.onloadedmetadata = () => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            };
    
            video.onloadeddata = () => {
                video.play(); 
                
                const drawFrame = () => {
                    if (video.readyState >= 2) { 
                        ctx.save();
                        ctx.translate(canvas.width / 2, canvas.height / 2);
                        ctx.scale(-1, 1);
                        ctx.drawImage(video, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
                        ctx.restore();
                    }
                    
                    if (mediaRecorder.state !== "inactive") {
                        requestAnimationFrame(drawFrame);
                    }
                };
    
              
                const canvasStream = canvas.captureStream(30);
                stream.getAudioTracks().forEach((track) => canvasStream.addTrack(track));
    
                const mediaRecorder = new MediaRecorder(canvasStream, { mimeType: "video/webm" });
                mediaRecorderRef.current = mediaRecorder;
    
                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) chunksRef.current.push(event.data);
                };
    
                mediaRecorder.onstop = () => {
                    const blob = new Blob(chunksRef.current, { type: "video/webm" });
                    const file = new File([blob], "recorded-video.webm", { type: "video/webm" });
                    const videoUrl = URL.createObjectURL(blob);
    
                    setMydata((prev) => ({
                        ...prev,
                        preview: videoUrl,
                        file,
                        filetype: "video",
                    }));
                    chunksRef.current = [];
                };
    
                mediaRecorder.start();
                setRecording(true);
                drawFrame();
            };
    
        } catch (error) {
            console.error("Error starting recording:", error);
            setErrorMessage("Unable to start recording. Please check permissions for microphone and camera.");
        }
    };
    
    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
    };
    
    const toggleRecording = () => {
        if (recording) {
            stopRecording();
        } else {
            startRecording();
        }
    };
    const handleinput = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileURL = URL.createObjectURL(file);

        if (file.type.startsWith("image/")) {
            setMydata((prev) => ({ ...prev, filetype: "photo", preview: fileURL, file }));
        } else if (file.type.startsWith("video/")) {
            setMydata((prev) => ({ ...prev, filetype: "video", preview: fileURL, file }));
        } else {
            setResponseMessage({ message: "Only images and videos are supported!", color: "red" });
            setMydata((prev) => ({ ...prev, filetype: "", preview: null, file: null }));
        }
    };


    const flipCamera = () => {
        setMydata((prev) => ({ ...prev, facingMode: prev.facingMode === "user" ? "environment" : "user", }));
    };

    const addStory = async function () {
        try {
            if (!mydata.preview) {
                setResponseMessage({ message: "No file selected!", color: "red" });
                return;
            }

            const formData = new FormData();

            if (mydata.preview.startsWith("blob:")) {
                const response = await fetch(mydata.preview);
                const blob = await response.blob();
                const file = new File(
                    [blob],
                    `story.${mydata.filetype === "video" ? "webm" : "png"}`,
                    { type: blob.type }
                );
                formData.append("file", file);
            } else {
                const file = mydata.preview instanceof File ? mydata.preview : new File([mydata.preview], "story.png", { type: "image/png" });
                formData.append("file", file);
            }

            formData.append("type", mydata.filetype || mydata.type);
            formData.append("msg", mydata.msg);
            formData.append("sharewith", mydata.sharewith);
            setLod2(true);
            const response = await axios.post("https://instaserver-knen.onrender.com/addStory", formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" },
            });

            setResponseMessage(response.data);
            setLod2(false);
            window.history.back();
        } catch (error) {
            setLod2(false);
            window.history.back();
            console.error("Fetch error:", error.response?.data?.message || error.message);
            setResponseMessage({ message: "Upload failed!", color: "red" });
        }
    };






    return (<>

        <div className="main65">
            {mydata.preview === null ?
                <>
                    {!errorMessage && <video className="capvideo" ref={videoRef} autoPlay playsInline />}
                    {resize.is && <ResizeOpt resize={resize} setResize={setResize} />}
                    <div className="controls controls0">
                        <img onClick={() => window.history.back()} src="/svg/Back.svg"></img>
                        <p>Add story</p>
                    </div>
                    {errorMessage && <p className="errmsg" style={{ color: "red" }}>{errorMessage}</p>}

                    <div className="controls">
                        {recording && (
                            <p className="timer">
                                {`${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`}
                            </p>
                        )}

                        <label htmlFor="iuy7"><img title="Choose from device" src="svg/file.svg" alt="Choose file from device" /></label>
                        <div onClick={!recording ? () => setResize((prev) => ({ ...prev, is: true })) : undefined} style={resize.ratio === 16 / 9 || resize.ratio === 1 / 1 || resize.ratio === 4 / 3 ? { height: "20px", aspectRatio: resize.ratio } : { height: "25px", aspectRatio: resize.ratio }} className="whatresize"  ></div>
                        {mydata.type === "video" ?
                            <div title="Record" onClick={toggleRecording} className="videoout">  <div className={recording ? "vdeoanmi videoin" : "videoin"}></div> </div> :
                            <div title="Capture" onClick={capturePhoto} className="videoout"></div>}
                        {mydata.type === "video" ?
                            <img onClick={!recording ? () => setMydata((prev) => ({ ...prev, type: "photo" })) : undefined} title="Switch to photo" src="svg/photo.svg" />
                            : <img onClick={() => setMydata((prev) => ({ ...prev, type: "video" }))} title="Switch to video" src="svg/video.svg" />}
                        <img title="Switch Camera" onClick={flipCamera} src="svg/switch.svg" alt="Switch camera" />
                    </div>
                    <canvas hidden ref={canvasRef} ></canvas>
                    <input id="iuy7" onChange={handleinput} type="file" accept="video/*, image/*" hidden />
                </> : <>
                    {mydata.setting && <Setting setResponseMessage={setResponseMessage} setMydata={setMydata} />}
                    {mydata.type === "photo" && mydata.filetype === "" || mydata.filetype === "photo" ?
                        <img src={mydata.preview} alt="Captured" /> :
                        <video key={mydata.preview} ref={videoRef} className="prevideo" src={mydata.preview} loop autoPlay />}
                    <div className="controls controls6 ">
                        <div className="part">
                            <img onClick={() => window.history.back()} src="/svg/Back.svg"></img>
                            <p>Story</p>
                        </div>
                        <div className="part">
                            <p className="clb" onClick={() => setMydata((pre) => ({ ...pre, sharewith: pre.sharewith === "public" ? "friends" : "public" }))} style={mydata.sharewith === "friends" ? { color: "rgb(0, 235, 86)" } : { color: "rgb(83, 189, 255)" }}>{mydata.sharewith} </p>
                            <img onClick={() => setMydata((pre) => ({ ...pre, setting: true }))} className="btnbox1" src="/svg/setting.svg"></img>
                        </div>
                    </div>
                    <input value={mydata.msg} onChange={(e) => setMydata((pre) => ({ ...pre, msg: e.target.value }))} className="iin5" autoFocus placeholder="Write a short message . . ." type="text" maxLength={50} />
                    <div className="finalbox">

                        <img style={{ cursor: "pointer" }} width="32px" onClick={() => setMydata((pre) => ({ ...pre, filetype: "", preview: null }))} src="/svg/retake.svg"></img>
                        <button onClick={addStory} >Post</button>
                    </div>
                </>}
            {lod2 && <Loader2 />}
        </div>
    </>)
}
