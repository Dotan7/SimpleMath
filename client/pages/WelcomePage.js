import React, { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  useLocation,
  useNavigate,
} from "react-router-dom";
import io from "socket.io-client";
import url from "../url";

const socket = io.connect(url + "/");

function WelcomePage(props) {
  const navigate = useNavigate();
  const userNameInput = useRef();
  const userNameMsg = useRef();
  const [isNameValid, setIsNameValid] = useState(null);

  const checkIfNameValid = () => {
    socket.emit("checkIfNameValid", userNameInput.current.value, (answer) => {
      if (answer === true) {
        userNameMsg.current.value = "invalid name";
        setIsNameValid(false);
      } else {
        userNameMsg.current.value = "valid name";
        setIsNameValid(true);
      }
    });
  };

  const checkNameAndGo = (e) => {
    e.preventDefault();

    if (
      userNameInput.current.value === "" ||
      userNameInput.current.value === null
    ) {
      alert("אנא הכנס שם כדי להמשיך =)");
      return;
    } else if (!isNameValid) {
      alert("אנא בחר שם אחר. שם זה תפוס");
    } else {
      props.setUserName(userNameInput.current.value);
      socket.emit("pushToNamesArrInServer", userNameInput.current.value);
      navigate(`/home`);
    }
  };

  return (
    <div className="wolcomePageContainer bigDiv">
      <div className="navBarHome">
        <h3 className="wolcomePageHeadline">ברוכים הבאים לחשבון פשוט</h3>
        <h6 className="wolcomePageSubHeadline">
          שפרו את יכולות שלכם בכפל וחילוק ובאחוזים ושחקו נגד חברים
        </h6>
      </div>
      <h4 className="wolcomePageSubHeadline">הכנס את שמך:</h4>
      <div className="wolcomePageFormDiv">
        <form className="wolcomePageForm" typeof="submit">
          <input
            className="wolcomePageFormInput"
            onChange={() => {
              checkIfNameValid();
            }}
            ref={userNameInput}
            placeholder="שם שחקן"
            type="text"
          ></input>
          <br />
          <span
            className="wolcomePageUserNameMsg"
            style={{ color: isNameValid ? "green" : "red" }}
            ref={userNameMsg}
          >
            {userNameMsg.current ? userNameMsg.current.value : null}
          </span>
          <br />
          <button
            className="wolcomePageFormBtn"
            onClick={(e) => {
              checkNameAndGo(e);
            }}
          >
            המשך
          </button>
        </form>
      </div>
    </div>
  );
}

export default WelcomePage;
