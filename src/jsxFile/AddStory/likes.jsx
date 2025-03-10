
import "../../cssFile/AddStory-css/opton.css";
import { useState, useEffect, useRef } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";


export default function likes({ setResponseMessage, setOpt, userid, storyid }) {
    const navigate = useNavigate();
    const [alldata, setAlldata] = useState([])

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;


        const fetchData = async () => {
            try {
                const response = await axios.post('https://instaserver-knen.onrender.com/viewsdoplz',
                    { userid, storyid }, { withCredentials: true, signal, });

                if (response.data.message === 'Login required.') {
                    await navigate('/Login');
                    setResponseMessage(response.data);
                    return;
                }


                if (response.data.color && response.data.color === 'red') {
                    setResponseMessage(response.data);
                    return;
                }

                setAlldata(response.data.data);
            } catch (error) {
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

        fetchData();

        return () => {
            console.log('Cleanup: Request aborted');
            controller.abort();
        };
    }, [navigate]);

    return (

        <div className="inopton">
            <h3> <img onClick={() => setOpt((pre) => ({ ...pre, page: 0 }))} src="/svg/bref.svg" /> <span>Likes</span></h3>
            {
                alldata.length > 0 && alldata.some(one => one.like) ? (
                    alldata.map(one =>
                        one.like && (
                            <div key={one.user._id}>
                                <img onClick={() => navigate("/profile/" + one.user.username)} src={one.user.pic.path} alt="User" />
                                <a href={"/profile/" + one.user.username}>{one.user.username}</a>
                            </div>
                        )
                    )
                ) : (
                    <p>No Likes on this story</p>
                )
            }


        </div>
    )
}
