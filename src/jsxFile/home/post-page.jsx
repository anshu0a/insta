import "../../cssFile/home-css/post-page.css"
import PostAll from "../../jsxFile/home/post-all.jsx"
import Story from "./story/story.jsx"


export default function postPage({ post, user, setResponseMessage  , setRes}) {
   
    return (<>
        <div className="postPage">
            <Story setResponseMessage={setResponseMessage } user={user} />
            <PostAll setRes={setRes} user={user} setResponseMessage={setResponseMessage} post={post} />
        </div>
    </>)
}