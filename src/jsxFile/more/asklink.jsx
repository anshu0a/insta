

import "../../cssFile/more-css/option2.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Switch from '@mui/material/Switch';


export default function link({ setResponseMessage, setLod2, user, tab, setTab }) {
    const navigate = useNavigate();
    const [input, setInput] = useState({ name: "", link: "", ename: "", elink: "", id: "", ind: "" })
    const [mylink, setMylink] = useState({ show: true, links: [] })
    const [err, setErr] = useState({ msg: "", type: "" })



    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;


        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:8080/laolink',
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

                setMylink(response.data);
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
    }, []);


    const handleinp = async (ev) => {
        const { name, value, checked } = ev.target;
        if (name === "show") {
            setMylink((prev) => ({ ...prev, show: checked }));
            try {
                setLod2(true);
                const response = await axios.post(
                    "http://localhost:8080/addshowlink",
                    { show: checked },
                    { withCredentials: true }
                );
                setLod2(false);
                if (response.data.message === "Login required.") {
                    await navigate("/Login");
                    setResponseMessage(response.data);
                    return;
                }
                setResponseMessage(response.data);
            } catch (error) {
                setLod2(false);
                console.error("Fetch error:", error.message);
                setResponseMessage({
                    message: error.response?.data?.message || "An error occurred",
                    color: "red",
                });
            }
            return;
        }

        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const savelink = async function () {
        setErr({ msg: "", type: "" })

        if (input.name === "") {
            setErr({ msg: "Name is empty", type: "name" })
        } else if (input.name.length <= 2) {
            setErr({ msg: "Name must be atleast 3 character", type: "name" })
        } else if (input.link === "") {
            setErr({ msg: "Link is  empty", type: "link" })
        } else if (!input.link.includes(".") || input.link.length < 2) {
            setErr({ msg: "Enter a valid link", type: "link" })
        } else {
            try {
                const response = await axios.post('http://localhost:8080/addlink',
                    { name: input.name, link: input.link }, { withCredentials: true, });

                if (response.data.message === 'Login required.') {
                    await navigate('/Login');
                    setResponseMessage(response.data);
                    return;
                }
                setResponseMessage(response.data);
                if (response.data.color === "green") {
                    setMylink({ links: response.data.alllinks, show: response.data.show })
                    setInput((pre) => ({ elink: "", ename: "" }))
                }
                setTab(1)
            } catch (error) {
                console.error('Fetch error:', error.message);
                setResponseMessage({ message: error.response?.data?.message || 'An error occurred', color: 'red', });
            }
        }
    }

    const editlink = async function () {
        setErr({ msg: "", type: "" })

        if (input.ename === "") {
            setErr({ msg: "Name is empty", type: "ename" })
        } else if (input.ename.length <= 2) {
            setErr({ msg: "Name must be atleast 3 character", type: "ename" })
        } else if (input.elink === "") {
            setErr({ msg: "Link is  empty", type: "elink" })
        } else if (!input.elink.includes(".") || input.elink.length < 2) {
            setErr({ msg: "Enter a valid link", type: "elink" })
        } else {
            try {
                const response = await axios.post(`http://localhost:8080/editlink/${input.id}`,
                    { name: input.ename, link: input.elink }, { withCredentials: true, });

                if (response.data.message === 'Login required.') {
                    await navigate('/Login');
                    setResponseMessage(response.data);
                    return;
                }
                setResponseMessage(response.data);
                if (response.data.color === "green") {
                    setMylink((pre) => ({ ...pre, links: response.data.alllinks }))
                    setInput((pre) => ({ ...pre, elink: "", ename: "" }))
                }
                setTab(1)
            } catch (error) {

                console.error('Fetch error:', error.message);
                setResponseMessage({
                    message: error.response?.data?.message || 'An error occurred',
                    color: 'red',
                });

            }
        }
    }

    const deletelink = async function (id) {
        try {
            mylink.links = mylink.links.filter((onelink) => onelink._id !== id);

            const response = await axios.post(`http://localhost:8080/deletelink/${id}`,
                {},
                { withCredentials: true }
            );

            if (response.data.message === 'Login required.') {
                setResponseMessage(response.data);
                await navigate('/Login');
                return;
            }

            setResponseMessage(response.data);
        } catch (error) {
            console.error('Fetch error:', error.message);
            setResponseMessage({
                message: error.response?.data?.message || 'An error occurred',
                color: 'red',
            });
        }
    };

    const clckedit = function (ind, id) {
        setTab(3)
        setInput({ ename: mylink.links[ind].name, elink: mylink.links[ind].link, ind: ind, id: id })
    }


    return (
        <>
            <p className="notic">Feel free to link your website, portfolio, and any other relevant pages or social media profiles. Once added, they will be displayed in your profile, making it easier for others to learn more about you and your work.</p>
            {tab === 1 ? <>
                <div className="showalllinks">
                    <label htmlFor="fgd">Show all Links on your profile</label>
                    <Switch id="fgd" checked={mylink.show} onChange={handleinp} size="small" name="show" />
                </div>
                <div className="alllinks">
                    {mylink.links?.map((one, ind) =>
                        <div key={one._id} className="onelink">
                            <a href={one.link} target="_blank" rel="noopener noreferrer" className="prt1">
                                <p className="first">{one.name}</p>
                                <p className="second">{one.link}</p>
                            </a>
                            <div className="prt2">
                                <img onClick={() => clckedit(ind, one._id)} width="18px" src="/svg/edit2.svg" />
                                <img onClick={() => deletelink(one._id)} width="20px" src="/svg/delete.svg" />
                            </div>
                        </div>)
                    }
                </div>
                <div onClick={() => setTab(2)} className="addlinks">{mylink.links?.length > 0 ? " Add another link" : "Add your first Link"}</div>
            </> : tab === 2 ?
                <>
                    {mylink.links.length >= 5 && <p className="myerror">Maximum of 5 links are allowed, and you have allready 10 links added</p>}
                    <div style={err.msg !== "" ? { border: "1px solid red" } : mylink.links.length >= 5 ? { opacity: ".5" } : {}} className="linkbox">
                        <label htmlFor="uigww">Name</label>
                        <input style={err.type === "name" ? { borderBottom: "1px solid red" } : {}} disabled={mylink.links.length >= 5} maxLength="10" id="uigww" placeholder="Set a name of your link." autoComplete="off" autoFocus name="name" value={input.name} onChange={handleinp} />
                        <label htmlFor="uigw">Link</label>
                        <input style={err.type === "link" ? { borderBottom: "1px solid red" } : {}} disabled={mylink.links.length >= 5} id="uigw" placeholder="Paste your link here." autoComplete="off" autoFocus name="link" value={input.link} onChange={handleinp} />
                        {err.msg !== "" && <p className="myerror">{err.msg}</p>}
                    </div>
                    {input.link !== "" && input.name !== "" && <div onClick={savelink} className="savebtnu">Save</div>}
                </> : tab === 3 ?
                    <>

                        <div className="linkbox">
                            <label htmlFor="uq">Edit name</label>
                            <input style={err.type === "ename" ? { borderBottom: "1px solid red" } : {}} id="uq" placeholder="Edit name of your link." maxLength="10" autoComplete="off" autoFocus name="ename" value={input.ename} onChange={handleinp} />
                            <label htmlFor="ueg">Edit link</label>
                            <input style={err.type === "elink" ? { borderBottom: "1px solid red" } : {}} id="ueg" placeholder="Edit your link." autoComplete="off" autoFocus name="elink" value={input.elink} onChange={handleinp} />
                            {err.msg !== "" && <p className="myerror">{err.msg}</p>}
                        </div>
                        {input.elink !== "" && input.ename !== "" && (input.ename !== mylink.links[input.ind].name || input.elink !== mylink.links[input.ind].link) && <div onClick={editlink} className="savebtnu">Edit</div>}
                    </> :
                    <></>}
        </>
    );
}
