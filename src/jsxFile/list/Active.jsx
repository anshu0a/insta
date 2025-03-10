import "../../cssFile/list-css/all.css";

import { useState } from "react";

export default function active({ data , lagao }) {
    const act  = ["active","offline"]
    return (
        <div className="Active">
            {/* {act.map((itm , ind)=>(<div  className={data.includes(itm)?"slct nsl":"nsl"} key={ind}>{itm}</div>))} */}
        </div>
    )
}