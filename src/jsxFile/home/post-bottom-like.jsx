import "../../cssFile/home-css/post-bottom-like.css";

export default function PostBottomLike({ post  }) {

    return (
        <> {post.simLike && post.simLike.length > 0 &&
            <div className="PostBottomLike">
                <div className="outimgdiv">
                    {post.simLike.map((itm, ind) => (<div key={ind} className={`imgbox img${ind}`}>
                        <img src={itm.userpic} />
                    </div>))}
                </div>
                <p className="like">{post.simLike[0].username + " and " + (post.likes.length - 1).toLocaleString("en-IN")} other like this</p>
            </div>
        } </>)
}