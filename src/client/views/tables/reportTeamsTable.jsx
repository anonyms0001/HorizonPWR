import React from 'react';
import {view, emit} from '../../framework'
// import userStore from '../../stores/userStore'
import weekStatsStore from "../../stores/weekStatsStore"
import salesforceStore from '../../stores/salesforceStore'


export default view(function ReportTeamsTable() {

    const {companyReportTeamScores, companyReportScores} = weekStatsStore
    const {teamScores, teamState, sortBy, tableMode, statesScore, sortTeamBy, energyConsultants, fieldMarketers,} = salesforceStore

    console.log("companyReportTeamScores HERE ", companyReportTeamScores)

    let teamScoresSort = []
    //teamScoresSort = teamScores.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)//
    teamScoresSort = companyReportTeamScores.sort((r1, r2) => sortTeamBy ? (r1[sortTeamBy] > r2[sortTeamBy] ? -1 : 1) : 0)

    // let rexFM = fieldMarketers.filter((rep) => {
    //     return (rep.Team === 'Rexburg')
    // })
    // let rexEC = energyConsultants.filter((rep) => {
    //     return (rep.Team === 'Rexburg')
    // })
    // let bendFM = fieldMarketers.filter((rep) => {
    //     return (rep.Team === 'Bend')
    // })
    // let bendEC = energyConsultants.filter((rep) => {
    //     return (rep.Team === 'Bend')
    // })
    // let kfFM = fieldMarketers.filter((rep) => {
    //     return (rep.Team === 'Klamath Falls')
    // })
    // let kfEC = energyConsultants.filter((rep) => {
    //     return (rep.Team === 'Klamath Falls')
    // })
    // //Rexburg Report Score starts
    // let rexTeamStats = teamScoresSort.filter((team) => {
    //     return (team.Name === 'Rexburg')
    // })
    // let leadsPRA = rexTeamStats[0].Leads / rexFM.length
    // let rexLeadsScore = ((leadsPRA/8)*.8)

    // let qsPRA = rexTeamStats[0].Qs / rexTeamStats[0].Leads

    // //Rexburg Report Score ends
    // let bendTeamLeads = teamScoresSort.filter((team) => {
    //     return (team.Name === 'Bend')
    // })
    // let kfTeamLeads = teamScoresSort.filter((team) => {
    //     return (team.Name === 'Klamath Falls')
    // })


    return (
        <div id="teams"
             className={teamState === null ? "tab-content-bottom active" : "tab-content-bottom"}>
            <div className="table-header">
                <table>
                    <thead>
                    <tr style={{backgroundColor: " #e79236"}}>
                        <th className="team-sort" param="DESC">Team</th>
                        <th className="team-sort score" param="DESC"
                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Score"})}>

                            Report Cards
                        </th>

                        <th className="team-sort" param="DESC"
                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>
                            Leads
                        </th>
                        <th className="team-sort" param="DESC"
                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                        </th>
                        {/*<th className="team-sort" param="DESC"*/}
                        {/*    onClick={() => emit.SelectedStatsSortBy({sortBy: "Close"})}>Close*/}
                        {/*</th>*/}
                        <th className="team-sort" param="DESC"
                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Installs"})}>Scheduled Installs
                        </th>
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
                        <th>QS</th>
                        {/*<th>Close</th>*/}
                        <th>Scheduled Installs</th>
                    </tr>
                    </thead>
                    <tbody id='teams-grouping'>
                    {
                        teamScoresSort !== null ? teamScoresSort.map((statTeam, index) => {
                            if (statTeam.Name !== 'Idaho' && statTeam.Name !== 'Oregon' && statTeam.Name !== 'Wolf' && statTeam.Name !== 'Fox' && statTeam.Name !== 'PWR Dialers' && statTeam.Name !== 'Amp' && statTeam.Name !== 'Medford' && statTeam.Name !== 'Managers') {
                                //
                                return (
                                    <tr>
                                        <td className={tableMode === 'fm' ? "teams-icon greyColor  active" : "teams-icon  "}>
                                            {/*<a className="greyColor" style={{cursor: "pointer"}}
                                               onClick={() => emit.TeamStateChange(statTeam.Name)}>
                                                {statTeam.Name}
                                            </a>*/}
                                            <div style={{paddingLeft: "15px", textAlign: "left"}}>
                                                <a className="greyColor" style={{cursor: "pointer"}}
                                                   onClick={() => emit.TeamStateChange(statTeam.Name)}>
                                                    {statTeam.Name === 'Managers' ? 'Regional Managers' : statTeam.Name}
                                                </a>
                                                {/*{ statTeam.Name !== "Managers" ?*/}
                                                {/*    return({*/}
                                                    &nbsp;&nbsp;<span
                                                    style={ statTeam.Name === "Managers" ? {display: "none"} : {fontSize: "11px"}}>{statTeam.Name === "Rexburg" ? companyReportScores.rexWins : statTeam.Name === "Boise" ? companyReportScores.boiseWins : statTeam.Name === "Bend" ? companyReportScores.bendWins : statTeam.Name === "Pocatello" ? companyReportScores.pocatelloWins : statTeam.Name === "Klamath Falls" ? companyReportScores.kfWins : 0}W-{statTeam.Name === "Rexburg" ? (companyReportScores.pastWeeks - companyReportScores.rexWins) : statTeam.Name === "Boise" ? (companyReportScores.pastWeeks - companyReportScores.boiseWins) : statTeam.Name === "Bend" ? (companyReportScores.pastWeeks - companyReportScores.bendWins) : statTeam.Name === "Pocatello" ? (companyReportScores.pastWeeks - companyReportScores.pocatelloWins) : statTeam.Name === "Klamath Falls" ? (companyReportScores.pastWeeks - companyReportScores.kfWins) : 0}</span>
                                                {/*})*/}
                                                {/*    : ''}*/}
                                            </div>
                                        </td>
                                        <td>
                                            {statTeam.Score ? statTeam.Score : statTeam.teamScore ? statTeam.teamScore.toFixed(0) : 0}%
                                        </td>
                                        <td>
                                            {statTeam.ECLeads ? statTeam.ECLeads + statTeam.Leads : statTeam.Leads}
                                        </td>
                                        <td>{statTeam.Qs ? statTeam.Qs : statTeam.Sits}</td>
                                        {/*<td>{statTeam.Closes}</td>*/}
                                        <td>{statTeam.Installs ? statTeam.Installs : statTeam.ScheduledInstalls}</td>
                                    </tr>
                                )
                            }
                        }) : null
                    }
                    </tbody>
                </table>

            </div>
        </div>

    )
})




