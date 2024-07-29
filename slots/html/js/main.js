const SKIPPED_ICONS = 3;

var slotsApp = new Vue({
  el: ".content",
  data: {
    show: true,
    icons: config.elements.map((element) => `./assets/icons/${element.img}`),
    spinInterval: null,
    spinDuration: 1500,
    stopDuration: 1500,
    credits: 15,
    spinning: false,
  },
  methods: {
    async Post(url, data = {}) {
      const response = await fetch(
        `https://${GetParentResourceName()}/${url}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        }
      );

      return await response.json();
    },
    formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    },
    generateElements() {
      const insideElements = document.querySelectorAll(".inside");
      insideElements.forEach((inside) => {
        inside.innerHTML = "";
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < this.icons.length * 5; i++) {
          const img = document.createElement("img");
          const randomIndex = Math.floor(Math.random() * this.icons.length);
          img.src = this.icons[randomIndex];
          fragment.appendChild(img);
        }
        inside.appendChild(fragment);
      });
    },
    async startSpin() {
      if (this.spinning) return;

      stopBlink("reel1");
      stopBlink("reel2");
      stopBlink("reel3");

      this.spinning = true;
      const insideElements = document.querySelectorAll(".inside");
      insideElements.forEach((inside) => {
        inside.style.top = "";
        inside.style.bottom = "0%";
        inside.style.animation = `spin ${
          this.spinDuration / 1000
        }s linear infinite`;
      });
      this.generateElements();

      const slotMatrix = generateSlotMatrix();
      await this.spinWheels(insideElements);

      setTimeout(() => {
        this.stopSpin(1, slotMatrix);
        this.stopSpin(2, slotMatrix);
        this.stopSpin(3, slotMatrix);
        this.checkWinCondition(slotMatrix);
      }, 500);
    },
    spinWheels(insideElements) {
      return new Promise((resolve) => {
        this.spinInterval = setInterval(() => {
          let spinningReels = 0;

          insideElements.forEach((inside) => {
            const currentDuration = parseFloat(
              getComputedStyle(inside).animationDuration
            );
            inside.style.animationDuration = currentDuration - 0.2 + "s";

            if (currentDuration <= 0.2) {
              spinningReels++;
            }
          });

          if (spinningReels === insideElements.length) {
            clearInterval(this.spinInterval);
            resolve();
          }
        }, 100);
      });
    },
    getGeneratedElementsForReelID(reelID, slotMatrix) {
      let valuesForReel = [];
      const columnID = reelID - 1;

      for (let row = 0; row < slotMatrix.length; row++) {
        const element = slotMatrix[row][columnID];
        valuesForReel.push(element);
      }

      return valuesForReel;
    },
    async stopSpin(reelID, slotMatrix) {
      const reelElement = document.querySelector(`.reel${reelID}`);
      const images = reelElement.querySelectorAll("img");

      const generatedElements = this.getGeneratedElementsForReelID(
        reelID,
        slotMatrix
      );

      for (i = 0; i < generatedElements.length; i++) {
        const element = images[i + SKIPPED_ICONS];
        const targetPictureID = generatedElements[i] - 1;
        const picturePath = this.icons[targetPictureID];

        element.src = picturePath;
      }

      const targetPosition = -100 * i;
      reelElement.style.transform = `translateY(${targetPosition}%)`;
      reelElement.style.animation = "";
      reelElement.style.top = "0%";

      const promises = [
        this.animateTransform(
          reelElement,
          -100 * SKIPPED_ICONS,
          this.stopDuration,
          "elasticOut"
        ),
      ];

      await Promise.all(promises);
      this.spinning = false;
    },
    animateTransform(element, targetPosition, duration, easing) {
      return new Promise((resolve) => {
        const startPosition =
          parseFloat(getComputedStyle(element).transform.split(",")[5]) || 0;
        const changeInPosition = targetPosition - startPosition;
        const startTime = performance.now();
        const easingFunction = $.easing[easing];

        const animate = (currentTime) => {
          const timeElapsed = currentTime - startTime;
          const t = Math.min(timeElapsed / duration, 1);
          const newPosition = easingFunction(
            null,
            t,
            startPosition,
            changeInPosition,
            1
          );
          const convertedPX = (newPosition / 1920) * 100;
          element.style.transform = `translateY(${convertedPX}vw)`;

          if (timeElapsed < duration) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(animate);
      });
    },
    checkWinCondition(slotMatrix) {
      const middleRow = slotMatrix[1];

      if (middleRow[0] === middleRow[1] && middleRow[1] === middleRow[2]) {
        const win = config.getWinForElementID(middleRow[0]);

        setTimeout(() => {
          startBlink("reel1");
          startBlink("reel2");
          startBlink("reel3");
        }, 1500);

        return;
      }
    },

    onMessage(event) {
      let data = event.data;

      switch (data.act) {
        case "open":
          this.show = true;
          break;
        default:
          break;
      }
    },
    onKey(event) {
      var theKey = event.code;

      if (theKey === "Space") {
        this.startSpin();
      }

      if (theKey == "Escape") {
        this.closeUI();
      }
    },
    closeUI() {
      // this.show = false;
      this.spinning = false;
      this.Post("slots", { act: "closeUI" });
    },
  },
  mounted() {
    this.generateElements();
    window.addEventListener("message", this.onMessage);
    window.addEventListener("keydown", this.onKey);
  },
});

$.extend($.easing, {
  bounceOut: function (x, t, b, c, d) {
    if ((t /= d) < 1 / 2.75) {
      return c * (7.5625 * t * t) + b;
    } else if (t < 2 / 2.75) {
      return c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + b;
    } else if (t < 2.5 / 2.75) {
      return c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + b;
    } else {
      return c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + b;
    }
  },
  easeOut: function (x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
  elasticOut: function (x, t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * 0.3;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = (p / (2 * Math.PI)) * Math.asin(c / a);
    return (
      a * Math.pow(2, -10 * t) * Math.sin(((t * d - s) * (2 * Math.PI)) / p) +
      c +
      b
    );
  },
});
function startBlink(elementClass) {
  const $element = $(`.${elementClass} img:nth-child(${SKIPPED_ICONS + 2})`);
  if ($element.length) {
    $element.addClass("blink");

    setTimeout(() => {
      stopBlink(elementClass);
    }, 3000);
  } else {
    console.error("Element not found:", elementClass);
  }
}

function stopBlink(elementClass) {
  const $element = $(`.${elementClass} img:nth-child(${SKIPPED_ICONS + 2})`);
  if ($element.length) {
    $element.removeClass("blink");
  } else {
    console.error("Element not found:", elementClass);
  }
}

function weightedRandomElement() {
  const totalWeight = config.elements.reduce(
    (sum, element) => sum + element.weight,
    0
  );
  const threshold = Math.random() * totalWeight;
  let cumulativeWeight = 0;
  for (let element of config.elements) {
    cumulativeWeight += element.weight;
    if (cumulativeWeight >= threshold) {
      return element;
    }
  }
}

function randomElement() {
  const randomIndex = Math.floor(Math.random() * config.elements.length);
  return config.elements[randomIndex];
}

function generateSlotMatrix() {
  let matrix = [];
  for (let i = 0; i < 3; i++) {
    let row = [];
    for (let j = 0; j < 3; j++) {
      if (i === 1) {
        row.push(weightedRandomElement().id);
      } else {
        row.push(randomElement().id);
      }
    }
    matrix.push(row);
  }
  return matrix;
}
