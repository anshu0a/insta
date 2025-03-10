import "../../cssFile/list-css/all.css";


export default function events({ data , lagao }) {
    const rel = ["single", "in a relationship","engaged", "married", "separated", "divorced", "widowed", "it's complicated","open relationship","hidden","domestic partnership","polyamorous", "cohabiting", "friends with benefits","situationship"]
    
    return (
        <div className="Relationship">
{rel.map((itm , ind)=>(<div onClick={lagao} className={data.includes(itm)?"slct nsl":"nsl"} key={ind}>{itm}</div>))}
        </div>
    )
}