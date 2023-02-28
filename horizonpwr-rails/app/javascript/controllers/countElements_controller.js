import {Controller} from 'stimulus';

export default class extends Controller {

    connect() {
        // const element = this.element;
        // console.log("element HERE HERE ")
        let installersCheckboxes = [].slice.call(document.querySelectorAll('.installer-checkboxes'));
        let installersCheckboxesValue = installersCheckboxes.filter(chk => chk.checked).length;
        // console.log("installersCheckboxesValue ", installersCheckboxesValue)
        document.getElementById('installers-header').innerHTML = installersCheckboxesValue

        let teamsCheckboxes = [].slice.call(document.querySelectorAll('.teams-checkboxes'));
        let teamsCheckboxesValue = teamsCheckboxes.filter(chk => chk.checked).length;
        // console.log("teamsCheckboxesValue ", teamsCheckboxesValue)
        document.getElementById('teams-header').innerHTML = teamsCheckboxesValue
    }
    // async submitForm() {
    //    let installersCheckboxes = [].slice.call(document.querySelectorAll('.installer-checkboxes'));
    //    let installersCheckboxesValue = installersCheckboxes.filter(chk => chk.checked).length;
    //    console.log("installersCheckboxesValue ", installersCheckboxesValue)
    // }
}