const { response } = require("express");
const { request } = require("http");
const { printMap, isSufficient, getDeductions } = require("../utility/helperFunctions");

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
            "You need sufficient points to add this negative points transaction.",
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
          "You need sufficient points to add this negative points transaction.",
      };
    }
  }

  printMap(userStore);
  response.status(responseBody.status).json(responseBody.json);
};

exports.deductPoints = (request, response) => {
    const userName = request.body.userName;
  let point_to_deduct = request.body.points;

  const responseBody = {
    status: 200,
    json: {
      code: "SUCCESS",
    },
  };

  if (userStore.has(userName)) {
    const userObject = userStore.get(userName);
    const pm = userStore.get(userName).pointsMap;
    const tq = userStore.get(userName).transactionQueue;

    const deductionMap = new Map();

    let left_over_points = 0;

    if (isSufficient(userObject.pointsMap, point_to_deduct)) {
      while (point_to_deduct !== 0) {
        const transaction = tq.shift();
        const points = transaction.points;
        const partnerName = transaction.partnerName;
        let points_before = 0;
        let points_after = 0;

        left_over_points = point_to_deduct - points;
        if (left_over_points >= 0) {
          point_to_deduct = point_to_deduct - points;

          points_before = pm.get(partnerName);
          pm.set(partnerName, pm.get(partnerName) - points);
          points_after = pm.get(partnerName);
        } else {
          point_to_deduct = 0;
          const ts = new Date();
          const newTransaction = {
            partnerName: partnerName,
            points: -left_over_points,
            timestamp: ts.toLocaleString(),
          };
          tq.push(newTransaction);
          points_before = pm.get(partnerName);
          pm.set(partnerName, -left_over_points);
          points_after = pm.get(partnerName);
        }

        const points_dedcuted = deductionMap.get(partnerName)
          ? deductionMap.get(partnerName) + (points_after - points_before)
          : points_after - points_before;
        deductionMap.set(partnerName, points_dedcuted);
      }
      
      responseBody.status = 200;
      responseBody.json = getDeductions(deductionMap);

      userStore.set(userName, userObject);
    } else {
      responseBody.status = 400;
      responseBody.json = {
        code: "INSUFFICIENT POINTS",
      };
    }
  } else {
    responseBody.status = 404;
    responseBody.json = {
      code: "USER NOT FOUND",
    };
  }

  printMap(userStore);
  response.status(responseBody.status).json(responseBody.json);
};

exports.readPoints = (request, response) => {
  const userName = request.params.username;
  const responseBody = {
    status: 200,
    json: {
      code: "SUCCESS",
    },
  };

  if (userStore.has(userName)) {
    const userObject = userStore.get(userName);
    const responseList = [];

    for (let [key, value] of userObject.pointsMap.entries())
      responseList.push({ partnerName: key, points: value });

    responseBody.status = 200;
    responseBody.json = responseList;
  } else {
    responseBody.status = 404;
    responseBody.json = {
      code: "USER NOT FOUND",
    };
  }

  response.status(responseBody.status).json(responseBody.json);
};

exports.readPoints = (request, response) => {
  const userName = request.params.userName;
  const responseBody = {
    status: 200,
    json: {
      code: "SUCCESS",
    },
  };

  if (userStore.has(userName)) {
    const userObject = userStore.get(userName);
    const responseList = [];

    for (let [key, value] of userObject.pointsMap.entries())
      responseList.push({ partnerName: key, points: value });

    responseBody.status = 200;
    responseBody.json = responseList;
  } else {
    responseBody.status = 404;
    responseBody.json = {
      code: "USER NOT FOUND",
    };
  }

  response.status(responseBody.status).json(responseBody.json);
};
