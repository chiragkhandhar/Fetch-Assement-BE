const printMap = (map) => {
  console.log("------------------------------");
  for (let [key, value] of map.entries()) {
    console.log("Key: " + key);
    console.log(value);
  }
  console.log("------------------------------");
};

const isSufficient = (pointsMap, point_to_deduct) => {
  let total = 0;
  for (let [key, value] of pointsMap.entries()) total = total + value;
  return total >= point_to_deduct;
};

const getDeductions = (deductionMap) => {
  let responseList = [];
  for (let [key, value] of deductionMap.entries()) {
    responseList.push({ [key]: value });
  }
  return responseList;
};

module.exports = {
  printMap,
  isSufficient,
  getDeductions,
};
