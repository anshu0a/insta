import "../../cssFile/home-css/reply.css";

import React, { useState } from 'react';
import { timedo } from '../../../utils/timedo.js'
import { mention } from '../../../utils/mention.js'

export default function PostBottomComment({ comment, setrp }) {
    const [ron, setron] = useState(false)



    return (
        <> {comment.reply.length > 0 &&

            <div className="repl">
                {ron ?
                    <>{comment.reply.map((reply, ind) => (
                        <div key={ind} className="inin">
                            <a href={`/Profile/${reply.info.username}`}><img src={reply.info.pic.path} /></a>
                            <div id={comment._id} className="forreply">
                                <div className="onecmt">
                                    <a href={`/Profile/${reply.info.username}`}>{reply.info.username}<span>{timedo(reply.datex)}</span></a>
                                    <p dangerouslySetInnerHTML={{ __html: mention(reply.dtl) }} />

                                </div>
                                <label title={`reply to ${reply.info.username}`} htmlFor="rp" id={reply.info.username} onClick={setrp} className="dorepl">
                                    <svg viewBox="0 0 24 24" fill="none" width="20px" height="20px">
                                        <path d="M20 17V15.8C20 14.1198 20 13.2798 19.673 12.638C19.3854 12.0735 18.9265 11.6146 18.362 11.327C17.7202 11 16.8802 11 15.2 11H4M4 11L8 7M4 11L8 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </label>

                            </div>
                        </div>
                    ))}

                    </> :
                    <div className="gsg">
                        <div className="lsjh" />
                        <p onClick={() => setron(true)} className="brifreply">{comment.reply.length} reply</p>
                        <div className="lsjh" />
                    </div>
                }
            </div>

        } </>
    );
}