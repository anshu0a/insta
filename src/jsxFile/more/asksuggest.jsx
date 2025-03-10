import "../../cssFile/more-css/option2.css";
import { useState, useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { timedo } from "../../../utils/timedo"


export default function suggestion({ setResponseMessage, setLod2, user }) {
    const navigate = useNavigate();
    const [inp, setInpdata] = useState("")
    const [mysuggestion, setMysuggestion] = useState([])


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;


        const fetchData = async () => {
            try {
                const response = await axios.post('https://instaserver-knen.onrender.com/laosuggest',
                    {}, { withCredentials: true, signal, });

                if (response.data.message === 'Login required.') {
                    await navigate('/Login');
                    setResponseMessage(response.data);
                    return;
                }


                if (response.data.color && response.data.color === 'red') {
                    setResponseMessage(response.data);
                    return;
                }
                console.log(response.data.data);
                setMysuggestion(response.data.data);
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.warn('Request aborted by the user.');
                } else {
                    console.error('Fetch error:', error.message);
                    setResponseMessage({
                        message: error.response?.data?.message || 'An error occurred',
                        color: 'red',
                    });
                }
            }
        };

        fetchData();

        return () => {
            console.log('Cleanup: Request aborted');
            controller.abort();
        };
    }, [navigate]);

    const sendsuggestion = async (typ) => {
        try {
            setLod2(true)
            const response = await axios.post('https://instaserver-knen.onrender.com/suggestion', { inp }, { withCredentials: true });

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }

            setResponseMessage(response.data);
            setInpdata("")
            setLod2(false)


        } catch (error) {
            setLod2(false)
            if (axios.isCancel(error)) {
                console.warn('Request aborted by the user.');
            } else {
                console.error('Fetch error:', error.message);
                setResponseMessage({
                    message: error.response?.data?.message || 'An error occurred',
                    color: 'red',
                });
            }
        }
    };
    const chghelp = async function (typ, idx) {
        try {
            setLod2(true)
            if (typ === "deleted") {
                setMysuggestion((pre) => pre.filter((one) => one._id.toString() !== idx));
            } else {
                setMysuggestion((pre) =>
                    pre.map((one) =>
                        one._id.toString() === idx ? { ...one, respond: true } : one
                    )
                );
            }

            const response = await axios.post(`https://instaserver-knen.onrender.com/chgsuggestion/${typ}/${idx}`,
                {}, { withCredentials: true });

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }

            setResponseMessage(response.data);
            setLod2(false)

        } catch (error) {
            setLod2(false)
            console.error('Fetch error:', error.message);
            setResponseMessage({
                message: error.response?.data?.message || 'An error occurred',
                color: 'red',
            });
        }

    }



    return (
        <>
            <p className="notic">We greatly value your insights, and if you have any suggestions or recommendations, we would love to hear them. Your ideas play a crucial role in helping us improve, innovate, and provide a better experience. No matter how big or small, every suggestion matters, so please feel free to share your thoughts with us.</p>
            <div className="linkbox boc">
                <label htmlFor="jhjk">Suggest your ideas.</label>
                <textarea id="jhjk" autoFocus className="text1" rows={6} onChange={(e) => setInpdata(e.target.value)} value={inp} placeholder="Share what you think . . ." autoComplete="off" spellCheck="false" />
            </div>
            {inp.length > 4 && <div onClick={sendsuggestion} className="savebtnu">Send</div>}
            {mysuggestion?.length > 0 &&
                <>
                    <p className="prev">Your Previous Suggestion</p>
                    <div className="prehelp">
                        {
                            mysuggestion?.map((one) => (
                                <div style={one.respond ? { border: "1px solid green", backgroundColor: "rgb(247, 255, 248)" } : {}} key={one._id} className="onehelp">
                                    <div className="thr">
                                        <div className="pee">
                                            <p>{user.username}</p>
                                            <p style={one.respond ? { color: "green" } : { color: "red" }}><b>Status : </b>{one.respond ? "Complete" : "Pending"}</p>
                                        </div>
                                        <p>{one.msg}</p>
                                    </div>

                                    <div className="cntrl">
                                        {!one.respond && <img onClick={() => chghelp("listened", one._id)} title="Solved" src="/svg/read.svg" />}
                                        <img title="Delete" onClick={() => chghelp("deleted", one._id)} src="/svg/delete.svg" />
                                        <img src="/svg/history.svg" />
                                        <p>{timedo(one.datex)}</p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </>
            }

        </>
    );
}
