import React, { useState, useEffect, useRef } from "react";

function GameForKefel(props) {
  const [numOne, setnumOne] = useState(props.problem.numOne);
  const [numTwo, setnumTwo] = useState(props.problem.numTwo);
  const [finalTopic, setFinalTopic] = useState(props.problem.finalTopic);

  return (
    <div className="createKefelProblemDiv">
      {finalTopic === "multiplication" ? (
        <div className="kefelProblemText">
          כמה זה
          <br />
          <span className="kefelProblemSpan"> {numOne} </span>x
          <span className="kefelProblemSpan"> {numTwo} </span>?
        </div>
      ) : finalTopic === "division" ? (
        <div className="kefelProblemText">
          כמה זה
          <br />
          {props.problem.fullNumbers === "true" ? (
            <span className="kefelProblemSpan"> {numOne * numTwo} </span>
          ) : (
            <span className="kefelProblemSpan"> {numOne} </span>
          )}
          ÷<span className="kefelProblemSpan"> {numTwo} </span>?
        </div>
      ) : null}
    </div>
  );
}
export default GameForKefel;
