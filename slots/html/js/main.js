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
          img.src = this.icons[i % this.icons.length];
          fragment.appendChild(img);
        }
        inside.appendChild(fragment);
      });
    },
    async startSpin() {
      if (this.spinning) return;

      this.spinning = true;
      const insideElements = document.querySelectorAll(".inside");
      insideElements.forEach((inside) => {
        inside.style.bottom = "0%";
        inside.style.animation = `spin ${
          this.spinDuration / 1000
        }s linear infinite`;
      });
      // this.generateElements();

      await this.spinWheels(insideElements);

      setTimeout(() => {
        this.stopSpin(insideElements);
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
    async stopSpin(insideElements) {
      const promises = Array.from(insideElements).map((inside) => {
        inside.style.animation = "";
        const randomPosition =
          -100 * Math.floor(Math.random() * this.icons.length);
        return this.animateTransform(
          inside,
          randomPosition,
          this.stopDuration,
          "elasticOut"
        );
      });

      await Promise.all(promises);
      this.spinning = false;
      this.checkWinCondition();
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
          element.style.transform = `translateY(${newPosition}px)`;

          if (timeElapsed < duration) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(animate);
      });
    },
    checkWinCondition() {},
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
      if (theKey == "Escape") {
        this.closeUI();
      }
    },
    closeUI() {
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

function blink(element) {
  $(element).animate({ opacity: 0 }, 200, "linear", function () {
    $(this).animate({ opacity: 1 }, 200);
  });
}
