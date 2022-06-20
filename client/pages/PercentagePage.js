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
      fidbackTextShown.current.innerText = `תשובה לא נכונה!`;
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
          {questionTopic === "mana"
            ? "מצא/י את המנה"
            : questionTopic === "ahuz"
            ? "מצא/י את האחוז"
            : questionTopic === "shalem"
            ? "מצא/י את השלם"
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
          מנה
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
          אחוז
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
          שלם
        </div>
      </div>

      <h4 className="multiplicationPageSubHeadLine">
        {questionTopic === "mana"
          ? "מהו ערכו של אחוז מתוך שלם?"
          : questionTopic === "ahuz"
          ? "כמה אחוזים מהווה המנה/החלק מתוך השלם?"
          : questionTopic === "shalem"
          ? "מהו ערכו של השלם?"
          : null}
      </h4>

      <div className="explaneDiv">
        {questionTopic === "mana" ? (
          <>
            <span className="explane">התרגיל הוא: (משמאל לימין):</span>
            <span className="explane">שלם X (100 ÷ אחוז)</span>
            <span className="explane">האחוז חלקי מאה כפול השלם</span>
          </>
        ) : questionTopic === "ahuz" ? (
          <>
            <span className="explane">התרגיל הוא: (משמאל לימין):</span>
            <span className="explane">100 X (שלם ÷ מנה)</span>
            <span className="explane">המנה חלקי השלם כפול מאה</span>
          </>
        ) : questionTopic === "shalem" ? (
          <>
            <span className="explane">התרגיל הוא: (משמאל לימין):</span>
            <span className="explane"> מנה X (אחוז ÷ 100)</span>
            <span className="explane">מאה חלקי האחוז כפול המנה</span>
          </>
        ) : null}
      </div>

      <div className="multiplicationPageLevelsControlDiv">
        <h5 className="headlineLevelsDiv">דרגות קושי:</h5>

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
              בסיסי (מספרים עגולים קלים עד 100)
            </option>
            <option className="easyLevelChose" value="easy">
              קל (מספרים עגולים עד 100)
            </option>
            <option className="hardLevelChose" value="hard">
              קשה (כל המספרים עד 100)
            </option>
          </select>
        </div>
      </div>

      <div className="probDivInPractice">
        {problem ? <GameForAhuzim problem={problem} /> : null}
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

export default PercentagePage;
