import "../../cssFile/AddStory-css/resizeOpt.css";
import { useRef, useEffect } from "react"

export default function resize({ setResize, resize }) {
    const rebtn = useRef(null)
    useEffect(() => {

        const handleClickOutside = (e) => {
            if (!rebtn.current.contains(e.target)) {
                setResize((pre) => ({ ...pre, is: false }))
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (

        <div className="resize">
            <img className="cutto" onClick={() => setResize((pre) => ({ ...pre, is: false }))} src="svg/Cut.svg" />
            <div ref={rebtn} className="inresize">
                <p>Choose size</p>
                <div className="allsize">
                    <div onClick={() => setResize({ is: false, ratio: 9 / 16 })} className="sec1">
                        <div style={resize.ratio === 9 / 16 ? { aspectRatio: "9/16", height: "25px", border: "3px solid rgb(0, 123, 172)" } : { aspectRatio: "9/16", height: "25px" }} />
                        <p style={resize.ratio === 9 / 16 ? { color: " rgb(0, 123, 172)" } : {}}>9 : 16 &nbsp; (  portrait )</p>
                    </div>
                    <div onClick={() => setResize({ is: false, ratio: 16 / 9 })} className="sec1">
                        <div style={resize.ratio === 16 / 9 ? { aspectRatio: "16/9", height: "20px", border: "3px solid rgb(0, 123, 172)" } : { aspectRatio: "16/9", height: "15px" }} />
                        <p style={resize.ratio === 16 / 9 ? { color: " rgb(0, 123, 172)" } : {}}>16 : 9 &nbsp; ( Rectangle )</p>
                    </div>
                    <div onClick={() => setResize({ is: false, ratio: 4 / 3 })} className="sec1">
                        <div style={resize.ratio === 4 / 3 ? { aspectRatio: "4/3", height: "20px", border: "3px solid rgb(0, 123, 172)" } : { aspectRatio: "4/3", height: "20px" }} />
                        <p style={resize.ratio === 4 / 3 ? { color: " rgb(0, 123, 172)" } : {}}>4 : 3 &nbsp; ( Small rectangle ) </p>
                    </div>
                    <div onClick={() => setResize({ is: false, ratio: 1 / 1 })} className="sec1">
                        <div style={resize.ratio === 1 / 1 ? { aspectRatio: "1/1", height: "20px", border: "3px solid rgb(0, 123, 172)" } : { aspectRatio: "1/1", height: "20px" }} />
                        <p style={resize.ratio === 1 / 1 ? { color: " rgb(0, 123, 172)" } : {}}>1 : 1 &nbsp; ( Square ) </p>
                    </div>
                    <div onClick={() => setResize({ is: false, ratio: 3 / 4 })} className="sec1">
                        <div style={resize.ratio === 3 / 4 ? { aspectRatio: "3/4", height: "25px", border: "3px solid rgb(0, 123, 172)" } : { aspectRatio: "3/4", height: "25px" }} />
                        <p style={resize.ratio === 3 / 4 ? { color: " rgb(0, 123, 172)" } : {}}>4 : 3 &nbsp; ( For story ) </p>
                    </div>
                </div>
            </div>
        </div>

    );
}
