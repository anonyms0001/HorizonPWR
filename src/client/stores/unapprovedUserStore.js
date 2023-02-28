import {store} from '../framework'

export default store({

    unapprovedUsers: [],
    sortBy: 'percentComplete',
    reverseSort: false,
    unapprovedUserSearchString: '',
    selectedUnapprovedUsers: {},
    selectedUnapprovedUser: null,
    selectedOnboarderToDelete: {},
    selectedOnboarderReasonToDelete: {},
    // trashBinSelection: false,

    eventListeners: {

        LoginConfirmed({entities}) {
            const {users} = entities
            this.unapprovedUsers = users.filter(u => !u.isApproved)
        },
        ReceivedUsers({users}) {

            this.unapprovedUsers = users.filter(u => !u.isApproved)
        },
        DeletedUserMessage() {
            alert("User was deactivated")
        },
        onboardingInviteSent(){
            alert("Onboarding Invitation Sent")
        },
        SelectedUnapprovedUserSortBy({sortBy}) {
            if (sortBy === this.sortBy) {
                this.reverseSort = !this.reverseSort
            } else {
                this.reverseSort = false
            }
            this.sortBy = sortBy
        },

        ChangedUnapprovedUserSearchString({unapprovedUserSearchString}) {
            this.selectedUnapprovedUsers = {}
            this.unapprovedUserSearchString = unapprovedUserSearchString
        },
        ClickedSelectUnapprovedUserCheckbox({userId}) {
            this.selectedUnapprovedUsers[userId] = !this.selectedUnapprovedUsers[userId]
            this.selectedUnapprovedUser = userId


        },

        ClickedRowTrashCan({userToDelete, selectedOnboarderReasonToDelete}) {
            // console.log("unapproved store ", selectedOnboarderReasonToDelete)
            this.selectedOnboarderToDelete = userToDelete
            this.selectedOnboarderReasonToDelete = selectedOnboarderReasonToDelete
        },
        ClickedSelectAllUnapprovedUsersCheckbox() {
            if (this.unapprovedUsers.every(user => this.selectedUnapprovedUsers[user.userId])) {
                this.selectedUnapprovedUsers = {}
            } else {
                this.unapprovedUsers.forEach(user => {
                    this.selectedUnapprovedUsers[user.userId] = true
                })
            }
        },
    }
})
