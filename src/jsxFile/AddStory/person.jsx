
import "../../cssFile/AddStory-css/person.css";



export default function setting({ setResponseMessage, tik, oneper, handleadd, handlehide }) {

    function daysRemain(timestamp) {
        const future = new Date(timestamp);
        const today = new Date();


        const diffTime = future - today;


        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays > 0 ? diffDays : 0;
    }




    return (<>
        <div className="pr1t">
            <img onClick={() => window.location.href = `/Profile/${oneper?.username}`} src={oneper?.pic.path} />
            <p onClick={() => window.location.href = `/Profile/${oneper?.username}`}>{oneper?.username}</p>
        </div>
        <div onClick={() => handleadd ? handleadd(oneper, !tik ? "add" : "remove") : handlehide(oneper, !tik ? "add" : "remove")} className={tik ? "tik" : " tik notik"}>
            {tik ? "✔️" : "➕"}
        </div>
    </>)
}
