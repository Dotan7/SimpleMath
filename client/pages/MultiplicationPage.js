import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";

import GameForKefel from "../comps/GameForKefel";
import Invitation from "../comps/Invitation";
import Keyboard from "../comps/Keyboard";

import { FaHome } from "react-icons/fa";
import { BiShow } from "react-icons/bi";

import io from "socket.io-client";
import url from "../url";
const socket = io.connect(url + "/");

function MultiplicationPage(props) {
  const navigate = useNavigate();

  const [me, setMe] = useState();
  const firstEnter = useRef(true);

  const [problem, setProblem] = useState();
  const answer = useRef("");
  const fidbackTextShown = useRef();

  const [showAnswer, setShowAnswer] = useState(false);
  const [questionTopic, setQuestionTopic] = useState("both");
  const [numbersRange, setNumbersRange] = useState("10");
  const [fullNumbers, setFullNumbers] = useState("true");

  useEffect(() => {
    if (firstEnter.current) {
      setMe({ userName: props.userName, id: socket.id });
      firstEnter.current = false;
      socket.emit("updateMe", {
        userName: props.userName,
        id: socket.id,
        where: "Kefel practice",
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
      "kefelGame",
      null,
      numbersRange,
      fullNumbers,
      questionTopic,
      (answer) => {
        setProblem(answer);
      }
    );
  }, [questionTopic, numbersRange, fullNumbers]);

  // useEffect(() => {
  //   if (!props.userName) {
  //     navigate("/");
  //   }
  // }, [props.userName]);

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
      fidbackTextShown.current.innerText = `תשובה נכונה!`;
      fidbackTextShown.current.style.backgroundColor = "rgb(19, 122, 91)";
      setProblem(null);
      setShowAnswer(false);
      answer.current.innerText = "תשובה";
      setTimeout(() => {
        fidbackTextShown.current.innerText = "";
        fidbackTextShown.current.style.backgroundColor = "rgb(19, 122, 91,0)";
      }, 2000);
      socket.emit(
        "startTest",
        "kefelGame",
        null,
        numbersRange,
        fullNumbers,
        questionTopic,
        (answer) => {
          setProblem(answer);
        }
      );
    } else {
      fidbackTextShown.current.innerText = `תשובה לא נכונה! `;
      fidbackTextShown.current.style.backgroundColor = "rgb(109, 27, 16)";
      setTimeout(() => {
        fidbackTextShown.current.innerText = "";
        fidbackTextShown.current.style.backgroundColor = "rgb(109, 27, 16,0)";
      }, 2000);
      answer.current.innerText = "תשובה";
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
          {questionTopic === "both"
            ? "כפל וחילוק"
            : questionTopic === "multiplication"
            ? "כפל"
            : questionTopic === "division"
            ? "חילוק"
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
            backgroundColor:
              questionTopic === "multiplication" ? "#2197ff" : "#2197ff59",
          }}
          onClick={() => {
            setQuestionTopic("multiplication");
          }}
        >
          כפל
        </div>
        <div
          className="multiplicationPageBtnOption multiplicationPageBtnBattle"
          style={{
            backgroundColor: questionTopic === "both" ? "#2197ff" : "#2197ff59",
          }}
          onClick={() => {
            setQuestionTopic("both");
          }}
        >
          כפל וחילוק
        </div>
        <div
          className="multiplicationPageBtnOption multiplicationPageBtnPercentage"
          style={{
            backgroundColor:
              questionTopic === "division" ? "#2197ff" : "#2197ff59",
          }}
          onClick={() => {
            setQuestionTopic("division");
          }}
        >
          חילוק
        </div>
      </div>

      <h4 className="multiplicationPageSubHeadLine">
        {questionTopic === "both"
          ? "כפל וחילוק."
          : questionTopic === "multiplication"
          ? "כפל."
          : questionTopic === "division"
          ? "חילוק."
          : null}
        {numbersRange === "10" ? " טווח 10X10." : " טווח 100X100."}
        {fullNumbers === "true" ? " מספרים שלמים." : " כל המספרים."}
      </h4>
      <div className="multiplicationPageLevelsControlDiv">
        <h5 className="headlineLevelsDiv">דרגות קושי:</h5>

        <label htmlFor="multiplicationPageRangeLevelsOptions">טווח: </label>
        <select
          id="multiplicationPageRangeLevelsOptions"
          style={{
            backgroundColor: numbersRange === "10" ? " #2197ff" : "#2197ff59",
          }}
          onChange={(e) => {
            setNumbersRange(e.target.value);
          }}
        >
          <option className="multiplicationPageRangeEasyLevelChose" value="10">
            לוח הכפל קלאסי (10X10)
          </option>
          <option className="multiplicationPageRangeHardLevelChose" value="100">
            לוח הכפל מורחב (100X100)
          </option>
        </select>
        <br />
        <label htmlFor="multiplicationPageFullLevelsOptions">מספרים: </label>
        <select
          id="multiplicationPageFullLevelsOptions"
          style={{
            backgroundColor: fullNumbers === "true" ? "#2197ff" : "#2197ff59",
          }}
          onChange={(e) => {
            setFullNumbers(e.target.value);
          }}
        >
          <option className="multiplicationPageEasyLevelChose" value="true">
            שלמים בלבד (בסיסי)
          </option>
          <option className="multiplicationPageHardLevelChose" value="false">
            כל המספרים (מתקדם)
          </option>
        </select>
      </div>

      <div className="probDivInPractice">
        {problem ? <GameForKefel problem={problem} /> : null}
      </div>

      <form className="kefelProblemAnswerDiv" typeof="submit">
        <div className="kefelProblemAnswerInput" ref={answer}>
          {answer.current.innerText === "" ? "תשובה" : answer.current.innerText}
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
            בדיקה
          </button>
        </div>
      </form>
    </div>
  );
}

export default MultiplicationPage;
