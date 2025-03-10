import "../../cssFile/more-css/option2.css";
import { useState, useEffect } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";
import { timedo } from "../../../utils/timedo"



export default function suggestion({ setResponseMessage, setLod2, user }) {
    const navigate = useNavigate();
    const [inp, setInpdata] = useState({ title: "bug", report: "" })

    const [mysuggestion, setMysuggestion] = useState([])


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;


        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:8080/fetcreport',
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

    const sendreport = async () => {
        try {
            setLod2(true)
            const response = await axios.post('http://localhost:8080/addreport', { title: inp.title, report: inp.report }, { withCredentials: true });

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }

            setResponseMessage(response.data);
            setInpdata({ title: "bug", report: "" })
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
                        one.report._id.toString() === idx
                            ? { ...one, report: { ...one.report, respond: true } }
                            : one
                    )
                );

            }

            const response = await axios.post(`http://localhost:8080/chgreport/${typ}/${idx}`,
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
                <label htmlFor="uigww">Title</label>
                <select id="uigww" onChange={(e) => setInpdata((prev) => ({ ...prev, title: e.target.value }))} value={inp.title} >
                    <option value="bug">Bug/Glitch</option>
                    <option value="login">Login Issues</option>
                    <option value="privacy">Privacy & Security</option>
                    <option value="content">Content Issues</option>
                    <option value="messaging">Messaging Problems</option>
                    <option value="notifications">Notification Issues</option>
                    <option value="profile">Profile</option>
                    <option value="Settings">Settings</option>
                    <option value="ui">UI/UX Issues</option>
                    <option value="performance">Slow Performance</option>
                    <option value="crash">App Crashing</option>
                    <option value="upload">Media Upload Issues</option>
                    <option value="search">Search Function Not Working</option>
                    <option value="request">Friend Request Issues</option>
                    <option value="abuse">Reporting Abuse/Harassment</option>
                    <option value="other">Other</option>
                </select>

                <br />
                <label htmlFor="jhjk">What problem you are facing.</label>
                <textarea id="jhjk" autoFocus className="text1" rows={6} onChange={(e) => setInpdata((pre) => ({ ...pre, report: e.target.value }))} value={inp.report} placeholder="Share your issues . . ." autoComplete="off" spellCheck="false" />
            </div>
            {(inp.title !== "" && inp.report.length > 4) && <div onClick={sendreport} className="savebtnu">Report</div>}
            {mysuggestion?.length > 0 &&
                <>
                    <p className="prev">Your Previous Report</p>
                    <div className="prehelp">
                        {
                            mysuggestion?.map((one, ind) => (
                                <div style={one.report.respond ? { border: "1px solid green", backgroundColor: "rgb(247, 255, 248)" } : {}} key={one.report._id} className="onehelp">
                                    <div className="thr">
                                        <div className="pee">
                                            <p><b>Regarding : </b>{one.report.title}</p>
                                            <p style={one.report.respond ? { color: "green" } : { color: "red" }}><b>Status : </b>{one.report.respond ? "Complete" : "Pending"}</p>
                                        </div>
                                        <div className="outpe">
                                            <p>{one.report.report}</p>
                                            {one.postDetails &&
                                                <img src={one.postDetails?.postimg?.path}></img>
                                            }
                                        </div>
                                    </div>

                                    <div className="cntrl">
                                        {!one.report.respond && <img onClick={() => chghelp("listened", one.report._id)} title="Solved" src="/svg/read.svg" />}
                                        <img title="Delete" onClick={() => chghelp("deleted", one.report._id)} src="/svg/delete.svg" />
                                        <img src="/svg/history.svg" />
                                        <p>{timedo(one.report.datex)}</p>
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
