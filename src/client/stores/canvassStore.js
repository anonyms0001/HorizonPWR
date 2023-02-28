import { store } from '../framework'

export default store({
    appointments: [],
    eventListeners: {
        LoginConfirmed({ entities }) {
            const { canvassAppointments } = entities
            this.appointments = canvassAppointments
        }
    }
})
