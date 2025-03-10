import React, { useState } from 'react';
import Flash from '../jsxFile/collect/flash';
import Home from '../jsxFile/home/home';
import Search from '../jsxFile/search/search';
import List from '../jsxFile/list/list';
import Profile from '../jsxFile/profile/profile';
import Edit from '../jsxFile/editProfile/edtPro';
import Notfound from '../jsxFile/notfound/notfound';
import Forgot from '../jsxFile/forgot/forgot';
import Create from '../jsxFile/create/create';
import Login from '../jsxFile/login/login';
import Reels from '../jsxFile/reels/reels';
import Message from '../jsxFile/message/msg.jsx';
import More from '../jsxFile/more/more.jsx';
import AddStory from '../jsxFile/AddStory/main.jsx';
import ViewStory from '../jsxFile/AddStory/viewstory.jsx';
import Switch from "../jsxFile/Switch/switch.jsx"
import Call from "../jsxFile/call/call.jsx"

import { Routes, Route } from 'react-router-dom';
import SocketManager from './socketManager.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [responseMessage, setResponseMessage] = useState({ message: "", color: "white" });
  const [news, setNews] = useState()
  const [notimsg, setNotomsg] = useState();


  return (
    <>
      <Flash mymsg={responseMessage?.message} color={responseMessage?.color} />
      <SocketManager userid={user?._id} setUser={setUser} setNotomsg={setNotomsg} setNews={setNews}>
        <Routes>
          <Route path="/" element={<Home notimsg={notimsg} news={news} setResponseMessage={setResponseMessage} />} />
          <Route path="/home" element={<Home notimsg={notimsg} news={news} setResponseMessage={setResponseMessage} />} />
          <Route path="/forgot/:whereigo" element={<Forgot setResponseMessage={setResponseMessage} />} />
          <Route path="/login" element={<Login setResponseMessage={setResponseMessage} />} />
          <Route path="/creating" element={<Create setResponseMessage={setResponseMessage} />} />
          <Route path="/search" element={<Search setResponseMessage={setResponseMessage} />} />
          <Route path="/filter" element={<List setResponseMessage={setResponseMessage} />} />
          <Route path="/profile/:user" element={<Profile notimsg={notimsg} news={news} setResponseMessage={setResponseMessage} />} />
          <Route path="/EditProfile/:user" element={<Edit setResponseMessage={setResponseMessage} />} />
          <Route path="/reels" element={<Reels user={user} notimsg={notimsg} news={news} setResponseMessage={setResponseMessage} />} />
          <Route path="/messages" element={<Message notimsg={notimsg} news={news} setResponseMessage={setResponseMessage} />} />
          <Route path="/Messages/:user" element={<Message notimsg={notimsg} news={news} setResponseMessage={setResponseMessage} />} />
          <Route path="*" element={<Notfound setResponseMessage={setResponseMessage} />} />
          <Route path="/more" element={<More user={user} notimsg={notimsg} news={news} setResponseMessage={setResponseMessage} />} />
          <Route path="/AddStory" element={<AddStory user={user} setResponseMessage={setResponseMessage} />} />
          <Route path="/story/:userid/:storyid" element={<ViewStory user={user} setResponseMessage={setResponseMessage} />} />
          <Route path="/Switch" element={<Switch setResponseMessage={setResponseMessage} />} />
          <Route path="/call" element={<Call setResponseMessage={setResponseMessage} />} />
        </Routes>
      </SocketManager>
    </>
  );
}

export default App;
