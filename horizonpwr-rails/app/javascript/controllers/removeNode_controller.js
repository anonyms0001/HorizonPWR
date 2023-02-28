import {Controller} from 'stimulus';

export default class extends Controller {
  // static targets = ["CanvasTarget" ]

  // Setting controller static values
  // static values = {}

  // connect() {
  //   const element = this.element;
  //   console.log("remove Node ", element)
  // }

  async removeOption() {
    const clickedElement = this.element;
    clickedElement.remove();
    // let grandPaElement = clickedElement.parentNode;
    // console.log("clickedElement ", clickedElement)
    // console.log("grandPaElement ", grandPaElement)
  }

}