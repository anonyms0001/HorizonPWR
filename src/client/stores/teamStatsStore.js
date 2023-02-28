import { store, emit } from '../framework'
import requester from '../requester'
import sessionStore from './sessionStore'

export default store({



    teamScoresTeam: null,
    sortBy: 'Score',



    eventListeners: {
        LoginConfirmed({ entities }) {
            const { statsTeam } = entities
            emit.ReceivedStatsTeam({ statsTeam })
            // emit.ReceivedCommissions({ commissions })
        },

        async RouteChanged({ pathname }) {

            if ( pathname === '/repsLeaderboard'  || pathname === '/leaderboardTest') {

                // if (this.energyConsultants === null) {
                    let date = new Date()

                    date = date.toIsoString()
                    date = date.split("T")
                    // console.log("team stats store begining date ", date[0])
                    this.dateRange = { start: date[0], end: date[0]}
                    // console.log("LISTENER IN TEAM STAT STORE")
                    // emit.GetStats({ start: this.dateRange.start, end: this.dateRange.end})
                    emit.GetStatsTeam({ start: this.dateRange.start, end: this.dateRange.end})
                // }
            }
        },
        // ChangeMode({ mode }) {
        //     this.tableMode = mode
        //     this.initOtherTables = mode
        // },
        // ReceivedStats({ stats }) {
        //     this.teamScores = stats.TeamScores
        //     console.log("team stats store only ",  stats.TeamScores)
        //     let table = this.energyConsultants
        //         emit.ChangeTable({ table })
        // },

        ReceivedStatsTeam({ statsTeam }) {
            // console.log("team stats store ",   statsTeam.TeamScoresTeam)
            // this.teamScoresTeam = statsTeam.TeamScoresTeam
            // if (this.energyConsultants !== undefined && this.currentTable === null) {
            //     let table = this.energyConsultants
            //     emit.ChangeTable({ table })
            // }

            // console.log("team stats store ",  this.teamScores)
           // if (this.tableMode === 'team') {
           //      const table = this.teamScoresTeam
           //      emit.ChangeTable({ table })
           //  }

        },
        ChangeTableTeam({ table }) {

            this.teamScoresTeam = table
        },

        // ReceivedCommissions({ commissions }) {
        //     this.commissions = commissions
        // },
        SelectedStatsSortBy({ sortBy }) {
            if (sortBy === this.sortBy) {
                this.reverseSort = !this.reverseSort
            }
            else {
                this.reverseSort = false
            }
            this.sortBy = sortBy
        },
        // ClickedCommissionsRow({ PayDate }) {
        //     this.SelectedPayDate = PayDate
        // }
    }
})
// import { store, emit } from '../framework'
// import requester from '../requester'
// import sessionStore from './sessionStore'

// export default store({

//     energyConsultants: null,
//     fieldMarketers: null,
//     teamScores: null,
//     currentTable: null,
//     dateRange: null,
//     tableMode: 'ec',
//     commissions: null,
//     sortBy: 'Score',
//     reverseSort: false,

//     eventListeners: {
//         async RouteChanged({ pathname }) {
//             if (pathname === '/leaderboard') {
//                 if (this.energyConsultants === null) {
//                     let date = new Date()
//                     date = date.toISOString()
//                     date = date.split("T")
//                     this.dateRange = { start: date[0], end: date[0]}
//                     emit.GetStats({ start: this.dateRange.start, end: this.dateRange.end })
//                 }
//             }
//             else if (pathname === '/home') {
//                 if (this.commissions === null) {
//                     emit.GetCommissions()
//                 }
//             }
//         },
//         ReceivedStats({ stats }) {
//             this.energyConsultants = stats.EnergyConsultants
//             this.fieldMarketers = stats.FieldMarketers
//             this.teamScores = stats.TeamScores
//             // if (this.energyConsultants !== undefined && this.currentTable === null) {
//             //     let table = this.energyConsultants
//             //     emit.ChangeTable({ table })
//             // }
//             if (this.tableMode === 'ec') {
//                 const table = this.energyConsultants
//                 emit.ChangeTable({ table })
//             }
//             else if (this.tableMode === 'team') {
//                 const table = this.teamScores
//                 emit.ChangeTable({ table })
//             }
//             else {
//                 const table = this.fieldMarketers
//                 emit.ChangeTable({ table })
//             }
//         },
//         ChangeTable({ table }) {
//             this.currentTable = table
//             console.log(this.reverseSort)
//         },
//         ChangeMode({ mode }) {
//             this.tableMode = mode
//         },
//         ReceivedCommissions({ commissions }) {
//             this.commissions = commissions
//         },
//         SelectedStatsSortBy({ sortBy }) {
//             if (sortBy === this.sortBy) {
//                 this.reverseSort = !this.reverseSort
//             }
//             else {
//                 this.reverseSort = false
//             }
//             this.sortBy = sortBy
//         }
//     }
// })
Date.prototype.toIsoString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}