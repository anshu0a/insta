import "../../cssFile/profile-css/onehilight.css"


export default function onehilight({data}) {
   return (<>
      <div className="onehilight">
         <img src={data.img}></img>
         <p>{data.name}</p>
      </div>
   </>)
}