import "../../cssFile/message-css/onemsg.css"

import { timedo } from "../../../utils/timedo.js"
import { handleImageError} from "../../../utils/handleImg.js"



export default function onemsg({ min, msginfo , chatwith}) {

    return (<>
        <div className="block1">
            <img title={chatwith?.fname} src={chatwith?.pic?.path}  onError={handleImageError}></img>
            
            {!msginfo?.seen && msginfo?.reciever !== chatwith._id && <div className="innmm"></div> }
            {!min && <div className="namewl">
                <p className="usern">{chatwith?.fname}</p>
                <div className="userm">
                    <i className="usm" style={!msginfo?.seen && msginfo?.reciever !== chatwith._id ? {opacity:"1"}:{opacity:".4"}}>{ msginfo?.reciever === chatwith._id ? <span>You: {msginfo?.msg}</span>:msginfo?.msg}</i>
                    <p title="Last message">{timedo(msginfo.msgtime)}</p>
                </div>
            </div>}
        </div>
        {!min && <div className="block2">
            {chatwith?.online && <div className="online"></div>}
        </div>}
    </>)
}