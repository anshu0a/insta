import "../../cssFile/profile-css/tagged.css"


export default function tagged({tagged}) {



    return (<div className="outtagged">
        {tagged.length > 0 ?
            <div className="tagged">
                {tagged.map((str, index) => (
                    <div key={index} className="outtag">
                        <img src={str.img}></img>
                        <div className="outt">
                            <img  src={str.user}></img>
                        </div>
                    </div>
                ))}
            </div> :
            <div className="notagged">
               <img src="/svg/tagged.svg"></img>
               <p className="sha">Tagged post</p>
               <p>When someone tagged you, they will appear on your profile.</p>
            </div>
        }
    </div>)
}