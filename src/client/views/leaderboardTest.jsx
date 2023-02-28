import Link from '../components/link'
import {view, emit} from '../framework'
import userStore from '../stores/userStore'
import salesforceStore from '../stores/salesforceStore'


export default view(function LeaderBoardTest() {

    const {energyConsultants, fieldMarketers, teamScores, statesScore, currentTable, teamState, tableMode, sortBy, reverseSort} = salesforceStore


    // console.log("STATES SCORES IN LeaderBoardTest ", statesScore)
    let repsList = []
    let repsListSort = []
    let idahoList = []
    let idahoListSort = []
    let oregonList = []
    let oregonListSort = []

    // let remainder = []
    // console.log(-1)
    let ec = 0
    let fm = -1
    while (ec++ < energyConsultants.length) {

        if (energyConsultants[ec] !== undefined) {
            repsList.push(energyConsultants[ec])
            if (energyConsultants[ec].Team === "Boise") {
                idahoList.push(energyConsultants[ec])
            } else if (energyConsultants[ec].Team === "Rexburg") {
                idahoList.push(energyConsultants[ec])
            } else if (energyConsultants[ec].Team === "Klamath Falls") {
                oregonList.push(energyConsultants[ec])
            }
        }
    }
     let statesScoresSort = []
    statesScoresSort = statesScore.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    // console.log("STATES SCORES IN LeaderBoardTest SORT ", statesScore)

    // console.log("WOLF AFTER EC ", wolfList)
    // console.log("REX AFTER EC ", rexList)
    // console.log("FOX AFTER EC ", foxList)
    while (fm++ < fieldMarketers.length) {

        if (fieldMarketers[fm] !== undefined) {
            repsList.push(fieldMarketers[fm])
            if (fieldMarketers[fm].Team === "Boise") {
                idahoList.push(fieldMarketers[fm])

            } else if (fieldMarketers[fm].Team === "Rexburg") {
                idahoList.push(fieldMarketers[fm])
            } else if (fieldMarketers[fm].Team === "Klamath Falls") {
                oregonList.push(fieldMarketers[fm])
            }
        }
    }
    //
    let statesScores = {
        Idaho: {
            Name: 'Idaho',
            Closes: 0,
            Score: 0,
            Leads: 0,
            Installs: 0,
            Qs: 0
        },
        Oregon: {
            Name: 'Oregon',
            Closes: 0,
            Score: 0,
            Leads: 0,
            Installs: 0,
            Qs: 0
        }
    }
    // console.log("TEAM SCORES BEFORE LOOP ", teamScores.length, teamScores)

    let s = -1
    while (s++ < teamScores.length) {
        if (teamScores[s] !== undefined) {
            if (teamScores[s].Name === "Rexburg" || teamScores[s].Name === "Boise") {
                // statesScores.Closes.push(teamScores[s].Closes)
                statesScores['Idaho'].Closes += teamScores[s].Closes
                statesScores['Idaho'].Score += teamScores[s].Score
                statesScores['Idaho'].Leads += teamScores[s].Leads
                statesScores['Idaho'].Installs += teamScores[s].Installs
                statesScores['Idaho'].Qs += teamScores[s].Qs
            }else{
                statesScores['Oregon'].Closes = teamScores[s].Closes
                statesScores['Oregon'].Score = teamScores[s].Score
                statesScores['Oregon'].Leads = teamScores[s].Leads
                statesScores['Oregon'].Installs = teamScores[s].Installs
                statesScores['Oregon'].Qs = teamScores[s].Qs
            }
        }
    }


    // console.log("TEAM SCORES AFTER WHILE ", statesScores)


    idahoListSort = idahoList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    oregonListSort = oregonList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    repsListSort = repsList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    // console.log("REPSLISTSORT ", repsListSort)
    // console.log("WOLF AFTER FM ", wolfList)
    // console.log("REX AFTER FM ", rexList)
    // console.log("FOX AFTER FM ", foxList)


    let companyLeads = 0
    let companyQs = 0
    let companyCloses = 0
    let companyInstalls = 0
    for (let i = 0; i < teamScores.length; i++) {
        companyLeads += teamScores[i].Leads
        companyQs += teamScores[i].Qs
        companyCloses += teamScores[i].Closes
        companyInstalls += teamScores[i].Installs
    }

    const headOptions = [
        {sortBy: 'score', label: 'Score'},
        {sortBy: 'leads', label: 'Leads'},
        {sortBy: 'Qs', label: 'Sits'},
        {sortBy: 'assistedClose', label: 'Assisted Close'},
        {sortBy: 'close', label: 'Close'},
        {sortBy: 'assistedInstalls', label: 'Assisted Installs'},
        {sortBy: 'selfGeneratedInstalls', label: 'Self Generated Installs'},
    ]


    function changeTable(table, mode) {
        // console.log("CHANGE TABLE RUN ", mode)
        emit.ChangeTable({table})
        emit.ChangeMode({mode})
    }

    function changeTeamState(teamState) {
        // console.log("CHANGE TABLE RUN ", mode)
        // emit.ChangeTable({table})
        emit.TeamStateChange({teamState})
    }


    function changeDate() {
        let timePeriod = document.getElementById('periodSelect').value
        let start = []
        let end = []
        if (timePeriod === "This Week") {
            let now = new Date()
            let days = now.getDay()
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - days)
            start = startDate.toISOString()
            start = start.split("T")
            end = now.toISOString()
            end = end.split("T")
        } else if (timePeriod === "Last Week") {
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - startDate.getDay() - 7)
            let now = new Date(startDate)
            now.setDate(startDate.getDate() + 6)
            start = startDate.toISOString()
            start = start.split("T")
            end = now.toISOString()
            end = end.split("T")
        } else if (timePeriod === "This Month") {
            let now = new Date()
            //we want the 1st day of the month
            let days = now.getDate() - 1
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - days)
            start = startDate.toISOString()
            start = start.split("T")
            end = now.toISOString()
            end = end.split("T")
        } else if (timePeriod === "Last Month") {
            let now = new Date()
            now.setDate(0)
            let startDate = new Date(now)
            startDate.setDate(1)
            start = startDate.toISOString()
            start = start.split("T")
            end = now.toISOString()
            end = end.split("T")
        } else if (timePeriod === "This Year") {
            let now = new Date()
            start = new Date(now.getFullYear().toString())
            start = start.toISOString()
            start = start.split("T")
            end = new Date(now.getFullYear(), 12, 31, 23, 60, 60)
            end = end.toISOString()
            end = end.split("T")
        } else if (timePeriod === "Last Year") {
            let now = new Date()
            now.setFullYear(now.getFullYear() - 1)
            let startDate = new Date(now)
            startDate.setMonth(0)
            startDate.setDate(1)
            start = startDate.toISOString()
            start = start.split("T")
            now.setMonth(11)
            now.setDate(31)
            end = now.toISOString()
            end = end.split("T")
        } else if (timePeriod === "All Time") {
            start.push('1970-01-01')
            end.push('2069-12-31')
        } else {
            let difference = timePeriod.split(':')
            let startDate = new Date()
            let startDifference = startDate.getDate() - Number(difference[0])
            startDate.setDate(startDifference)
            start = startDate.toIsoString()
            start = start.split("T")
            let endDifference = startDate.getDate() + Number(difference[1])
            startDate.setDate(endDifference)
            end = startDate.toIsoString()
            end = end.split("T")
        }
        // console.log('start')
        // console.log(start[0])
        // console.log('end')
        // console.log(end[0])
        emit.GetStats({start: start[0], end: end[0]})
    }

    return (


        <div className="panel with-nav-tabs panel-default">
            <div className="panel-heading" style={{display: "flex"}}>
                <div className="panel-title" style={{flex: "4", textAlign: "left", marginTop: "8px"}}>OVERALL NUMBERS
                </div>
                <ul className="nav nav-pills" style={{flex: "1"}}>
                    <li style={{float: "right"}}>
                        <ul style={{listStyle: "none"}}>
                            <li onClick={() => emit.TeamStateChange(null)}
                                className={teamState === null ? "list-option active" : "list-option"}>
                                Team View
                            </li>
                            <li onClick={() => emit.TeamStateChange("Reps")}
                                className={teamState !== null ? "list-option  active" : "list-option "}>
                                Rep View
                            </li>
                        </ul>
                    </li>

                </ul>
            </div>
            <div className="panel-body" style={{padding: "0px"}}>
                <div className="tab-content">
                    {/* <div className="tab-content-top">
                        <strong>Period</strong><select className="period" style={{display: "inline"}}
                                                       id="periodSelect"
                                                       onChange={changeDate.bind(this)}>
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
                    </div> */}
                    <div id="teams"
                         className={teamState === null ? "tab-content-bottom active" : "tab-content-bottom"}>
                        <div className="table-header">
                               <table>
                                <thead>
                                <tr style={{backgroundColor: " #e79236"}}>
                                    <th className="team-sort" param="DESC">Team</th>
                                    <th className="team-sort score" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Score" })}>
                                         <div className="popover fade right in" style={{ left: "34%", top: "4%"}} >
                                            <div className="arrow" style={{top: "26%"}}></div>
                                            {/*<h3 className="popover-title" style={{color: "#333333"}}>Scores</h3>*/}
                                            <div className="popover-content" style={{color: "#333333"}}>
                                                Lead = 1<br />
                                                Sit = 2<br />
                                                Close = 3<br />
                                                Install = 4<br />
                                            </div>
                                        </div>
                                        Score
                                    </th>
                                    <th className="team-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Leads" })}>
                                        Leads
                                    </th>
                                    <th className="team-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Qs" })}>Sits</th>
                                    <th className="team-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Close" })}>Closes</th>
                                    <th className="team-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Installs" })}>Installs Scheduled</th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div className="table-content">
                            <table className="table table-striped">
                                <thead>
                                <tr>
                                     <th>Team</th>
                                    <th>Score</th>
                                    <th>Leads</th>
                                    <th>Sits</th>
                                    <th>Closes</th>
                                    <th>Installs Scheduled</th>
                                </tr>
                                </thead>
                                             <tbody>
                                {
                                    statesScoresSort !== null ? statesScoresSort.map((stat) => {
                                        return (
                                            <tr>
                                                <td className={tableMode === 'fm' ? "teams-icon greyColor  active" : "teams-icon  "}>
                                                    <a className="greyColor" style={{cursor: "pointer"}} onClick={() => emit.TeamStateChange(stat.State)}>
                                                    {stat.State}
                                                    </a>
                                                </td>
                                                <td>{stat.Score}</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.Closes}</td>
                                                <td>{stat.Installs}</td>
                                            </tr>
                                        )
                                    }) : null
                                }
                                </tbody>
                            </table>

                        </div>
                    </div>
                      <div id="topreps"
                         className={teamState !== null ? "tab-content-bottom active" : "tab-content-bottom"}>
                        <div className="table-header">
                            <table
                                className={teamState === "Reps" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>Rep
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>
                                        <div className="popover fade right in" style={{ left: "34%", top: "4%"}} >
                                            <div className="arrow" style={{top: "45%"}}></div>
                                           
                                            <div className="popover-content" style={{color: "#333333"}}>
                                                Leads = 3<br />
                                                Sits = 2<br />
                                                Closes = 3<br />
                                                Installs = 4<br />
                                            </div>
                                        </div>
                                        Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>Sits
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Closes
                                    </th>
                                    <th className="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Idaho" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>Rep
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>
                                        <div className="popover fade right in" style={{ left: "34%", top: "4%"}} >
                                            <div className="arrow" style={{top: "45%"}}></div>
                                           
                                            <div className="popover-content" style={{color: "#333333"}}>
                                                Leads = 3<br />
                                                Sits = 2<br />
                                                Closes = 3<br />
                                                Installs = 4<br />
                                            </div>
                                        </div>
                                        Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>Sits
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Closes
                                    </th>
                                      <th className="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Oregon" ? "table table-striped table-fm active" : "table table-striped table-fm"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>Rep
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>
                                        <div className="popover fade right in" style={{ left: "34%", top: "4%"}} >
                                            <div className="arrow" style={{top: "45%"}}></div>
                                           
                                            <div className="popover-content" style={{color: "#333333"}}>
                                                Leads = 3<br />
                                                Sits = 2<br />
                                                Closes = 3<br />
                                                Install = 4<br />
                                            </div>
                                        </div>
                                        Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>Sits
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Closes
                                    </th>
                                    <th className="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>

                        </div>
                        <div className="table-content">
                            <table
                                className={teamState === "Reps" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th className="fm-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>
                                        <div className="popover fade right in" style={{ left: "34%", top: "4%"}} >
                                            <div className="arrow" style={{top: "45%"}}></div>
                                           
                                            <div className="popover-content" style={{color: "#333333"}}>
                                                Leads = 3<br />
                                                Sits = 2<br />
                                                Closes = 3<br />
                                                Installs = 4<br />
                                            </div>
                                        </div>
                                        Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>Sits</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Closes</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Closes
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    repsListSort !== null ? repsListSort.map((stat) => {
                                        return (
                                            <tr>
                                                <td>{stat.Name}</td>
                                                <td>{stat.Score}</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.Closes}</td>
                                               <td>{stat.ScheduledInstalls}</td>
                                            </tr>
                                        )
                                    }) : null
                                }
                                </tbody>
                            </table>
                            <table
                                className={teamState === "Idaho" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>Sits</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Closes</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    idahoListSort !== null ? idahoListSort.map((stat) => {
                                        return (
                                            <tr>
                                                <td>{stat.Name}</td>
                                                <td>{stat.Score}</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.Closes}</td>
                                                <td>{stat.ScheduledInstalls}</td>
                                            </tr>
                                        )
                                    }) : null
                                }
                                </tbody>
                            </table>
                            <table
                                className={teamState === "Oregon" ? "table table-striped table-fm active" : "table table-striped table-fm"}>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>Sits</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    oregonListSort !== null ? oregonListSort.map((stat) => {
                                        return (
                                            <tr>
                                                <td>{stat.Name}</td>
                                                <td>{stat.Score}</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.Closes}</td>
                                                <td>{stat.ScheduledInstalls}</td>
                                            </tr>
                                        )
                                    }) : null
                                }
                                </tbody>
                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
})




