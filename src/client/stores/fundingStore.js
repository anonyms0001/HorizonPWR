import { store, emit } from '../framework'

export default store({
    financialPartnersFunding: [],
    fundingPayments: [],
    fundingBoardAlert: null,
    selectedFundingCard: [],
    proposalFundingReloading: false,
    cashExpanded: false,
    generationsExpanded: false,
    loanPalExpanded: false,
    sunlightExpanded: false,
    eventListeners: {
        LoginConfirmed({entities}) {
            const {fundingPayments, financialPartnersFunding} = entities
            // console.log("funding store ", fundingPayments)
            this.fundingPayments = fundingPayments
            this.financialPartnersFunding = financialPartnersFunding
        },
        ClickedSelectedFundingCard({ metadata }){
            this.selectedFundingCard = { metadata }
        },
        ReceivedFundingPayments({fundingPayments}){
            this.fundingPayments = setUpcomingFundingPayments
            // console.log("ReceivedProposals ", proposals)
            // alert("proposal started")
            // const proposalSet = this.proposal
            // emit.RefreshProposalBoard({proposals: proposals})
            const setUpcomingFundingPayments = this.fundingPayments = fundingPayments
            // emit.EmitProposalBoard({setUpcomingProposals})
            this.proposalFundingReloading = false
        },
        FundingReceivedAlert({alert}){
            this.fundingBoardAlert = alert
        },
        ClickedRefreshFundingBoardBtn(){
            this.proposalFundingReloading = true
        },
         ClickedExpandedBtn({financePartner, selectedState}) {
            this.cashExpanded = false
            this.generationsExpanded = false
            this.loanPalExpanded = false
            this.sunlightExpanded = false
            if (financePartner === 'sunlight') {
                this.sunlightExpanded = selectedState
            } else if (financePartner === 'cash') {
                this.cashExpanded = selectedState
            } else if (financePartner === 'generations') {
                this.generationsExpanded = selectedState
            } else if (financePartner === 'loanPal') {
                this.loanPalExpanded = selectedState
            }
        }
    }
})
