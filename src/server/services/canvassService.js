const dbService = require('./dbService')

async function getCanvassAppointments() {
    const appointmentsOnly = await dbService.query('SELECT appointment_data FROM canvass_appointment WHERE title IS NULL')
    // console.log("appointmentsOnly ", appointmentsOnly)
    // console.log("appointmentsOnly ", appointmentsOnly.length)
    if (appointmentsOnly.length > 0) {
    // //     console.log("appointmentsOnly ", appointmentsOnly[0].length)
        for (let i = 0; i < appointmentsOnly.length; i++) {
            let parsedAppointment = JSON.parse(appointmentsOnly[i].appointment_data)
            let id = parsedAppointment.appointment.id
            let title =  parsedAppointment.appointment.title
            //look local appointment id if title is null
             // console.log("parsedAppointment ", parsedAppointment)
            // console.log("id and title ", id, title)
            await dbService.query('UPDATE canvass_appointment SET title = ? WHERE appointment_id = ?', [title, id])

        }
    }
    // console.log("get teams start")
    const canvassAppointments = await dbService.query('SELECT canvass_appointment.appointment_id, canvass_appointment.appointment_data, canvass_appointment.title, _lead.Name, _lead.Appointment_Date__c FROM canvass_appointment LEFT JOIN _lead ON canvass_appointment.title = _lead.Name')
    // console.log("team const ", teams)
    return canvassAppointments
}

async function saveAppointment({data}) {
    // let objectAppointment = JSON.parse(cavassApointment)

    if (data.action === 'create' && data.type === 'appointment') {
        console.log("saveAppointment ", data.data.appointment.id)
        let id = data.data.appointment.id
        let title = data.data.appointment.title
        if(id){
            await dbService.query('INSERT IGNORE INTO canvass_appointment  (appointment_id, appointment_data, title) VALUES(?, ?, ?)', [id, JSON.stringify(data.data), title])
        }
    }
}
async function saveAppointmentInteraction({data}) {
    // let objectAppointment = JSON.parse(cavassApointment)
    // console.log(data)
    if ( data.data.interaction.type_id === 4 ) {
        // console.log("saveAppointment ", data.data.appointment.id)
        let id = data.data.interaction.id
        let title = data.data.customer.first_name + " " + data.data.customer.last_name
        if(id){
            await dbService.query('INSERT IGNORE INTO canvass_appointment  (appointment_id, appointment_data, title) VALUES(?, ?, ?)', [id, JSON.stringify(data.data), title])
        }
    }
}

module.exports = {
    saveAppointmentInteraction,
	 getCanvassAppointments,
    saveAppointment
}
