import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";

import GameForAhuzim from "../comps/GameForAhuzim";
import Invitation from "../comps/Invitation";
import Keyboard from "../comps/Keyboard";

import { FaHome } from "react-icons/fa";
import { BiShow } from "react-icons/bi";

import io from "socket.io-client";
import url from "../url";
const socket = io.connect(url + "/");

function PercentagePage(props) {
  const navigate = useNavigate();

  const [showAnswer, setShowAnswer] = useState(false);
  const [questionTopic, setQuestionTopic] = useState("mana");
  const [ahuzimGameLevel, setAhuzimGameLevel] = useState("basic");
  const answer = useRef("");
  const fidbackTextShown = useRef();
  const [problem, setProblem] = useState();

  const [me, setMe] = useState();
  const firstEnter = useRef(true);

  useEffect(() => {
    if (firstEnter.current) {
      setMe({ userName: props.userName, id: socket.id });
      firstEnter.current = false;
      socket.emit("updateMe", {
        userName: props.userName,
        id: socket.id,
        where: "Percentage practice",
      });

      socket.on("invitation", (userInviteYou) => {
        props.setOpponent(userInviteYou);
        props.setIsBeingInvited(true);
      });
    }
  }, []);
  useEffect(() => {
    setProblem(null);

    socket.emit(
      "startTest",
      "ahuzimGame",
      ahuzimGameLevel,
      null,
      null,
      questionTopic,
      (answer) => {
        setProblem(answer);
      }
    );
  }, [questionTopic, ahuzimGameLevel]);

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

  const checkAnswer = (e) => {
    e.preventDefault();

    if (
      Number(answer.current.innerText).toFixed(2) ===
      problem.theRealAnswer.toFixed(2)
    ) {
      fidbackTextShown.current.innerText = `?????????? ??????????!`;
      fidbackTextShown.current.style.backgroundColor = "rgb(19, 122, 91)";
      setProblem(null);
      setShowAnswer(false);
      answer.current.innerText = "??????????";
      setTimeout(() => {
        fidbackTextShown.current.innerText = "";
        fidbackTextShown.current.style.backgroundColor = "rgb(19, 122, 91,0)";
      }, 2000);
      socket.emit(
        "startTest",
        "ahuzimGame",
        ahuzimGameLevel,
        null,
        null,
        questionTopic,
        (answer) => {
          setProblem(answer);
        }
      );
    } else {
      fidbackTextShown.current.innerText = `?????????? ???? ??????????!`;
      fidbackTextShown.current.style.backgroundColor = "rgb(109, 27, 16)";
      setTimeout(() => {
        fidbackTextShown.current.innerText = "";
        fidbackTextShown.current.style.backgroundColor = "rgb(109, 27, 16,0)";
      }, 2000);
      answer.current.innerText = "??????????";
    }
  };

  return (
    <div className="multiplicationPageDiv bigDiv">
      {props.isBeingInvited ? (
        <Invitation
          opponent={props.opponent}
          acceptOrDeclineGame={acceptOrDeclineGame}
          userName={props.userName}
        />
      ) : null}
      <div className="navBar">
        <BiShow
          size={44}
          className="showAnswerBtn"
          onClick={() => {
            setShowAnswer(!showAnswer);
          }}
        />
        <h3 className="multiplicationPageHeadLine">
          {questionTopic === "mana"
            ? "??????/?? ???? ????????"
            : questionTopic === "ahuz"
            ? "??????/?? ???? ??????????"
            : questionTopic === "shalem"
            ? "??????/?? ???? ????????"
            : null}
        </h3>
        <FaHome
          className="goHomeBtn"
          size={40}
          onClick={() => {
            navigate("/home");
          }}
        />
      </div>
      <div className="multiplicationPagePracticePickDiv">
        <div
          className="multiplicationPageBtnOption multiplicationPageBtnMultiplication"
          style={{
            backgroundColor: questionTopic === "mana" ? "#2197ff" : "#2197ff59",
          }}
          onClick={() => {
            setQuestionTopic("mana");
          }}
        >
          ??????
        </div>
        <div
          className="multiplicationPageBtnOption multiplicationPageBtnBattle"
          style={{
            backgroundColor: questionTopic === "ahuz" ? "#2197ff" : "#2197ff59",
          }}
          onClick={() => {
            setQuestionTopic("ahuz");
          }}
        >
          ????????
        </div>
        <div
          className="multiplicationPageBtnOption multiplicationPageBtnPercentage"
          style={{
            backgroundColor:
              questionTopic === "shalem" ? "#2197ff" : "#2197ff59",
          }}
          onClick={() => {
            setQuestionTopic("shalem");
          }}
        >
          ??????
        </div>
      </div>

      <h4 className="multiplicationPageSubHeadLine">
        {questionTopic === "mana"
          ? "?????? ???????? ???? ???????? ???????? ???????"
          : questionTopic === "ahuz"
          ? "?????? ???????????? ?????????? ????????/???????? ???????? ?????????"
          : questionTopic === "shalem"
          ? "?????? ???????? ???? ?????????"
          : null}
      </h4>

      <div className="explaneDiv">
        {questionTopic === "mana" ? (
          <>
            <span className="explane">???????????? ??????: (?????????? ??????????):</span>
            <span className="explane">?????? X (100 ?? ????????)</span>
            <span className="explane">?????????? ???????? ?????? ???????? ????????</span>
          </>
        ) : questionTopic === "ahuz" ? (
          <>
            <span className="explane">???????????? ??????: (?????????? ??????????):</span>
            <span className="explane">100 X (?????? ?? ??????)</span>
            <span className="explane">???????? ???????? ???????? ???????? ??????</span>
          </>
        ) : questionTopic === "shalem" ? (
          <>
            <span className="explane">???????????? ??????: (?????????? ??????????):</span>
            <span className="explane"> ?????? X (???????? ?? 100)</span>
            <span className="explane">?????? ???????? ?????????? ???????? ????????</span>
          </>
        ) : null}
      </div>

      <div className="multiplicationPageLevelsControlDiv">
        <h5 className="headlineLevelsDiv">?????????? ????????:</h5>

        <div className="ahuzLevelsControl">
          <select
            id="ahuzLevelsOptions"
            style={{
              backgroundColor:
                ahuzimGameLevel === "basic"
                  ? "rgb(43, 150, 150)"
                  : ahuzimGameLevel === "easy"
                  ? " #2197ff"
                  : "#2197ff59",
            }}
            onChange={(e) => {
              setAhuzimGameLevel(e.target.value);
            }}
          >
            <option className="basicLevelChose" value="basic">
              ?????????? (???????????? ???????????? ???????? ???? 100)
            </option>
            <option className="easyLevelChose" value="easy">
              ???? (???????????? ???????????? ???? 100)
            </option>
            <option className="hardLevelChose" value="hard">
              ?????? (???? ?????????????? ???? 100)
            </option>
          </select>
        </div>
      </div>

      <div className="probDivInPractice">
        {problem ? <GameForAhuzim problem={problem} /> : null}
      </div>

      <form className="kefelProblemAnswerDiv" typeof="submit">
        <div className="kefelProblemAnswerInput" ref={answer}>
          {answer.current.innerText === "" ? "??????????" : answer.current.innerText}
        </div>
        <div className="fidbackTextShown" ref={fidbackTextShown}></div>
        {showAnswer ? (
          problem ? (
            <h3 className="answerTextShown">
              {problem.theRealAnswer.toFixed(2)}
            </h3>
          ) : null
        ) : null}

        <Keyboard answer={answer} />

        <div className="btnWrop">
          <button
            className="testAnswerBtn"
            onClick={(e) => {
              checkAnswer(e);
            }}
          >
            ??????????
          </button>
        </div>
      </form>
    </div>
  );
}

export default PercentagePage;
