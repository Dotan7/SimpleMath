import "./App.css";
import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import useLocalStorage from "./hooks/useLocalStorage";
import WelcomePage from "./pages/WelcomePage";
import HomePage from "./pages/HomePage";

import PercentagePage from "./pages/PercentagePage";
import MultiplicationPage from "./pages/MultiplicationPage";
import BattlePage from "./pages/BattlePage";
import GameboardPage from "./pages/GameboardPage";
import TestPage from "./pages/TestPage";

import AdminPage from "./pages/AdminPage";

function App() {
  const [userName, setUserName] = useLocalStorage("userName");
  const [settings, setSettings] = useState({
    gameTopic: "",
    ahuzimGameLevel: "",
    numbersRange: "",
    fullNumbers: "",
    numOfQuestionsInGame: null,
  });
  const [isBeingInvited, setIsBeingInvited] = useState(false);
  const [opponent, setOpponent] = useState(null);
  const [roomNum, setRoomNum] = useState(null);

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <WelcomePage userName={userName} setUserName={setUserName} />
            }
          />
          <Route
            path="home"
            element={
              <HomePage
                userName={userName}
                isBeingInvited={isBeingInvited}
                setIsBeingInvited={setIsBeingInvited}
                setOpponent={setOpponent}
                opponent={opponent}
                roomNum={roomNum}
                setRoomNum={setRoomNum}
              />
            }
          />
          <Route
            path="multiplication"
            element={
              <MultiplicationPage
                userName={userName}
                isBeingInvited={isBeingInvited}
                setIsBeingInvited={setIsBeingInvited}
                settings={settings}
                setSettings={setSettings}
                setOpponent={setOpponent}
                opponent={opponent}
                roomNum={roomNum}
                setRoomNum={setRoomNum}
              />
            }
          />
          <Route
            path="percentage"
            element={
              <PercentagePage
                userName={userName}
                isBeingInvited={isBeingInvited}
                setIsBeingInvited={setIsBeingInvited}
                settings={settings}
                setSettings={setSettings}
                setOpponent={setOpponent}
                opponent={opponent}
                roomNum={roomNum}
                setRoomNum={setRoomNum}
              />
            }
          />

          <Route
            path="test"
            element={
              <TestPage
                userName={userName}
                isBeingInvited={isBeingInvited}
                setIsBeingInvited={setIsBeingInvited}
                opponent={opponent}
                setOpponent={setOpponent}
                settings={settings}
                setSettings={setSettings}
                roomNum={roomNum}
                setRoomNum={setRoomNum}
              />
            }
          />

          <Route
            path="battle"
            element={
              <BattlePage
                userName={userName}
                isBeingInvited={isBeingInvited}
                setIsBeingInvited={setIsBeingInvited}
                opponent={opponent}
                setOpponent={setOpponent}
                settings={settings}
                setSettings={setSettings}
                roomNum={roomNum}
                setRoomNum={setRoomNum}
              />
            }
          />

          <Route
            path="gameboard/:invitername"
            element={
              <GameboardPage
                userName={userName}
                isBeingInvited={isBeingInvited}
                setIsBeingInvited={setIsBeingInvited}
                opponent={opponent}
                settings={settings}
                setSettings={setSettings}
                setOpponent={setOpponent}
                roomNum={roomNum}
                setRoomNum={setRoomNum}
              />
            }
          />
          <Route path="admin" element={<AdminPage />} />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
