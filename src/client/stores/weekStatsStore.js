import { store, emit } from '../framework'
import requester from '../requester'
import sessionStore from './sessionStore'

export default store({
    companyReportScores: null,
    companyReportTeamScores: null,
    weekScores: null,
    teamState: null,
    bloodlineGrowth: null,
    bloodlineGrowthOregon: null,
    bloodlineGrowthIdaho: null,
    currentDateRange: null,
    datePickerOption: "dropdown",


    eventListeners: {
        LoginConfirmed({ entities }) {
            // const { statsWeek } = entities
            // emit.ReceivedWeekStats({ statsWeek })
            // emit.ReceivedCommissions({ commissions })
        },

        async RouteChanged({ pathname }) {

            if ( pathname === '/repsLeaderboard' || pathname === '/reports'  || pathname === '/leaderboardTest'  ) {

                // if (this.energyConsultants === null) {


                // let startDate = new Date()
                // startDate.setDate(startDate.getDate() - startDate.getDay() - 7)
                // let now = new Date(startDate)
                // now.setDate(startDate.getDate() + 6)
                // start = startDate.toIsoString()
                // start = start.split("T")
                // end = now.toIsoString()
                // end = end.split("T")
                let date = new Date()
                let end = []
                    date.setDate(date.getDate() - date.getDay() )
                    let now = new Date(date)
                    now.setDate(date.getDate() + 6)
                    date = date.toIsoString()
                    date = date.split("T")
                    end = now.toIsoString()
                    end = end.split("T")
                    // date = date.toIsoString()
                    // date = date.split("T")
                    // console.log("week stats store begining date ", date[0], end[0])
                    this.dateRange = { start: date[0], end: end[0]}
                     // console.log("LISTENER IN WEEK STAT STORE ", data[0], end[0])
                    this.currentDateRange = { start: date[0], end: end[0]}
                    emit.GetStatsWeek({ start: this.dateRange.start, end: this.dateRange.end})
                    // emit.GetStatsWeek()
                // }
            }
        },


        TeamStateChange(teamState){
            this.teamState = teamState
        },
        DatePickerChange(datePickerOption){
            this.datePickerOption = datePickerOption
        },
        currentDateRangeChange(currentDateRange){
            this.currentDateRange = currentDateRange
        },
        ReceivedWeekStats({ statsWeek }) {
            // console.log("week stats store ",   statsWeek)
            this.companyReportScores = statsWeek.ComReportStats
            this.companyReportTeamScores = statsWeek.TeamNumbers
            // this.bloodlineGrowth = statsWeek.BloodlineGrowth
            // this.bloodlineGrowthIdaho = statsWeek.BloodlineGrowthIdaho
            // this.bloodlineGrowthOregon = statsWeek.BloodlineGrowthFox
            // if (this.energyConsultants !== undefined && this.currentTable === null) {
            //     let table = this.energyConsultants
            //     emit.ChangeTable({ table })
            // }

            // console.log("team stats store ",  this.teamScores)
           // if (this.tableMode === 'team') {
           //      const table = this.weekScores
           //      const tableGrowth = this.bloodlineGrowth
           //      const tableGrowthIdaho = this.bloodlineGrowthIdaho
           //      const tableGrowthOregon = this.bloodlineGrowthOregon
           //
           //      emit.ChangeTableWeek({ table })
           //      emit.ChangeTableGrowth({tableGrowth})
           //      emit.ChangeTableGrowthIdaho({tableGrowthIdaho})
           //      emit.ChangeTableGrowthOregon({tableGrowthOregon})
           //  }

        },
        ChangeTableWeek({ table }) {

            this.weekScores = table

        }, ChangeTableGrowth({ tableGrowth }) {

            this.bloodlineGrowth = tableGrowth
        }, ChangeTableGrowthIdaho({ tableGrowthIdaho }) {

            this.bloodlineGrowthIdaho = tableGrowthIdaho
        }, ChangeTableGrowthOregon({ tableGrowthOregon }) {

            this.bloodlineGrowthOregon = tableGrowthOregon
        },

        // ReceivedCommissions({ commissions }) {
        //     this.commissions = commissions
        // },

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