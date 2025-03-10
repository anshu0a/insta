
import '../../../cssFile/profile-css/follow-css/follow.css';
import { useState } from 'react'
import Follow from './follow';

export default function OneMan({ oneman, setOnopt, user2id, setResponseMessage }) {

    const thatuser = oneman.user1._id === user2id ? oneman.user2 : oneman.user1
    const moreclck = function () {

        // setOnopt((pre) => !pre)
    }
    return (
        <>
            <div className='onex'>
                <a href={`/Profile/${thatuser.username}`} className='part1'>
                    <img className='imeg' src={thatuser.pic.path} />
                    <p className='usny'>{thatuser.username}</p>
                </a>
                <div className='part2'>
                    <Follow img={false} hisid={thatuser._id} setResponseMessage={setResponseMessage} />
                    {/* <svg onClick={moreclck} className='moris' viewBox="0 9.5 9 8">
                        <line stroke="grey" strokeLinecap="round"
                            strokeWidth="1.5" x1="5" x2="5" y1="9" y2="9"></line>
                        <line stroke="grey" strokeLinecap="round"
                            strokeWidth="1.5" x1="5" x2="5" y1="14" y2="14"></line>
                        <line stroke="grey" strokeLinecap="round"
                            strokeWidth="1.5" x1="5" x2="5" y1="19" y2="19"></line>
                    </svg> */}
                </div>

            </div>
        </>
    );
}

