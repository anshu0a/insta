import "../../cssFile/home-css/post-one.css"
import PostTop from "../../jsxFile/home/post-top.jsx"
import PostBottom from "../../jsxFile/home/post-bottom.jsx"

export default function postOne({ post, user, setResponseMessage , setRes }) {

    
    return (<>
        <div className="postOne">

            <PostTop setRes={setRes} setResponseMessage={setResponseMessage} user={user} post={post} />
            <img src={post.postimg.path} />
            {post.edit ? <div className="edtmsg"><p style={{ backgroundColor: "rgb(50, 50, 50)" }}>Edited</p></div> : (new Date() - new Date(post.posttime)) < 24 * 60 * 60 * 1000 ? <div className="edtmsg"><p style={{ backgroundColor: "rgb(244, 0, 0)" }}>Fresh</p></div> : <></>}
            <PostBottom setRes={setRes} setResponseMessage={setResponseMessage} user={user} post={post} />
        </div>
    </>)
}