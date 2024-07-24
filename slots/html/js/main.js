var slotsApp = new Vue({
  el: ".content",
  data: {
    show: true,
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
    onMessage() {
      let data = event.data;

      switch (data.act) {
        case "open":
          this.show = true;
          break;
        default:
          break;
      }
    },
    onKey() {
      var theKey = event.code;
      if (theKey == "Escape") {
        // this.closeUI();
      }
    },
    closeUI() {
      this.Post("slots", { act: "closeUI" });
    },
  },

  mounted() {
    window.addEventListener("message", this.onMessage);
    window.addEventListener("keydown", this.onKey);
  },
});
