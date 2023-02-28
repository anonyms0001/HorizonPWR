// import Link from '../../components/link'
import {view, emit} from '../../framework'
// import StatesTable from './tables/statesTable'
// import TeamsTable from './tables/teamsTable'
import ReportTeamsTable from './reportTeamsTable'
import userStore from '../../stores/userStore'
import salesforceStore from '../../stores/salesforceStore'
import sessionStore from '../../stores/sessionStore'
import weekStatsStore from "../../stores/weekStatsStore";


export default view(function ReportsLeaderboard() {

    const {user} = sessionStore
    const {companyReportTeamScores} = weekStatsStore
    const {energyConsultants, fieldMarketers, teamScores, currentTable, teamState, tableMode, sortBy, repsSortBy, reverseSort, repNameSelection} = salesforceStore

    // teamScoresSort = companyReportTeamScores.sort((r1, r2) => sortTeamBy ? (r1[sortTeamBy] > r2[sortTeamBy] ? -1 : 1) : 0)
    // console.log("companyReportTeamScores HERE MANAGERS ", companyReportTeamScores)
    let managersOverallStats = companyReportTeamScores.filter((rep) => {
        return (rep.Name === 'Managers')
    })
    // console.log("here TEST ", managersOverallStats, managersOverallStats.length )

    let rexFM = fieldMarketers.filter((rep) => {
        return (rep.Team === 'Rexburg')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    let rexEC = energyConsultants.filter((rep) => {
        return (rep.Team === 'Rexburg')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    let bendFM = fieldMarketers.filter((rep) => {
        return (rep.Team === 'Bend')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    let bendEC = energyConsultants.filter((rep) => {
        return (rep.Team === 'Bend')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    let kfFM = fieldMarketers.filter((rep) => {
        return (rep.Team === 'Klamath Falls')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    let kfEC = energyConsultants.filter((rep) => {
        return (rep.Team === 'Klamath Falls')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)

    let pocatelloFM = fieldMarketers.filter((rep) => {
        return (rep.Team === 'Pocatello')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    let pocatelloEC = energyConsultants.filter((rep) => {
        return (rep.Team === 'Pocatello')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)

    let boiseFM = fieldMarketers.filter((rep) => {
        return (rep.Team === 'Boise')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    let boiseEC = energyConsultants.filter((rep) => {
        return (rep.Team === 'Boise')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)

    let meridianFM = fieldMarketers.filter((rep) => {
        return (rep.Team === 'Meridian')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    let meridianEC = energyConsultants.filter((rep) => {
        return (rep.Team === 'Meridian')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)

    let caldwellFM = fieldMarketers.filter((rep) => {
        return (rep.Team === 'Caldwell')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    let caldwellEC = energyConsultants.filter((rep) => {
        return (rep.Team === 'Caldwell')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)

    let twinFallsFM = fieldMarketers.filter((rep) => {
        return (rep.Team === 'Twin Falls')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    let twinFallsEC = energyConsultants.filter((rep) => {
        return (rep.Team === 'Twin Falls')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)

    let mitEC = energyConsultants.filter((rep) => {
        return (rep.Team === 'MIT')
    }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    let managerEC = null

    // companyReportTeamScores.filter((rep) => { return (rep.Name === 'Managers')})
    // if(companyReportTeamScores[5].energyConsultants !== undefined){
    if (managersOverallStats.length > 0) {
        // console.log("hey hey HEY")
        managerEC = companyReportTeamScores[5].energyConsultants.sort((r1, r2) => sortBy ? (r1['WeekGrade'] > r2['WeekGrade'] ? -1 : 1) : 0)
    }
    // let managerEC = companyReportTeamScores[5].filter((managerOverall) => {
    //     return (managerOverall.energyConsultants)
    // }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    // console.log("managerEC HERE OTHER ", managerEC)
    // let teamScore = companyReportTeamScores.filter((manager.) => {
    //     return (rep.Team === 'Boise')
    // }).sort((r1, r2) => sortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)


    // console.log("pocateloEC HERE1 ", pocatelloEC)
    // console.log("user HERE1 ", user)

    let ecListSort = energyConsultants.sort((r1, r2) => r2.ReportScore - r1.ReportScore)
    let fmListSort = fieldMarketers.sort((r1, r2) => r2.ReportScore - r1.ReportScore)


    let repsList = []
    let repsListSort = []
    let bendList = []
    let bendListSort = []
    let kfallsList = []

    let kfallsListSort = []
    let rexList = []
    let rexListSort = []

    // let remainder = []
    let ec = -1
    let fm = -1
    while (ec++ < energyConsultants.length) {

        if (energyConsultants[ec] !== undefined) {
            // console.log(energyConsultants[ec].Name)
            if (energyConsultants[ec].Name === 'Judd Ferguson')
                continue

            repsList.push(energyConsultants[ec])
            if (energyConsultants[ec].Team === "Rexburg") {
                rexList.push(energyConsultants[ec])

            } else if (energyConsultants[ec].Team === "Klamath Falls") {
                kfallsList.push(energyConsultants[ec])

            } else if (energyConsultants[ec].Team === "Bend") {
                bendList.push(energyConsultants[ec])
            }
        }
    }


    while (fm++ < fieldMarketers.length) {

        if (fieldMarketers[fm] !== undefined) {
            repsList.push(fieldMarketers[fm])
            if (fieldMarketers[fm].Team === "Rexburg") {
                rexList.push(fieldMarketers[fm])

            } else if (fieldMarketers[fm].Team === "Klamath Falls") {
                kfallsList.push(fieldMarketers[fm])

            } else if (fieldMarketers[fm].Team === "Bend") {
                bendList.push(fieldMarketers[fm])
            }
        }
    }

    // repsListSort = repsList.sort((r1, r2) => repsSortBy ? (r1[repsSortBy] > r2[repsSortBy] ? -1 : 1) : 0)
    repsListSort = repsList.sort((r1, r2) => r2.Score - r1.Score)

    kfallsListSort = kfallsList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    rexListSort = rexList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
    bendListSort = bendList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)


    const headOptions = [
        {sortBy: 'Score', label: 'Report Score'},
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


    let viewLeads = (user.roleId <= 4)
    let fullName = user.firstName + " " + user.lastName.replace(/\s/g, '')

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
                    <ReportTeamsTable/>

                    <div id="topreps"
                         className={teamState !== null ? "tab-content-bottom active" : "tab-content-bottom"}>
                        <div className="table-header">
                            <div className="table-header">
                                <table
                                    className={teamState === "Reps" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                    <thead>
                                    <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                        <th className="ec-sort"
                                        >FM
                                        </th>
                                        <th className="ec-sort score" param="DESC"
                                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}
                                        >
                                            <div className="popover fade right in" style={{left: "34%", top: "4%"}}>
                                                <div className="arrow" style={{top: "26%"}}/>
                                                {/*<h3 className="popover-title" style={{color: "#333333"}}>Scores</h3>*/}
                                                <div className="popover-content" style={{color: "#333333"}}>
                                                    Leads = 1<br/>
                                                    Sits = 2<br/>
                                                    Close = 3<br/>
                                                    Install = 4<br/>
                                                </div>
                                            </div>
                                            Score
                                        </th>
                                        <th className="ec-sort" param="DESC"
                                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}
                                        >Leads
                                        </th>
                                        <th className="ec-sort" param="DESC"
                                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}
                                        >QS
                                        </th>
                                        <th className="ec-sort" param="DESC"
                                            onClick={() => emit.SelectedStatsSortBy({sortBy: "AssistedCloses"})}
                                        >Assists
                                        </th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <table
                                className={teamState === "Klamath Falls" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>FM
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ReportStore"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Assists"})}>Assists
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Boise" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>FM
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ReportStore"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Assists"})}>Assists
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Pocatello" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>FM
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ReportStore"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Assists"})}>Assists
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Bend" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>FM
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ReportStore"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Assists"})}>Assists
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Rexburg" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>FM
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ReportStore"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Assists"})}>Assists
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Meridian" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>FM
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ReportStore"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Assists"})}>Assists
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Caldwell" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>FM
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ReportStore"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Assists"})}>Assists
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Twin Falls" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>FM
                                    </th>
                                    <th className="ec-sort score" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ReportStore"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Assists"})}>Assists
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
                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Assists</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    fmListSort !== null ? fmListSort.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || stat.Closes && stat.Name === fullName || user.roleId !== '10' && user.roleId < '6' && stat.Qs && stat.Closes === '-'
                                                    ?
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
                                                    <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.AssistedCloses}</td>

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

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                   {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    kfFM !== null ? kfFM.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || stat.Closes && stat.Name === fullName || user.roleId !== '10' && stat.Qs && stat.Closes === viewLeads || user.roleId !== '10' && user.roleId < '6' && stat.Qs && stat.Closes === '-' ?
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.AssistedCloses}</td>

                                            </tr>

                                            {
                                                stat.QsNames ?
                                                    <tr className="child-row" key={stat.Name}>
                                                        <td className="child-col" colspan='6'>
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
                                    }) : <tbody>
                                    <tr>
                                        <td colSpan="5">No data found</td>
                                    </tr>
                                    </tbody>

                                }
                            </table>
                            <table
                                className={teamState === "Bend" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                   {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    bendFM !== null ? bendFM.map((stat) => {
                                        // console.log("HERE bendFM ", bendFM)
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    stat.Name === 'Dennis Miller' && stat.Qs && stat.Closes === '-' || user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || user.roleId !== '5' && stat.Closes && stat.Name === fullName || user.roleId !== '10' && user.roleId < '6' && stat.Qs && stat.Closes === '-' ?
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
                                                                     style={{
                                                                         textAlign: "left",
                                                                         cursor: "pointer",
                                                                         paddingLeft: "16px"
                                                                     }}
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.AssistedCloses}</td>

                                            </tr>

                                            {
                                                stat.QsNames ?
                                                    <tr className="child-row" key={stat.Name}>
                                                        <td className="child-col" colspan='5'>
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
                                className={teamState === "Rexburg" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    rexFM !== null ? rexFM.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || user.roleId !== '5' && stat.Closes && stat.Name === fullName || user.roleId !== '10' && user.roleId < '6' && stat.Qs && stat.Closes === '-' ?
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
                                                    <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.AssistedCloses}</td>
                                            </tr>

                                            {
                                                stat.QsNames ?
                                                    <tr className="child-row" key={stat.Name}>
                                                        <td className="child-col" colspan='6'>
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
                                className={teamState === "Pocatello" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    pocatelloFM !== null ? pocatelloFM.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || user.roleId !== '5' && stat.Closes && stat.Name === fullName || user.roleId !== '10' && user.roleId < '6' && stat.Qs && stat.Closes === '-' ?
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
                                                    <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.AssistedCloses}</td>
                                            </tr>

                                            {
                                                stat.QsNames ?
                                                    <tr className="child-row" key={stat.Name}>
                                                        <td className="child-col" colspan='6'>
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
                                className={teamState === "Boise" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    boiseFM !== null ? boiseFM.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || user.roleId !== '5' && stat.Closes && stat.Name === fullName || user.roleId !== '10' && user.roleId < '6' && stat.Qs && stat.Closes === '-' ?
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
                                                    <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.AssistedCloses}</td>
                                            </tr>

                                            {
                                                stat.QsNames ?
                                                    <tr className="child-row" key={stat.Name}>
                                                        <td className="child-col" colspan='6'>
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
                                className={teamState === "Meridian" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    meridianFM !== null ? meridianFM.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || user.roleId !== '5' && stat.Closes && stat.Name === fullName || user.roleId !== '10' && user.roleId < '6' && stat.Qs && stat.Closes === '-' ?
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
                                                    <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.AssistedCloses}</td>
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
                                className={teamState === "Caldwell" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    caldwellFM !== null ? caldwellFM.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || user.roleId !== '5' && stat.Closes && stat.Name === fullName || user.roleId !== '10' && user.roleId < '6' && stat.Qs && stat.Closes === '-' ?
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
                                                    <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.AssistedCloses}</td>
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
                                className={teamState === "Twin Falls" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Qs"})}>QS</th>
                                    <th onClick={() => emit.SelectedStatsRepsSortBy({repsSortBy: "Closes"})}>Close</th>
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    twinFallsFM !== null ? twinFallsFM.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || user.roleId !== '5' && stat.Closes && stat.Name === fullName || user.roleId !== '10' && user.roleId < '6' && stat.Qs && stat.Closes === '-' ?
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
                                                    <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Leads}</td>
                                                <td>{stat.Qs}</td>
                                                <td>{stat.AssistedCloses}</td>
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
                        </div>
                        <div className="table-header" style={{borderTop: "9px solid #70899f"}}>
                            <div className="table-header">
                                <table
                                    className={teamState === "Reps" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                    <thead>
                                    <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                        <th className="ec-sort"
                                        >EC
                                        </th>
                                        <th className="ec-sort" param="DESC"
                                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}
                                        >Score
                                        </th>
                                        {/*<th className="ec-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}*/}
                                        {/*>Leads*/}
                                        {/*</th>*/}
                                        <th className="ec-sort" param="DESC"
                                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}
                                        >Sits
                                        </th>
                                        {/*<th className="ec-sort" param="DESC"*/}
                                        {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}*/}
                                        {/*>Close*/}
                                        {/*</th>*/}
                                        <th className="fm-sort" param="DESC" style={{width: "13%"}}
                                            onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstall"})}
                                        >
                                            Installs Scheduled
                                        </th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <table
                                className={teamState === "Klamath Falls" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>EC
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}>Sits
                                    </th>
                                    {/*<th className="ec-sort" param="DESC"*/}
                                    {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close*/}
                                    {/*</th>*/}
                                    <th className="fm-sort" param="DESC" style={{width: "13%"}}
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Boise" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>EC
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}>Sits
                                    </th>
                                    {/*<th className="ec-sort" param="DESC"*/}
                                    {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close*/}
                                    {/*</th>*/}
                                    <th className="fm-sort" param="DESC" style={{width: "13%"}}
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Pocatello" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>EC
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}>Sits
                                    </th>
                                    {/*<th className="ec-sort" param="DESC"*/}
                                    {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close*/}
                                    {/*</th>*/}
                                    <th className="fm-sort" param="DESC" style={{width: "13%"}}
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
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>EC
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}>Sits
                                    </th>
                                    {/*<th className="ec-sort" param="DESC"*/}
                                    {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close*/}
                                    {/*</th>*/}
                                    <th className="fm-sort" param="DESC" style={{width: "13%"}}
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
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>EC
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}>Sits
                                    </th>
                                    {/*<th className="ec-sort" param="DESC"*/}
                                    {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close*/}
                                    {/*</th>*/}
                                    <th className="fm-sort" param="DESC" style={{width: "13%"}}
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Managers" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>EC
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}>Sits
                                    </th>
                                    {/*<th className="ec-sort" param="DESC"*/}
                                    {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close*/}
                                    {/*</th>*/}
                                    <th className="fm-sort" param="DESC" style={{width: "13%"}}
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "MIT" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>EC
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}>Sits
                                    </th>
                                    {/*<th className="ec-sort" param="DESC"*/}
                                    {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close*/}
                                    {/*</th>*/}
                                    <th className="fm-sort" param="DESC" style={{width: "13%"}}
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Meridian" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>EC
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}>Sits
                                    </th>
                                    {/*<th className="ec-sort" param="DESC"*/}
                                    {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close*/}
                                    {/*</th>*/}
                                    <th className="fm-sort" param="DESC" style={{width: "13%"}}
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            <table
                                className={teamState === "Caldwell" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>EC
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}>Sits
                                    </th>
                                    {/*<th className="ec-sort" param="DESC"*/}
                                    {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close*/}
                                    {/*</th>*/}
                                    <th className="fm-sort" param="DESC" style={{width: "13%"}}
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "ScheduledInstalls"})}>
                                        Installs Scheduled
                                    </th>
                                </tr>
                                </thead>
                            </table>
                             <table className={teamState === "Twin Falls" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Name"})}>EC
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th className="ec-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Sits"})}>Sits
                                    </th>
                                    {/*<th className="ec-sort" param="DESC"*/}
                                    {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close*/}
                                    {/*</th>*/}
                                    <th className="fm-sort" param="DESC" style={{width: "13%"}}
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

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    ecListSort !== null ? ecListSort.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    stat.LeadNames.length > 0 && user.roleId <= 6 || stat.LeadNames.length > 0 && user.roleId >= 9 && stat.Name === fullName ?
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Sits}</td>
                                                {/*<td>{stat.Closes}</td>*/}
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
                                                                        <th>Sit Date</th>
                                                                        <th>Name</th>
                                                                        <th>FM</th>
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
                                                                                        {qs.FM}&nbsp;
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
                                className={
                                    teamState === "Klamath Falls" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    kfEC !== null ? kfEC.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    user.roleId !== '10' && stat.Qs && stat.Closes === '-' && stat.Name === fullName || stat.Closes && stat.Name === fullName || user.roleId !== '10' && stat.Qs && stat.Closes === viewLeads || user.roleId !== '10' && user.roleId < '6' && stat.Qs && stat.Closes === '-' ?
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Sits}</td>
                                                {/*<td>{stat.Closes}</td>*/}
                                                <td>{stat.ScheduledInstalls}</td>
                                            </tr>


                                            </tbody>
                                        )
                                    }) : null

                                }
                            </table>
                            <table
                                className={teamState === "Bend" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                   {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    bendEC !== null ? bendEC.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    stat.LeadNames.length > 0 && user.roleId === 9 && user.teamId === 14 || stat.LeadNames.length > 0 && user.roleId <= 6 || stat.LeadNames.length > 0 && user.roleId >= 10 && stat.Name === fullName ?
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Sits}</td>
                                                {/*<td>{stat.Closes}</td>*/}
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
                                                                        <th>Sit Date</th>
                                                                        <th>Name</th>
                                                                        <th>FM</th>
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
                                                                                        {qs.FM}&nbsp;
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
                                className={teamState === "Rexburg" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    rexEC !== null ? rexEC.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    stat.LeadNames.length > 0 && user.roleId === 9 && user.teamId === 8 || stat.LeadNames.length > 0 && user.roleId <= 6 || stat.LeadNames.length > 0 && user.roleId >= 10 && stat.Name === fullName ?
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Sits}</td>
                                                {/*<td>{stat.Closes}</td>*/}
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
                                                                        <th>Sit Date</th>
                                                                        <th>Name</th>
                                                                        <th>FM</th>
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
                                                                                        {qs.FM}&nbsp;
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
                                className={teamState === "Pocatello" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                   {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    pocatelloEC !== null ? pocatelloEC.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    stat.LeadNames.length > 0 && user.roleId === 9 && user.teamId === 15 || stat.LeadNames.length > 0 && user.roleId <= 6 || stat.LeadNames.length > 0 && user.roleId >= 10 && stat.Name === fullName ?
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Sits}</td>
                                                {/*<td>{stat.Closes}</td>*/}
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
                                                                        <th>Sit Date</th>
                                                                        <th>Name</th>
                                                                        <th>FM</th>
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
                                                                                        {qs.FM}&nbsp;
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
                                className={teamState === "Boise" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                   {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    boiseEC !== null ? boiseEC.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    stat.LeadNames.length > 0 && user.roleId === 9 && user.teamId === 2 || stat.LeadNames.length > 0 && user.roleId <= 6 || stat.LeadNames.length > 0 && user.roleId >= 10 && stat.Name === fullName ?
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Sits}</td>
                                                {/*<td>{stat.Closes}</td>*/}
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
                                                                        <th>Sit Date</th>
                                                                        <th>Name</th>
                                                                        <th>FM</th>
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
                                                                                        {qs.FM}&nbsp;
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
                                className={teamState === "Managers" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                   {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    managerEC !== null ? managerEC.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                <td className='padding-adjustment'>{stat.Name}</td>
                                                <td>{stat.WeekGrade}%</td>
                                                <td>{stat.Sits}</td>
                                                {/*<td>{stat.Closes}</td>*/}
                                                <td>{stat.ScheduledInstalls}</td>
                                            </tr>
                                            </tbody>
                                        )
                                    }) : null

                                }
                            </table>
                            <table
                                className={teamState === "MIT" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                   {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>
                                {
                                    mitEC !== null ? mitEC.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    stat.LeadNames.length > 0 && user.roleId === 9 && user.teamId === 8 || stat.LeadNames.length > 0 && user.roleId <= 6 || stat.LeadNames.length > 0 && user.roleId >= 10 && stat.Name === fullName ?
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Sits}</td>
                                                {/*<td>{stat.Closes}</td>*/}
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
                                                                        <th>Sit Date</th>
                                                                        <th>Name</th>
                                                                        <th>FM</th>
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
                                                                                        {qs.FM}&nbsp;
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
                                className={teamState === "Meridian" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                   {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    meridianEC !== null ? meridianEC.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    stat.LeadNames.length > 0 && user.roleId === 9 && user.teamId === 2 || stat.LeadNames.length > 0 && user.roleId <= 6 || stat.LeadNames.length > 0 && user.roleId >= 10 && stat.Name === fullName ?
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Sits}</td>
                                                {/*<td>{stat.Closes}</td>*/}
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
                                                                        <th>Sit Date</th>
                                                                        <th>Name</th>
                                                                        <th>FM</th>
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
                                                                                        {qs.FM}&nbsp;
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
                                className={teamState === "Meridian" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                   {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    caldwellEC !== null ? caldwellEC.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    stat.LeadNames.length > 0 && user.roleId === 9 && user.teamId === 2 || stat.LeadNames.length > 0 && user.roleId <= 6 || stat.LeadNames.length > 0 && user.roleId >= 10 && stat.Name === fullName ?
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Sits}</td>
                                                {/*<td>{stat.Closes}</td>*/}
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
                                                                        <th>Sit Date</th>
                                                                        <th>Name</th>
                                                                        <th>FM</th>
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
                                                                                        {qs.FM}&nbsp;
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
                                className={teamState === "Twin Falls" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                                <thead>
                                <tr>

                                    <th className="fm-sort" param="DESC"
                                        onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>Score
                                    </th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>Leads</th>
                                    <th onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS</th>
                                    {/*<th onClick={() => emit.SelectedStatsSortBy({sortBy: "Closes"})}>Close</th>*/}
                                    <th className="fm-sort" param="DESC">
                                        Assisted Close
                                    </th>
                                </tr>
                                </thead>

                                {
                                    twinFallsEC !== null ? twinFallsEC.map((stat) => {
                                        return (
                                            <tbody>
                                            <tr>
                                                {
                                                    stat.LeadNames.length > 0 && user.roleId === 9 && user.teamId === 2 || stat.LeadNames.length > 0 && user.roleId <= 6 || stat.LeadNames.length > 0 && user.roleId >= 10 && stat.Name === fullName ?
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
                                                        <td className='padding-adjustment'>{stat.Name}</td>
                                                }
                                                <td>{stat.ReportScore}%</td>
                                                <td>{stat.Sits}</td>
                                                {/*<td>{stat.Closes}</td>*/}
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
                                                                        <th>Sit Date</th>
                                                                        <th>Name</th>
                                                                        <th>FM</th>
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
                                                                                        {qs.FM}&nbsp;
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





