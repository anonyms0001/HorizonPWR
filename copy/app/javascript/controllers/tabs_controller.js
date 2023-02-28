import {Controller} from 'stimulus'

export default class extends Controller {
  static targets = ['tab', 'panel']

  connect() {
    this.activeTabClasses = (this.data.get('activeTab') || 'active').split(' ')
    this.inactiveTabClasses = (this.data.get('inactiveTab') || 'inactive').split(' ')
    if (this.anchor) {
      this.index = this.tabTargets.findIndex((tab) => tab.dataset.param === this.anchor)
    }
    this.showTab()
  }

  change(event) {
    event.preventDefault()

    // If target specifies an index, use that
    if (event.currentTarget.dataset.index) {
      this.index = event.currentTarget.dataset.index

      // If target specifies an id, use that
    } else if (event.currentTarget.dataset.id) {
      this.index = this.tabTargets.findIndex((tab) => tab.id == event.currentTarget.dataset.id)

      // Otherwise, use the index of the current target
    } else {
      this.index = this.tabTargets.indexOf(event.currentTarget)
    }

    window.dispatchEvent(new CustomEvent('tsc:tab-change'))
  }

  showTab() {
    this.tabTargets.forEach((tab, index) => {
      // console.log("HERE ", tab.getAttribute('data-param'))
      const panel = this.panelTargets[index]

      if (index === this.index) {
        panel.classList.remove('hidden')
        tab.classList.remove(...this.inactiveTabClasses)
        tab.classList.add(...this.activeTabClasses)
        let tabParam = tab.getAttribute('data-param')
        let querystring = "tab=" + tabParam

        // Update URL with the tab ID if it has one
        // This will be automatically selected on page load
        if (querystring) {

          window.history.replaceState(null, null, "?" + querystring);
        }
      } else {
        panel.classList.add('hidden')
        tab.classList.remove(...this.activeTabClasses)
        tab.classList.add(...this.inactiveTabClasses)
      }
    })
  }

  get index() {
    return parseInt(this.data.get('index') || 0)
  }

  set index(value) {
    this.data.set('index', (value >= 0 ? value : 0))
    this.showTab()
  }

  get anchor() {
    const urlParams = new URLSearchParams(window.location.search);
    const myParam = urlParams.get('tab');
    console.log("myParam")
    console.log(myParam)
    return (myParam ? myParam : null)
  }
}