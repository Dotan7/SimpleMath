import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";

import io from "socket.io-client";
import url from "../url";
import { BsBackspaceFill } from "react-icons/bs";
import GameForKefel from "../comps/GameForKefel";
import GameForAhuzim from "../comps/GameForAhuzim";
import SettingsOption from "../comps/SettingsOption";
import Keyboard from "../comps/Keyboard";

const socket = io.connect(url + "/");

function GameboardPage(props) {
  const navigate = useNavigate();
  const [me, setMe] = useState();
  const [opponent, setOpponent] = useState(props.opponent);
  const [meReadyToPlay, setMeReadyToPlay] = useState(false);
  const [opponentReadyToPlay, setOpponentReadyToPlay] = useState(false);
  const [NumOfQuestionsInGame, setNumOfQuestionsInGame] = useState(0);
  const questNum = useRef(0);
  const score = useRef(0);
  const opponentScore = useRef(0);
  const answer = useRef("");
  const firstEnter = useRef(true);
  const [problem, setProblem] = useState();
  const fidbackTextShown = useRef();

  // flow consts
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [rematchOfferToYou, setRematchOfferToYou] = useState(false);
  const [iOfferedRemach, setIOfferedRemach] = useState(true);
  const [isWaitingForRematch, setIsWaitingForRematch] = useState(false);
  const [isRematch, setIsRematch] = useState(false);
  const [opponentLeft, setOpponentLeft] = useState(false);

  useEffect(() => {
    if (firstEnter.current) {
      setMe({ userName: props.userName, id: socket.id });
      firstEnter.current = false;
      socket.emit("updateMe", {
        userName: props.userName,
        id: socket.id,
        where: "In Game Board",
      });

      socket.emit(
        "joinMeToRoom",
        { userName: props.userName, id: socket.id },
        props.roomNum
      );

      socket.on("startTheGameFromServer", (problem, theGoldNum) => {
        setGameOver(false);
        setRematchOfferToYou(false);
        setIOfferedRemach(true);
        setIsWaitingForRematch(false);
        setIsRematch(false);
        setOpponentLeft(false);
        setProblem(problem);
        setNumOfQuestionsInGame(theGoldNum);
        setIsPlaying(true);
        if (fidbackTextShown.current) {
          fidbackTextShown.current.innerText = "";
          fidbackTextShown.current.style.backgroundColor = "rgb(109, 27, 16,0)";
        }
        score.current = 0;
        opponentScore.current = 0;
        questNum.current = 0;
      });

      socket.on("opponentIsReadyToPlay", (opponent, readyOrNot) => {
        setOpponentReadyToPlay(readyOrNot);
        setOpponent(opponent);
        if (meReadyToPlay) {
          socket.emit("startTheGame", props.roomNum);
        }
      });

      socket.on("nextQuest", (problem) => {
        setProblem(problem);
      });

      socket.on("gameOver", () => {
        setIsPlaying(false);
        setGameOver(true);
        if (fidbackTextShown.current) {
          if (score.current > opponentScore.current) {
            fidbackTextShown.current.innerText = `המשחק נגמר - ניצחת!! =)`;
            fidbackTextShown.current.style.backgroundColor = "rgb(19, 122, 91)";
          } else if (opponentScore.current > score.current) {
            fidbackTextShown.current.innerText = `המשחק נגמר - הפסדת!! =(`;
            fidbackTextShown.current.style.backgroundColor = "rgb(109, 27, 16)";
          } else if (opponentScore.current === score.current) {
            fidbackTextShown.current.innerText = `המשחק נגמר - שוויון!!`;
            fidbackTextShown.current.style.backgroundColor =
              "rgb(20, 150, 255)";
          }
        }
      });

      socket.on("youLoseThisRound", () => {
        opponentScore.current++;
        questNum.current++;
        setProblem(null);
        if (fidbackTextShown.current) {
          fidbackTextShown.current.innerText = `הפסדת את הסיבוב`;
          fidbackTextShown.current.style.backgroundColor = "rgb(109, 27, 16)";
          setTimeout(() => {
            fidbackTextShown.current.innerText = "";
            fidbackTextShown.current.style.backgroundColor =
              "rgb(109, 27, 16,0)";
          }, 1000);
        }
      });

      socket.on("rematchOfferToYou", () => {
        setRematchOfferToYou(true);
        setIOfferedRemach(false);
      });
      socket.on("invitation", (userInviteYou) => {
        props.setOpponent(userInviteYou);
        props.setIsBeingInvited(true);
      });
      socket.on("oppenentLeftTheGame", () => {
        if (fidbackTextShown.current) {
          fidbackTextShown.current.innerText = `עזב את המשחק ${props.opponent.userName}`;
          fidbackTextShown.current.style.backgroundColor = "rgb(109, 27, 16)";
        }
        socket.emit("leaveRoom", props.roomNum);

        const timeTemp = setTimeout(() => {
          if (fidbackTextShown.current) {
            fidbackTextShown.current.innerText = "";
            fidbackTextShown.current.style.backgroundColor =
              "rgb(109, 27, 16,0)";
          }
          props.setOpponent(null);
          props.setRoomNum(null);

          navigate("/battle");
          clearTimeout(timeTemp);
        }, 2000);
      });
    }
  }, []);

  useEffect(() => {
    if (!props.userName) {
      socket.emit("leaveRoom", props.roomNum);
      props.setRoomNum(null);
      navigate("/");
    }
  }, [props.userName]);

  onpopstate = (e) => {
    leaveGameToGameLobby();
  };

  const setMeReadyFunc = () => {
    setMeReadyToPlay(!meReadyToPlay);
    socket.emit("meReadyToPlay", me, opponent, !meReadyToPlay, props.roomNum);

    if (opponentReadyToPlay && !meReadyToPlay) {
      socket.emit("startTheGame", props.roomNum);
    }
  };

  const sendAnsweFromUserFunc = (e) => {
    e.preventDefault();
    if (
      Number(answer.current.innerText).toFixed(2) ===
      problem.theRealAnswer.toFixed(2)
    ) {
      socket.emit(
        "amIAnswerdFirst",
        props.roomNum,
        questNum.current,
        (answer) => {
          if (answer === true) {
            // win round
            score.current = score.current + 1;
            questNum.current++;
            setProblem(null);

            fidbackTextShown.current.innerText = `תשובה נכונה! הרווחת נקודה`;
            fidbackTextShown.current.style.backgroundColor = "rgb(19, 122, 91)";
            setTimeout(() => {
              fidbackTextShown.current.innerText = "";
              fidbackTextShown.current.style.backgroundColor =
                "rgb(19, 122, 91,0)";
            }, 1000);
          } else {
            fidbackTextShown.current.innerText = `תשובה נכונה! אבל לא מספיק מהר`;
            fidbackTextShown.current.style.backgroundColor =
              "rgb(189, 100, 180)";
            setTimeout(() => {
              fidbackTextShown.current.innerText = "";
              fidbackTextShown.current.style.backgroundColor =
                "rgb(189, 100, 180,0)";
            }, 1000);
          }
        }
      );

      answer.current.innerText = "תשובה";
    } else {
      fidbackTextShown.current.innerText = `תשובה לא נכונה!`;
      fidbackTextShown.current.style.backgroundColor = "rgb(109, 27, 16)";
      setTimeout(() => {
        fidbackTextShown.current.innerText = "";
        fidbackTextShown.current.style.backgroundColor = "rgb(109, 27, 16,0)";
      }, 1000);
      answer.current.innerText = "תשובה";
    }
  };

  const reMatchOffer = () => {
    if (iOfferedRemach) {
      socket.emit(
        "gameSettings",
        props.roomNum,
        props.settings.gameTopic,
        props.settings.ahuzimGameLevel,
        props.settings.numbersRange,
        props.settings.fullNumbers,
        props.settings.numOfQuestionsInGame
      );

      socket.emit("rematchOffer", props.roomNum, props.opponent, (answer) => {
        if (answer) {
          setIsWaitingForRematch(true);
        } else {
          setOpponentLeft(true);
          navigate("/battle");
        }
      });
    } else if (rematchOfferToYou) {
      socket.emit("startTheGame", props.roomNum);
      setGameOver(false);
      setIsPlaying(true);
    }
  };

  const leaveGameToGameLobby = (leftHow) => {
    socket.emit("leaveRoom", props.roomNum);
    props.setRoomNum(null);
    navigate("/battle");
  };

  return (
    <div className="gameBoardPageDiv bigDiv">
      {!isPlaying && gameOver ? (
        <div className="optionsInGameOver">
          <div className="topLineInOptiosGameOver">
            <SettingsOption
              settings={props.settings}
              setSettings={props.setSettings}
            />
          </div>
          <div className="bottomLineInOptiosGameOver">
            <button
              className="reMatchBtn"
              onClick={() => {
                reMatchOffer();
              }}
            >
              {rematchOfferToYou
                ? `מזמין משחק חוזר ${props.opponent.userName}`
                : opponentLeft
                ? `יצא מהמשחק ${props.opponent.userName}`
                : isRematch
                ? `אישר את בקשתך - קדימה מתחילים ${props.opponent.userName}`
                : isWaitingForRematch
                ? `ממתין לתשובה מ ${props.opponent.userName}`
                : "?משחק חוזר"}
            </button>
            <button
              className="goToGamesLobyBtn"
              onClick={() => {
                leaveGameToGameLobby(
                  rematchOfferToYou ? "rejectAndGoBack" : "GoBack"
                );
              }}
            >
              {rematchOfferToYou ? "דחה וחזור למשחקים" : "חזור למשחקים"}
            </button>
          </div>
        </div>
      ) : null}
      <div className="opponentInfoLine">
        <div className="opponentScoreDiv">
          <div className="opponentScoreText">ניקוד:</div>
          <div className="opponentScore">{opponentScore.current}</div>
        </div>
        <div className="opponentName">{props.opponent.userName}</div>
        <BsBackspaceFill
          className="backToGames"
          size={30}
          onClick={() => {
            leaveGameToGameLobby("GoBack");
          }}
        />
      </div>

      <div className="opponentAreaLine">
        {!gameOver && !isPlaying ? (
          <div
            className="opponentReadyToPlayLikeBtn"
            style={{
              backgroundColor: opponentReadyToPlay
                ? "rgb(19, 122, 91)"
                : "rgb(109, 27, 16)",
            }}
          >
            {opponentReadyToPlay ? "מוכן לשחק" : "לא מוכן לשחק"}
          </div>
        ) : null}
      </div>

      <div className="drilLine">
        {problem ? (
          problem.mana ? (
            <GameForAhuzim problem={problem} />
          ) : (
            <GameForKefel problem={problem} />
          )
        ) : null}
      </div>

      <div className="myAreaLine">
        <div className="fidbackTextShown" ref={fidbackTextShown}></div>

        {!gameOver && !isPlaying ? (
          <button
            className="meReadyToPlayBtn"
            style={{
              backgroundColor: meReadyToPlay
                ? "rgb(19, 122, 91)"
                : "rgb(109, 27, 16)",
            }}
            onClick={() => {
              setMeReadyFunc();
            }}
          >
            {meReadyToPlay ? "מוכן לשחק" : "לא מוכן לשחק"}
          </button>
        ) : isPlaying ? null : null}
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
            className="gameBoardFormBtn"
            onClick={(e) => {
              sendAnsweFromUserFunc(e);
            }}
          >
            שלח
          </button>
        </form>
      </div>

      <div className="myInfoLine">
        <div className="myScoreDiv">
          <div className="myScoreText">ניקוד:</div>
          <div className="myScore">{score.current}</div>
        </div>

        <div className="myName">{props.userName}</div>
        <div className="questionsToEndDiv">
          <div className="questionsToEnd">נותרו</div>
          <div className="questionsToEnd">
            {NumOfQuestionsInGame - questNum.current}
          </div>
          <div className="questionsToEnd">שאלות</div>
        </div>
      </div>
    </div>
  );
}

export default GameboardPage;
