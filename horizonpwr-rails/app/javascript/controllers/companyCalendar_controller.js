import { Controller} from "stimulus"
import { Calendar } from '@fullcalendar/core'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Rails from '@rails/ujs'

export default class extends Controller {
  static targets = ["calendar", "modal", "start_time", "end_time"]
  static values = { appointments: Array }
  connect() {
    // console.log("HEY ", fetch(this.appointmentsValue) )
    let _this = this
    let calendar = new Calendar(this.calendarTarget, {
      events: this.appointmentsValue,
      editable: false,
      navLinks: true,
      eventLimit:true,
      views: { timeGrid: {eventLimit: 4} },
      headerToolbar: { center: 'dayGridMonth,timeGridWeek,timeGridDay' },
      plugins: [dayGridPlugin,timeGridPlugin,interactionPlugin],
      // navLinkDayClick: function(date, jsEvent) {
      //   _this.modalTarget.style.display = "block"
      //   _this.start_timeTarget.value = date
      //   _this.end_timeTarget.value = date
      // },
      eventClick: function (info) {
        let dayElements = []
        dayElements = [].slice.call(document.getElementsByClassName("fc-event"));
        // console.log("DAY ELEMENTS HERE ", day_elements)
        dayElements.map((day) => {
          day.style.background = "#ffffff";
        })
        info.el.style.background = "rgb(253 218 171)";
        const nameEl = document.getElementById('appointment_name');
        const start_el = document.getElementById('appointment_start');
        const end_el = document.getElementById('appointment_end');
        const ec_el = document.getElementById('appointment_ec');
        const fm_el = document.getElementById('appointment_fm');
        const team_el = document.getElementById('appointment_team');
        const type_el = document.getElementById('appointment_type')
        const link_el = document.getElementById('appointment_link')

        // window.location.search = "aptId=" + info.event.id;
        Rails.ajax({
          type: "GET",
          dataType: "json",
          url: "/appointments/" + info.event.id + "/selected_appointment?id=" + info.event.id,
          // url: "/appointments/" + info.event.id + "/selected_appointment",

          // data: {id: info.event.id},
          success: function(data) {
            // console.log("SUCCESS ", data);
              nameEl.innerText = data.contact ? data.contact.first_name + " " +  data.contact.last_name : 'Unknown'
              start_el.innerText = data.appointment_start
              end_el.innerText = data.appointment_end
              type_el.innerText = data.appointment_type
              ec_el.innerText = data.energy_consultant ? data.energy_consultant.first_name + " " + data.energy_consultant.last_name : 'Unknown'
              fm_el.innerText = data.field_marketer ? data.field_marketer.first_name + " " + data.field_marketer.last_name : 'Unknown'
              fm_el.innerText = data.team.name
              link_el.innerText = '/appointments/' + data.appointment_id
              link_el.href = '/appointments/' + data.appointment_id
          },
          error: function(data) {  console.log("ERROR ", data) }
        })
        // console.log("INFO HERE ", info.event)
        // const eventBox = document.getElementById("event-details-container");
        // console.log(eventBox.getBoundingClientRect());
        // const element_position_details = eventBox.getBoundingClientRect();
        // console.log(element_position_details.top);
        // eventBox.style.position = "absolute";
        // eventBox.style.top = element_position_details.top + "px";

        // const placeholder = document.getElementById("event-content");
        // console.log(eventBox.getBoundingClientRect());
        // const element_position_details = eventBox.getBoundingClientRect();
        // console.log(element_position_details.top);
        // eventBox.style.position = "absolute";
        // eventBox.style.top = element_position_details.top + "px";
        // placeholder.innerText = info.event.id


        // eventBox.css()
        // let newEl = document.createElement('div');
        // newEl.className = "event-list";
        // newEl.innerHTML = info.event.id;
        // info.el.appendChild(newEl);
        // info.jsEvent.preventDefault()
        // alert('Event: ' + info.el, info.event);
        // console.log("HERE INFO ", info)
        // window.location.href = '/appointments/' + info.event.id
        // tippy(info.el, {
        //   content: info.event.id
        //   // content: info.event.extendedProps.name,
        //   // placement: "top-start",
        //   // arrow: false,
        //   // The prompt does not disappear when the mouse is placed in the prompt
        //   // interactive: true,
        // });

        // Turbolinks.visit(info.event.extendedProps.show_url)
      },
      // eventRender: function(event, element) {
      //   // this.tippy = tippy(element);
      //   element.tippy({
      //     // animation: true,
      //     // delay: 300,
      //     content: '<b>Inicio</b>:' + event.start + "<b>Fin</b>:" + event.end,
      //     // trigger: 'hover'
      //   });
      //
      // }
      // eventDidMount: function(info) {
      //   console.log("HERE ", info.el)
      //   tippy(info.el, {
      //     content: info.event.id,
      //     // placement: 'top',
      //     trigger: 'hover',
      //     // container: 'body'
      //   });
      // },

      // eventMouseEnter:function (info) {
      //   tippy(info.el, {
      //     content: "ksljd"
      //     // content: info.event.extendedProps.name,
      //     // placement: "top-start",
      //     // arrow: false,
      //     // The prompt does not disappear when the mouse is placed in the prompt
      //     // interactive: true,
      //   });
      // }
        //   eventDrop: function (info) {
    //     let data = _this.data(info)
    //     Rails.ajax({
    //       type: 'PUT',
    //       url: info.event.url,
    //       data: new URLSearchParams(data).toString()
    //     })
    //   },
    //   eventResize: function (info) {
    //     let data = _this.data(info)
    //     Rails.ajax({
    //       type: 'PUT',
    //       url: info.event.url,
    //       data: new URLSearchParams(data).toString()
    //     })
    //   },
    })
    calendar.render()
  }
  //
  // data(info) {
  //   return {
  //     "appointment_event[start_time]": info.event.start,
  //     "appointment_event[end_time]": info.event.end,
  //   }
  // }
}