const { response } = require("express");
const { request } = require("http");
const { printMap } = require("../utility/helperFunctions");

const userStore = new Map();

exports.addPoints = (request, response) => {
  const responseBody = {
    status: 200,
    json: {
      code: "SUCCESS",
    },
  };

  const userName = request.body.userName;
  const transaction = {
    partnerName: request.body.partnerName,
    points: request.body.points,
    timestamp: request.body.timestamp,
  };

  if (userStore.has(userName)) {
    const userObject = userStore.get(userName);
    const pm = userStore.get(userName).pointsMap;

    if (pm.has(transaction.partnerName)) {
      const oldPoints = pm.get(transaction.partnerName);
      const newPoints = oldPoints + transaction.points;

      if (newPoints >= 0) {
        userObject.transactionQueue.push(transaction);
        pm.set(transaction.partnerName, newPoints);

        let data = userObject.transactionQueue.sort((a, b) => {
          return a.timestamp.localeCompare(b.timestamp);
        });

        const newUserObject = {
          transactionQueue: data,
          pointsMap: pm,
        };
        userStore.set(userName, newUserObject);
      } else {
        responseBody.status = 400;
        responseBody.json = {
          code: "BAD REQUEST",
          description:
            "You need sufficient points to add this negative points transaction",
        };
      }
    } else {
      if (transaction.points > 0) {
        userObject.transactionQueue.push(transaction);
        pm.set(transaction.partnerName, transaction.points);

        let data = userObject.transactionQueue.sort((a, b) => {
          return a.timestamp.localeCompare(b.timestamp);
        });

        const newUserObject = {
          transactionQueue: data,
          pointsMap: pm,
        };

        userStore.set(userName, newUserObject);
      } else {
        responseBody.status = 400;
        responseBody.json = {
          code: "BAD REQUEST",
          description:
            "You need sufficient points to add this negative points transaction.",
        };
      }
    }
  } else {
    const pointsMap = new Map();
    if (transaction.points > 0) {
      pointsMap.set(transaction.partnerName, transaction.points);

      const newUserObject = {
        transactionQueue: [transaction],
        pointsMap: pointsMap,
      };

      userStore.set(userName, newUserObject);
    } else {
      responseBody.status = 400;
      responseBody.json = {
        code: "BAD REQUEST",
        description:
          "You need sufficient points to add this negative points transaction",
      };
    }
  }

  printMap(userStore);
  response.status(responseBody.status).json(responseBody.json);
};

exports.deductPoints = (request, response) => {};

exports.readPoints = (request, response) => {};
