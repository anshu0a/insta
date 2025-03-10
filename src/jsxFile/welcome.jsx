import "../cssFile/collect-css/welcome.css"
export default function welcome({well,welcomemsg, first, second,third }) {
    return (<div className="welcome">
        <h1>{well}<br /> <span>{welcomemsg}</span></h1>
        <p>{first}<br />
            {second}<br /><br /><br/>
            <span>{third}</span>
        </p>
    </div>)
}