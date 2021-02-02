const printMap = (map) => {
  console.log("------------------------------");
  for (let [key, value] of map.entries()) {
    console.log("Key: " + key);
    console.log(value);
  }
  console.log("------------------------------");
};

module.exports = {
  printMap,
};
