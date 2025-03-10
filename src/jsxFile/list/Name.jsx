import "../../cssFile/list-css/all.css";

export default function name({ lagao , data , wht}) {

    const vlu = Array.from({ length: 26 }, (_, i) =>  String.fromCharCode(65 + i));
    return (
        <>
        
        <div className={wht}>
        <p className="msgspan">{wht + " started with"}</p>
            {
                vlu.map((alp , no)=>(<div onClick={lagao} key={no} id={alp} className={data.includes(alp) ? "slct nsl" : "nsl"} >{alp}</div>))
            }
                
         
        </div></>
    )
}
