import Who from './who.jsx';
import Msgbox from './msgbox.jsx';
import { useParams, } from "react-router-dom";

export default function AllMsg({ setResponseMessage, ret, news  }) {
    const { user } = useParams();
    return (
        <>
            <Who user={user} news={news} ret={ret} setResponseMessage={setResponseMessage} />
            <Msgbox user={user} news={news} setResponseMessage={setResponseMessage} />
        </>
    );
}
