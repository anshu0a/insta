import "../../cssFile/list-css/all.css";
import axios from "axios"
import { useState, useEffect,  useRef} from "react";
import Loader from "../collect/loader.jsx"
import { useNavigate } from 'react-router-dom';

export default function badge({ data, lagao , setResponseMessage }) {
    const navigate = useNavigate();
    const [vlu, setVlu] = useState({})
    const [lod2, setLod2] = useState(false)
    const controllerRef = useRef(null);



    useEffect(() => {
        const controller = new AbortController(); 
        controllerRef.current = controller;
    
        async function lao() {
          try {
            setLod2(true);
    
            const result = await axios.post(
              `https://instaserver-knen.onrender.com/fltrData/badge`,
              {},
              { withCredentials: true, signal: controller.signal }
            );
    
            setLod2(false);
    
            if (result.data.message === "Login required.") {
              await navigate("/Login");
              setResponseMessage(result.data);
              return;
            }
    
            if (result.data.color === "red") {
              setResponseMessage(result.data);
              return;
            }
    
            setVlu(result.data);
          } catch (error) {
            if (axios.isCancel(error)) {
              console.warn("Request canceled");
            } else {
              console.error("Error during request:", error);
              setResponseMessage({ color: "red", message: "Something went wrong." });
            }
            setLod2(false);
          }
        }
    
        lao();

        return () => {
          if (controller) {
            console.log("Cleanup: Request aborted");
            controller.abort();
          }
        };
      }, [setLod2, navigate, setResponseMessage, setVlu]);


    return (<>{lod2 && <Loader />}
        {vlu?.data?.length > 0 ?
            <div className="Badge">
                {vlu?.data?.map((itm, ind) => (
                    <div onClick={lagao} className={data.includes(itm._id) ? "slct nsl" : "nsl"} key={ind}>{itm._id}</div>
                ))}
            </div>
            : <p>Loading . . .</p>} </>)
}