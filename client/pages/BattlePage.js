import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";
import io from "socket.io-client";
import url from "../url";
import SettingsOption from "../comps/SettingsOption";
import Invitation from "../comps/Invitation";
import { FaHome } from "react-icons/fa";

const socket = io.connect(url + "/");

function BattlePage(props) {
  const navigate = useNavigate();
  const [me, setMe] = useState();
  const contactInput = useRef();

  // sender consts
  const [tryingToConnect, setTryingToConnect] = useState(false);
  const [waitingToAnwerFromUser, setwaitingToAnwerFromUser] = useState(false);
  const [notExistOrNotOnline, setnotExistOrNotOnline] = useState(false);
  const [hasBeenDeclined, setHasBeenDeclined] = useState(false);
  const [hasBeenAccepted, setHasBeenAccepted] = useState(false);
  const [inGameCantPlayRightNow, setInGameCantPlayRightNow] = useState(false);
  // receiver consts at app //

  const firstEnter = useRef(true);

  useEffect(() => {
    if (firstEnter.current) {
      setMe({ userName: props.userName, id: socket.id });
      firstEnter.current = false;
      socket.emit("updateMe", {
        userName: props.userName,
        id: socket.id,
        where: "Battle page - Game set",
      });

      socket.on("invitation", (userInviteYou) => {
        props.setOpponent(userInviteYou);
        props.setIsBeingInvited(true);
      });

      socket.on("yourOfferHasBeenDeclined", (userRejectYou) => {
        setwaitingToAnwerFromUser(false);
        setHasBeenDeclined(true);
        const tempTime = setTimeout(() => {
          setHasBeenDeclined(false);
          clearTimeout(tempTime);
        }, 3000);
      });
    }
  }, []);

  useEffect(() => {
    socket.on("yourOfferHasBeenAccepted", (userAcceptYou, roomNum) => {
      props.setIsBeingInvited(false);
      setwaitingToAnwerFromUser(false);
      setHasBeenAccepted(true);
      props.setOpponent(userAcceptYou);
      props.setRoomNum(roomNum);
      socket.emit(
        "gameSettings",
        roomNum,
        props.settings.gameTopic,
        props.settings.ahuzimGameLevel,
        props.settings.numbersRange,
        props.settings.fullNumbers,
        props.settings.numOfQuestionsInGame
      );

      navigate(`/gameboard/${props.userName}-vs-${userAcceptYou.userName}`);

      const tempTime = setTimeout(() => {
        setHasBeenAccepted(false);
        clearTimeout(tempTime);
      }, 3000);
    });
  }, [props.settings]);

  useEffect(() => {
    if (!props.userName) {
      navigate("/");
    }
  }, [props.userName]);

  const tryToMakeContact = (e) => {
    e.preventDefault();
    if (
      contactInput.current.value === null ||
      contactInput.current.value === ""
    ) {
      alert("נא להזין שם משתמש אליו נרצה לשלוח בקשה");
      return;
    }
    if (contactInput.current.value === props.userName) {
      alert("אי אפשר לשלוח בקשה לעצמך");
      return;
    }
    if (
      props.settings.numOfQuestionsInGame === null ||
      props.settings.numOfQuestionsInGame === 0
    ) {
      alert("נא להגדיר מספר שאלות");
      return;
    }
    setTryingToConnect(true);
    socket.emit(
      "tryToConnectFromFront",
      contactInput.current.value,
      me,
      (answer) => {
        if (answer === "notExistOrNotOnline") {
          setTryingToConnect(false);
          setnotExistOrNotOnline(true);
          const tempTime = setTimeout(() => {
            setnotExistOrNotOnline(false);
            clearTimeout(tempTime);
          }, 3000);
        } else if (answer === "waitingForAnswerFromUser") {
          setTryingToConnect(false);
          setwaitingToAnwerFromUser(true);
        } else if (answer === "inGameNow") {
          setTryingToConnect(false);
          setInGameCantPlayRightNow(true);
          const tempTime = setTimeout(() => {
            setInGameCantPlayRightNow(false);
            clearTimeout(tempTime);
          }, 3000);
        }
      }
    );
  };

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
    <div className="multiplicationPageDiv bigDiv">
      {props.isBeingInvited ? (
        <Invitation
          opponent={props.opponent}
          acceptOrDeclineGame={acceptOrDeclineGame}
        />
      ) : null}
      <div className="navBar">
        <div className="showAnswerBtn">{props.userName}</div>
        <h3 className="multiplicationPageHeadLine">שחק/י נגד חברים</h3>
        <FaHome
          className="goHomeBtn"
          size={40}
          onClick={() => {
            navigate("/home");
          }}
        />
      </div>
      <h4 className="battlePageHeadLine">בחר/י את נושא המשחק:</h4>
      <SettingsOption
        settings={props.settings}
        setSettings={props.setSettings}
      />

      <div className="contactFriendDiv">
        <h5 className="explainContactText">
          הכנס את שם המשתמש אותו תרצה/י להזמין:
        </h5>
        <form className="contactFriendForm" typeof="submit">
          <input
            className="contactFriendInput"
            placeholder="שם המשתמש"
            ref={contactInput}
          ></input>
          <br />
          {tryingToConnect ? (
            <h4 className="connectStatusFidbackText">מתחבר...</h4>
          ) : waitingToAnwerFromUser ? (
            <h4 className="connectStatusFidbackText">
              ממתין לתשובה מ {contactInput.current.value}...
            </h4>
          ) : notExistOrNotOnline ? (
            <h4 className="connectStatusFidbackText">
              {contactInput.current.value} לא מחובר ולא יכול לשחק
            </h4>
          ) : hasBeenDeclined ? (
            <h4 className="connectStatusFidbackText">
              {contactInput.current.value} דחה את בקשתך למשחק
            </h4>
          ) : inGameCantPlayRightNow ? (
            <h4 className="connectStatusFidbackText">
              {contactInput.current.value} באמצע משחק ולא יכול לשחק עכשיו
            </h4>
          ) : hasBeenAccepted ? (
            <h4 className="connectStatusFidbackText">
              {contactInput.current.value} אישר את בקשתך למשחק
            </h4>
          ) : null}
          <button
            className="testAnswerBtn"
            onClick={(e) => {
              tryToMakeContact(e);
            }}
          >
            הזמן חבר/ה
          </button>
        </form>
      </div>
    </div>
  );
}

export default BattlePage;
