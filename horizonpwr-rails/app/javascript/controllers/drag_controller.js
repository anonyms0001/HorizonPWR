import {Controller} from "stimulus"
import Sortable from "sortablejs"

export default class extends Controller {


  connect() {
    this.sortable = Sortable.create(this.element, {
      group: 'shared',
      animation: 150,
      onUpdate: this.update.bind(this),
      // onEnd: this.end.bind(this)
    })
  }

  // updates the position in the view
  update(event) {
    let positions = [];
    [].forEach.call(event.from.getElementsByClassName('moving-boxes'), function (el, index) {
      // console.log("here id ", el.getAttribute('data-id'));
      el.setAttribute("data-position", index + 1);
      el.querySelector("div p a span.position-number").innerHTML = index + 1;
      positions.push({field_config: {id: el.getAttribute('data-id'), position: index + 1}})
    })

    // console.log("positions HERE ", positions)
    if (positions.length > 0) {
      positions.map(function (position) {
        // console.log(position.field_config)
        Rails.ajax({
          url: ("/field_configs/" + position.field_config.id),
          type: 'PATCH',
          beforeSend(xhr, options) {
            xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8')
            // Workaround: add options.data late to avoid Content-Type header to already being set in stone
            // https://github.com/rails/rails/blob/master/actionview/app/assets/javascripts/rails-ujs/utils/ajax.coffee#L53
            options.data = JSON.stringify(position.field_config)
            return true
          },
        })
      });

    }
  }
}
