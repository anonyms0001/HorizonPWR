import {emit, view} from "../framework";
import teamStatsStore from '../stores/teamStatsStore'

export default view(function TeamsWidget() {

    // const { teamScores, prevTable, currentTable, tableMode, initOtherTables, sortBy, reverseSort} = salesforceStore
    const { teamScoresTeam, sortBy } = teamStatsStore

    let teamScoresTeamSort = []
    function changeTableTeam(table, mode, initOtherTables) {
        // console.log("CHANGE TABLE RAN", mode, initOtherTables)
        emit.ChangeTable({table})
        emit.ChangeMode({mode, initOtherTables})
        // emit.ChangeMode({initOtherTables})

    }

    teamScoresTeamSort = teamScoresTeam.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)


    function changeDateTeam() {
        let timePeriod = document.getElementById('periodSelectTeam').value

        let start = []
        let end = []
        if (timePeriod === "This Week" ) {
            let now = new Date()
            let days = now.getDay()
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - days)
            start = startDate.toIsoString()
            start = start.split("T")
            end = now.toIsoString()
            end = end.split("T")
        } else if (timePeriod === "Last Week" ) {
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - startDate.getDay() - 7)
            let now = new Date(startDate)
            now.setDate(startDate.getDate() + 6)
            start = startDate.toIsoString()
            start = start.split("T")
            end = now.toIsoString()
            end = end.split("T")
        } else if (timePeriod === "This Month" ) {
            let now = new Date()
            //we want the 1st day of the month
            let days = now.getDate() - 1
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - days)
            start = startDate.toIsoString()
            start = start.split("T")
            end = now.toIsoString()
            end = end.split("T")
        } else if (timePeriod === "Last Month" ) {
            let now = new Date()
            now.setDate(0)
            let startDate = new Date(now)
            startDate.setDate(1)
            start = startDate.toIsoString()
            start = start.split("T")
            end = now.toIsoString()
            end = end.split("T")
        } else if (timePeriod === "This Year" ) {
            let now = new Date()
            start = new Date(now.getFullYear().toString())
            start = start.toIsoString()
            start = start.split("T")
            end = new Date(now.getFullYear(), 12, 31, 23, 60, 60)
            end = end.toIsoString()
            end = end.split("T")
        } else if (timePeriod === "Last Year" ) {
            let now = new Date()
            now.setFullYear(now.getFullYear() - 1)
            let startDate = new Date(now)
            startDate.setMonth(0)
            startDate.setDate(1)
            start = startDate.toIsoString()
            start = start.split("T")
            now.setMonth(11)
            now.setDate(31)
            end = now.toIsoString()
            end = end.split("T")
        } else if (timePeriod === "All Time" ) {
            start.push('1970-01-01')
            end.push('2069-12-31')
        } else {
            let difference = timePeriod.split(':')

            let startDate = new Date()
            let startDifference = startDate.getDate() - Number(difference[0])
            // console.log("start difference ", startDifference)
            startDate.setDate(startDifference)
            start = startDate.toIsoString()
            // console.log("start else ", start[0])
            start = start.split("T")
            let endDifference = startDate.getDate() + Number(difference[1])
            startDate.setDate(endDifference)
            end = startDate.toIsoString()
            end = end.split("T")
        }


        // console.log('start')
        console.log(start[0])
        // console.log('end')
        console.log(end[0])


        emit.GetStatsTeam({start: start[0], end: end[0]})
    }


    return (
        <div className="panel panel-team-stats panel-default">
            <div className="panel-heading">
                <div style={{display: "flex"}}>
                    <div style={{flex: "1", textAlign: "left"}}>OVERALL NUMBERS</div>
                    <select className="period"
                            style={{display: "inline", float: "right", color: "black"}}
                            id="periodSelectTeam" onChange={changeDateTeam.bind(this)}
                    >
                        <option value="0:0">Today</option>
                        <option value="1:0">Yesterday</option>
                        <option value="This Week">This Week</option>
                        <option value="Last Week">Last Week</option>
                        <option value="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                        <option value="90:90">This Quarter</option>
                        <option value="This Year">This Year</option>
                        <option value="Last Year">Last Year</option>
                        <option value="All Time">All Time</option>
                    </select>
                </div>
            </div>

            <div className="panel-body">
                <table className="table">
                    <thead>
                    <tr>
                        <th className="team-sort">Team</th>
                        <th className="team-sort">Score</th>
                        <th className="team-sort">Leads</th>
                        <th className="team-sort">QS</th>
                        <th className="team-sort">Close</th>
                        <th className="team-sort">Installs</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        // sortedTable !== null ? sortedTable.map((stat) => {
                        teamScoresTeamSort !== null ? teamScoresTeamSort.map((statTeam) => {
                            return (
                                <tr>

                                    {/*<td>{stat.Name}</td>*/}
                                    <td>{statTeam.Name}</td>
                                    <td>{statTeam.Score}</td>
                                    <td>{statTeam.Leads}</td>
                                    <td>{statTeam.Qs}</td>
                                    <td>{statTeam.Closes}</td>
                                    <td>{statTeam.Installs}</td>
                                </tr>
                            )
                        }) : null
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
})