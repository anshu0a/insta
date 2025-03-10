import "../../cssFile/more-css/option2.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";

import Switch from "@mui/material/Switch";

export default function Relation({ setResponseMessage, setLod2, setOpton2, user }) {
    const navigate = useNavigate();
    const myinput = useRef(null);
    const [selectedStatus, setSelectedStatus] = useState(user?.relationship?.typ || "Select your status.");
    const [show, setShow] = useState(user.relationship.show);

    useEffect(() => {
        if (user?.relationship?.typ && selectedStatus) {
            const selector = selectedStatus.split(" ")[0];
            const sts = document.querySelector("." + selector);
            const slct = document.querySelectorAll(".slct");
    
            if (sts) {
                for (let slc of slct) {
                    slc.style.color = "";
                    slc.style.border = "";
                }
    
                sts.style.color = "rgb(22, 150, 255)";
                sts.style.border = "1px solid rgb(0, 140, 255)";
            }
        }
    }, [selectedStatus]);
    

    const savekro = async () => {
        try {
            setLod2(true)
            const response = await axios.post('http://localhost:8080/saverelation',
                { selectedStatus, show }, { withCredentials: true });

            if (response.data.message === 'Login required.') {
                await navigate('/Login');
                setResponseMessage(response.data);
                return;
            }

            setResponseMessage(response.data);
            setOpton2({ msg: "", open: false });
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




    return (
        <>
            <p className="notic">
                Let the world know where your heart stands. Update your relationship status and make your profile truly yours.
            </p>
            <div className="showalllinks">
                <label htmlFor="fgd">Show relationship status</label>
                <Switch id="fgd" checked={show} onChange={() => setShow((pre) => !pre)} size="small" name="show" />
            </div>
            <div className="linkbox">
                <label htmlFor="uigww">Relationship</label>
                <input ref={myinput} disabled id="uigww" placeholder="Select your status." value={selectedStatus} readOnly />
                <div className="relbox">
                    {[
                        "single", "in a relationship", "engaged", "married",
                        "separated", "divorced", "widowed", "complicated",
                        "open relationship", "hidden", "domestic partnership",
                        "polyamorous", "cohabiting", "friends with benefits", "situationship"
                    ].map((status) => {
                        const className = status.split(" ")[0].toLowerCase();
                        return (
                            <p key={status} onClick={() => setSelectedStatus(status)} className={`slct ${className}`}>
                                {status}
                            </p>
                        );
                    })}
                </div>
            </div>
            {((user.relationship.typ !== selectedStatus) || (show !== user.relationship.show)) && <div onClick={savekro} className="savebtnu">Update</div>}

        </>
    );
}
