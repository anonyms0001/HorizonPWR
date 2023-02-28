import Link from '../components/link'
import {view, emit} from '../framework'
// import StatesTable from './tables/statesTable'
import TeamsTable from './tables/teamsTable'
import userStore from '../stores/userStore'
import salesforceStore from '../stores/salesforceStore'
import sessionStore from '../stores/sessionStore'


export default view(function TeamLeaderboard() {

    const {user} = sessionStore
    const {energyConsultants, fieldMarketers, teamScores, currentTable, teamState, tableMode, sortBy, reverseSort, repNameSelection} = salesforceStore

    // console.log("repNameSelection HEY ", repNameSelection)

   let rexFMCount = fieldMarketers.filter((rep) => {
        return (rep.Team === 'Rexburg')
    })
    let rexECCount = energyConsultants.filter((rep) => {
        return (rep.Team === 'Rexburg')
    })

    console.log("rexFMCount HERE ", rexFMCount)
    console.log("rexECCount HERE ", rexECCount)
    // console.log("fieldMarketers ", fieldMarketers)
    // console.log("team STATE ", teamState)
    // console.log("teamScores ", teamScores)
    let repsList = []
    let repsListSort = []
    let idahoList = []
    let idahoListSort = []
    let oregonList = []
    let oregonListSort = []
    let dialerList = []
    let dialerListSort = []
    let boiseList = []
    let boiseListSort = []
    let ampList = []
    let ampListSort = []
    let medfordList = []
    let medfordListSort = []
    let kfallsList = []
    let kfallsListSort = []
    let rexList = []
    let rexListSort = []
    let bendList = []
    let bendListSort = []

    // let remainder = []
    let ec = -1
    let fm = -1
    while (ec++ < energyConsultants.length) {

        if (energyConsultants[ec] !== undefined) {
            // console.log(energyConsultants[ec].Name)
            if (energyConsultants[ec].Name === 'Judd Ferguson') {
                continue
            }
            repsList.push(energyConsultants[ec])
            if (energyConsultants[ec].Team === "Boise") {
                boiseList.push(energyConsultants[ec])
                idahoList.push(energyConsultants[ec])
            } else if (energyConsultants[ec].Team === "Wolf") {
                // console.log("wolf ec", energyConsultants[ec])
                boiseList.push(energyConsultants[ec])
                idahoList.push(energyConsultants[ec])
            } else if (energyConsultants[ec].Team === "Rexburg") {
                rexList.push(energyConsultants[ec])
                idahoList.push(energyConsultants[ec])
            } else if (energyConsultants[ec].Team === "Klamath Falls") {
                kfallsList.push(energyConsultants[ec])
                oregonList.push(energyConsultants[ec])
            } else if (energyConsultants[ec].Team === "PWR Dialers") {
                dialerList.push(energyConsultants[ec])
            } else if (energyConsultants[ec].Team === "Amp") {
                ampList.push(energyConsultants[ec])
            } else if (energyConsultants[ec].Team === "Medford") {
                medfordList.push(energyConsultants[ec])
            }else if (energyConsultants[ec].Team === "Bend") {
                bendList.push(energyConsultants[ec])
            }
        }
    }


    // console.log("WOLF AFTER EC ", wolfList)
    // console.log("REX AFTER EC ", rexList)
    // console.log("FOX AFTER EC ", foxList)
    while (fm++ < fieldMarketers.length) {

        if (fieldMarketers[fm] !== undefined) {
            repsList.push(fieldMarketers[fm])
            if (fieldMarketers[fm].Team === "Boise") {
                // console.log("boise fm", fieldMarketers[fm], fm)
                boiseList.push(fieldMarketers[fm])
                idahoList.push(fieldMarketers[fm])
            } else if (fieldMarketers[fm].Team === "Wolf") {
                // console.log("wolf fm", fieldMarketers[fm])
                boiseList.push(fieldMarketers[fm])
                idahoList.push(fieldMarketers[fm])
            } else if (fieldMarketers[fm].Team === "Rexburg") {
                rexList.push(fieldMarketers[fm])
                idahoList.push(fieldMarketers[fm])
            } else if (fieldMarketers[fm].Team === "Klamath Falls") {
                kfallsList.push(fieldMarketers[fm])
                oregonList.push(fieldMarketers[fm])
            } else if (fieldMarketers[fm].Team === "PWR Dialers") {
                dialerList.push(fieldMarketers[fm])
            } else if (fieldMarketers[fm].Team === "Amp") {
                ampList.push(fieldMarketers[fm])
            } else if (fieldMarketers[fm].Team === "Medford") {
                medfordList.push(fieldMarketers[fm])
            }else if (fieldMarketers[fm].Team === "Bend") {
                bendList.push(fieldMarketers[fm])
            }
        } else {
            // console.log("undefined stuff ", fm)
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
    let statesScoresSort = []
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
            } else {
                statesScores['Oregon'].Closes = teamScores[s].Closes
                statesScores['Oregon'].Score = teamScores[s].Score
                statesScores['Oregon'].Leads = teamScores[s].Leads
                statesScores['Oregon'].Installs = teamScores[s].Installs
                statesScores['Oregon'].Qs = teamScores[s].Qs
            }
        }
    }


    idahoListSort = idahoList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    oregonListSort = oregonList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    repsListSort = repsList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    dialerListSort = dialerList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    boiseListSort = boiseList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    kfallsListSort = kfallsList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    rexListSort = rexList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    ampListSort = ampList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    medfordListSort = medfordList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    bendListSort = bendList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    // console.log("kfallsListSort ", kfallsListSort)


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
        {sortBy: 'qs', label: 'QS'},
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
            now.setDate(0)
            let startDate = new Date(now)
            startDate.setDate(1)
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
            // console.log("DIFFERENCE ", difference)
            let startDate = new Date()
            let startDifference = startDate.getDate() - Number(difference[0])
            // let startDifference = startDate.setDate(startDate.getDate() - Number(difference[0]))
            // gettingDay.setDate(gettingDay.getDate() + 1)
            startDate.setDate(startDifference)
            start = startDate.toIsoString()
            start = start.split("T")
            let endDifference = startDate.getDate() + Number(difference[1])
            startDate.setDate(endDifference)
            end = startDate.toIsoString()
            end = end.split("T")
        }
        // console.log('start all')spo
        // console.log(start[0])
        // console.log('end all')
        // console.log(end[0])
        emit.GetStats({start: start[0], end: end[0]})
    }

    let n = -1

    let viewLeads = (user.roleId <= 4)
    let fullName = user.firstName + " " + user.lastName

    return (


        <div className="panel with-nav-tabs panel-default" style={{boxShadow: "0 1px 24px 0 rgba(0,0,0,.25)",
    border: "0"}}>
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
                    <TeamsTable/>
                    <div id="topreps"
                         className={teamState !== null ? "tab-content-bottom active" : "tab-content-bottom"}>
                        <div className="table-header">
                            <table
                                className={teamState === "Reps" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC" f
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>Rep
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close
                                    </th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table style={{display: "none"}}
                                className={teamState === "Boise" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>Rep
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close
                                    </th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Klamath Falls" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>Rep
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close
                                    </th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Amp" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>Rep
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close
                                    </th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table style={{display: "none"}}
                                className={teamState === "Medford" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>Rep
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close
                                    </th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "PWR Dialers" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>Rep
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close
                                    </th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Rexburg" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>Rep
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close
                                    </th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
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
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close
                                    </th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
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
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close
                                    </th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                             <table
                                className={teamState === "Bend" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>Rep
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close
                                    </th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
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
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    repsListSort !== null ? repsListSort.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName ||  stat.Closes && stat.Name === fullName || user.roleId !== '10' && user.roleId < '6'  && stat.Qs && stat.Closes === '-' ?
                                                    <td style={{textAlign: "left"}}>
                                                        {repNameSelection === stat.Name ?
                                                            <div className="arrows"
                                                                 style={{textAlign: "left", cursor: "pointer"}}
                                                                 onClick={() => emit.ClickedRepName({
                                                                     repName: null
                                                                 })}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                    width="24px"
                                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                                    className="kt-svg-icon">
                                                                    <g stroke="none" strokeWidth="1" fill="#ffffff"

                                                                       fillRule="evenodd">
                                                                        <polygon id="Shape"
                                                                                 points="0 0 24 0 24 24 0 24"/>
                                                                        <path
                                                                            d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                            id="Path-94" fill="#000000"
                                                                            fillRule="nonzero"
                                                                            transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>
                                                                    </g>
                                                                </svg>
                                                                &nbsp;{stat.Name}
                                                            </div>
                                                            :
                                                            <div className="arrows"
                                                                 style={{textAlign: "left", cursor: "pointer"}}
                                                                 onClick={() => emit.ClickedRepName({
                                                                     repName: stat.Name
                                                                 })}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                    width="24px"
                                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                                    className="kt-svg-icon">
                                                                    <g stroke="none" strokeWidth="1" fill="none"
                                                                       fillRule="evenodd">
                                                                        <polygon id="Shape"
                                                                                 points="0 0 24 0 24 24 0 24"/>
                                                                        <path
                                                                            d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                            id="Path-94" fill="#000000"
                                                                            fillRule="nonzero"
                                                                            transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                                    </g>
                                                                </svg>
                                                                &nbsp;{stat.Name}
                                                            </div>
                                                        }
                                                    </td>
                                                    :
                                                    <td>{stat.Name}</td>
                                                }
                                                <td>{stat.Score}</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.Closes}</td>
                                                <td>{stat.ScheduledInstalls}</td>
                                            </tr>
                                        
                                             {
                                                stat.QsNames ?
                                                    <tr className="child-row" key={stat.Name}>
                                                        <td className="child-col" colSpan='6'>
                                                            <div>
                                                                <table
                                                                    style={repNameSelection === stat.Name ? {display: "table"} : {display: "none"}}
                                                                    className="table table-condensed child-table">
                                                                    <tbody>
                                                                    <tr>
                                                                        <th>QS Date</th>
                                                                        <th>Name</th>
                                                                        <th>EC</th>
                                                                    </tr>
                                                                    {
                                                                        stat.QsNames.map((qs) => {
                                                                            let onlyDate = qs.Date.split('T')
                                                                            return (
                                                                                <tr>
                                                                                    <td>{onlyDate[0]}</td>
                                                                                    <td>
                                                                                        {qs.Name}&nbsp;
                                                                                    </td>
                                                                                    <td>
                                                                                        {qs.EC}&nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    : null
                                            }
                                            </tbody>
                                        )
                                    }) : null
                                }
                            </table>
                            <table style={{display: "none"}}
                                className={teamState === "Boise" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    boiseListSort !== null ? boiseListSort.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                     user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || stat.Closes && stat.Name === fullName || user.roleId !== '10' && stat.Qs && stat.Closes === viewLeads ||  user.roleId !== '10' && user.roleId < '6'  && stat.Qs && stat.Closes === '-' ?
                                                        <td style={{textAlign: "left"}}>
                                                            {repNameSelection === stat.Name ?


                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: null
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="#ffffff"

                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                                :
                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: stat.Name
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="none"
                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                            }
                                                        </td>
                                                        :
                                                        <td>{stat.Name}</td>
                                                }
                                                <td>{stat.Score}</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.Closes}</td>
                                                <td>{stat.ScheduledInstalls}</td>
                                            </tr>
                                         
                                               {
                                                stat.QsNames ?
                                                    <tr className="child-row" key={stat.Name}>
                                                        <td className="child-col" colSpan='6'>
                                                            <div>
                                                                <table
                                                                    style={repNameSelection === stat.Name ? {display: "table"} : {display: "none"}}
                                                                    className="table table-condensed child-table">
                                                                    <tbody>
                                                                    <tr>
                                                                        <th>QS Date</th>
                                                                        <th>Name</th>
                                                                        <th>EC</th>
                                                                    </tr>
                                                                    {
                                                                        stat.QsNames.map((qs) => {
                                                                            let onlyDate = qs.Date.split('T')
                                                                            return (
                                                                                <tr>
                                                                                    <td>{onlyDate[0]}</td>
                                                                                    <td>
                                                                                        {qs.Name}&nbsp;
                                                                                    </td>
                                                                                    <td>
                                                                                        {qs.EC}&nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    : null
                                            }
                                            </tbody>
                                        )
                                    }) : null

                                }
                            </table>
                            <table
                                className={teamState === "Klamath Falls" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>
                                    <th style={{width: "16%"}} ></th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    kfallsListSort !== null ? kfallsListSort.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                     user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || stat.Closes && stat.Name === fullName || user.roleId !== '10' && stat.Qs && stat.Closes === viewLeads ||  user.roleId !== '10' && user.roleId < '6'  && stat.Qs && stat.Closes === '-' ?
                                                        <td style={{textAlign: "left"}}>
                                                            {repNameSelection === stat.Name ?


                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: null
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="#ffffff"

                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                                :
                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: stat.Name
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="none"
                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                            }
                                                        </td>
                                                        :
                                                        <td>{stat.Name}</td>
                                                }
                                                <td>{ stat.Score }</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.Closes}</td>
                                                <td>{stat.ScheduledInstalls}</td>
                                            </tr>
                                       
                                               {
                                                stat.QsNames ?
                                                    <tr className="child-row" key={stat.Name}>
                                                        <td className="child-col" colSpan='6'>
                                                            <div>
                                                                <table
                                                                    style={repNameSelection === stat.Name ? {display: "table"} : {display: "none"}}
                                                                    className="table table-condensed child-table">
                                                                    <tbody>
                                                                    <tr>
                                                                        <th>QS Date</th>
                                                                        <th>Name</th>
                                                                        <th>EC</th>
                                                                    </tr>
                                                                    {
                                                                        stat.QsNames.map((qs) => {
                                                                            let onlyDate = qs.Date.split('T')
                                                                            return (
                                                                                <tr>
                                                                                    <td>{onlyDate[0]}</td>
                                                                                    <td>
                                                                                        {qs.Name}&nbsp;
                                                                                    </td>
                                                                                    <td>
                                                                                        {qs.EC}&nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    : null
                                            }
                                            </tbody>
                                        )
                                    }) : null

                                }

                            </table>
                            <table
                                className={teamState === "PWR Dialers" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    dialerListSort !== null ? dialerListSort.map((stat) => {
                                        return (
                                            <tr>
                                                {
                                                    stat.Leads && viewLeads || stat.Leads && stat.Name === fullName ?
                                                        <td style={{textAlign: "left"}}>
                                                            {repNameSelection === stat.Name ?


                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: null
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="#ffffff"

                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                                :
                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: stat.Name
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="none"
                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                            }
                                                        </td>
                                                        :
                                                        <td>{stat.Name}</td>
                                                }
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
                                className={teamState === "Amp" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    ampListSort !== null ? ampListSort.map((stat) => {
                                        // console.log("amp ", stat)
                                        return (
                                            <tr>
                                                {
                                                    stat.Leads && stat.Closes === '-' || stat.Leads && stat.Name === fullName || stat.Leads && stat.Closes === viewLeads ?
                                                        <td style={{textAlign: "left"}}>
                                                            {repNameSelection === stat.Name ?


                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: null
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="#ffffff"

                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                                :
                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: stat.Name
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="none"
                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                            }
                                                        </td>
                                                        :
                                                        <td>{stat.Name}</td>
                                                }
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
                                className={teamState === "Rexburg" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>
                                    <th style={{width: "16%"}} >Rep</th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    rexListSort !== null ? rexListSort.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                { user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || stat.Closes && stat.Name === fullName || user.roleId !== '10' && stat.Qs && stat.Closes === viewLeads ||  user.roleId !== '10' && user.roleId < '6'  && stat.Qs && stat.Closes === '-'  ?
                                                    <td style={{textAlign   : "left"}}>
                                                        {repNameSelection === stat.Name ?


                                                            <div className="arrows"
                                                                 style={{textAlign: "left", cursor: "pointer"}}
                                                                 onClick={() => emit.ClickedRepName({
                                                                     repName: null
                                                                 })}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                    width="24px"
                                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                                    className="kt-svg-icon">
                                                                    <g stroke="none" strokeWidth="1" fill="#ffffff"

                                                                       fillRule="evenodd">
                                                                        <polygon id="Shape"
                                                                                 points="0 0 24 0 24 24 0 24"/>
                                                                        <path
                                                                            d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                            id="Path-94" fill="#000000"
                                                                            fillRule="nonzero"
                                                                            transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>
                                                                    </g>
                                                                </svg>
                                                                &nbsp;{stat.Name}
                                                            </div>
                                                            :
                                                            <div className="arrows"
                                                                 style={{textAlign: "left", cursor: "pointer"}}
                                                                 onClick={() => emit.ClickedRepName({
                                                                     repName: stat.Name
                                                                 })}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                    width="24px"
                                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                                    className="kt-svg-icon">
                                                                    <g stroke="none" strokeWidth="1" fill="none"
                                                                       fillRule="evenodd">
                                                                        <polygon id="Shape"
                                                                                 points="0 0 24 0 24 24 0 24"/>
                                                                        <path
                                                                            d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                            id="Path-94" fill="#000000"
                                                                            fillRule="nonzero"
                                                                            transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                                    </g>
                                                                </svg>
                                                                &nbsp;{stat.Name}
                                                            </div>
                                                        }
                                                    </td>
                                                    :
                                                    <td>{stat.Name}</td>
                                                }
                                                <td>{ stat.Score }</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.Closes}</td>
                                                <td>{stat.ScheduledInstalls}</td>
                                            </tr>
                                      
                                               {
                                                stat.QsNames ?
                                                    <tr className="child-row" key={stat.Name}>
                                                        <td className="child-col" colSpan='6'>
                                                            <div>
                                                                <table
                                                                    style={repNameSelection === stat.Name ? {display: "table"} : {display: "none"}}
                                                                    className="table table-condensed child-table">
                                                                    <tbody>
                                                                    <tr>
                                                                        <th>QS Date</th>
                                                                        <th>Name</th>
                                                                        <th>EC</th>
                                                                    </tr>
                                                                    {
                                                                        stat.QsNames.map((qs) => {
                                                                            let onlyDate = qs.Date.split('T')
                                                                            return (
                                                                                <tr>
                                                                                    <td>{onlyDate[0]}</td>
                                                                                    <td>
                                                                                        {qs.Name}&nbsp;
                                                                                    </td>
                                                                                    <td>
                                                                                        {qs.EC}&nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    : null
                                            }
                                            </tbody>
                                        )
                                    }) : null
                                }

                            </table>
                            <table style={{display: "none"}}
                                className={teamState === "Medford" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead style={{fontSize:"18px"}} >
                                <tr>
                                    <th></th>
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    medfordListSort !== null ? medfordListSort.map((stat) => {
                                        // console.log("amp ", stat)
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                     user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || stat.Closes && stat.Name === fullName || user.roleId !== '10' && stat.Qs && stat.Closes === viewLeads ||  user.roleId !== '10' && user.roleId < '6'  && stat.Qs && stat.Closes === '-'  ?
                                                    <td style={{textAlign: "left"}}>
                                                        {
                                                            repNameSelection === stat.Name ?
                                                            <div className="arrows"
                                                                 style={{textAlign: "left", cursor: "pointer"}}
                                                                 onClick={() => emit.ClickedRepName({
                                                                     repName: null
                                                                 })}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                    width="24px"
                                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                                    className="kt-svg-icon">
                                                                    <g stroke="none" strokeWidth="1" fill="#ffffff"

                                                                       fillRule="evenodd">
                                                                        <polygon id="Shape"
                                                                                 points="0 0 24 0 24 24 0 24"/>
                                                                        <path
                                                                            d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                            id="Path-94" fill="#000000"
                                                                            fillRule="nonzero"
                                                                            transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>
                                                                    </g>
                                                                </svg>
                                                                &nbsp;{stat.Name}
                                                            </div>
                                                            :
                                                            <div className="arrows"
                                                                 style={{textAlign: "left", cursor: "pointer"}}
                                                                 onClick={() => emit.ClickedRepName({
                                                                     repName: stat.Name
                                                                 })}
                                                            >
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                    width="24px"
                                                                    height="24px" viewBox="0 0 24 24" version="1.1"
                                                                    className="kt-svg-icon">
                                                                    <g stroke="none" strokeWidth="1" fill="none"
                                                                       fillRule="evenodd">
                                                                        <polygon id="Shape"
                                                                                 points="0 0 24 0 24 24 0 24"/>
                                                                        <path
                                                                            d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                            id="Path-94" fill="#000000"
                                                                            fillRule="nonzero"
                                                                            transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                                    </g>
                                                                </svg>
                                                                &nbsp;{stat.Name}
                                                            </div>
                                                        }
                                                    </td>
                                                    :
                                                    <td>{stat.Name}</td>
                                                }
                                                <td>{stat.Score}</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.Closes}</td>
                                                <td>{stat.ScheduledInstalls}</td>
                                            </tr>
                                    
                                            {
                                                stat.QsNames ?
                                                    <tr className="child-row" key={stat.Name}>
                                                        <td className="child-col" colSpan='6'>
                                                            <div>
                                                                <table
                                                                    style={repNameSelection === stat.Name ? {display: "table"} : {display: "none"}}
                                                                    className="table table-condensed child-table">
                                                                    <tbody>
                                                                    <tr>
                                                                        <th>QS Date</th>
                                                                        <th>Name</th>
                                                                        <th>EC</th>
                                                                    </tr>
                                                                    {
                                                                        stat.QsNames.map((qs) => {
                                                                            let onlyDate = qs.Date.split('T')
                                                                            return (
                                                                                <tr>
                                                                                    <td>{onlyDate[0]}</td>
                                                                                    <td>
                                                                                        {qs.Name}&nbsp;
                                                                                    </td>
                                                                                    <td>
                                                                                        {qs.EC}&nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    : null
                                            }
                                            </tbody>
                                        )
                                    }) : null
                                }

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
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>
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
                                                {
                                                    stat.Leads && viewLeads || stat.Leads && stat.Name === fullName ?
                                                        <td style={{textAlign: "left"}}>
                                                            {repNameSelection === stat.Name ?


                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: null
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="#ffffff"

                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                                :
                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: stat.Name
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="none"
                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                            }
                                                        </td>
                                                        :
                                                        <td>{stat.Name}</td>
                                                }
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
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
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
                                                {
                                                    stat.Leads && viewLeads || stat.Leads && stat.Name === fullName ?
                                                        <td style={{textAlign: "left"}}>
                                                            {repNameSelection === stat.Name ?


                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: null
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="#ffffff"

                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                                :
                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: stat.Name
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="none"
                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                            }
                                                        </td>
                                                        :
                                                        <td>{stat.Name}</td>
                                                }
                                                <td>{stat.Score}</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.Closes}</td>
                                                <td>{stat.Closes === "-" ? stat.SelfGenInstall : stat.AssistedInstalls}</td>
                                            </tr>
                                        )
                                    }) : null
                                }
                                </tbody>
                            </table>

                            <table
                                className={teamState === "Bend" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>
                                    <th></th>
                                    <th className="fm-sort" param="DESC" 
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}
                                        style={{width: "17%"}}
                                        >Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    bendListSort !== null ? bendListSort.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || user.roleId !== '5' && stat.Closes && stat.Name === fullName || user.roleId !== '10' && user.roleId < '6' && stat.Qs && stat.Closes === '-' ?
                                                        <td style={{textAlign: "left"}}>
                                                            {repNameSelection === stat.Name ?


                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: null
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="#ffffff"

                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-180.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                                :
                                                                <div className="arrows"
                                                                     style={{textAlign: "left", cursor: "pointer"}}
                                                                     onClick={() => emit.ClickedRepName({
                                                                         repName: stat.Name
                                                                     })}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                                        width="24px"
                                                                        height="24px" viewBox="0 0 24 24" version="1.1"
                                                                        className="kt-svg-icon">
                                                                        <g stroke="none" strokeWidth="1" fill="none"
                                                                           fillRule="evenodd">
                                                                            <polygon id="Shape"
                                                                                     points="0 0 24 0 24 24 0 24"/>
                                                                            <path
                                                                                d="M6.70710678,15.7071068 C6.31658249,16.0976311 5.68341751,16.0976311 5.29289322,15.7071068 C4.90236893,15.3165825 4.90236893,14.6834175 5.29289322,14.2928932 L11.2928932,8.29289322 C11.6714722,7.91431428 12.2810586,7.90106866 12.6757246,8.26284586 L18.6757246,13.7628459 C19.0828436,14.1360383 19.1103465,14.7686056 18.7371541,15.1757246 C18.3639617,15.5828436 17.7313944,15.6103465 17.3242754,15.2371541 L12.0300757,10.3841378 L6.70710678,15.7071068 Z"
                                                                                id="Path-94" fill="#000000"
                                                                                fillRule="nonzero"
                                                                                transform="translate(12.000003, 11.999999) rotate(-270.000000) translate(-12.000003, -11.999999) "/>
                                                                        </g>
                                                                    </svg>
                                                                    &nbsp;{stat.Name}
                                                                </div>
                                                            }
                                                        </td>
                                                        :
                                                        <td>{stat.Name}</td>
                                                }
                                                <td>
                                                { stat.Score }</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.Closes}</td>
                                                <td>{stat.ScheduledInstalls}</td>
                                            </tr>
                                            {/*{*/}
                                            {/*    stat.LeadNames ?*/}
                                            {/*        <tr className="child-row" key={stat.Name}>*/}
                                            {/*            <td className="child-col" colSpan='6'>*/}
                                            {/*                <div>*/}
                                            {/*                    <table*/}
                                            {/*                        style={repNameSelection === stat.Name ? {display: "table"} : {display: "none"}}*/}
                                            {/*                        className="table table-condensed child-table">*/}
                                            {/*                        <tbody>*/}
                                            {/*                        <tr>*/}
                                            {/*                            <th>Opportunity Date</th>*/}
                                            {/*                            <th>Lead Name</th>*/}
                                            {/*                        </tr>*/}
                                            {/*                        {*/}
                                            {/*                            stat.LeadNames.map((lead) => {*/}
                                            {/*                                let onlyDate = lead.Date.split('T')*/}
                                            {/*                                return (*/}
                                            {/*                                    <tr>*/}
                                            {/*                                        <td>{onlyDate[0]}</td>*/}
                                            {/*                                        <td>*/}
                                            {/*                                            {lead.LeadName}&nbsp;*/}
                                            {/*                                            {lead.QS ?*/}
                                            {/*                                                <span className="badge"*/}
                                            {/*                                                      style={{background: "#6f899f"}}>QS</span>*/}
                                            {/*                                                : ''*/}
                                            {/*                                            }*/}
                                            {/*                                        </td>*/}
                                            {/*                                    </tr>*/}
                                            {/*                                )*/}
                                            {/*                            })*/}
                                            {/*                        }*/}
                                            {/*                        </tbody>*/}
                                            {/*                    </table>*/}
                                            {/*                </div>*/}
                                            {/*            </td>*/}
                                            {/*        </tr>*/}
                                            {/*        : null*/}
                                            {/*}*/}
                                            {
                                                stat.QsNames ?
                                                    <tr className="child-row" key={stat.Name}>
                                                        <td className="child-col" colSpan='6'>
                                                            <div>
                                                                <table
                                                                    style={repNameSelection === stat.Name ? {display: "table"} : {display: "none"}}
                                                                    className="table table-condensed child-table">
                                                                    <tbody>
                                                                    <tr>
                                                                        <th>QS Date</th>
                                                                        <th>Name</th>
                                                                        <th>EC</th>
                                                                    </tr>
                                                                    {
                                                                        stat.QsNames.map((qs) => {
                                                                            let onlyDate = qs.Date.split('T')
                                                                            return (
                                                                                <tr>
                                                                                    <td>{onlyDate[0]}</td>
                                                                                    <td>
                                                                                        {qs.Name}&nbsp;
                                                                                    </td>
                                                                                    <td>
                                                                                        {qs.EC}&nbsp;
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    : null
                                            }
                                            </tbody>
                                        )
                                    }) : null

                                }

                            </table>

                        </div>
                    </div>
                </div>
            </div>
        </div>


    )
})




