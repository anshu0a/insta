import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import ShowList from './showlist'

export default function FollowList({ user2id, setResponseMessage }) {
    const navigate = useNavigate();
    const [list, setList] = useState({ follower: [], following: [], user: {}, myfollower: [], myfollowing: [] })
    const [showl, setShowl] = useState({ sts: false, ers: true })

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                const response = await axios.post(
                    `http://localhost:8080/laofollow/${user2id}`,
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
                if (response.data.list.length !== 0) {
                    const listfollowing = response.data.list.filter(onelist => onelist.user1._id === user2id || (onelist.user2._id === user2id && onelist.back === true))
                    const listfollower = response.data.list.filter(onelist => onelist.user2._id === user2id || (onelist.user1._id === user2id && onelist.back === true))
                    setList((pre) => ({ ...pre, follower: listfollower, following: listfollowing }))
                }
                if (response.data.mylist.length !== 0) {
                    const mylistfollowing = response.data.mylist.filter(onelist => onelist.user1 === user2id || (onelist.user2 === user2id && onelist.back === true))
                    const mylistfollower = response.data.mylist.filter(onelist => onelist.user2 === user2id || (onelist.user1 === user2id && onelist.back === true))
                    setList((pre) => ({ ...pre, myfollower: mylistfollower, myfollowing: mylistfollowing }))
                }
                if (response.data.user.length !== 0) {
                    setList((pre) => ({ ...pre, user: response.data.user }))
                }


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
    }, [user2id]);


    return (
        <>
            <div className="erdiv" onClick={() => setShowl({ sts: true, ers: true })}>
                <b>{list.follower.length}</b>
                <p>followers</p>
            </div>
            <div className="erdiv" onClick={() => setShowl({ sts: true, ers: false })}>
                <b>{list.following.length}</b>
                <p>following</p>
            </div>
            {showl.sts && <ShowList list={list} user2id={user2id} setShowl={setShowl} ers={showl.ers} setResponseMessage={setResponseMessage}/>}
        </>
    );
}
