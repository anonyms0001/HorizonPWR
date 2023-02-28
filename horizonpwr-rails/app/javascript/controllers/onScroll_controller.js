import {Controller} from 'stimulus';

export default class extends Controller {
  // static targets = ["filtersContainer", "leftButton", "rightButton"]

  // Setting controller static values
  // static values = {}

  connect() {

    const element = this.element;
    // console.log("onScroll ", element);
    let leftButton = element.previousElementSibling;
    let rightButton = element.nextElementSibling;
    let maxValue = element.scrollWidth - element.clientWidth - 10
    // console.log("maxValue ", maxValue)
    // console.log(leftButton);
    // leftButton.classList.remove("hidden");
    if (maxValue < 0) {
      rightButton.classList.add("hidden");
    }
    element.onscroll = function () {
      // console.log('scrolling', element.scrollLeft);
      if (maxValue > 0) {
        if (element.scrollLeft > 0) {
          leftButton.classList.remove("hidden");
        } else if (element.scrollLeft < 80) {
          leftButton.classList.add("hidden");
        }
        if (element.scrollLeft > maxValue) {
          rightButton.classList.add("hidden");
        } else if (element.scrollLeft < maxValue) {
          rightButton.classList.remove("hidden");
        }
      }


    };
  }


}