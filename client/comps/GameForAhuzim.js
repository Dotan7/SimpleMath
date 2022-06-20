import React, { useState, useEffect, useRef } from "react";

function GameForAhuzim(props) {
  const [theRealAnswer, setTheRealAnswer] = useState(
    props.problem.theRealAnswer
  );
  const [mana, setmana] = useState(props.problem.mana);
  const [ahuz, setahuz] = useState(props.problem.ahuz);
  const [shalem, setshalem] = useState(props.problem.shalem);
  const [finalTopic, setFinalTopic] = useState(props.problem.finalTopic);

  return (
    <div className="createKefelProblemDiv">
      {finalTopic === "mana" ? (
        <div className="percentageProblemText">
          כמה זה
          <span className="percentageProblemSpan"> {ahuz}% </span>
          מתוך
          <span className="percentageProblemSpan"> {shalem}</span>?
        </div>
      ) : finalTopic === "ahuz" ? (
        <div className="percentageProblemText">
          כמה זה באחוזים
          <span className="percentageProblemSpan"> {mana} </span>
          מתוך
          <span className="percentageProblemSpan"> {shalem}</span>?
        </div>
      ) : finalTopic === "shalem" ? (
        <div className="percentageProblemText">
          אם
          <span className="percentageProblemSpan"> {ahuz}% </span>
          הם
          <span className="percentageProblemSpan"> {mana}</span>, מהו הסכום
          השלם?
        </div>
      ) : null}
    </div>
  );
}
export default GameForAhuzim;
