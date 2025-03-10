import "../../cssFile/home-css/post-top.css";

import { timedo } from '../../../utils/timedo.js'
import { handleImageError } from "../../../utils/handleImg.js"
import Threedot from "./threedot.jsx";
export default function postTop({ post, setResponseMessage, user , setRes }) {
    
    return (<>
        <div className="postTop">
            <div className="firstsec">
                <img onError={handleImageError} onClick={() => window.location.href = `/Profile/${post.user.username}`} src={post.user.pic.path} title={post.user.username} />
                <div className="textinfo">
                    <a href={`/Profile/${post.user.username}`} className="user" title={post.user.username}>{post.user.username}</a>
                    <p className="loc" title={post.location}>{post.location}</p>
                </div>

                <p className="ago" title={post.posttime.slice(3, 16)} > {timedo(post.posttime)}</p>

            </div>
            <div className="secondsec">
                <Threedot setResponseMessage={setResponseMessage} setRes={setRes} post={post} user={user} />
            </div>
        </div>

    </>)
}