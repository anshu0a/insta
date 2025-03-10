import '../../../cssFile/profile-css/follow-css/follow.css';
import React, { useRef, useEffect, useState } from 'react';

import Oneman from './oneman'
import Options from './options'

export default function ShowfollowList({ ers, user2id, setShowl, list, setResponseMessage }) {
    const [tab, setTab] = useState(ers ? 1 : 2);
    const crtRef = useRef(null);
    const [onopt, setOnopt] = useState(false)


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (crtRef.current && !crtRef.current.contains(e.target)) {
                setShowl({ sts: false, ers: true })
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setShowl]);
    return (
        <div className='showfollowerlist'>
            <div ref={crtRef} className='mainlist'  >
                <div className='bl1'>
                    <div className='back' onClick={() => setShowl({ sts: false, ers: true })}>
                        <svg className="bbux" viewBox="0 0 32 32">
                            <path d="M22,29.73a1,1,0,0,1-.71-.29L9.93,18.12a3,3,0,0,1,0-4.24L21.24,2.56A1,1,0,1,1,22.66,4L11.34,15.29a1,1,0,0,0,0,1.42L22.66,28a1,1,0,0,1,0,1.42A1,1,0,0,1,22,29.73Z"></path>
                        </svg>
                    </div>
                    <p>{list?.user.username}</p>
                </div>
                <div className='bl2'>
                    <p onClick={() => setTab(1)} className={tab === 1 ? 'pp slct' : 'pp'}> follower ({list.follower.length})</p>
                    <p onClick={() => setTab(2)} className={tab === 2 ? 'pp slct' : 'pp'}>following ({list.following.length})</p>
                </div>
                <div className='bl3'>
                    {tab === 2 ?
                        <>
                            {
                                list.following?.length > 0 ?
                                    <>
                                        {
                                            list.following?.map((fling) =>
                                                list.myfollowing?.some((myF) => myF._id === fling._id) && (
                                                    <Oneman setOnopt={setOnopt} user2id={user2id} key={fling._id} oneman={fling} setResponseMessage={setResponseMessage} />
                                                )
                                            )
                                        }
                                        {list.following?.map((fling) =>
                                            list.myfollowing?.every((myF) => myF._id !== fling._id) && (
                                                <Oneman setOnopt={setOnopt} user2id={user2id} key={fling._id} oneman={fling} setResponseMessage={setResponseMessage} />
                                            )
                                        )}
                                    </> :
                                    <div className='emmptyx'>
                                        <img src="/svg/ing.svg" />
                                        <p>{list?.user.fname} haven't follow anyone</p>
                                    </div>
                            }
                        </>

                        : <>
                            {
                                list.follower?.length > 0 ?
                                    <>
                                        {list.follower?.map((fling) =>
                                            list.myfollowing?.some((myF) => myF._id === fling._id) && (
                                                <Oneman setOnopt={setOnopt} user2id={user2id} key={fling._id} oneman={fling} setResponseMessage={setResponseMessage} />
                                            )
                                        )}
                                        {list.follower?.map((fling) =>
                                            list.myfollowing?.every((myF) => myF._id !== fling._id) && (
                                                <Oneman setOnopt={setOnopt} user2id={user2id} key={fling._id} oneman={fling} setResponseMessage={setResponseMessage} />
                                            )
                                        )}
                                    </> :
                                    <div className='emmptyx tru'>
                                    <img src="/svg/ers.svg" />
                                    <p>{list?.user.fname} have no follower</p>
                                </div>
                            }
                        </>
                    }
                    {onopt && <Options setOnopt={setOnopt} setResponseMessage={setResponseMessage} />}
                </div>
            </div>
        </div>
    );
}

