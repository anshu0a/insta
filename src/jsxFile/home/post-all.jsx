import "../../cssFile/home-css/post-all.css";
import PostOne from "./post-one.jsx";

export default function PostAll({ post ,user,setResponseMessage,setRes }) {
    
    return (
        <div className="postAll">
            {post.map((itm, ind) => (
                <PostOne setRes={setRes} user={user} setResponseMessage={setResponseMessage} key={ind} post={itm} />
            ))}
        </div>
    );
}
