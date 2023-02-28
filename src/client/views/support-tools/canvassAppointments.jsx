import {view, emit} from '../../framework'
import canvassStore from "../../stores/canvassStore";

export default view(function CanvassAppointments() {

    const {appointments} = canvassStore
    // console.log("appointments ", appointments) 
    let now = new Date()
    let nowString = now.toISOString()
    let nowDateOnly = nowString.split('T')
    let todayUTCStart = nowDateOnly[0] + 'T00:00:00.000Z'
    let todayUTCValidDate = nowDateOnly[0] + 'T01:00:00.000Z'
    let todayUTCEnd = nowDateOnly[0] + 'T00:00:00.000Z'

    // console.log("canvass appointments ", appointments[0].Id)
    // let appointmentData = JSON.parse(appointments[0].appointment)
    // console.log("canvass appointments ", appointmentData)
    return (
        <section className="pwrstation-view-profile">

            <div id="resultbox"/>

            <div className="row">
                <div className="clear20"/>
                <table className="table table-bordered table-striped">
                    <thead>
                    <tr>
                        <th>Canvass Appointment Date/Time</th>
                        <th>Canvass Name</th>
                        
                        <th>SF Opportunity</th>
                        <th>SF Appointment Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        appointments ?
                            appointments.map((appointment) => {
                                let appointmentData = JSON.parse(appointment.appointment_data)
                              let dateToUse = !appointmentData.appointment && appointment.Appointment_Date__c === null ?  todayUTCValidDate : appointmentData.appointment ? appointmentData.appointment.start : appointment.Appointment_Date__c
                                // let dateToUse = appointmentData.appointment.start === null ? appointment.Appointment_Date__c : appointmentData.appointment.Appointment_Date__c === null ? todayUTCValidDate : todayUTCValidDate
                                console.log("dateToUse ", dateToUse, appointment.title)
                                if (dateToUse > todayUTCStart) {
                                return (
                                    <tr id={appointment.appointment_id}>
                                        <th>{appointmentData.appointment ? appointmentData.appointment.start : '' }</th>
                                        <th>{appointment.title }</th>

                                        <th>{
                                            appointment.Name !== null ?
                                                <span className="glyphicon glyphicon-check"/>
                                                :
                                                <span className="glyphicon glyphicon-warning-sign"/>
                                        }
                                        </th>
                                        <th>{appointment.Appointment_Date__c}</th>
                                    </tr>
                                    // {
                                    //     appointmentData ?
                                    //         appointmentData.map((canvassItem, key) => {
                                    //             console.log("appointmentData appointment ", canvassItem)
                                    //             // return (
                                    //                 // <tr id={canvassItem.appointment.Id}>
                                    //                 //     <th>{canvassItem.appointment.start}</th>
                                    //                 //     <th>{canvassItem.appointment.title}</th>
                                    //                 //     <th />
                                    //                 //     <th />
                                    //                 // </tr>
                                    //             // )
                                    //         })
                                    //         : null
                                    // }

                                )
                            }
                            })
                            : null
                    }
                    </tbody>
                </table>
                <div className="clear20"/>
            </div>

            <div className="clear30"/>
        </section>


    )
})



