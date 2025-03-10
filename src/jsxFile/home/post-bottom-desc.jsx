import "../../cssFile/home-css/post-Bottom-desc.css";
import { useState, useEffect, useRef } from "react";

export default function PostBottomDesc({ post }) {

    const { description = "" } = post;
    const [isExpanded, setIsExpanded] = useState(false);
    const paragraphRef = useRef(null);
    const [line, setline] = useState(false);

    const formattedDesc = `<a href="/profile/${post.user.username}" class="userInDesc">${post.user.username}</a>` + description.replace(/\n/g, "<br/>");

    const checkParagraphLines = () => {
        if (paragraphRef.current) {
            const computedStyle = window.getComputedStyle(paragraphRef.current);
            const lineHeight = parseFloat(computedStyle.lineHeight);
            const maxHeight = lineHeight * 2;

            if (paragraphRef.current.scrollHeight > maxHeight) {
                setline(true);
            } else {
                setline(false);
            }
        }
    };
    useEffect(() => {
        checkParagraphLines();

        window.addEventListener('resize', checkParagraphLines); // Re-check on window resize
        return () => {
            window.removeEventListener('resize', checkParagraphLines);
        };
    }, [formattedDesc]);
    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };


    return (<>
        {description && description.length > 0 &&
            <div className="postBottomDesc">
                <div className={`desc ${isExpanded ? 'expanded' : ''}`} ref={paragraphRef} title={description} dangerouslySetInnerHTML={{ __html: formattedDesc }} ></div>
                {line && <>
                    {!isExpanded
                        ? <i className="more-text" title="view more" onClick={toggleExpand}>view more</i>
                        : <i className="more-text" title="view less" onClick={toggleExpand}>view less</i>
                    }</>}
            </div>
        }</>)
}