import "../../cssFile/home-css/home.css";
import Navbar from "./navbar.jsx";
import Top from "./top.jsx";
import PostPage from "./post-page.jsx";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";

export default function Home({ setResponseMessage, news, notimsg }) {

    const navigate = useNavigate();
    const [bodyWidth, setBodyWidth] = useState(window.innerWidth);
    const [data, setData] = useState(null);
    const [res, setRes] = useState(1)


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;


        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:8080/postdo',
                    {}, { withCredentials: true, signal, });

                if (response.data.message === 'Login required.') {
                    await navigate('/Login');
                    setResponseMessage(response.data);
                    return;
                }

                setResponseMessage(response.data);
                setData(response.data);

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
    }, [navigate, res]);


    useEffect(() => {

        const handleResize = () => {
            setBodyWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);



    return (
        <>
            <div className="home">
                {bodyWidth <= 500 && <Top notimsg={notimsg} setResponseMessage={setResponseMessage} userData={data?.user} />}
                <Navbar news={news} notimsg={notimsg} userData={data?.user} setResponseMessage={setResponseMessage} />
                {data && data.posts && data.posts ? (
                    <PostPage setRes={setRes} setResponseMessage={setResponseMessage} user={data.user} post={data.posts} />
                ) : (
                    <div className="outld">

                        <div className="inld">
                            <ContentLoader viewBox="0 0 500 100" >
                                <circle cx="46" cy="38" r="32" />
                                <rect x="34" y="83" rx="5" ry="5" width="25" height="10" />
                                <rect x="547" y="222" rx="5" ry="5" width="220" height="10" />
                                <rect x="82" y="150" rx="5" ry="5" width="220" height="10" />
                                <circle cx="137" cy="38" r="32" />
                                <rect x="124" y="83" rx="5" ry="5" width="25" height="10" />
                                <circle cx="228" cy="38" r="32" />
                                <rect x="215" y="83" rx="5" ry="5" width="25" height="10" />
                                <circle cx="320" cy="38" r="32" />
                                <rect x="307" y="83" rx="5" ry="5" width="25" height="10" />
                                <circle cx="410" cy="38" r="32" />
                                <rect x="398" y="83" rx="5" ry="5" width="25" height="10" />

                            </ContentLoader>
                            <ContentLoader viewBox="0 0 400 360" >
                                <circle cx="31" cy="31" r="15" />
                                <rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
                                <rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
                                <rect x="0" y="60" rx="2" ry="2" width="400" height="300" />
                            </ContentLoader>
                            <ContentLoader viewBox="0 0 400 360" >
                                <circle cx="31" cy="31" r="15" />
                                <rect x="58" y="18" rx="2" ry="2" width="140" height="10" />
                                <rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
                                <rect x="0" y="60" rx="2" ry="2" width="400" height="300" />
                            </ContentLoader>
                        </div>
                    </div>
                )}

            </div>

        </>
    );
}