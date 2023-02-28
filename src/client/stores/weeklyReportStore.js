import {store, emit} from '../framework'


export default store({
    teamCollapse: "none",
    weekECs: null,
    weekFMs: null,
    teamsWeekScores: null,
    reportRangeState: "current",
    topLabel: null,
    bottomLabel: null,
    weekReport: null,
    processedPoint: true,
    pointsArray: [],
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
        LoginConfirmed({entities}) {
            // console.log("sf store login confirm")
            // const {weekReport, weeksForChart} = entities
            // emit.getReportStats({statsReport})
            // console.log("weekReport HERE ", weekReport.len)
            // console.log("weeksForChart HERE ", weeksForChart)
            // if(weekReport.length > 0 && weeksForChart.length > 0){
            //     emit.ReceivedWeekStatsReport({weekReport})
            //     emit.ReceivedDataForChart({weeksForChart})
            // }else{
            //     console.log('empty weekklyReportStore')
            // }
        },
        async RouteChanged({pathname}) {
            if (pathname === '/reports' || pathname === '/repsLeaderboard') {
                let date = new Date()
                let end = []
                date.setDate(date.getDate() - date.getDay())
                let now = new Date(date)
                now.setDate(date.getDate() + 6)
                date = date.toIsoString()
                date = date.split("T")
                end = now.toIsoString() 
                end = end.split("T")
                // console.log("date vs end ", date[0],  end[0])
               
               // emit.GetCurrentWeek({start: '2021-05-02', end: '2021-05-08'})
                // emit.GetCurrentWeek({start: '2021-05-09', end: '2021-05-15'})
                // emit.GetCurrentWeek({start: '2021-05-16', end: '2021-05-22'})
                // emit.GetCurrentWeek({start: '2021-05-23', end: '2021-05-29'})
               emit.GetCurrentWeek({start: date[0], end: end[0]})
            }
        },
         ClickedTeamReport(teamName){
            console.log("ClickedTeamReport ", teamName)
            // this.teamSelection = teamName
            const teamSelection = teamName
            emit.EmitTeamChange(teamSelection)
        },
        EmitTeamChange(teamSelection){
            console.log("EmitTeamChange ", teamSelection)
            this.teamCollapse = teamSelection
        },
        RangeSelectionChanged({rangeSelection}) {
            this.reportRangeState = rangeSelection
        },
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
            this.pointsArray = points
            this.processedPoint = true
        },
        QuarterChange({quarter}) {
            // console.log("report store ", quarter)
            emit.GetWeeksForChart({quarter: quarter})
            this.loadState = 'loading'
            // this.processignMode = true
        },
        ReceivedWeekStatsReport({weekReport}) {
            // console.log("currentWeekStats ", weekReport)
            const reportOfWeek = this.weekReport = weekReport
            emit.EmitCurrentWeekReport({reportOfWeek})
        },
        EmitCurrentWeekReport({reportOfWeek}) {
            this.weekReport = reportOfWeek
        },
        ReceivedDataForChart({weeksForChart}) {
            // console.log("weeksForChart inside store ", weeksForChart)
            const weeks = this.weeksQuarters = weeksForChart.WeekRanges
            const weeksLabel = this.topLabel = weeksForChart.TopLabel
            const scoresLabel = this.bottomLabel = weeksForChart.BottomLabel
            const weeksLabelTeams = this.teamsWeekScores = weeksForChart.TeamScoresLabel
            const energyConsultants = this.weekECs = weeksForChart.WeeksECs
            const fieldMarketers = this.weekFMs = weeksForChart.WeeksFMs

            let selectedPoint = []
            scoresLabel
            for (let i = 0; i < scoresLabel.length; i++) {
                if (i === (scoresLabel.length - 1)) {
                    selectedPoint.push(8)
                } else {
                    selectedPoint.push(4)
                }
            }
            // console.log("selectedPoint received data ", selectedPoint)
            let pointArrayValue = this.pointsArray
            // console.log("point array vs selected point ", pointArrayValue.length, selectedPoint.length)
            if (pointArrayValue.length !== selectedPoint.length) {
                emit.EmitLinePointChange({points: selectedPoint})
            }

            emit.EmitLabels({weeksLabel, scoresLabel, weeks, weeksLabelTeams, energyConsultants, fieldMarketers})
        },
        EmitLabels({weeksLabel, scoresLabel, weeks, weeksLabelTeams, energyConsultants, fieldMarketers}) {
            this.topLabel = weeksLabel
            this.bottomLabel = scoresLabel
            this.weekQuarters = weeks
            this.teamsWeekScores = weeksLabelTeams
            this.weekECs = energyConsultants
            this.weekFMs = fieldMarketers
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
            let pointArrayValue = this.pointsArray
            // console.log("point array vs selected point ", pointArrayValue.length, selectedPoint.length)
            if (pointArrayValue.length !== selectedPoint.length) {
                emit.EmitLinePointChange({points: selectedPoint})
            }
        },
        EmitChart({labels, weeksScores, quarterWeeks}) {
            this.lineChartLabels = labels
            this.lineChartWeekScores = weeksScores
            this.weeksQuarters = quarterWeeks

        },
        ClickedChangeRepPosition({weekStats, weekId, Rep, action, start, end, pointsArray, rangeSelection}) {
            // console.log("teamNumbers ", weekStats, weekId, Rep, action, start, end)
            console.log("teamNumbers ", pointsArray, rangeSelection)
            let weekAccounts = [{fms: [], ecs: []}]
            // weekAccounts['fms'] = []
            // weekAccounts['ecs'] = []
            for (let t = 0; t < weekStats.length; t++) {

                for (let ec = 0; ec < weekStats[t].energyConsultants.length; ec++) {
                    // console.log("inside loop", weekStats[t],  weekStats[t].energyConsultants[ec])
                    if (Rep === weekStats[t].energyConsultants[ec].Name && action === "ec-fm") {
                        weekAccounts.forEach(function (position) {
                            position.fms.push({
                                Name: weekStats[t].energyConsultants[ec].Name,
                                Status: 'Active',
                                Team: weekStats[t].Name
                            })
                        })
                    } else {
                        weekAccounts.forEach(function (position) {
                            position.ecs.push({
                                Name: weekStats[t].energyConsultants[ec].Name,
                                Status: 'Active',
                                Team: weekStats[t].Name
                            })

                        })
                    }
                }
                for (let fm = 0; fm < weekStats[t].fieldMarketers.length; fm++) {
                    if (Rep === weekStats[t].fieldMarketers[fm].Name && action === "fm-ec") {
                        weekAccounts.forEach(function (position) {
                            position.ecs.push({
                                Name: weekStats[t].fieldMarketers[fm].Name,
                                Status: 'Active',
                                Team: weekStats[t].Name
                            })
                        })
                    } else {
                        // weekAccounts['fms'].push({
                        //     Name: weekStats[t].fieldMarketers[fm].Name,
                        //     Status: 'Active',
                        //     Team: weekStats[t].Name
                        // })
                        weekAccounts.forEach(function (position) {
                            position.fms.push({
                                Name: weekStats[t].fieldMarketers[fm].Name,
                                Status: 'Active',
                                Team: weekStats[t].Name
                            })
                        })
                    }
                }
            }
            console.log("new weekAccounts ", weekAccounts)
            emit.RecalculateReportWeek({weekId: weekId, start: start, end: end, accounts: weekAccounts[0]})
            alert("Update Was Successful")
            emit.ReloadWeek({start: start, end: end, pointsArray: pointsArray, rangeSelection: rangeSelection})
        },
        ReloadWeek({start, end, pointsArray, rangeSelection}) {
            emit.GetWeeksReport({start: start, end: end})
            emit.GetWeeksForChart({rangeSelection: rangeSelection})
            console.log("emit point change bottom ")
            let pointsPlainArray = Object.values(pointsArray)
            console.log("pointsPlainArray after stringify", pointsPlainArray)

            // console.log("pointsArray bottom ", this.pointsArray)
            // emit.EmitLinePointChange({points: pointsArray})
            this.loadState = 'loading'
            this.pointsArray = pointsPlainArray
            this.reportRangeState = rangeSelection
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