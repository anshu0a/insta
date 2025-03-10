import "../../cssFile/more-css/option2.css";
import { useState, useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { timedo } from "../../../utils/timedo"


export default function Relation({ setResponseMessage, setLod2 }) {
    const navigate = useNavigate();
    const [err, setErr] = useState({ msg: "", color: "rgb(150,150,150)" });
    const [inpdata, setInpdata] = useState("")
    const [myallhelp, setMyallhelp] = useState([])


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;


        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:8080/laohelp',
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
                setMyallhelp(response.data.data);
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

    const sendhelp = async (typ) => {
       
        try {
            setLod2(true)
            const response = await axios.post('http://localhost:8080/addhelp',
                { typ, inpdata }, { withCredentials: true });

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
            if (typ === "deleted") {
                setMyallhelp((pre) => pre.filter((one) => one._id.toString() !== idx));
            } else {
                setMyallhelp((pre) => 
                    pre.map((one) => 
                        one._id.toString() === idx ? { ...one, respond: true } : one
                    )
                );
            }
            
            setLod2(true)
            const response = await axios.post(`http://localhost:8080/chghelp/${typ}/${idx}`,
                { typ, inpdata }, { withCredentials: true });

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
            <p className="notic">I understand that you might be facing some challenges, and I want to assure you that I’m here to help in any way I can. Please feel free to share any questions or concerns you have, and I’ll do my best to provide the support or guidance you need.</p>
            <div className="linkbox boc">
                <label htmlFor="jhjk">How can i help you ?</label>
                <textarea style={{ borderBottom: `1px solid ${err.color}` }} id="jhjk" autoFocus className="text1" rows={6} onChange={(e) => setInpdata(e.target.value)} value={inpdata} placeholder="Share your problem." autoComplete="off" spellCheck="false" />
                {err.msg !== "" &&
                    <p style={{ color: err.color }} className="alerthai"> {err.msg} </p>
                }
                {inpdata.length >= 4 &&
                    <>
                        <p>Ask on </p>
                        <div className="relbox2">
                            <a onClick={() => sendhelp("whatsapp")} href={`https://wa.me/916201909837?text=${encodeURIComponent(inpdata)}`} target="_blank" rel="noopener noreferrer">
                                <img title="Whatsapp" src="svg/whatsapp.svg" className="imgg" alt="WhatsApp Icon" />
                            </a>

                            <a onClick={() => sendhelp("email")} href={`mailto:anshukumargupta000@email.com?subject=Message&body=${encodeURIComponent(inpdata)}`}>
                                <img title="Email" src="svg/mail.svg" className="imgg" alt="Email Icon" />
                            </a>

                            <a onClick={() => sendhelp("sms")} href={`sms:+1916201909837?&body=${encodeURIComponent(inpdata)}`}>
                                <img title="Sms" src="svg/sms.svg" className="imgg" alt="SMS Icon" />
                            </a>

                        </div>
                    </>}
            </div>
            {myallhelp?.length > 0 &&
                <>
                    <p className="prev">Your Previous help</p>
                    <div className="prehelp">
                        {
                            myallhelp?.map((one) => (
                                <div style={one.respond ? { border: "1px solid green",backgroundColor:"rgb(247, 255, 248)" } : {}} key={one._id} className="onehelp">
                                    <div className="thr">
                                        <div className="pee">
                                            <p><b>Through : </b>{one.type}</p>
                                            <p style={one.respond ? { color: "green" } : { color: "red" }}><b>Status : </b>{one.respond ? "Complete" : "Pending"}</p>
                                        </div>
                                        <p>{one.msg}</p>
                                    </div>

                                    <div className="cntrl">
                                        {!one.respond && <img onClick={() => chghelp("solved", one._id)} title="Solved" src="/svg/read.svg" />}
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
