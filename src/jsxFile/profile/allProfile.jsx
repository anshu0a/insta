import "../../cssFile/profile-css/allProfile.css"
import Hilight from "../../jsxFile/profile/hilight.jsx"
import Posts from "../../jsxFile/profile/posts.jsx"
import Saved from "../../jsxFile/profile/saved.jsx"
import Tagged from "../../jsxFile/profile/tagged.jsx"
import Follow from '../profile/follow/follow.jsx'
import FollowList from '../profile/follow/list.jsx'
import Archieves from "./archieve.jsx"

import { useState } from "react"
import { goBack } from "../../../utils/goback.js";
import { handleImageError } from "../../../utils/handleImg.js"


export default function allProfile({ detail, data, setRes, setResponseMessage, user }) {

  const [swch, setSwch] = useState("POSTS");
  const [showarc, setShowarc] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(data.username);

    } catch (err) {
    }
  };
  const doswch = function (e) {
    if (e.target.tagName == "P") {
      setSwch(e.target.innerText)
    } else if (e.target.tagName == "DIV") {
      setSwch(e.target.children[1].innerText)
    } else {
      setSwch(e.target.parentElement.children[1].innerText)
    }
  }

  function formatDate(datt) {
    const date = new Date(datt);

    const day = date.getDate();
    const daySuffix =
      day % 10 === 1 && day !== 11 ? 'st' :
        day % 10 === 2 && day !== 12 ? 'nd' :
          day % 10 === 3 && day !== 13 ? 'rd' : 'th';

    const month = date.toLocaleString('default', { month: 'long' });

    return `${day}${daySuffix} ${month}`;
  }
  return (<>
    <div className="allProfile">
      <div className="outprofile">
        <div className="out1">
          <img className="backe" onClick={goBack} title="Back" src="/svg/Back.svg" alt="Back" />
          <div className="outin1">
            <div className="username" title="Click to copy username" onClick={copyToClipboard} >{data.username}</div>
            {data.badge.show && <a href={`/filter?B=${data.badge.msg}`} style={{ backgroundColor: data.badge.color, boxShadow: '0px 0px 15px rgba(' + data.badge.color.split("(")[1].slice(0, -1) + ',.5)' }} className="bdge">{data.badge.msg}</a>}
          </div>
        </div>
        <div className="out2">
          <div className="outimgx">
            <img onError={handleImageError} src={data.pic.path}></img>
            <a href={`/filter?M=${data.birthdate.datex.slice(5, 7)}&D=${data.birthdate.datex.slice(8, 10)}`} className="birth">
              <img width="30px" src={"/svg/bday/birth" + data.birthdate.img + ".svg"}></img>
              <p>{formatDate(data.birthdate.datex)}</p>
            </a>
          </div>
          <div className="somedtl">
            <div className="doChange">
              {user.username === data.username ?
                <>
                  <a href={"/EditProfile/" + user.username} className="edit">
                    <img width="22px" src="/svg/Edit.svg"></img>
                    <p>Edit Profile</p>
                  </a>
                  <a onClick={() => setShowarc(true)} className="view">
                    <img width="22px" src="/svg/archive.svg"></img>
                    <p href="/ViewArchive">View Archive</p>
                  </a>
                </>
                :
                <>
                  <Follow img={true} hisid={data._id} setResponseMessage={setResponseMessage} />
                  <a href={`/Messages/${data.username}`} className="view">
                    <img width="22px" src="/svg/msg.svg"></img>
                    <p >Message</p>
                  </a>
                </>
              }
            </div>
            <div className="gndr">
              {data.gender.show && (data.gender.value === "male" ? <img src="/svg/male.svg"></img> :
                data.gender.value === "female" ? <img src="/svg/female.svg"></img> : "")}
              <p>{data.fname}</p>
            </div>
            <div className="biox" dangerouslySetInnerHTML={{ __html: data.bio.replace(/\n/g, "<br/>") }}></div>
            {data?.relationship?.show && <div className="linkx">
              <img width="20px " src="/svg/relation.svg" />
              <p className="rels">{data?.relationship?.typ}</p>
            </div>}
            {(data?.links?.show && data?.links?.allLinks[0]) && <div className="linkx">
              <img width="18px " src="/svg/link.svg" />
              {data?.links?.allLinks?.slice(0, 3).map((onelink) => <a target="_blank" rel="noopener noreferrer" key={onelink._id} href={onelink.link}>{onelink.name}</a>)}
            </div>}

          </div>
        </div>
        <div className="out3">
          <div className="erdiv">
            <b>{data.post?.filter(post => !post.archieve).length}</b>
            <p>posts</p>
          </div>
          <FollowList setResponseMessage={setResponseMessage} user2id={data._id} />
        </div>
        <div className="out4">
          <Hilight hilight={[]} />
        </div>
        <div className="out5">
          <div onClick={doswch} style={swch == "POSTS" ? { borderBottom: "1px solid black" } : {}} >
            <img width="16px" src="/svg/post.svg"></img>
            <p style={swch == "POSTS" ? { color: " rgb(0, 179, 255)" } : {}}>POSTS</p>
          </div>
          {user.username === data.username &&
            <div onClick={doswch} style={swch == "SAVED" ? { borderBottom: "1px solid black" } : {}}>
              <img width="16px" src="/svg/save.svg"></img>
              <p style={swch == "SAVED" ? { color: " rgb(0, 179, 255)" } : {}}>SAVED</p>
            </div>
          }
          <div onClick={doswch} style={swch == "TAGGED" ? { borderBottom: "1px solid black" } : {}}>
            <img width="16px" src="/svg/tag.svg"></img>
            <p style={swch == "TAGGED" ? { color: " rgb(0, 179, 255)" } : {}}>TAGGED</p>
          </div>
        </div>
        <div className="out6">
          {swch == "POSTS" ?
            <Posts setRes={setRes} setResponseMessage={setResponseMessage} post={data.post} user={{ is: user.username === data.username, fname: data.fname, _id: data._id, userpic: data.pic.path }} /> :
            swch == "SAVED" ? user.username === data.username && <Saved userid={data._id} setResponseMessage={setResponseMessage} /> :
              <Tagged tagged={[]} />
          }
        </div>
      </div>
      {showarc && <Archieves setRes={setRes} setShowarc={setShowarc} setResponseMessage={setResponseMessage} post={data.post} />}
    </div>

  </>)
}