import React, { useState, useEffect, useRef } from "react";

function SettingsOption(props) {
  const [gameTopic, setGameTopic] = useState(
    props.settings.gameTopic ? props.settings.gameTopic : "kefelGame"
  );
  const [ahuzimGameLevel, setAhuzimGameLevel] = useState(
    props.settings.ahuzimGameLevel ? props.settings.ahuzimGameLevel : "basic"
  );
  const [numbersRange, setNumbersRange] = useState(
    props.settings.numbersRange ? props.settings.numbersRange : "10"
  );
  const [fullNumbers, setFullNumbers] = useState(
    props.settings.fullNumbers ? props.settings.fullNumbers : "true"
  );
  const [numOfQuestionsInGame, setNumOfQuestionsInGame] = useState(
    props.settings.numOfQuestionsInGame > 0
      ? props.settings.numOfQuestionsInGame
      : 5
  );

  useEffect(() => {
    props.setSettings({
      gameTopic: gameTopic,
      ahuzimGameLevel: ahuzimGameLevel,
      numbersRange: numbersRange,
      fullNumbers: fullNumbers,
      numOfQuestionsInGame: numOfQuestionsInGame,
    });
  }, [
    gameTopic,
    ahuzimGameLevel,
    numbersRange,
    fullNumbers,
    numOfQuestionsInGame,
  ]);

  return (
    <div className="settingsOptionCompDiv">
      <div className="multiplicationPagePracticePickDivOptins">
        <div
          className="multiplicationPageBtnOption multiplicationPageBtnMultiplication"
          style={{
            backgroundColor:
              gameTopic === "kefelGame" ? "#2197ff" : "#2197ff59",
          }}
          onClick={() => {
            setGameTopic("kefelGame");
          }}
        >
          כפל וחילוק
        </div>
        <div
          className="multiplicationPageBtnOption multiplicationPageBtnBattle"
          style={{
            backgroundColor:
              gameTopic === "ahuzimGame" ? "#2197ff" : "#2197ff59",
          }}
          onClick={() => {
            setGameTopic("ahuzimGame");
          }}
        >
          אחוזים
        </div>
      </div>
      <div className="multiplicationPageLevelsControlDiv">
        <div className="ahuzimGameLevelsControl">
          <label htmlFor="ahuzimGameLevelsOptions">מס' שאלות: </label>

          <input
            type="number"
            className="numQuestInput"
            id=""
            placeholder={
              props.settings.numOfQuestionsInGame > 0
                ? props.settings.numOfQuestionsInGame
                : 5
            }
            style={{ width: "30px" }}
            onChange={(e) => {
              e.target.value > 0
                ? setNumOfQuestionsInGame(e.target.value)
                : (e.target.value = 0);
            }}
          />
        </div>
        <h5 className="headlineLevelsDiv">דרגות קושי:</h5>

        {gameTopic === "ahuzimGame" ? (
          <div className="ahuzimGameLevelsControl">
            <label htmlFor="ahuzimGameLevelsOptions">אחוזים: </label>

            <select
              id="multiplicationPageRangeLevelsOptions"
              style={{
                backgroundColor:
                  ahuzimGameLevel === "basic"
                    ? "rgb(43, 150, 150)"
                    : ahuzimGameLevel === "easy"
                    ? "#2197ff"
                    : "#2197ff59",
              }}
              onChange={(e) => {
                setAhuzimGameLevel(e.target.value);
              }}
            >
              <option className="basicLevelChose" value="basic">
                בסיסי
              </option>
              <option className="easyLevelChose" value="easy">
                מתקדם
              </option>
              <option className="hardLevelChose" value="hard">
                קשה
              </option>
            </select>
          </div>
        ) : gameTopic === "kefelGame" ? (
          <div className="ahuzimGameLevelsControl">
            <label htmlFor="multiplicationPageRangeLevelsOptions">טווח: </label>
            <select
              id="multiplicationPageRangeLevelsOptions"
              style={{
                backgroundColor:
                  numbersRange === "10" ? "#2197ff" : "#2197ff59",
              }}
              onChange={(e) => {
                setNumbersRange(e.target.value);
              }}
            >
              <option
                className="multiplicationPageRangeEasyLevelChose"
                value="10"
              >
                לוח הכפל קלאסי (10X10)
              </option>
              <option
                className="multiplicationPageRangeHardLevelChose"
                value="100"
              >
                לוח הכפל מורחב (100X100)
              </option>
            </select>
            <br />
            <label htmlFor="multiplicationPageFullLevelsOptions">
              מספרים:{" "}
            </label>
            <select
              id="multiplicationPageFullLevelsOptions"
              style={{
                backgroundColor:
                  fullNumbers === "true" ? "#2197ff" : "#2197ff59",
              }}
              onChange={(e) => {
                setFullNumbers(e.target.value);
              }}
            >
              <option className="multiplicationPageEasyLevelChose" value="true">
                שלמים בלבד (בסיסי)
              </option>
              <option
                className="multiplicationPageHardLevelChose"
                value="false"
              >
                כל המספרים (מתקדם)
              </option>
            </select>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SettingsOption;
