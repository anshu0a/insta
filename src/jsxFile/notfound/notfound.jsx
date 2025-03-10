import "../../cssFile/notfound/notfound.css"
import {goBack} from "../../../utils/goback"
export default function notfound() {
    return (<div className="notfoundz">
        <h1>404 - Page Not Found</h1>
        <p >Oops!</p>
        <p>The page you're looking for doesn't exist.</p>
        <div className="bbooxy">
        <div onClick={goBack} className="inbox a">Back</div>
        <a href="/Home" className="inbox b">Home</a>
        </div>
    </div>)
}