import "../../cssFile/list-css/fetch.css";



export default function fetch({btn, choose , components , no , load, setLoad ,fun,width }) {


    const loadkro = function (e) {
        let { id } = e.target;
        setLoad(id)
    }
    return (
        <div className="fetch">
            <p>Search by &nbsp;( <b>{no} </b>)<img src="/svg/man/sleep.svg" /> <img className="sit" src="/svg/man/sit.svg" /></p>
            <div className="srchby">
                {Object.entries(choose).map(([key, value], no) => (
                    <div key={no}>
                        <div className={value.length > 0 ? "blnk" : ""}></div>
                        <div onClick={loadkro} id={key} className={load == key ? "ech slct" : "ech"}  >
                            {key}
                        </div>
                    </div>))}
            </div>
            <p>Options
                {load === "Badge" ? <img className="up" src="/svg/man/up.svg" /> : 
                load === "Name" ? <img className="solve" src="/svg/man/solve.svg" /> : 
                load === "Birthday" ? <img className="think" src="/svg/man/think.svg" /> : 
                load === "Username" ? <img className="thinksit" src="/svg/man/thinksit.svg" /> :
                load === "Gender" ? <img className="curv" src="/svg/man/curv.svg" /> : 
                load === "Relationship" ? <img className="cycle" src="/svg/man/cycle.svg" /> : 
                load === "Active" ? <img className="ball" src="/svg/man/ball.svg" /> :
                load === "Events" ? <img className="jump" src="/svg/man/jump.svg" /> :  ""}
            </p>
            <div className="optns">
                {components[load] || <> <img  src="/svg/filterimg3.svg" width="200px" /><p style={{color:"grey",fontSize:"17px"}}>No search choosen</p></>}
            </div>
            
        </div>
    )
};