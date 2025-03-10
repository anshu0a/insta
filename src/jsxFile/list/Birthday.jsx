import "../../cssFile/list-css/all.css";

import { useState } from "react";

export default function birthday({ data, lagao }) {

    return (
        <div className="Birthday">
            <p className="msgspan">Choose dates</p>
            <div className="dt">
                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <div onClick={lagao} key={day} id={`D${day}`} className={data.includes("D" + day) ? "slct nsl" : "nsl"}  >
                        {day}
                    </div>
                ))}
            </div>
            <p className="msgspan">Choose months</p>
            <div className="dt">
                {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                    <div onClick={lagao} key={month} id={`M${month}`} className={data.includes("M" + month) ? "slct nsl" : "nsl"}  >
                        {month}
                    </div>
                ))}
            </div>
            <p className="msgspan">Choose years</p>
            <div  className="dt">
                {Array.from({ length: 80 }, (_, i) => new Date(Date.now()).getFullYear() - i).map((year) => (
                    <div onClick={lagao} key={year} id={`Y${year}`} className={data.includes("Y" + year) ? "slct nsl" : "nsl"}  >
                        {year}
                    </div>
                ))}
            </div>
        </div>
    )
}