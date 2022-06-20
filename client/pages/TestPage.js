import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Invitation from "../comps/Invitation";

import io from "socket.io-client";
import url from "../url";
import { FaHome } from "react-icons/fa";
import Keyboard from "../comps/Keyboard";

import GameForKefel from "../comps/GameForKefel";
import GameForAhuzim from "../comps/GameForAhuzim";
import SettingsOption from "../comps/SettingsOption";

const socket = io.connect(url + "/");

function TestPage(props) {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    gameTopic: "",
    ahuzimGameLevel: "",
    numbersRange: "",
    fullNumbers: "",
    numOfQuestionsInGame: null,
  });
  const [me, setMe] = useState();
  const firstEnter = useRef(true);

  const questNum = useRef(0);
  const score = useRef(0);
  const answer = useRef("");
  const [problem, setProblem] = useState();
  const fidbackTextShown = useRef();

  // flow consts
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (firstEnter.current) {
      setMe({ userName: props.userName, id: socket.id });
      firstEnter.current = false;
      socket.emit("updateMe", {
        userName: props.userName,
        id: socket.id,
        where: "Test",
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

  const sendAnsweFromUserFunc = (e) => {
    e.preventDefault();
    if (
      Number(answer.current.innerText).toFixed(2) ===
      problem.theRealAnswer.toFixed(2)
    ) {
      score.current = score.current + 100 / settings.numOfQuestionsInGame;
    }
    questNum.current++;
    answer.current.innerText = "תשובה";
    setProblem(null);
    if (settings.numOfQuestionsInGame - questNum.current === 0) {
      setIsPlaying(false);
      fidbackTextShown.current.innerText = `המבחן נגמר. ציונך: ${score.current.toFixed(
        2
      )}`;
      if (score.current < 61) {
        fidbackTextShown.current.style.backgroundColor = "rgb(109, 27, 16)";
      } else if (score.current < 81) {
        fidbackTextShown.current.style.backgroundColor = "rgb(180, 70, 31)";
      } else if (score.current < 101) {
        fidbackTextShown.current.style.backgroundColor = "rgb(19, 122, 91)";
      }
    } else {
      socket.emit(
        "startTest",
        settings.gameTopic,
        settings.ahuzimGameLevel,
        settings.numbersRange,
        settings.fullNumbers,
        null,
        (answer) => {
          setProblem(answer);
        }
      );
    }
  };

  const startTest = () => {
    setIsPlaying(true);
    if (fidbackTextShown.current) {
      fidbackTextShown.current.innerText = "";
      fidbackTextShown.current.style.backgroundColor = "rgb(0, 0, 0,0)";
    }
    score.current = 0;
    questNum.current = 0;
    socket.emit(
      "startTest",
      settings.gameTopic,
      settings.ahuzimGameLevel,
      settings.numbersRange,
      settings.fullNumbers,
      null,
      (answer) => {
        setProblem(answer);
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
    <div className="gameBoardPageDiv bigDiv">
      {props.isBeingInvited ? (
        <Invitation
          opponent={props.opponent}
          acceptOrDeclineGame={acceptOrDeclineGame}
        />
      ) : null}
      {!isPlaying ? (
        <div className="optionsInGameOver">
          <div className="topLineInOptiosGameOver">
            <SettingsOption settings={settings} setSettings={setSettings} />
          </div>
          <div className="bottomLineInOptiosGameOver">
            <button
              className="reMatchBtn"
              onClick={() => {
                startTest();
              }}
            >
              {"התחל מבחן"}
            </button>
          </div>
        </div>
      ) : null}
      <div className="navBar">
        <div className="showAnswerBtn">{props.userName}</div>
        <h3 className="multiplicationPageHeadLine">בחן את עצמך</h3>
        <FaHome
          className="goHomeBtn"
          size={40}
          onClick={() => {
            navigate("/home");
          }}
        />
      </div>
      <div className="fidbackTextShown" ref={fidbackTextShown}></div>
      <div
        className="drilLineTest"
        style={{ height: isPlaying ? "40%" : "80%" }}
      >
        {problem ? (
          problem.mana ? (
            <GameForAhuzim problem={problem} />
          ) : (
            <GameForKefel problem={problem} />
          )
        ) : null}
      </div>
      <div
        className="myInputLine"
        style={{ display: isPlaying ? "flex" : "none" }}
      >
        <form className="gameBoardForm" typeof="submit">
          <div className="myInput" ref={answer}>
            {answer.current.innerText === ""
              ? "תשובה"
              : answer.current.innerText}
          </div>

          <Keyboard answer={answer} />

          <button
            className="testAnswerBtn"
            onClick={(e) => {
              sendAnsweFromUserFunc(e);
            }}
          >
            שלח
          </button>
        </form>
      </div>
      <div className="myInfoLine">
        <div className="myScoreDiv">מבחן</div>
        <div className="myName">{props.userName}</div>
        <div className="questionsToEndDiv">
          <div className="questionsToEnd">נותרו</div>
          <div className="questionsToEnd">
            {settings.numOfQuestionsInGame - questNum.current}
          </div>
          <div className="questionsToEnd">שאלות</div>
        </div>
      </div>
    </div>
  );
}

export default TestPage;
