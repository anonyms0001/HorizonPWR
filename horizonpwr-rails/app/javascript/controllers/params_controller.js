import {Controller} from 'stimulus';

export default class extends Controller {
  static targets = []

  connect() {
    let existingParams = window.location.search.replace(/\?/g, '');
    sessionStorage.setItem('FilterString', `${existingParams}`)
  }

  async add() {
    let selectEl = document.getElementById('view_as')
    let url = new URL(window.location.href)
    url.searchParams.set('view_as_user', selectEl.value);
    window.location.search = url.search;
  }

  async toggleApptType() {
    const element = this.element;
    let paramToToggle = element.getElementsByTagName("input")[1].id;
    let url = new URL(window.location.href)

    if (url.searchParams.getAll("appointment_type").includes(paramToToggle)) {  // Param is already in URL
      let params = new URLSearchParams(url.search.slice(1)).toString();
      let newParams = params.replace(`appointment_type=${paramToToggle.replace(/\s/g, '+')}`, '')
      if (newParams === "") { // If all params have been removed…
        window.location.href = window.location.href.replace(/\?/g, '');
      } else {
        window.location.search = newParams;
      }
    } else { // Param does not exist in URL
      url.searchParams.append('appointment_type', paramToToggle);
      window.location.search = url.search;
    }
  }

  async toggleApptSubtype() {
    const element = this.element;
    let paramToToggle = element.getElementsByTagName("input")[1].id;
    let url = new URL(window.location.href)

    if (url.searchParams.getAll("appointment_subtype").includes(paramToToggle)) {  // Param is already in URL
      let params = new URLSearchParams(url.search.slice(1)).toString();
      let newParams = params.replace(`appointment_subtype=${paramToToggle.replace(/\s/g, '+')}`, '')
      // let newParams = params.replace(`appointment_type=${paramToToggle.gsub('+', ' ')}`, '') # NOTE: This gsub might be better than the replace, above, but we haven't seen any issues, yet.
      if (newParams === "") { // If all params have been removed…
        // Remove the question mark from the end of the URL
        // TODO: This is being used in multiple places on this page. Perhaps it should be done in the connect method?
        window.location.href = window.location.href.replace(/\?.*/g, '');
      } else {
        window.location.search = newParams;
      }
    } else { // Param does not exist in URL
      url.searchParams.append('appointment_subtype', paramToToggle);
      window.location.search = url.search;
    }
  }

  async toggleInstallerId() {
    const element = this.element;
    let paramToToggle = element.getElementsByTagName("input")[1].id;
    let url = new URL(window.location.href)

    if (url.searchParams.getAll("installer_id").includes(paramToToggle)) {  // Param is already in URL
      // Returns the entire string of parameters, without the question mark (?)
      let params = new URLSearchParams(url.search.slice(1)).toString();
      params = params.split('&')

      for (let i = 0; i < params.length; i++) {
        if (params[i] == `installer_id=${paramToToggle}`) {
          params.splice(i, 1);
        }
      }

      if (!params || !params.length) { // If all params have been removed…
        // Remove the question mark from the end of the URL
        window.location.href = window.location.href.replace(/\?.*/g, '');
      } else {
        window.location.search = params;
      }
    } else { // Param does not exist in URL
      url.searchParams.append('installer_id', paramToToggle);
      window.location.search = url.search;
    }
  }

  async toggleAccountId() {
    const element = this.element;
    let paramToToggle = element.getElementsByTagName("input")[1].id;
    let url = new URL(window.location.href)

    if (url.searchParams.getAll("account_id").includes(paramToToggle)) {
      let params = new URLSearchParams(url.search.slice(1)).toString();
      params = params.split('&')

      for (let i = 0; i < params.length; i++) {
        if (params[i] == `account_id=${paramToToggle}`) {
          params.splice(i, 1);
        }
      }

      if (!params || !params.length) { // If all params have been removed…
        // Remove the question mark from the end of the URL
        window.location.href = window.location.href.replace(/\?.*/g, '');
      } else {
        window.location.search = params;
      }
    } else { // Param does not exist in URL
      url.searchParams.append('account_id', paramToToggle);
      window.location.search = url.search;
    }
  }

  async toggleFilter() {
    const element = this.element;
    let paramToToggle = element.getElementsByTagName("input")[1].name;
    let valueToToggle = element.getElementsByTagName("input")[1].id;
    let url = new URL(window.location.href);
    let existingParams = url.search.split('&');
    let filterString = sessionStorage.getItem("FilterString");
    if (filterString == null) {
      filterString = ''
    }
    let paramString = `${paramToToggle}=${valueToToggle.replace(/\s/g, '+')}`;
    let arrayOfParams = filterString.split('&');
    arrayOfParams = arrayOfParams.filter(Boolean);

    if (arrayOfParams.includes(paramString) || existingParams.includes(paramString)) {
      let filteredArray = arrayOfParams.filter(function(e) { return e !== paramString })
      sessionStorage.setItem("FilterString", filteredArray.join("&"));
    } else {
      sessionStorage.setItem('FilterString', `${filterString}&${paramString}`)
    }
  }

  async submitFilters() {
    let url = new URL(window.location.href.split("?")[0]);
    let filterString = sessionStorage.getItem("FilterString")
    if (filterString == null) {
      window.location.href = (window.location.origin + window.location.pathname)
    } else {
      let newParams = filterString
      sessionStorage.removeItem('FilterString');
      window.location.href = url + "?" + newParams;
    }

    // TODO: Still need to make sure this doesn't happen:
    // http://localhost:3000/calendars?
  }

  async clearFilters() {
    sessionStorage.removeItem('FilterString');
  }
}
