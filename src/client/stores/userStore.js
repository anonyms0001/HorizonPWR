import { store, emit } from '../framework'
import requester from '../requester'

export default store({

    users: [],
    addUserRedirectInitiated: false,
    addUserRedirectEngaged: false,
    sortBy: null,
    reverseSort: false,
    userSearchString: '',
    selectedUsers: {},
    selectedUser: null,
    selectedUserToDelete: null,
    selectedToDelete: {},
    selectedReasonToDelete: {},
    agreementProcessing: {},

    async _reloadUsers() {
        const { users } = await requester.get('/api/users')
        emit.ReceivedUsers({ users })
    },

    eventListeners: {
        LoginConfirmed({ entities }) {
            const { users } = entities
            this.users = users
        },
        ReceivedUsers({ users }) {
            this.users = users
            if (this.addUserRedirectInitiated) {
                this.addUserRedirectEngaged = true
            }
            this.addUserRedirectInitiated = false
        },
        RouteChanged({ pathname }) {
            if ( pathname === '/repsLaderboard') {
                this.addUserRedirectEngaged = false
                // this._reloadUsers()
            }else if(pathname === '/home'){
                this.addUserRedirectEngaged = false
            }
        },
        async ClickedAddNewUser({
            email,
            // personalEmail,
            // companyEmail,
            roleId,
            firstName,
            lastName,
            phoneNumber,
            teamId,
            startDate,
            password,
            verifyPassword,
        }) {
            if (password === verifyPassword) {
                this.addUserRedirectInitiated = true
                const { users } = await requester.post('/api/createUser', {
                    email,
                    // personalEmail,
                    // companyEmail,
                    roleId,
                    firstName,
                    lastName,
                    phoneNumber,
                    teamId,
                    startDate,
                    password,
                })
                alert("New Team Member was successfully added")
                emit.ReceivedUsers({ users })

                // window.location.href = '/repsLaderboard'
                // window.location.assign("/repsLaderboard")
            }
            else {
                throw new Error('Passwords do not match')
            }
        },
        async ClickedConfirmChangePassword({ userId, password, verifyPassword }) {
            if (password === verifyPassword) {             
                emit.ChangePassword({ userId, password })
            }else{
                alert("Passwords aren't matching, try again")
            }
        },
        SelectedUserSortBy({ sortBy }) {
            if (sortBy === this.sortBy) {
                this.reverseSort = !this.reverseSort
            }
            else {
                this.reverseSort = false
            }
            this.sortBy = sortBy
        },
          async SubmittedUserEdit({
                                    userId,
                                    email,
                                     personalEmail,
                                    roleId,
                                    teamId,
                                    firstName,
                                    lastName,
                                    phoneNumber,
                                    startDate,
                                }) {
            const {users} = await requester.post('/api/editUser', {
                userId,
                email,
                 personalEmail,
                roleId,
                teamId,
                firstName,
                lastName,
                phoneNumber,
                startDate,
            })
            emit.UserUpdatedAlert()
            emit.ReceivedUsers({users})
        },
      
       
        async UserUpdatedAlert() {
            alert("Profile was succesfully updated")
        },
         async ActivateOnboarder({onboarderEmail}) {
            // alert(onboarderEmail)
            emit.ActivateAccount({onboarderEmail})

        },
        async OnboarderActivated() {
            alert("Onboarder account was activated successfully")
             window.location.reload()
        },
        async UploadedImageFile({ userId, file }) {
            let formData = new FormData()
            formData.append('file', file)
            const { users } = await requester.post(`/api/uploadProfileImage/${userId}`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            })
            emit.ReceivedUsers({ users })
        },
        async ClickedResetPassword({ userId }) {
            await requester.post('/api/resetPassword', { userId })
            alert('Password reset completed')
        },
        async ClickedTestEmail({ userId }) {
            // alert("userStore accessed")
            emit.TestEmail({ userId })
        },
        ChangedUserSearchString({ userSearchString }) {
            this.selectedUsers = {}
            this.userSearchString = userSearchString
        },
        ClickedSelectUserCheckbox({ userId }) {
            this.selectedUsers[userId] = !this.selectedUsers[userId]
             this.selectedUser = userId
        },
          ClickedRowTrashBin({userToDelete, selectedReasonToDelete}){
            console.log("user store ", selectedReasonToDelete, userToDelete)
            this.selectedUserToDelete = userToDelete
            this.selectedReasonToDelete = selectedReasonToDelete
        },
          AwaitingForNewAgreement({userId}){
            // console.log("inside AwaitingForNewAgreement ", userId)
            this.agreementProcessing[userId] = !this.agreementProcessing[userId]
            // console.log(this.agreementProcessing)
        },
        ClickedSelectAllUsersCheckbox() {
            if (this.users.every(user => this.selectedUsers[user.userId])) {
                this.selectedUsers = {}
            }
            else {
                this.users.forEach(user => {
                    this.selectedUsers[user.userId] = true
                })
            }
        },
    }
})
