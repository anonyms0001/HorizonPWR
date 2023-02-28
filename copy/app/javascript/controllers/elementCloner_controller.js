import {Controller} from 'stimulus';

export default class extends Controller {
  static targets = ["originalNode"]

  // Setting controller static values
  // static values = {}

  connect() {
    const element = this.element;
    console.log("TESTING ", element)
  }

  async cloneFirstChild() {
    let parentElement = document.getElementById("options-input-wrapper");
    let firstChildElement = parentElement.firstElementChild;
    let lastChildElement = parentElement.lastElementChild;
    let newSiblingWrapper = document.createElement('div');
    let newSibling = firstChildElement.cloneNode(true);
    newSiblingWrapper.appendChild(newSibling);
    parentElement.insertBefore(newSiblingWrapper, lastChildElement);
  }

  async cloneTargetedElement() {
    const targetElement = this.originalNodeTarget
    // console.log('targetElement ', targetElement)
    let parentElement = targetElement.parentNode;
    let lastChildElement = parentElement.lastElementChild;
    let newSiblingWrapper = document.createElement('div');
    let newSibling = targetElement.cloneNode(true);
    newSibling.classList.remove("hidden");
    newSibling.children[1].firstChild.nextSibling.value = "";
    let buttonElement = newSibling.children[1].firstChild.nextSibling.nextSibling.nextSibling
    buttonElement.classList.remove("pointer-events-none")
    buttonElement.classList.remove("opacity-20")
    newSiblingWrapper.appendChild(newSibling);
    parentElement.insertBefore(newSiblingWrapper, lastChildElement)
  }

}