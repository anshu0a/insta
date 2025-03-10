import React, { useRef, useEffect } from 'react';
import '../../cssFile/profile-css/hilight.css';
import Onehilight from '../../jsxFile/profile/onehilight.jsx';

export default function Hilight({ hilight }) {
    const outfilterRef = useRef(null);
    const leftButtonRef = useRef(null);
    const rightButtonRef = useRef(null);

    const checkScrollPosition = () => {
        const outfilter = outfilterRef.current;
        const leftButton = leftButtonRef.current;
        const rightButton = rightButtonRef.current;

        if (outfilter) {
            const maxScrollLeft = outfilter.scrollWidth - outfilter.clientWidth;
            if (outfilter.clientWidth >= outfilter.scrollWidth) {
                leftButton.style.visibility = 'hidden';
                rightButton.style.visibility = 'hidden';
            } else {
                if (outfilter.scrollLeft <= 5) {
                    leftButton.style.visibility = 'hidden';
                    rightButton.style.visibility = 'visible';
                } else if (outfilter.scrollLeft >= maxScrollLeft - 5) {
                    leftButton.style.visibility = 'visible';
                    rightButton.style.visibility = 'hidden';
                } else {
                    leftButton.style.visibility = 'visible';
                    rightButton.style.visibility = 'visible';
                }
            }

        }
    };
    useEffect(() => {
        checkScrollPosition();
    }, []);

    const scrollRight = () => {
        const outfilter = outfilterRef.current;
        if (outfilter) {
            outfilter.scrollBy({ left: outfilter.clientWidth - 30, behavior: 'smooth' });
            setTimeout(checkScrollPosition, 600);
        }
    };

    const scrollLeft = () => {
        const outfilter = outfilterRef.current;
        if (outfilter) {
            outfilter.scrollBy({ left: -(outfilter.clientWidth - 30), behavior: 'smooth' });
            setTimeout(checkScrollPosition, 600);
        }
    };



    return (
        <div className='outhigh'>
            <div className="left" ref={leftButtonRef}>
                <svg onClick={scrollLeft} viewBox="0 0 256 512">
                    <path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6v256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" />
                </svg>
            </div>
            <div className="hilight" ref={outfilterRef} onScroll={checkScrollPosition}>
                {hilight.map((str, index) => (
                    <div key={index}>
                        <Onehilight data={str} />
                    </div>
                ))}
                {/* <div className="newset">
                <Onehilight data={{ name: 'new', img: '/svg/hilight.jpg' }} />
            </div> */}

            </div>
            <div className="right" ref={rightButtonRef}>
                <svg onClick={scrollRight} viewBox="0 0 256 512">
                    <path d="M9.4 278.6c-12.5-12.5-12.5-32.8 0-45.3l128-128c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6v256c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-128-128z" />
                </svg>
            </div>
        </div>

    );
}

