import '../../../cssFile/profile-css/follow-css/follow.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Follow({ hisid,img, setResponseMessage }) {
    const navigate = useNavigate();
    const [sts, setSts] = useState("Follow");

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:8080/kyafollow/${hisid}`,
                    {},
                    { withCredentials: true, signal }
                );

                if (response.data.message === 'Login required.') {
                    setResponseMessage(response.data);
                    navigate('/Login');
                    return;
                }

                if (response.data.color === 'red') {
                    setResponseMessage(response.data);
                    return;
                }
                setSts(response.data);

            } catch (error) {
                if (!axios.isCancel(error)) {
                    console.error('Fetch error:', error.message);
                    setResponseMessage({
                        message: error.response?.data?.message || 'An error occurred',
                        color: 'red',
                    });
                }
            }
        };

        fetchData();

        return () => controller.abort();
    }, [hisid]);

    const followsmjho = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/followme/${hisid}`,
                {},
                { withCredentials: true }
            );

            if (response.data.message === 'Login required.') {
                setResponseMessage(response.data);
                navigate('/Login');
                return;
            }

            if (response.data.color === 'red') {
                setResponseMessage(response.data);
                return;
            }
            setSts(response.data);

        } catch (error) {
            console.error('Fetch error:', error.message);
            setResponseMessage({
                message: error.response?.data?.message || 'An error occurred',
                color: 'red',
            });
        }
    };

    return (
        <a onClick={followsmjho} className="edit">
            {img && <img width="22px" src="/svg/follow.svg" alt="Follow" />}
            <p>{sts}</p>
        </a>
    );
}
