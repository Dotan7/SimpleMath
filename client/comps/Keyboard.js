import React from "react";
import { BsBackspaceFill } from "react-icons/bs";

function Keyboard(props) {
  const answering = (order) => {
    if (typeof order === "number") {
      if (props.answer.current.innerText === "תשובה") {
        props.answer.current.innerText = order;
      } else {
        props.answer.current.innerText += order;
      }
    }
    if (order === "." && props.answer.current.innerText.indexOf(".") === -1) {
      if (props.answer.current.innerText === "תשובה") {
        props.answer.current.innerText = 0 + order;
      } else {
        props.answer.current.innerText += order;
      }
    }

    if (order === "del" && props.answer.current.innerText !== "תשובה") {
      props.answer.current.innerText = props.answer.current.innerText.slice(
        0,
        props.answer.current.innerText.length - 1
      );
    }
    if (props.answer.current.innerText === "") {
      props.answer.current.innerText = "תשובה";
    }
  };
  return (
    <div className="answerBtnsDiv">
      <div className="answerBtnsRow">
        <div
          className="answerBtnscol"
          onClick={() => {
            answering(1);
          }}
        >
          1
        </div>
        <div
          className="answerBtnscol"
          onClick={() => {
            answering(2);
          }}
        >
          2
        </div>
        <div
          className="answerBtnscol"
          onClick={() => {
            answering(3);
          }}
        >
          3
        </div>
      </div>
      <div className="answerBtnsRow">
        <div
          className="answerBtnscol"
          onClick={() => {
            answering(4);
          }}
        >
          4
        </div>
        <div
          className="answerBtnscol"
          onClick={() => {
            answering(5);
          }}
        >
          5
        </div>
        <div
          className="answerBtnscol"
          onClick={() => {
            answering(6);
          }}
        >
          6
        </div>
      </div>
      <div className="answerBtnsRow">
        <div
          className="answerBtnscol"
          onClick={() => {
            answering(7);
          }}
        >
          7
        </div>
        <div
          className="answerBtnscol"
          onClick={() => {
            answering(8);
          }}
        >
          8
        </div>
        <div
          className="answerBtnscol"
          onClick={() => {
            answering(9);
          }}
        >
          9
        </div>
      </div>
      <div className="answerBtnsRow">
        <div
          className="answerBtnscol"
          onClick={() => {
            answering("del");
          }}
        >
          <BsBackspaceFill />
        </div>
        <div
          className="answerBtnscol"
          onClick={() => {
            answering(0);
          }}
        >
          0
        </div>
        <div
          className="answerBtnscol"
          onClick={() => {
            answering(".");
          }}
        >
          .
        </div>
      </div>
    </div>
  );
}

export default Keyboard;
