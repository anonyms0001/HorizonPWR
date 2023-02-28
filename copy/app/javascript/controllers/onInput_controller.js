import {Controller} from 'stimulus';

export default class extends Controller {
  // static targets = ["CanvasTarget" ]

  // Setting controller static values
  // static values = {}

  connect() {
    const element = this.element;
  }

  async checkValue() {
    let fieldTypeValue = document.getElementById('field_type').value;
    console.log("fieldTypeValue ", fieldTypeValue)
    let optionsWrapperElement = document.getElementById('options-input-wrapper');
    let optionsAddLink = document.getElementById('add-option-link');
    let optionsWrapperElementFirstChild = optionsWrapperElement.firstElementChild;
    console.log("optionsWrapperElementFirstChild ", optionsWrapperElementFirstChild)
    if (fieldTypeValue === 'select') {
      optionsWrapperElement.classList.remove('hidden');
      optionsWrapperElementFirstChild.classList.remove('hidden');
      optionsAddLink.classList.remove('hidden');
    } else {
      optionsWrapperElement.classList.add('hidden');
      optionsWrapperElementFirstChild.classList.add('hidden');
      optionsAddLink.classList.add('hidden');
    }

  }
}