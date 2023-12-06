import { Controller } from "@hotwired/stimulus";

// Connects to data-controller="search"
export default class extends Controller {
  static targets = ["query", "results"];
  static values = { enabledIndex: Number };

  connect() {
    this.queryTarget.addEventListener("keydown", (e) => {
      var currentValue = this.queryTarget.value;

      if (e.key === "Backspace") {
        currentValue = currentValue.slice(0, -1);
      } else if (e.key === "ArrowDown") {
        this.enabledIndexValue += 1;
        e.preventDefault();
        this.update();
        return;
      } else if (e.key === "ArrowUp") {
        this.enabledIndexValue -= 1;
        e.preventDefault();
        this.update();
        return;
      } else if (e.key === "Escape") {
        this.enabledIndexValue = null;
        this.queryTarget.value = "";
        currentValue = "";
        e.preventDefault();
      } else if (e.key === "Enter") {
        var links = this.resultsTarget.querySelectorAll("a");
        links[this.enabledIndexValue % links.length].click();
        e.preventDefault();
        return;
      } else {
        currentValue += e.key;
      }

      var fullUrl = this.element.action + "?q=" + currentValue;

      fetch(fullUrl, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "X-CSRF-Token": this.getMetaValue("csrf-token"),
          "X-Requested-With": "XMLHttpRequest",
          Accept: "text/html",
          "Content-Type": "text/plain",
        },
      })
        .then(function (response) {
          return response.text();
        })
        .then((html) => {
          this.resultsTarget.innerHTML = html;
          this.update();
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }

  update() {
    var links = this.resultsTarget.querySelectorAll("a");
    links.forEach((link) => {
      link.classList.remove("bg-blue-100");
    });

    if (links.length >= 0) {
      this.queryTarget.classList.remove("rounded-b-lg");
    } else {
      this.queryTarget.classList.add("rounded-b-lg");
    }

    if (this.enabledIndexValue !== null && this.enabledIndexValue >= 0) {
      links[this.enabledIndexValue % links.length].classList.add("bg-blue-100");
    }
  }

  getMetaValue(name) {
    const element = document.head.querySelector(`meta[name="${name}"]`);
    return element.getAttribute("content");
  }
}
