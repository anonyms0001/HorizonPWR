import {Controller} from 'stimulus';

export default class extends Controller {
  static targets = ["filtersContainer", "leftButton", "rightButton"]

  // Setting controller static values
  // static values = {}

  // connect() {
  //     const element = this.element;
  //     console.log("onclick ")
  // }
  async scrollLeft() {
    // const rightArrow = this.element;
    // console.log(this.itemTarget)
    let leftButton = this.leftButtonTarget;
    let filtersContainer = this.filtersContainerTarget;
    let scrollAmount = 0;
    let slideTimer = setInterval(function () {
      filtersContainer.scrollLeft -= 10;
      scrollAmount += 10;
      if (scrollAmount >= 100) {
        window.clearInterval(slideTimer);
      }
    }, 25);
    console.log(filtersContainer.scrollLeft)
    if(filtersContainer.scrollLeft <= 100){
      leftButton.classList.add("hidden");
    }
  }

  async scrollRight() {
    // const leftArrow = this.element;
    // console.log(this.itemTarget)
    let leftButton = this.leftButtonTarget;
    let filtersContainer = this.filtersContainerTarget;
    // console.log(filtersContainer.width);
    let scrollAmount = 0;
    let slideTimer = setInterval(function () {
      filtersContainer.scrollLeft += 10;
      scrollAmount += 10;
      if (scrollAmount >= 100) {
        window.clearInterval(slideTimer);
      }
    }, 25);
    leftButton.classList.remove("hidden");
    // console.log("width offset ", filtersContainer.scrollLeft, " vs ", filtersContainer.clientWidth)

  }

}