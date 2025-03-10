import "../../cssFile/list-css/person.css";
import Face from "./face.jsx";
import Follow from '../profile/follow/follow.jsx'

export default function List({ data, setResponseMessage }) {


    return (
        <>
            <div className="person">
                <div className="onee">
                    <Face data={data} />
                    <a href={`/Profile/${data.username}`} className="pp">
                        <p className="nm11">{data.username}</p>
                        <p className="nm22">{data.fname}</p>
                    </a>
                </div>
                <div className="twoo">
                        <Follow img={true} hisid={data?._id} setResponseMessage={setResponseMessage} />

                </div>
            </div>
        </>
    );
}
