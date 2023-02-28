import { store, emit } from '../framework'

export default store({
    proposals: [],
    alert: null,
    selectedCard: [],
    proposalReloading: false,
    wizardStep: 1,
    // upcommingAppointments: [],
    // data: [{lanes: [{id: 'new', title: 'New', style: {width: 280}, cards: []},{id: 'progress', title: 'Progress', style: {width: 280}, cards: []},{id: 'qc', title: 'QC', style: {width: 280}, cards: []},{id: 'needs', title: 'Needs Usage', style: {width: 280}, cards: []}]}],
    // data: [{lanes: []}],
    eventListeners: {
        LoginConfirmed({ entities }) {
            const { proposals } = entities
            this.proposals = proposals
            // emit.processUpcomingAppointments(proposals)
        },
        async RouteChanged({pathname}) {

            if (pathname === '/proposalBoard') {
                console.log("RouteChanged proposal store HERE ", pathname)
                document.body.style.overflow = "hidden"
            }else{
                document.body.style.overflow = "auto"
            }
        },
        EmitProposalBoard({setUpcomingProposals}){
            // console.log("RefreshProposalBoard ", setUpcomingProposals)
            this.proposals = setUpcomingProposals
        },
        ReceivedProposals({proposals}){
            this.proposals = setUpcomingProposals
            // console.log("ReceivedProposals ", proposals)
            // alert("proposal started")
            // const proposalSet = this.proposal
            // emit.RefreshProposalBoard({proposals: proposals})
            const setUpcomingProposals = this.proposals = proposals
            emit.EmitProposalBoard({setUpcomingProposals})
            this.proposalReloading = false
        },
        ReceivedAlert({leadId, alert}){
            this.alert = alert
        },
        ProposalReceivedAlert({alert}){
            console.log( "ProposalReceivedAlert ", alert)
            this.alert = alert
        },
        ClickedSelectedCard({ metadata }){
            this.selectedCard = { metadata }
        },
        ClickedRefreshBoard(){
            this.proposalReloading = true
        },
        UpdateWizardStep(step) {
            // console.log("UpdateWizardStep ", step)
            this.wizardStep = step 
        }

        // processUpcomingAppointments(proposals){
        //     // console.log()
        //     for(let i = 0; i < proposals.length; i++){
        //         if(proposals[i].Need_Usage__c === 1){
        //             // this.data.lanes[] = id: 'needs', title: 'Needs Usage', style: {width: 280}, cards: []
        //             // this.data.lanes[].{id: 'needs', title: 'Needs Usage', style: {width: 280}, cards: []}
        //
        //
        //         }
        //     }
        // }
    }
})
