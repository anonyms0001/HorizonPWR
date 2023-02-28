import {Controller} from 'stimulus'

export default class extends Controller {
  static targets = ['tab', 'panel']

  connect() {
    this.activeTabClasses = (this.data.get('activeTab') || 'active').split(' ')
    this.inactiveTabClasses = (this.data.get('inactiveTab') || 'inactive').split(' ')
    if (this.anchor) {
      this.index = this.tabTargets.findIndex((tab) => tab.dataset.param === this.anchor)
    }
    let changing = false
    this.showTab(changing)

  }

  change(event) {
    event.preventDefault()
    let querystring = ''
    let hash = ''
    if (this.anchor) {
      this.index = this.tabTargets.findIndex((tab) => tab.getAttribute('data-title') === event.currentTarget.dataset.title)
    } else {
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
    }
  }

  showTab(changing) {
    if (changing && !this.anchor) {
      this.tabTargets.map((tab, index) => {
        const panel = this.panelTargets[index]
        if (index === this.index) {
          let hash = tab.getAttribute('data-title')
          panel.classList.remove('hidden')
          tab.classList.remove(...this.inactiveTabClasses)
          tab.classList.add(...this.activeTabClasses)
          location.hash = hash
        } else {
          panel.classList.add('hidden')
          tab.classList.remove(...this.activeTabClasses)
          tab.classList.add(...this.inactiveTabClasses)
        }
      })

    } else if (changing && this.anchor) {
      this.tabTargets.map((tab, index) => {
        const panel = this.panelTargets[index]
        if (index === this.index) {
          panel.classList.remove('hidden')
          tab.classList.remove(...this.inactiveTabClasses)
          tab.classList.add(...this.activeTabClasses)
          let hash = tab.getAttribute('data-title')
          location.hash = hash
        } else {
          panel.classList.add('hidden')
          tab.classList.remove(...this.activeTabClasses)
          tab.classList.add(...this.inactiveTabClasses)
        }
      })
    } else {
      this.tabTargets.map((tab, index) => {
        const panel = this.panelTargets[index]
        if (index === this.index) {
          panel.classList.remove('hidden')
          tab.classList.remove(...this.inactiveTabClasses)
          tab.classList.add(...this.activeTabClasses)
        } else {
          panel.classList.add('hidden')
          tab.classList.remove(...this.activeTabClasses)
          tab.classList.add(...this.inactiveTabClasses)
        }
      })
    }
  }

  get index() {
    return parseInt(this.data.get('index') || 0)
  }

  set index(value) {
    this.data.set('index', (value >= 0 ? value : 0))
    let changing = true
    this.showTab(changing)
  }

  get anchor() {
    return (document.URL.split('#').length > 1) ? document.URL.split('#')[1] : null;
  }
}

