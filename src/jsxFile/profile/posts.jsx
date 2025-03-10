import "../../cssFile/profile-css/posts.css"
import React, { useEffect, useState } from 'react';
import Crt from '../home/crt/crt';
import Post from '../viewPost/post'

export default function posts({ post, user,setRes, setResponseMessage }) {
    const [showpost, setShowpost] = useState({ seen: false, postid: null })
    const [crt, setCrt] = useState(false);


    useEffect(() => {
        if (crt) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [crt]);
    const crtopt = () => {
        setCrt((pre) => !pre);
    };
    const ononepost = (id) => {
        setShowpost({ seen: true, postid: id });
    }
    return (<div className="outtpostt">
        {post.length > 0 && post.some(post => post.archieve === false) ?
            <div className="posts">
                {post.slice().reverse().map((str) => {
                    return !str.archieve ? (
                        <div key={str._id} onClick={() => ononepost(str._id)} className="outsix">
                            <img src={str.postimg.path} alt="Post Image"></img>
                            <div className="outlike">
                                <img width="15px" src="/svg/Notifications.svg" alt="Likes"></img>
                                <p>{str.likes.length}</p>
                            </div>
                        </div>
                    ) : null;
                })}

            </div> :
            <div className="nopost">
                <img src="/svg/camera.svg"></img>
                {user.is ?
                    <>
                        <p className="sha">Share photos</p>
                        <p>When you share photos, they will appear on your profile.</p>
                        <a onClick={crtopt}>Share your first photo</a>
                    </> :
                    <>
                        <p className="sha">No post</p>
                        <p>All your posts will appear here, if any !</p>
                        <a>Request {user.fname} to create post</a>
                    </>

                }

                {crt && <Crt setResponseMessage={setResponseMessage} userpic={user.userpic} setCrt={setCrt} />}
            </div>
        }
        {showpost.seen && <Post setRes={setRes} setShowpost={setShowpost} setResponseMessage={setResponseMessage} userid={user?._id} postid={showpost?.postid} />}
    </div>)
}