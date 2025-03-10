
import "../../cssFile/editProfile-css/edtPro.css"
import Name from "./name.jsx"
import Edt4 from "./edt4.jsx"
import Edt6 from "./edt6.jsx"
import Feedback from "../../jsxFile/collect/feedback.jsx"
import Loader2 from "../collect/loader2.jsx"
import { useNavigate } from "react-router-dom";
import ContentLoader from 'react-content-loader'


import { goBack } from "../../../utils/goback.js";
import { useEffect, useState } from "react"
import axios from "axios";
import { useParams } from "react-router-dom";
import { handleImageError } from "../../../utils/handleImg.js"


export default function edtPro({ setResponseMessage }) {
    const navigate = useNavigate();
    const { user } = useParams()
    const [reload, setReload] = useState(false)
    const [lod2, setLod2] = useState(false)
    const [data, setData] = useState({})
    const [pic, setPic] = useState()
    const [cut, setcut] = useState(false)
 


    useEffect(() => {
        if (lod2) {
            document.querySelector('body').style.overflow = "hidden"
        } else {
            document.querySelector('body').style.overflow = ""
        }
    }, [lod2]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setcut(true);
        }, Math.floor(Math.random() * 60000) + 60000);

        const fetchdata = async () => {
            try {

                const response = await axios.post(`https://instaserver-knen.onrender.com/updateData/${user}`,
                    {},
                    { withCredentials: true }
                );

                const { data } = response;

                if (data?.message === "Login required.") {
                    setResponseMessage(data);
                    await navigate("/Login");
                    return;
                }

                if (data?.color === "red") {
                    setResponseMessage(data);
                    return;
                }


                if (data?.user?.username === data?.data?.[0]?.username) {
                    setData(data.data[0]);
                    setPic(data.data[0].pic.path);
                } else {
                    setResponseMessage({
                        color: "red",
                        message: "This is not your account",
                    });
                }
            } catch (error) {

                setResponseMessage({
                    color: "red",
                    message: error.response?.data?.message || error.message,
                });
            }
        };


        fetchdata();

        return () => {
            clearTimeout(timeoutId);
        };
    }, [reload]);


    async function imgBhezo(e) {
        const file = e.target.files[0];

        if (file) {
            setPic(URL.createObjectURL(file));
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLod2(true);
            const response = await axios.post( 'https://instaserver-knen.onrender.com/updatePic',
                formData,
                {
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data', 
                    },
                }
            );
            setLod2(false);

            const { data } = response;

            if (data?.message === "Login required.") {
                setResponseMessage(data);
                await navigate("/Login");
                return;
            }

            setResponseMessage(data);

        } catch (error) {
            setResponseMessage({
                color: "red",
                message: error.response?.data?.message || error.message,
            });
        }

    }





    return (
        <div className="edtPro">
            {cut && <Feedback  setResponseMessage={ setResponseMessage} cutfun={() => setcut(false)} />}
            <div className="edt1" onClick={goBack}>
                <img className="back" title="Back" src="/svg/Back.svg" alt="Back" />
                <p>Edit Details</p>
            </div>
            {data?.username ? (
                <>
                    {lod2 && <Loader2 />}
                    <div className="edt2">
                        <div>
                            <img onError={handleImageError} src={pic} alt="Profile" />
                        </div>
                        <input id="tkimg" onChange={imgBhezo} accept="image/*" type="file" hidden />
                        <label htmlFor="tkimg">
                            <img src="/svg/respond.svg" alt="Edit" />
                            <p>Change picture</p>
                        </label>
                    </div>
                    <Name data={data} setResponseMessage={setResponseMessage} reload={{ reload, setReload }} />
                    <Edt4 data={data} setResponseMessage={setResponseMessage} reload={{ reload, setReload }} />
                    <Edt6 data={data} setResponseMessage={setResponseMessage} reload={{ reload, setReload }} />
                </>
            ) : (
                <div className="vviyrfhg">
                    <div className="ih">
                        <ContentLoader viewBox="0 0 400 160" >
                            <rect x="78" y="88" rx="3" ry="3" width="254" height="6" />
                            <rect x="150" y="103" rx="3" ry="3" width="118" height="6" />
                            <circle cx="210" cy="40" r="40" />
                            <rect x="37" y="54" rx="32" ry="32" width="15" height="15" />
                            <rect x="37" y="46" rx="0" ry="0" width="4" height="18" />
                            <rect x="54" y="54" rx="32" ry="32" width="15" height="15" />
                            <rect x="54" y="46" rx="0" ry="0" width="4" height="19" />
                            <rect x="336" y="118" rx="32" ry="32" width="15" height="15" />
                            <rect x="357" y="118" rx="32" ry="32" width="15" height="15" />
                            <rect x="347" y="123" rx="0" ry="0" width="4" height="18" />
                            <rect x="368" y="123" rx="0" ry="0" width="4" height="18" />
                        </ContentLoader>
                        <ContentLoader viewBox="0 0 300 130" >
                            <rect x="20" y="0" rx="3" ry="3" width="250" height="10" />
                            <rect x="20" y="20" rx="3" ry="3" width="220" height="10" />
                            <rect x="20" y="40" rx="3" ry="3" width="170" height="10" />
                            <rect x="20" y="60" rx="3" ry="3" width="250" height="10" />
                            <rect x="20" y="80" rx="3" ry="3" width="200" height="10" />
                            <rect x="20" y="100" rx="3" ry="3" width="80" height="10" />
                        </ContentLoader>
                    </div>
                </div>
            )}
        </div>
    );

}
