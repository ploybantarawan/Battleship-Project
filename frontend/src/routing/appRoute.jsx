import React from "react";
import { Route, Routes } from "react-router-dom";
import { useState } from "react";

import MainPage from "../pages/main";
import JoinPage from "../pages/join";
import WelcomePage from "../pages/welcome";
import AdminPage from "../pages/admin";
import { io } from "socket.io-client";

const AppRoute = () => {
  const [light, setLight] = useState(true);
  const toggle = () => {
    setLight(!light);
  };
  const socket = io("172.27.151.178:4000", { transports: ["websocket"] });
  // change to your own IP Adress
  return (
    <>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/join" element={<JoinPage socket={socket} />} />
        <Route path="/main" element={<MainPage socket={socket} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<p>There's nothing here: 404!</p>} />
      </Routes>
    </>
  );
};

export default AppRoute;
