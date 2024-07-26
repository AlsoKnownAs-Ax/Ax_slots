const config = {
  elements: [
    { id: 1, img: "watch.png", weight: 40.0 },
    { id: 2, img: "umbrella.png", weight: 30.0 },
    { id: 3, img: "like.png", weight: 25.0 },
    { id: 4, img: "dumbell.png", weight: 10.0 },
    { id: 5, img: "lock.png", weight: 5.5 },
    { id: 6, img: "star.png", weight: 2.5 },
    { id: 7, img: "crown.png", weight: 1.0 },
  ],
  winningTable: {
    "watch.png": 25,
    "umbrella.png": 50,
    "like.png": 100,
    "dumbell.png": 200,
    "lock.png": 500,
    "star.png": 1000,
    "crown.png": 5000,
  },

  logProbabilities: function () {
    const totalWeight = config.elements.reduce(
      (sum, element) => sum + element.weight,
      0
    );

    let probabilityTable;

    probabilityTable = config.elements.map((element) => {
      const probability = Math.pow(element.weight / totalWeight, 3);

      return {
        id: element.id,
        img: element.img,
        probability: probability,
      };
    });

    console.table(probabilityTable);
  },
};
