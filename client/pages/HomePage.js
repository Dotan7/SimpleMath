import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Invitation from "../comps/Invitation";

import io from "socket.io-client";
import url from "../url";
const socket = io.connect(url + "/");

function HomePage(props) {
  const navigate = useNavigate();
  const [me, setMe] = useState();
  const firstEnter = useRef(true);

  useEffect(() => {
    if (firstEnter.current) {
      setMe({ userName: props.userName, id: socket.id });
      firstEnter.current = false;
      socket.emit("updateMe", {
        userName: props.userName,
        id: socket.id,
        where: "Home",
      });

      socket.on("invitation", (userInviteYou) => {
        props.setOpponent(userInviteYou);
        props.setIsBeingInvited(true);
      });
    }
  }, []);
  useEffect(() => {
    if (!props.userName) {
      navigate("/");
    }
  }, [props.userName]);

  const acceptOrDeclineGame = (yesOrNo) => {
    if (yesOrNo === "yes") {
      props.setIsBeingInvited(false);
      socket.emit("acceptGameOffer", me, props.opponent, (answer) => {
        props.setRoomNum(answer);
        navigate(`/gameboard/${props.opponent.userName}-vs-${props.userName}`);
      });
    } else if (yesOrNo === "no") {
      props.setIsBeingInvited(false);
      socket.emit("diclineGameOffer", me, props.opponent);
      props.setOpponent(null);
    }
  };
  return (
    <div className="bigDiv">
      {props.isBeingInvited ? (
        <Invitation
          opponent={props.opponent}
          acceptOrDeclineGame={acceptOrDeclineGame}
          userName={props.userName}
        />
      ) : null}
      <div className="navBarHome">
        <h3 className="homePageHeadLine">היי {props.userName} =)</h3>
      </div>
      <h6 className="homePageSubHeadline">
        בחר/י אם לתרגל אחוזים, כפל וחילוק או שאולי לשחק נגד חבר/ה
      </h6>

      <div className="homePageBtnsOptionsDiv">
        <div
          className="homePageBtnOption homePageBtnMultiplication"
          onClick={() => {
            navigate("/multiplication");
          }}
        >
          כפל וחילוק
        </div>
        <div
          className="homePageBtnOption homePageBtnPercentage"
          onClick={() => {
            navigate("/percentage");
          }}
        >
          אחוזים
        </div>
        <div
          className="homePageBtnOption homePageBtnBattle"
          onClick={() => {
            navigate("/test");
          }}
        >
          בחן את עצמך
        </div>
        <div
          className="homePageBtnOption homePageBtnBattle"
          onClick={() => {
            navigate("/battle");
          }}
        >
          שחקו נגד חברים
        </div>
      </div>
    </div>
  );
}

export default HomePage;
