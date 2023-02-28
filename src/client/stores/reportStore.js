import {store, emit} from '../framework'


export default store({
    processedPoint: true,
    pointsArray: null,
    selectedWeek: null,
    companyScore: null,
    weeksQuarters: null,
    lineChartLabels: null,
    lineChartWeekScores: null,
    companyFMNumbers: null,
    companyECNumbers: null,
    teamNumbers: null,
    fieldMarketersReport: null,
    energyConsultantsReport: null,
    teamScores: null,
    currentTable: null,
    dateRange: null,
    sortBy: 'Score',
    loadState: 'loaded',
    // staticSort: 'Score',
    // reverseSort: false,
    // SelectedPayDate: null,
    // repNameSelection: null,

    eventListeners: {
        // LoginConfirmed({entities}) {
        //     // console.log("sf store login confirm")
        //     const {statsReport, quarter} = entities
        //     // emit.getReportStats({statsReport})
        //     emit.ReceivedStatsReport({statsReport})
        //     emit.ReceivedQuarterWeeks({quarter})

        // },
        // async RouteChanged({pathname}) {

        //     if (pathname === '/reports') {
        //         // emit.GetWeeksReport({quarter: 'current'})

        //     }
        // },
        EmitSelectedWeekRange(week) {
            // console.log("WEEK ", week)
            this.selectedWeek = week
        },

        ProcessNewPointPosition({position, length}) {
            this.processedPoint = false
            // emit.EmitPointProcessState()
            // console.log("position STORE ", position, length)

            const selectedPoint = []
            for (let i = 0; i <= length; i++) {
                if (i === position) {
                    selectedPoint.push(8)
                } else {
                    selectedPoint.push(4)
                }
            }
            // console.log("selectedPoint process ", selectedPoint)
            // this.selectedWeek = selectedPoint
            emit.EmitLinePointChange({points: selectedPoint})

        },
        EmitLinePointChange({points}) {
            // console.log("POINTS ARRAY store", points)
            this.pointsArray = points
            this.processedPoint = true
        },
        // EmitPointProcessState(){
        //
        // },
        QuarterChange({quarter}) {
            // console.log("report store ", quarter)
            emit.GetWeeksReport({quarter: quarter})
            this.loadState = 'loading'
            // this.processignMode = true
        },
        ReceivedStatsReport({statsReport}) {
            // console.log("statsReport ", statsReport)
            const overallScore = this.companyScore = statsReport.CompanyNumbers[0].Score
            const companyFM = this.companyFMNumbers = statsReport.CompanyNumbers[0].CompanyFMNumbers[0]
            const companyEC = this.companyECNumbers = statsReport.CompanyNumbers[0].CompanyECNumbers[0]
            const companyTeams = this.teamNumbers = statsReport.CompanyNumbers[0].Teams


            // let ec = []
            // let fm = []
            // // for(let i = 0; i < statsReport.CompanyNumbers[0].Teams.length; i++){
            // //             //     statsReport.CompanyNumbers[0].Teams[0]
            // //             // }
            // statsReport.CompanyNumbers[0].Teams.forEach(function ( team, key) {
            //     console.log("key ", key)
            //     console.log(team.fieldMarketers[key])
            //
            //   ec.push(team.energyConsultants[key])
            //   fm.push(team.fieldMarketers[key])
            // })

            emit.EmitReport({overallScore, companyFM, companyEC, companyTeams})
        },
        EmitReport({overallScore, companyFM, companyEC, companyTeams}) {
            this.companyScore = overallScore
            this.companyFMNumbers = companyFM
            this.companyECNumbers = companyEC
            this.teamNumbers = companyTeams


            // this.fieldMarketersReport = ec
            // this.energyConsultantsReport = fm
        },
        ReceivedQuarterWeeks({quarter}) {
            // console.log("ReceivedQuarterWeeks ", quarter.QuarterDate[0].ChartLabels)
            // if(quarter){
            this.lineChartLabels = quarter.QuarterDate[0].ChartLabels
            this.lineChartWeekScores = quarter.QuarterDate[0].WeeksScore
            this.weeksQuarters = quarter.QuarterDate[0].QuarterWeeks
            const labels = this.lineChartLabels
            const weeksScores = this.lineChartWeekScores
            const quarterWeeks = this.weeksQuarters
            emit.EmitChart({labels, weeksScores, quarterWeeks})
            this.loadState = 'loaded'
            let quarterWeeksLength = quarter.QuarterDate[0].QuarterWeeks.length
            quarterWeeksLength = quarterWeeksLength - 1
            // console.log("quarterWeeksLength ", quarterWeeksLength)

            emit.EmitSelectedWeekRange(quarter.QuarterDate[0].QuarterWeeks[quarterWeeksLength])

            let selectedPoint = []

            for (let i = 0; i < this.lineChartLabels.length; i++) {
                if (i === (this.lineChartLabels.length - 1)) {
                    selectedPoint.push(8)
                } else {
                    selectedPoint.push(4)
                }
            }
            // console.log("selectedPoint ", selectedPoint)
            emit.EmitLinePointChange({points: selectedPoint})
        },
        EmitChart({labels, weeksScores, quarterWeeks}) {
            this.lineChartLabels = labels
            this.lineChartWeekScores = weeksScores
            this.weeksQuarters = quarterWeeks

        },
        SelectedStatsSortBy({sortBy}) {
            if (sortBy === this.sortBy) {
                this.reverseSort = !this.reverseSort
            } else {
                this.reverseSort = false
            }
            this.sortBy = sortBy
        },

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