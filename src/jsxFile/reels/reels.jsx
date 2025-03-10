import "../../cssFile/reels-css/reels.css"


import Navbar from "../home/navbar.jsx"
import Outreel from './outreel.jsx'

export default function reels({ news, user, notimsg, setResponseMessage }) {
   




    return (<div className="reels">

        <Navbar news={news} notimsg={notimsg} userData={{ username: user?.username, _id: user?._id, pic: user?.pic.path }} setResponseMessage={setResponseMessage} />
        <Outreel data={[]} />
    </div>)
}


// const [data, setData] = useState({})
// useEffect(() => {
//     const fetchdata = async function () {
//         try {
//             const dd = await axios.post(`http://localhost:8080/updateData/${user}`);
//             setData(dd.data[0])

//         } catch {
//         }

//     }
//     fetchdata();
// }, [])



 // const data = [
    //     {
    //         "userPic": "/user/user3.jpeg",
    //         "username": "anika_star",
    //         "posttime": "Wed Oct 22 2024 11:30:22 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn22.mp4",
    //         "location": "Manali",
    //         "desc": "Mountains calling!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "neha_bharti_90", "userpic": "/user/user3.jpeg" },
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "rajveer_singh",
    //                 "userpic": "/user/user1.jpeg",
    //                 "cmtmsg": "Absolutely stunning!",
    //                 "reply": [
    //                     {
    //                         "username": "anika_sharma",
    //                         "userpic": "/user/user1.jpeg",
    //                         "towhom": "rajveer_singh",
    //                         "replymsg": "You should visit too!"
    //                     }
    //                 ]
    //             },
    //             {
    //                 "username": "sameer",
    //                 "userpic": "/user/user6.jpeg",
    //                 "cmtmsg": "oh hoo!",
    //                 "reply": [
    //                     {
    //                         "username": "anika_sharma",
    //                         "userpic": "/user/user1.jpeg",
    //                         "towhom": "rajveer_singh",
    //                         "replymsg": "You should visit too!"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user2.jpeg",
    //         "username": "deepak__09",
    //         "posttime": "Thu Oct 23 2024 14:40:15 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn1.mp4",
    //         "location": "Shimla",
    //         "desc": "Snowfall vibes!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "muskan_bharti", "userpic": "/user/user4.jpeg" },
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "vivaan_009",
    //                 "userpic": "/user/user3.jpeg",
    //                 "cmtmsg": "Chilling weather!",
    //                 "reply": [
    //                     {
    //                         "username": "neha_bharti_90",
    //                         "userpic": "/user/user3.jpeg",
    //                         "towhom": "vivaan_009",
    //                         "replymsg": "It was freezing!"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user8.jpeg",
    //         "username": "kavita_roy",
    //         "posttime": "Fri Oct 24 2024 17:15:35 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn20.mp4",
    //         "location": "Mumbai",
    //         "desc": "City lights and endless nights!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" },
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "rajveer_singh", "userpic": "/user/user1.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "rohitsetti__",
    //                 "userpic": "/user/user7.jpeg",
    //                 "cmtmsg": "Love the vibe!",
    //                 "reply": [
    //                     {
    //                         "username": "kavita_star",
    //                         "userpic": "/user/user4.jpeg",
    //                         "towhom": "rohitsetti__",
    //                         "replymsg": "Mumbai never sleeps!"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user10.jpeg",
    //         "username": "arjun_travels",
    //         "posttime": "Sat Oct 25 2024 18:05:20 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn23.mp4",
    //         "location": "Delhi",
    //         "desc": "Historical wonders!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "rajveer_singh", "userpic": "/user/user1.jpeg" },
    //             { "username": "neha_bharti_90", "userpic": "/user/user3.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "muskan_bharti",
    //                 "userpic": "/user/user5.jpeg",
    //                 "cmtmsg": "So much history here!",
    //                 "reply": [
    //                     {
    //                         "username": "deepak___8",
    //                         "userpic": "/user/user10.jpeg",
    //                         "towhom": "muskan_bharti",
    //                         "replymsg": "Indeed, every corner tells a story."
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user4.jpeg",
    //         "username": "neha_bharti_90",
    //         "posttime": "Sun Oct 26 2024 19:10:11 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn21.mp4",
    //         "location": "Goa",
    //         "desc": "Sunset beach vibes!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" },
    //             { "username": "rajveer_singh", "userpic": "/user/user1.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "rohitsetti__",
    //                 "userpic": "/user/user7.jpeg",
    //                 "cmtmsg": "Absolutely gorgeous sunset!",
    //                 "reply": [
    //                     {
    //                         "username": "neha_bharti_90",
    //                         "userpic": "/user/user4.jpeg",
    //                         "towhom": "rohitsetti__",
    //                         "replymsg": "The view was magical!"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user11.jpeg",
    //         "username": "muskan_bharti",
    //         "posttime": "Mon Oct 27 2024 12:30:45 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn2.mp4",
    //         "location": "Udaipur",
    //         "desc": "Royal city vibes!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" },
    //             { "username": "neha_bharti_90", "userpic": "/user/user3.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "rohitsetti__",
    //                 "userpic": "/user/user7.jpeg",
    //                 "cmtmsg": "Such a beautiful place!",
    //                 "reply": [
    //                     {
    //                         "username": "muskan_bharti",
    //                         "userpic": "/user/user11.jpeg",
    //                         "towhom": "rohitsetti__",
    //                         "replymsg": "You should definitely visit!"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user1.jpeg",
    //         "username": "arjun_vlogs",
    //         "posttime": "Tue Oct 28 2024 10:25:50 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn3.mp4",
    //         "location": "Rishikesh",
    //         "desc": "River rafting adventures!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" },
    //             { "username": "neha_bharti_90", "userpic": "/user/user3.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "rajveer_singh",
    //                 "userpic": "/user/user1.jpeg",
    //                 "cmtmsg": "Thrilling experience!",
    //                 "reply": [
    //                     {
    //                         "username": "arjun_vlogs",
    //                         "userpic": "/user/user8.jpeg",
    //                         "towhom": "rajveer_singh",
    //                         "replymsg": "It was such an adrenaline rush!"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user6.jpeg",
    //         "username": "kriti_678",
    //         "posttime": "Wed Oct 29 2024 14:45:05 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn4.mp4",
    //         "location": "Leh",
    //         "desc": "Leh Ladakh road trip!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "neha_bharti_90", "userpic": "/user/user3.jpeg" },
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" },
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "rohitsetti__",
    //                 "userpic": "/user/user7.jpeg",
    //                 "cmtmsg": "The road ahead looks amazing!",
    //                 "reply": [
    //                     {
    //                         "username": "kriti_678",
    //                         "userpic": "/user/user5.jpeg",
    //                         "towhom": "rohitsetti__",
    //                         "replymsg": "It’s a breathtaking view!"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user9.jpeg",
    //         "username": "rohitsetti__",
    //         "posttime": "Thu Oct 30 2024 16:55:23 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn5.mp4",
    //         "location": "Jaipur",
    //         "desc": "Royal palace vibes!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" },
    //             { "username": "neha_bharti_90", "userpic": "/user/user3.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "rajveer_singh",
    //                 "userpic": "/user/user1.jpeg",
    //                 "cmtmsg": "Amazing architecture!",
    //                 "reply": [
    //                     {
    //                         "username": "rohitsetti__",
    //                         "userpic": "/user/user7.jpeg",
    //                         "towhom": "rajveer_singh",
    //                         "replymsg": "It’s a marvel, right?"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user4.jpeg",
    //         "username": "muskan_bharti",
    //         "posttime": "Fri Oct 31 2024 12:30:10 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn6.mp4",
    //         "location": "Agra",
    //         "desc": "Taj Mahal beauty!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "neha_bharti_90", "userpic": "/user/user3.jpeg" },
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "rajveer_singh",
    //                 "userpic": "/user/user1.jpeg",
    //                 "cmtmsg": "The most beautiful monument in the world!",
    //                 "reply": [
    //                     {
    //                         "username": "muskan_bharti",
    //                         "userpic": "/user/user11.jpeg",
    //                         "towhom": "rajveer_singh",
    //                         "replymsg": "Truly, it’s breathtaking."
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user6.jpeg",
    //         "username": "arjun_vlogs",
    //         "posttime": "Sat Nov 1 2024 09:50:45 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn17.mp4",
    //         "location": "Kashmir",
    //         "desc": "Snow-covered landscapes!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "neha_bharti_90", "userpic": "/user/user3.jpeg" },
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "rohitsetti__",
    //                 "userpic": "/user/user7.jpeg",
    //                 "cmtmsg": "Such a peaceful place!",
    //                 "reply": [
    //                     {
    //                         "username": "arjun_vlogs",
    //                         "userpic": "/user/user8.jpeg",
    //                         "towhom": "rohitsetti__",
    //                         "replymsg": "Indeed, it’s a paradise."
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user5.jpeg",
    //         "username": "kriti_678",
    //         "posttime": "Sun Nov 2 2024 11:20:30 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn8.mp4",
    //         "location": "Varanasi",
    //         "desc": "Ganges and the spiritual aura!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "neha_bharti_90", "userpic": "/user/user3.jpeg" },
    //             { "username": "rajveer_singh", "userpic": "/user/user1.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "rohitsetti__",
    //                 "userpic": "/user/user7.jpeg",
    //                 "cmtmsg": "Such a divine place!",
    //                 "reply": [
    //                     {
    //                         "username": "kriti_678",
    //                         "userpic": "/user/user5.jpeg",
    //                         "towhom": "rohitsetti__",
    //                         "replymsg": "A truly sacred city."
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user12.jpeg",
    //         "username": "deepak__09",
    //         "posttime": "Mon Nov 3 2024 15:25:15 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn15.mp4",
    //         "location": "Ladakh",
    //         "desc": "Mountain adventures!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" },
    //             { "username": "rajveer_singh", "userpic": "/user/user1.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "muskan_bharti",
    //                 "userpic": "/user/user5.jpeg",
    //                 "cmtmsg": "What a breathtaking view!",
    //                 "reply": [
    //                     {
    //                         "username": "deepak__09",
    //                         "userpic": "/user/user12.jpeg",
    //                         "towhom": "muskan_bharti",
    //                         "replymsg": "It’s the magic of Ladakh!"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user11.jpeg",
    //         "username": "neha_bharti_90",
    //         "posttime": "Tue Nov 4 2024 09:35:30 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn9.mp4",
    //         "location": "Sikkim",
    //         "desc": "High-altitude beauty!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" },
    //             { "username": "rajveer_singh", "userpic": "/user/user1.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "rohitsetti__",
    //                 "userpic": "/user/user7.jpeg",
    //                 "cmtmsg": "What an incredible view!",
    //                 "reply": [
    //                     {
    //                         "username": "neha_bharti_90",
    //                         "userpic": "/user/user4.jpeg",
    //                         "towhom": "rohitsetti__",
    //                         "replymsg": "It’s pure magic up here!"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         "userPic": "/user/user1.jpeg",
    //         "username": "arjun_travels",
    //         "posttime": "Wed Nov 5 2024 14:00:12 GMT+0530 (India Standard Time)",
    //         "postvideo": "/video/sn10.mp4",
    //         "location": "Kolkata",
    //         "desc": "Cultural heritage!",
    //         "simLike": [
    //             { username: "rohan3kumar", userpic: "/user/user2.jpeg" },
    //             { username: "neha_bharti_90", userpic: "/user/user3.jpeg" },
    //             { username: "muskan_ bharti", userpic: "/user/user4.jpeg" },
    //         ],
    //         "likes": [
    //             { "username": "kriti_678", "userpic": "/user/user5.jpeg" },
    //             { "username": "arjun_vlogs", "userpic": "/user/user8.jpeg" },
    //             { "username": "neha_bharti_90", "userpic": "/user/user3.jpeg" }
    //         ],
    //         "comment": [
    //             {
    //                 "username": "muskan_bharti",
    //                 "userpic": "/user/user5.jpeg",
    //                 "cmtmsg": "Such rich culture and history!",
    //                 "reply": [
    //                     {
    //                         "username": "arjun_travels",
    //                         "userpic": "/user/user1.jpeg",
    //                         "towhom": "muskan_bharti",
    //                         "replymsg": "Kolkata’s charm is unmatched!"
    //                     }
    //                 ]
    //             }
    //         ]
    //     },

    // ]