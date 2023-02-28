import { store, emit } from '../framework'
import requester from '../requester'

export default store({

    teams: [],
    addTeamModalVisible: false,
    editTeamsModalVisible: false,

    eventListeners: {
        LoginConfirmed({ entities }) {
            const { teams } = entities
            this.teams = teams
        },
        ReceivedTeams({ teams }) {
            this.teams = teams
        },
        ClickedCreateNewTeam() {
            this.editTeamsModalVisible = false
            this.addTeamModalVisible = true
        },
        ClickedCancelNewTeam() {
            this.addTeamModalVisible = false
        },
        async ClickedConfirmCreateTeam({ newTeamName }) {
            this.addTeamModalVisible = false
            const { teams } = await requester.post('/api/createTeam', { newTeamName })
            emit.ReceivedTeams({ teams })
        },
        ClickedEditTeams() {
            this.addTeamModalVisible = false
            this.editTeamsModalVisible = true
        },
        ClickedCancelEditTeams() {
            this.editTeamsModalVisible = false
        },
        async ClickedConfirmEditTeam({ team }) {
            emit.EditTeam({ team })
        },
        TeamNameChanged({ team }) {
            const index = this.teams.findIndex(element => element.teamId === team.teamId)
            this.teams[index].teamName = team.teamName
            console.log(team.teamName)
        },
        async ClickedDeleteTeam({ team }) {
            emit.DeleteTeam({ team })
        }
    }
})
// import { store, emit } from '../framework'
// import requester from '../requester'

// export default store({

//     teams: [],
//     addTeamModalVisible: false,

//     eventListeners: {
//         LoginConfirmed({ entities }) {
//             const { teams } = entities
//             this.teams = teams
//         },
//         ReceivedTeams({ teams }) {
//             this.teams = teams
//         },
//         ClickedCreateNewTeam() {
//             this.addTeamModalVisible = true
//         },
//         ClickedCancelNewTeam() {
//             this.addTeamModalVisible = false
//         },
//         async ClickedConfirmCreateTeam({ newTeamName }) {
//             this.addTeamModalVisible = false
//             const { teams } = await requester.post('/api/createTeam', { newTeamName })
//             emit.ReceivedTeams({ teams })
//         },
//     }
// })
