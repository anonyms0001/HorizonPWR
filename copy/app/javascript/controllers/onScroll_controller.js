import {Controller} from 'stimulus';

export default class extends Controller {
  // static targets = ["filtersContainer", "leftButton", "rightButton"]

  // Setting controller static values
  // static values = {}

  connect() {

    const element = this.element;
    // console.log("onScroll ", element);
    let leftButton = element.previousElementSibling;
    // console.log(leftButton);
    // leftButton.classList.remove("hidden");
    element.onscroll = function () {
      // console.log('scrolling', element.scrollLeft);
      if (element.scrollLeft > 0) {
        leftButton.classList.remove("hidden");
      } else if (element.scrollLeft < 80) {
        leftButton.classList.add("hidden");
      }
    };
  }

  async scrollMove() {
    const filtersContainer = this.element;
    // var isTouchPad = e.wheelDeltaY ? e.wheelDeltaY === -3 * e.deltaY : e.deltaMode === 0
    // your code
    // document.body.textContent = isTouchPad ? "isTouchPad" : "isMouse"
    // document.addEventListener("mousewheel", handler, false);
    // document.addEventListener("DOMMouseScroll", handler, false);
    // console.log(filtersContainer);
    // filtersContainer.style.overflow = 'hidden';
    // let scrollAmount = 0;
    // let slideTimer = setInterval(function () {
    //   filtersContainer.scrollLeft += 10;
    //   scrollAmount += 10;
    //   if (scrollAmount >= 100) {
    //     window.clearInterval(slideTimer);
    //   }
    // }, 25);
  }

  // async scrollLeft() {
  //     // const rightArrow = this.element;
  //     // console.log(this.itemTarget)
  //     let leftButton = this.leftButtonTarget;
  //     let filtersContainer = this.filtersContainerTarget;
  //     let scrollAmount = 0;
  //     let slideTimer = setInterval(function () {
  //         filtersContainer.scrollLeft -= 10;
  //         scrollAmount += 10;
  //         if (scrollAmount >= 100) {
  //             window.clearInterval(slideTimer);
  //         }
  //     }, 25);
  //     // console.log(filtersContainer.scrollLeft)
  //     if(filtersContainer.scrollLeft <= 100){
  //         leftButton.classList.add("hidden");
  //     }
  // }

}