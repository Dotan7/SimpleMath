const { table } = require("console");
const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: "https://simplemathpractice.herokuapp.com",
    methods: ["GET", "POST"],
  },
});
const cors = require("cors");
const path = require("path");

app.use(cors());
// paths
const admin = io.of("/admin");
const game = io.of("/");

global.settings = {};
global.rooms = {};
global.users = [];

const setAhuzimProblem = async (level, questionTopic) => {
  let mana = 0;
  let ahuz = 0;
  let shalem = 0;
  let theRealAnswer = 0;

  if (level === "basic") {
    let manaForKalArr = [
      1, 2, 3, 4, 5, 10, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 100, 200, 300,
      400, 500, 600, 700, 800, 900, 1000,
    ];
    mana = manaForKalArr[Math.floor(Math.random() * manaForKalArr.length)];

    let ahuzForKalArr = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 25, 30, 33, 40, 50, 60, 70, 75, 80, 90,
    ];
    ahuz = ahuzForKalArr[Math.floor(Math.random() * ahuzForKalArr.length)];
    let shalemForKalArr = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200,
      300, 400, 500, 600, 700, 800, 900, 1000,
    ];
    shalem =
      shalemForKalArr[Math.floor(Math.random() * shalemForKalArr.length)];
  } else if (level === "easy") {
    let manaForKalArr = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65,
      70, 75, 80, 85, 90, 95, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550,
      600, 650, 700, 750, 800, 850, 900, 950, 1000,
    ];
    mana = manaForKalArr[Math.floor(Math.random() * manaForKalArr.length)];
    let ahuzForKalArr = [
      5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95,
    ];
    ahuz = ahuzForKalArr[Math.floor(Math.random() * ahuzForKalArr.length)];

    let shalemForKalArr = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65,
      70, 75, 80, 85, 90, 95, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550,
      600, 650, 700, 750, 800, 850, 900, 950, 1000,
    ];
    shalem =
      shalemForKalArr[Math.floor(Math.random() * shalemForKalArr.length)];
  } else if (level === "hard") {
    mana = Math.floor(Math.random() * 1000) + 1; // every number 1-999
    ahuz = Math.floor(Math.random() * 99) + 1; // every number 1-99
    shalem = Math.floor(Math.random() * 1000) + 1;
  }

  let finalTopic = "mana";
  if (
    questionTopic === "mana" ||
    questionTopic === "ahuz" ||
    questionTopic === "shalem"
  ) {
    finalTopic = questionTopic;
  } else {
    finalTopic = Math.floor(Math.random() * 3);
    if (finalTopic === 0) {
      finalTopic = "mana";
    } else if (finalTopic === 1) {
      finalTopic = "ahuz";
    } else {
      finalTopic = "shalem";
    }
  }

  if (finalTopic === "mana") {
    theRealAnswer = (ahuz / 100) * shalem;
  } else if (finalTopic === "ahuz") {
    theRealAnswer = (mana / shalem) * 100;
  } else if (finalTopic === "shalem") {
    theRealAnswer = mana * (100 / ahuz);
  }

  console.log(mana, ahuz, shalem, theRealAnswer, finalTopic);
  return { mana, ahuz, shalem, theRealAnswer, finalTopic };
};

const setKefelProblem = async (numbersRange, fullNumbers, questionTopic) => {
  let numOne = 0;
  let numTwo = 0;
  let theRealAnswer = 0;
  console.log("questionTopicquestionTopic", questionTopic);
  if (numbersRange === "10") {
    numOne = Math.floor(Math.random() * 10) + 1;
    numTwo = Math.floor(Math.random() * 10) + 1;
  } else if (numbersRange === "100") {
    numOne = Math.floor(Math.random() * 100) + 1;
    numTwo = Math.floor(Math.random() * 100) + 1;
  }

  let finalTopic = "multiplication";
  if (questionTopic === "multiplication" || questionTopic === "division") {
    finalTopic = questionTopic;
  } else {
    finalTopic = Math.floor(Math.random() * 2);
    if (finalTopic === 0) {
      finalTopic = "multiplication";
    } else {
      finalTopic = "division";
    }
  }

  if (finalTopic === "multiplication") {
    theRealAnswer = numOne * numTwo;
  } else if (finalTopic === "division") {
    if (fullNumbers === "true") {
      theRealAnswer = numOne;
    } else if (fullNumbers === "false") {
      theRealAnswer = numOne / numTwo;
    }
  }
  console.log(numOne, numTwo, theRealAnswer, finalTopic, fullNumbers);
  return { numOne, numTwo, theRealAnswer, finalTopic, fullNumbers };
};

game.on("connection", (socket) => {
  socket.on("checkIfNameValid", (userNameInput, answer) => {
    const isNameExsist = users.filter((x) => x.userName === userNameInput);
    console.log("checkIfNameValid: ", userNameInput, isNameExsist);
    if (isNameExsist.length === 0) {
      answer(false);
    } else {
      answer(true);
    }
  });

  socket.on("pushToNamesArrInServer", (userNameInput) => {
    console.log("pushToNamesArrInServer: ", userNameInput);
    users.push({ userName: userNameInput, id: socket.id, where: "Welcome" });
    console.table(users);
  });

  socket.on("updateMe", (userObj) => {
    const userToUpdate = users.filter((x) => x.userName === userObj.userName);
    const findUserToUpdate = users.indexOf(userToUpdate[0]);
    console.log(
      "findUserToUpdate: ",
      userObj,
      findUserToUpdate,
      users[findUserToUpdate]
    );
    if (findUserToUpdate === -1) {
      console.log("findUserToUpdate say: NO USER TO UPDATE!!!!!!");
    } else {
      users[findUserToUpdate].id = userObj.id;
      users[findUserToUpdate].where = userObj.where;
    }
    console.table(users);
  });

  // to do: on disconnect

  socket.on("tryToConnectFromFront", (playerToCall, me, answer) => {
    const isNameExsist = users.filter((x) => x.userName === playerToCall);
    console.log(
      "tryToConnectFromFront: ",
      playerToCall,
      isNameExsist,
      socket.id,
      me
    );
    if (isNameExsist.length === 0) {
      //   שלח לו בחזרה שאין שחקן כזה או שהוא לא אונליין
      answer("notExistOrNotOnline");
    } else {
      if (isNameExsist[0].roomNum) {
        //   שלח לו בחזרה במשחק ולא יכול כרגע לענות
        answer("inGameNow");
      } else {
        //   שלח לו בחזרה שמחכים לתשובה מהשחקן
        answer("waitingForAnswerFromUser");
        socket.to(isNameExsist[0].id).emit("invitation", me);
      }
    }
  });

  socket.on("diclineGameOffer", (plyaerDecline, opponentOfferDecline) => {
    socket
      .to(opponentOfferDecline.id)
      .emit("yourOfferHasBeenDeclined", plyaerDecline.id);
  });

  socket.on(
    "acceptGameOffer",
    (plyaerAccepted, opponentOfferAccepted, answer) => {
      let roomNum = Math.floor(Math.random() * 1000) + 1; //needs to to it with big numbers and chek they not allready exist
      answer(roomNum);
      socket
        .to(opponentOfferAccepted.id)
        .emit("yourOfferHasBeenAccepted", plyaerAccepted, roomNum);
    }
  );

  socket.on("joinMeToRoom", (me, roomNum) => {
    console.log("server: -JOIM ME TO ROOM-JOIM ME TO ROOM-JOIM ME TO ROOM");
    console.log("roomNum:", roomNum);
    console.log("me.id", me.id, me);
    console.log("socket.id", socket.id);
    // console.log(socket.rooms);
    socket.join(roomNum);
    console.log("ROOMS:");
    console.table(rooms);
    const userToUpdate = users.filter((x) => x.userName === me.userName);
    const findUserToUpdate = users.indexOf(userToUpdate[0]);
    users[findUserToUpdate].roomNum = roomNum;
    console.log("nanana");
    console.log(users[findUserToUpdate]);
    if (rooms[roomNum]) {
      rooms[roomNum].push(me);
    } else {
      rooms[roomNum] = [me];
    }
    console.table(rooms);
    console.log("END 2");
  });

  socket.on(
    "gameSettings",
    (
      roomNum,
      gameTopic,
      ahuzimGameLevel,
      numbersRange,
      fullNumbers,
      numOfQuestionsInGame
    ) => {
      console.log("gameSettings");
      console.log("gameTopic", gameTopic);
      console.log("ahuzimGameLevel", ahuzimGameLevel);
      console.log("numbersRange", numbersRange);
      console.log("fullNumbers", fullNumbers);
      settings[roomNum] = {
        gameTopic,
        ahuzimGameLevel,
        numbersRange,
        fullNumbers,
        numOfQuestionsInGame,
        numOfQuestionsInGameToPlay: numOfQuestionsInGame,
      };
      console.log("settings[roomNum]: ", settings[roomNum]);
    }
  );

  socket.on("meReadyToPlay", (me, opponent, readyOrNot, roomNum) => {
    console.log("server: meReadyToPlay");
    console.log("me.id", me.id);
    console.log("opponent.id", opponent.id);
    console.log("socket.id", socket.id);
    console.log("roomNum", roomNum);

    socket.in(roomNum).emit("opponentIsReadyToPlay", me, readyOrNot);
  });

  socket.on("startTheGame", async (roomNum) => {
    if (
      settings[roomNum].gamingNow === undefined ||
      settings[roomNum].gamingNow === false
    ) {
      console.log("startTheGame");
      console.log("roomNum", roomNum);
      settings[roomNum].gamingNow = true;
      let problem;
      if (settings[roomNum].gameTopic === "kefelGame") {
        problem = await setKefelProblem(
          settings[roomNum].numbersRange,
          settings[roomNum].fullNumbers
        );
      } else if (settings[roomNum].gameTopic === "ahuzimGame") {
        problem = await setAhuzimProblem(settings[roomNum].ahuzimGameLevel);
      }

      console.log(problem);
      let theGoldNum = settings[roomNum].numOfQuestionsInGame;
      console.log("theGoldNumGOLD", theGoldNum);

      socket.in(roomNum).emit("startTheGameFromServer", problem, theGoldNum);
      socket.emit("startTheGameFromServer", problem, theGoldNum);
    }
  });

  socket.on("amIAnswerdFirst", (roomNum, questNum, answer) => {
    console.log(roomNum);
    let theGoldNum =
      settings[roomNum].numOfQuestionsInGame -
      settings[roomNum].numOfQuestionsInGameToPlay;
    console.log("theGoldNumWHO WORKS!!");
    console.log(theGoldNum);

    if (questNum === theGoldNum) {
      answer(true);
      settings[roomNum].numOfQuestionsInGameToPlay--;
      socket.in(roomNum).emit("youLoseThisRound");
      if (settings[roomNum].numOfQuestionsInGameToPlay === 0) {
        // game over
        const timeTemp = setTimeout(() => {
          settings[roomNum].gamingNow = false;
          socket.in(roomNum).emit("gameOver");
          socket.emit("gameOver");

          clearTimeout(timeTemp);
        }, 2000);
      } else {
        const timeTemp = setTimeout(async () => {
          let problem;
          if (settings[roomNum].gameTopic === "kefelGame") {
            problem = await setKefelProblem(
              settings[roomNum].numbersRange,
              settings[roomNum].fullNumbers
            );
          } else if (settings[roomNum].gameTopic === "ahuzimGame") {
            problem = await setAhuzimProblem(settings[roomNum].ahuzimGameLevel);
          }
          console.log(problem);
          socket.in(roomNum).emit("nextQuest", problem);
          socket.emit("nextQuest", problem);

          clearTimeout(timeTemp);
        }, 1000);
      }
    } else {
      answer(false);
    }
  });

  socket.on("rematchOffer", (roomNum, opponent, answer) => {
    console.log("rematchOffer");
    // נבדוק שהוא עדיין בחדר - שזה רלוונטי בכלל
    const stilHere = rooms[roomNum].filter(
      (x) => x.userName === opponent.userName
    );
    const isHe = stilHere[0];
    console.log("stilHere -stilHerestilHerestilHere ");
    console.log(stilHere, isHe);

    if (stilHere.length === 0) {
      answer(false);
    } else {
      answer(true);
      socket.in(roomNum).emit("rematchOfferToYou");
    }
  });

  socket.on(
    "startTest",
    async (
      gameTopic,
      ahuzimGameLevel,
      numbersRange,
      fullNumbers,
      questionTopic,
      answer
    ) => {
      console.log("startTest");
      let problem;
      if (gameTopic === "kefelGame") {
        problem = await setKefelProblem(
          numbersRange,
          fullNumbers,
          questionTopic
        );
      } else if (gameTopic === "ahuzimGame") {
        problem = await setAhuzimProblem(ahuzimGameLevel, questionTopic);
      }

      answer(problem);
    }
  );

  socket.on("leaveRoom", (roomNum) => {
    console.log(`leaveRoom - rooms 1:`);
    console.log(roomNum);
    console.table(users);
    console.table(rooms);

    socket.leave(roomNum);

    // update room null for the leaving user in USERS
    const userToUpdate = users.filter((x) => x.id === socket.id);
    const findUserToUpdate = users.indexOf(userToUpdate[0]);
    users[findUserToUpdate].roomNum = null;

    console.log(`leaveRoom - rooms 2:`);
    console.log(users[findUserToUpdate]);
    console.log(roomNum);
    console.table(users);

    // update player leaving the room in ROOMS
    if (rooms[roomNum]) {
      const leavingUser = rooms[roomNum].findIndex((x) => x.id === socket.id);
      console.log("leavingUserINDEX: ", leavingUser);
      rooms[roomNum].splice(leavingUser, 1);

      console.log(`leaveRoom - rooms 2:`);
      console.table(rooms[roomNum]);
      console.table(rooms);
      if (rooms[roomNum].length === 0) {
        delete rooms[roomNum];
        console.log(`DELETE ROOM:`);
        console.table(rooms);
      } else {
        socket.in(roomNum).emit("oppenentLeftTheGame");

        // const timeTemp = setTimeout(() => {
        //   delete rooms[roomNum];
        //   console.log(`leaveRoom - rooms 3:`);
        //   console.table(rooms);
        //   clearTimeout(timeTemp);
        // }, 4000);
      }
    }
  });

  socket.on("disconnect", (e) => {
    socket.leave();

    for (const key in rooms) {
      rooms[key].map((player, playerInd) => {
        // console.log(`${key}: ${rooms[key][0].userName}`);
        // console.log(`${key}: ${player.userName}`);

        if (player.id === socket.id) {
          // console.log(`player: ${player.userName}. socket.id: ${socket.id}`);

          console.log(`rooms: 1`);
          console.table(rooms);
          rooms[key].splice(playerInd, 1);
          console.log(`rooms: 2`);
          console.table(rooms);

          if (rooms[key].length === 0) {
            delete rooms[key];
          } else {
            socket.in(Number(key)).emit("oppenentLeftTheGame");

            const timeTemp = setTimeout(() => {
              delete rooms[key];
              console.log(`rooms: 3`);
              console.table(rooms);
              clearTimeout(timeTemp);
            }, 4000);
          }
        }
      });
    }
    console.log("users:1");
    console.table(users);
    users.map((player, playerInd) => {
      if (player.id === socket.id) {
        users.splice(playerInd, 1);
      }
    });
    console.log("users:2");
    console.table(users);
  });
});

admin.on("connection", (socket) => {
  socket.on("someoneInAdminPage", (answer) => {
    answer({ users, rooms });
  });

  socket.on("verifyAdminPassword", (pass, answer) => {
    if (pass === "zoharAdmin2022") {
      answer(true);
    } else {
      answer(false);
    }
  });
});

if (process.env.PROD) {
  app.use(express.static(path.join(__dirname, "./client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
}

const PORT = process.env.PORT || 3015;
// listen to server
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
