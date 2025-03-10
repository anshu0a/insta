import "../../cssFile/list-css/face.css"
import { handleImageError} from "../../../utils/handleImg.js"

export default function face({ data }) {
    return (<>

        <div className="strr">

            <img onError={handleImageError} src={data.pic.path} alt="Profile Picture" />
        </div>

    </>)
}