import "../../cssFile/list-css/all.css";

import { useState } from "react";

export default function gender({ data , lagao }) {
    const gnd = ["male","female" ,"other"]
    return (
        <div className="Gender">
            {gnd.map((itm , ind)=>(<div onClick={lagao} className={data.includes(itm)?"slct nsl":"nsl"} key={ind}>{itm}</div>))}
        </div>
    )
}