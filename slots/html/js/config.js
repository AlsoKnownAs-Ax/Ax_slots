const config = {
  useFairProbability: false, // This will automatically set a fair chance to each symbol
  animation: "easeOut", //Available Animations: bounceOut, elasticOut, easeOut

  elements: [
    { id: 1, img: "watch.png", weight: 88.8889 }, // 88.8889%
    { id: 2, img: "umbrella.png", weight: 44.4444 }, // 44.4444%
    { id: 3, img: "like.png", weight: 22.2222 }, // 22.2222%
    { id: 4, img: "dumbell.png", weight: 11.1111 }, // 11.1111%
    { id: 5, img: "lock.png", weight: 4.4444 }, // 4.4444%
    { id: 6, img: "star.png", weight: 2.2222 }, // 2.2222%
    { id: 7, img: "crown.png", weight: 0.4444 }, // 0.4444%
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

  setWeightsAccordingToWins: function () {
    let inverseWeights = this.elements.map((element) => {
      const win = this.winningTable[element.img];
      return { id: element.id, img: element.img, inverseWeight: 1 / win };
    });

    const totalInverseWeight = inverseWeights.reduce(
      (sum, element) => sum + element.inverseWeight,
      0
    );

    this.elements = this.elements.map((element) => {
      const inverseWeight = inverseWeights.find(
        (el) => el.id === element.id
      ).inverseWeight;
      element.weight = (inverseWeight / totalInverseWeight) * 100; // Normalize to sum up to 100

      return element;
    });
  },

  logProbabilities: function () {
    const totalWeight = this.elements.reduce(
      (sum, element) => sum + element.weight,
      0
    );

    let probabilityTable;

    probabilityTable = this.elements.map((element) => {
      const probability = element.weight / totalWeight;

      return {
        id: element.id,
        img: element.img,
        probability: probability,
      };
    });

    console.table(probabilityTable);
  },

  getPictureByElementID(elementID) {
    const element = this.elements.find((el) => el.id === elementID);
    return element ? element.img : null;
  },

  getWinForElementID(elementID) {
    const element = this.elements.find((el) => el.id === elementID);
    return element ? config.winningTable[element.img] : 0;
  },
};

/**
 * The logProbabilities function can be used to log in the console the probability of each symbol
 * ex:
 * 0.05 == 5%
 * 0.8623 == 86.23%
 */
if (config.useFairProbability) config.setWeightsAccordingToWins();
