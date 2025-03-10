import "../../cssFile/search-css/list.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home({ type, name1, name2, src, refresh, load, setResponseMessage }) {
  const navigate = useNavigate();
  const makeDel = async function (e) {
    try {
      const response = await axios.post(`http://localhost:8080/deleteHistory/${e.target.title.slice(7)}`, {},
        { withCredentials: true });

      if (response.data?.message === "Login required.") {
        setResponseMessage(response.data);
        await navigate("/Login");
        return;
      }
      setResponseMessage(response.data);
      refresh();

    } catch (error) {
      setResponseMessage({ message: error.message || "Somthing went wrong", color: "red" });
    }
  };

  return (
    <>
      <div className="onename">
        <div className="nocut" onClick={load}>
          <img onClick={type === "h" ? null : ()=>window.location.href=`/Profile/${name1}`} className={type === "h" ? "imgh" : "imgs"} src={src} alt="icon" />
          <div className="bothName">
            {type === "h"? 
            <>
            <p className="h">{name1}</p>
            <p className={"name2"}>{name2}</p>
            </>:
            <>
            <p onClick={()=>window.location.href=`/Profile/${name1}`}  className= "s" >{name1}</p>
            <p onClick={()=>window.location.href=`/Profile/${name1}`}  className={"name2"}>{name2}</p>
            </>}
          </div>
        </div>
        {type === "h" && (
          <div className="cut">
            <img onClick={makeDel} title={"Remove " + name1} width="18px" src="/svg/Cut.svg" alt="Delete" />
          </div>
        )}
      </div>
    </>
  );
}
