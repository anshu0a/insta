import { useEffect, useState } from 'react';
import "../../cssFile/collect-css/feedback.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function Feedback({ cutfun, setResponseMessage }) {
    const navigate = useNavigate();
    const [inp, setInp] = useState("")
    const [err, setErr] = useState("")

    useEffect(() => {
        const cut = document.querySelector('.cuty');
        setTimeout(() => { document.querySelector('body').style.overflow = "hidden" }, 2000)
        setTimeout(() => {
            cut.style.display = "flex"
        }, 5400)

    }, []);

    function handlepp(e) {
        setInp(e.target.value)
    }
    async function cutcut(e) {
        if (e.target.className === "submit2") {
            setErr("")
            try {
                const response = await axios.post('http://localhost:8080/suggestion', { inp }, { withCredentials: true });
                if (response.data?.message === "Login required.") {
                    setResponseMessage(response.data);
                    await navigate("/Login");
                    return;
                }

                if (response.data?.color === "red") {
                    setResponseMessage(response.data);
                    return;
                }

            } catch (er) {
                console.log(er)
                setResponseMessage({ message: er.message, color: "red" });
            }
        } else if (e.target.className === "submit") {
            console.log("marry")
            setErr("Feedback length must be greater then 20 letter")
            return
        }
        document.querySelector('body').style.overflow = ""
        cutfun();
    }

    return (
        <div className="feedback">
            <div className="progress-bar"></div>
            <div className="infeedback">
                <p>We respect your Suggestion</p>
                <textarea style={err.length > 0 ? { border: "1px solid red" } : {}} value={inp} onChange={handlepp} rows="7" placeholder="what we will have to improve ?"></textarea>
                <div className='aall'>{err}</div>
                <svg className="cuty" onClick={cutcut} viewBox="0 0 384 512">
                    <path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z" /></svg>

                <div className={inp.length > 20 ? "submit2" : "submit"} onClick={cutcut}>Submit</div>
            </div>
        </div>
    );
}
