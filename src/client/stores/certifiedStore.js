import {emit, store} from '../framework'
import requester from "../requester";

export default store({
    certifications: [],
    submitCertificationEngaged: false,
    // async _reloadCertifications() {
    //     console.log("certification reloading inside")
    //     const {certifications} = await requester.get('/api/certifications')
    //     emit.ReceivedCertifications({certifications})
    // },
    eventListeners: {
        LoginConfirmed({ entities }) {
            const { certifications } = entities
            // console.log({certifications})
            // this.certifications = certifications
            emit.ReceivedCertifications({certifications})
        },
        ReceivedCertifications({certifications}) {
            // console.log("emit received", certifications)
            this.certifications = certifications
        },
        RouteChanged({pathname}) {
            if (pathname.includes("certification")) {
                // console.log("certification reloading certifiactions")
                this.submitCertificationEngaged = false

            }


            // if (pathname.includes("certify")) {
            //     this._reloadCertifications()
            // }
        },
        async SubmittedFMCertification({
                                           userId,
                                           work_ethic,
                                           attitude,
                                           leadership_potential,
                                           sales_skills,
                                           becoming_ec,
                                           work_days,
                                           leads_amount,
                                           culture_contribution,
                                           certify,
                                           rep_con,
                                           rep_pros,
                                       }) {
            // console.log("user store")
            const {certifications} = await requester.post('/api/certifyUser', {
                userId,
                work_ethic,
                attitude,
                leadership_potential,
                sales_skills,
                becoming_ec,
                work_days,
                leads_amount,
                culture_contribution,
                certify,
                rep_con,
                rep_pros,
            })

            await emit.UserCertifiedAlert()
            emit.ReceivedCertifications({certifications})


        },
        async UserCertifiedAlert() {
            this.submitCertificationEngaged = true
            alert("Evaluation was submitted")

        },

    }
})
