import {store, emit} from '../framework'
import requester from '../requester'
import sessionStore from './sessionStore'
import userStore from "./userStore";

export default store({

    statesScore: null,
    energyConsultants: null,
    fieldMarketers: null,
    prevTable: null,
    teamScores: null,
    currentTable: null,
    dateRange: null,
    tableMode: 'team',
    teamState: null,
    commissions: null,
    residentialProjectsCommissions: null,
    opportunityCommissions: null,
    currentWeekStartDate: null,
    currentWeekEndDate: null,
    nextWeekStartDate: null,
    nextNextWeekStartDate: null,
    nextNextWeekEndDate: null,
    nextWeekEndDate: null,
    sortBy: 'Score',
    sortTeamBy: 'teamScore',
    repsSortBy: 'ReportScore',
    staticSort: 'Score',
    reverseSort: false,
    SelectedPayDate: null,
    fmFirstPayDate: null,
    fmFirstBonusPayDate: null,
    fmSecondBonusPayDate: null,
    repNameSelection: null,
    overrideDetected: false,
    fmBasedRate: 0,
    // initialBonus

    eventListeners: {
        LoginConfirmed({entities}) {
            // const {stats, commissions} = entities
            // emit.ReceivedStats({stats})
            // emit.ReceivedCommissions({commissions})
            const {commissions} = entities
            emit.ReceivedCommissions({commissions})
        },
        async RouteChanged({pathname}) {

            if (pathname === '/leaderboard' || pathname === '/repsLeaderboard') {

                if (this.energyConsultants === null) {
                    let date = new Date()

                    date = date.toIsoString()
                    date = date.split("T")
                    // console.log("store begining date ", date[0])
                    this.dateRange = {start: date[0], end: date[0]}

                    emit.GetStats({start: this.dateRange.start, end: this.dateRange.end})
                    emit.GetCurrentWeek({start: this.dateRange.start, end: this.dateRange.end})

                }
            } else if (pathname === '/home') {
                if (this.commissions === null) {
                    emit.GetCommissions()
                }
            }
        },
        TeamStateChange(teamState) {
            this.teamState = teamState
        },
        ChangeMode({mode}) {
            this.tableMode = mode

        },
        ReceivedStats({stats}) {
            this.energyConsultants = stats.EnergyConsultants
            this.fieldMarketers = stats.FieldMarketers
            this.teamScores = stats.TeamScores
            this.statesScore = stats.StateScores
            // if (this.energyConsultants !== undefined && this.currentTable === null) {
            //     let table = this.energyConsultants
            //     emit.ChangeTable({ table })
            // }
            if (this.tableMode === 'ec') {
                const table = this.energyConsultants

                emit.ChangeTable({table})
            } else if (this.tableMode === 'team') {
                const table = this.teamScores
                emit.ChangeTable({table})
            } else if (this.tableMode === 'fm') {
                const table = this.fieldMarketers
                emit.ChangeTable({table})
            } else {
                const table = this.statesScore
                emit.ChangeTable({table})
            }
        },
        ChangeTable({table}) {
            this.prevTable = this.currentTable
            this.currentTable = table
        },
        ReceivedCommissions({commissions}) {
            // console.log("commissions store ", commissions)
            this.residentialProjectsCommissions = commissions.ResidentialProjectsCommissions
            this.opportunityCommissions = commissions.OpportunityCommissions

            if (sessionStore.user.accountId !== null) {

                commissions.ResidentialProjectsCommissions.filter(residentialCheck => residentialCheck.Account__c !== sessionStore.user.accountId).map((residentialCheck) => {
                    if (residentialCheck.Parent_Account__c === sessionStore.user.accountId) {
                        this.overrideDetected = true
                    } else if (residentialCheck.Manager_2__c === sessionStore.user.accountId) {
                        this.overrideDetected = true
                    } else if (residentialCheck.Manager_3__c === sessionStore.user.accountId) {
                        this.overrideDetected = true
                    }
                })

            }

            // this.fmBasedRate = sessionStore.user === 7 ? 60 : sessionStore.user === 8 ? 80 : 0
            let weekDate = new Date()
            weekDate.setHours(weekDate.getHours() - 6)
            weekDate.setDate(weekDate.getDate() - weekDate.getDay())
            let now = new Date(weekDate)
            now.setDate(weekDate.getDate() + 6)
            weekDate = weekDate.toIsoString()
            weekDate = weekDate.split("T")
            let weekEnd = now.toIsoString()
            weekEnd = weekEnd.split("T")
            // console.log("weekDate ", weekDate, "weekEnd ", weekEnd)
            this.currentWeekStartDate = weekDate[0]
            this.currentWeekEndDate = weekEnd[0]

            let nextDate = new Date()
            nextDate.setHours(nextDate.getHours() - 6)
            // nextDate.setDate(nextDate.getDate() + ( 7 - nextDate.getDay() )
            nextDate.setDate(nextDate.getDate() + (7 - nextDate.getDay()) % 7);
            let nowNext = new Date(nextDate)
            nowNext.setDate(nextDate.getDate() + 6)
            nextDate = nextDate.toIsoString()
            nextDate = nextDate.split("T")
            let nextEnd = nowNext.toIsoString()
            nextEnd = nextEnd.split("T")

            this.nextWeekStartDate = nextDate[0]
            this.nextWeekEndDate = nextEnd[0]

            let secondWeekDate = new Date(sessionStore.user.startDate)
            secondWeekDate.setHours(secondWeekDate.getHours() - 6)
            // secondWeekDate.setDate(secondWeekDate.getDate() + (7 - secondWeekDate.getDay()) % 7)
            secondWeekDate.setDate(secondWeekDate.getDate() - secondWeekDate.getDay() + 7)
            let nowSecondWeekDate = new Date(secondWeekDate)
            nowSecondWeekDate.setDate(secondWeekDate.getDate() + 7)
            secondWeekDate = secondWeekDate.toIsoString()
            secondWeekDate = secondWeekDate.split("T")
            let thirdWeekDate = nowSecondWeekDate.toIsoString()
            thirdWeekDate = thirdWeekDate.split("T")

            function getFriday(date, dayOfWeek) {
                let nextFriday = new Date(date.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7))
                nextFriday.setDate(nextFriday.getDate() - nextFriday.getDay() + 18)
                let nextFridayString = nextFriday.toISOString()
                let nextFridayDateOnly = nextFridayString.split('T')
                return nextFridayDateOnly[0]
            }

            let initialFMCommissionDate = getFriday(new Date(sessionStore.user.startDate), 5)

            // console.log("secondWeekDate[0] ", secondWeekDate[0])
            // console.log("thirdWeekDate[0] ", thirdWeekDate[0])
            let today = new Date()
            let newPayScaleDate = new Date('2021-11-08')
            this.fmFirstPayDate = today < newPayScaleDate ? initialFMCommissionDate : '2018-09-01 06:00:00'
            this.fmFirstBonusPayDate = sessionStore.user.firstBonus ? getFriday(new Date(secondWeekDate[0]), 4) : null
            this.fmSecondBonusPayDate = sessionStore.user.secondBonus ? getFriday(new Date(thirdWeekDate[0]), 4) : null


        },
        // ClickedNextWeek(){
        //     let nextDate = new Date()
        //     nextDate.setHours(nextDate.getHours() - 6)
        //     // nextDate.setDate(nextDate.getDate() + ( 7 - nextDate.getDay() )
        //     nextDate.setDate(nextDate.getDate() + ( 7 - nextDate.getDay()) % 7);
        //     let nowNext = new Date(nextDate)
        //     nowNext.setDate(nextDate.getDate() + 6)
        //     nextDate = nextDate.toIsoString()
        //     nextDate = nextDate.split("T")
        //     let nextEnd = nowNext.toIsoString()
        //     nextEnd = nextEnd.split("T")
        //     console.log("next week start ", nextDate)
        //     console.log("next week end ", nextEnd)
        //     this.currentWeekStartDate = nextDate[0]
        //     this.currentWeekEndDate = nextEnd[0]
        // },

        SelectedStatsSortBy({sortBy}) {
            if (sortBy === this.sortBy) {
                this.reverseSort = !this.reverseSort
            } else {
                this.reverseSort = false
            }
            this.sortBy = sortBy
        },
        SelectedStatsRepsSortBy({repsSortBy}) {
            if (repsSortBy === this.repsSortBy) {
                this.reverseSort = !this.reverseSort
            } else {
                this.reverseSort = false
            }
            this.repsSortBy = repsSortBy
        },
        ClickedCommissionsRow({PayDate}) {
            this.SelectedPayDate = PayDate
        },
        ClickedRepName({repName}) {
            this.repNameSelection = repName
        }
    }
})

Date.prototype.toIsoString = function () {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function (num) {
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