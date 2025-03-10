import "../../cssFile/list-css/list.css"


import Badge from "./badge"
import Birthday from "./Birthday"
import Active from "./Active"
import Events from "./Events"
import Gender from "./Gender"
import Name from "./Name"
import Relationship from "./Relationship"
import Loader2 from "../collect/loader2.jsx"

import { goBack } from "../../../utils/goback.js";
import Person from "./person.jsx"
import Fetch from "./fetch.jsx"
import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { useNavigate, useSearchParams } from 'react-router-dom';




export default function list({ setResponseMessage }) {
  const navigate = useNavigate();
  const [lod2, setLod2] = useState(false)
  const [searchParams] = useSearchParams();
  const badge = searchParams.get('B');
  const date = parseInt(searchParams.get('D'), 10);
  const month = parseInt(searchParams.get('M'), 10);
  const controllerRef = useRef(null);
  const filterBoxRef = useRef(null);

  const [data, setData] = useState({ emp: "" })
  const [fn, setFn] = useState({ flt: true })
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [choose, setChoose] = useState({ Badge: [], Name: [], Birthday: [], Username: [], Gender: [], Active: [], Relationship: [], Events: [] });
  const [no, setNo] = useState(0)
  const [load, setLoad] = useState("Badge")
  const buttonRefs = useRef([]);

  useEffect(() => {
    let timeoutId;

    if (badge) {
      setChoose((prev) => ({ ...prev, Badge: [badge] }));
      setLoad("Badge");

      timeoutId = setTimeout(() => {
        if (buttonRefs.current[0]) buttonRefs.current[0].click();
        if (buttonRefs.current[1]) buttonRefs.current[1].click();
        // setFn((prev) => ({ ...prev, flt: false }));
      }, 300);
    } else if (
      date &&
      month &&
      !isNaN(date) &&
      !isNaN(month) &&
      date > 0 &&
      date <= 31 &&
      month > 0 &&
      month <= 12
    ) {
      setChoose((prev) => ({
        ...prev,
        Birthday: [`M${month}`, `D${date}`,],
      }));
      setLoad("Birthday");

      timeoutId = setTimeout(() => {
        if (buttonRefs.current[0]) buttonRefs.current[0].click();
        if (buttonRefs.current[1]) buttonRefs.current[1].click();
        // setFn((prev) => ({ ...prev, flt: false }));
      }, 300);
    }

    return () => {

      clearTimeout(timeoutId);
    };
  }, [badge, date, month]);


  useEffect(() => {
    const check = () => {
      let count = 0;
      Object.entries(choose).forEach(([key, value]) => {
        if (value.length > 0) {
          count += 1;
        }
      });
      setNo(count);
    };

    check();
  }, [choose]);


  const lagao = function (e) {
    let { innerText, parentElement, id } = e.target
    let trm = parentElement.className;

    if (trm === "dt") {
      trm = "Birthday"
      innerText = id
    }
    setChoose((prevChoose) => {
      const isSelected = prevChoose[trm].includes(innerText);
      return {
        ...prevChoose,
        [trm]: isSelected
          ? prevChoose[trm].filter((item) => item !== innerText)
          : [...prevChoose[trm], innerText]
      };
    });

  }

  const components = {
    Badge: <Badge setResponseMessage={setResponseMessage} lagao={lagao} data={choose.Badge} />,
    Name: <Name lagao={lagao} data={choose.Name} wht="Name" />,
    Birthday: <Birthday lagao={lagao} data={choose.Birthday} />,
    Username: <Name lagao={lagao} data={choose.Username} wht="Username" />,
    Active: <Active lagao={lagao} data={choose.Active} />,
    Gender: <Gender lagao={lagao} data={choose.Gender} />,
    Relationship: <Relationship lagao={lagao} data={choose.Relationship} />,
    Events: <Events />
  };






  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 750 && fn.flt) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [fn.flt]);

  useEffect(() => {
    return () => {
      if (controllerRef.current) {
        console.log("Cleanup: Request aborted");
        controllerRef.current.abort();
      }
    };
  }, []);

  const handlefltbtn = async () => {
    const fbx = filterBoxRef.current;

    if (fn.flt) {
      if (no !== 0) {
        const controller = new AbortController();
        controllerRef.current = controller;

        try {
          setLod2(true);

          const result = await axios.post(`http://localhost:8080/applyFilter`,
            choose,
            { withCredentials: true, signal: controller.signal }
          );

          setLod2(false);

          if (result.data.message === "Login required.") {
            await navigate("/Login");
            setResponseMessage(result.data);
            return;
          }

          if (result.data.color !== "green") {
            setResponseMessage(result.data);
          }

          setData(result.data);
        } catch (error) {
          if (axios.isCancel(error)) {
            console.warn("Request canceled");
          } else {
            console.error("Error during request:", error);
            setResponseMessage({ color: "red", message: "Something went wrong." });
          }
        }


        if (fbx) {
          fbx.style.bottom = "-20vh";
          setTimeout(() => {
            fbx.style.bottom = "0";
          }, 300);
        }

        setFn((prev) => ({ ...prev, flt: !prev.flt }));
      } else {
        setLoad("");
      }
    } else {
      if (fbx) {
        fbx.style.bottom = "-20vh";
        setTimeout(() => {
          fbx.style.bottom = "0";
        }, 300);
      }

      setFn((prev) => ({ ...prev, flt: !prev.flt }));
    }
  };



  return (<div className="lisst">
    {lod2 && <Loader2 />}
    {windowWidth < 750 && <div ref={(el) => buttonRefs.current[1] = el} className={`filterbox`} onClick={handlefltbtn}>
      <svg viewBox="0 0 24 24" fill="none" >
        <path stroke="white" d="M14.3206 19.0698C14.3206 19.6798 13.9205 20.4798 13.4105 20.7898L12.0005 21.6998C10.6905 22.5098 8.87054 21.5998 8.87054 19.9798V14.6298C8.87054 13.9198 8.47055 13.0098 8.06055 12.5098L4.22052 8.46976C3.71052 7.95976 3.31055 7.05977 3.31055 6.44977V4.12976C3.31055 2.91976 4.22057 2.00977 5.33057 2.00977H18.6705C19.7805 2.00977 20.6906 2.91975 20.6906 4.02975V6.24976C20.6906 7.05976 20.1805 8.06976 19.6805 8.56976" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        {!fn.flt ? <>
          <path d="M17.0802 11.8899L13.5401 15.4299C13.4001 15.5699 13.2701 15.8299 13.2401 16.0199L13.0501 17.3699C12.9801 17.8599 13.3202 18.1999 13.8102 18.1299L15.1601 17.9399C15.3501 17.9099 15.6202 17.7799 15.7502 17.6399L19.2901 14.0999C19.9001 13.4899 20.1901 12.7799 19.2901 11.8799C18.4001 10.9899 17.6902 11.2799 17.0802 11.8899Z" stroke="green" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M16.5801 12.3901C16.8801 13.4701 17.72 14.3101 18.8 14.6101" stroke="green" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
        </> : <>
          <path stroke="green" d="M16.0692 16.5201C17.8365 16.5201 19.2692 15.0874 19.2692 13.3201C19.2692 11.5528 17.8365 10.1201 16.0692 10.1201C14.3018 10.1201 12.8691 11.5528 12.8691 13.3201C12.8691 15.0874 14.3018 16.5201 16.0692 16.5201Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path stroke="green" d="M19.8691 17.1201L18.8691 16.1201" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /> </>}
      </svg>
    </div>}
    <div className="toop">
      <div className="onne">
        <img className="back" onClick={goBack} title="Back" src="/svg/Back.svg" alt="Back" />
        <p>Users Filter</p>
      </div>
    </div>
    <div className="midddle">
      <div className="lefft">
        <Fetch components={components} btn={buttonRefs} fun={handlefltbtn} width={windowWidth} no={no} choose={choose} load={load} setLoad={setLoad} />
        {(windowWidth > 750 && no > 0) && <div ref={(el) => buttonRefs.current[0] = el} onClick={handlefltbtn} className="svsearch" >Search</div>}
      </div>
      <div className="cennter">
        {(fn.flt && windowWidth < 750) &&
          <div className="fltbase">
            <div className="linn"></div>
            <div className="actflt">
              <Fetch components={components} no={no} choose={choose} load={load} setLoad={setLoad} />
            </div>
          </div>}{data[0]?.username ?
            <>
              {data.map((dt, ind) => (<Person setResponseMessage={setResponseMessage} key={ind} data={dt} />))}
            </> :
            <div className="nodata">
              <img src="svg/filterimgno.svg" />
              <p>No user found</p>
            </div>
        }

      </div>
      <div className="rigght">
        <h2>Dive Deep, Discover More.</h2>
        <p> Filters refine searches and eliminate distractions,</p>
          <p> connecting you to the right people effortlessly and unlocking endless opportunities</p>
      </div>
    </div>
  </div>)
}