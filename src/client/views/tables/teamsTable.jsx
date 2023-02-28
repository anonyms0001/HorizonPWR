import React from 'react';
import {view, emit} from '../../framework'
// import userStore from '../../stores/userStore'
import salesforceStore from '../../stores/salesforceStore'
import teamStatsStore from '../../stores/teamStatsStore'


export default view(function TeamsTable() {

    const {teamScores, teamState, sortBy, tableMode, statesScore} = salesforceStore


    // console.log("STATE SCORE IN STATE TABLE VIEW ", statesScore)
    console.log("TEAM STATE ", statesScore)
        // console.log("TEAM Scores ", teamScores)
    // let statesScoresSort = []
    // statesScoresSort = statesScore.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)

    let teamScoresSort = []
    teamScoresSort = teamScores.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)

    // function changeTeamState(teamState) {
    //     // console.log("CHANGE TABLE RUN ", mode)
    //     // emit.ChangeTable({table})
    //     emit.TeamStateChange({teamState})
    // }


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
                            <div className="popover fade right in" style={{left: "34%", top: "4%"}}>
                                <div className="arrow" style={{top: "26%"}}></div>
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

                        <th className="team-sort" param="DESC"
                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Leads"})}>
                            Leads
                        </th>
                        <th className="team-sort" param="DESC"
                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Qs"})}>QS
                        </th>
                        <th className="team-sort" param="DESC"
                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Close"})}>Close
                        </th>
                        <th className="team-sort" param="DESC"
                            onClick={() => emit.SelectedStatsSortBy({sortBy: "Installs"})}>Scheduled Installs
                        </th>
                    </tr>
                    </thead>
                </table>
            </div>
            <div className="table-content">
                <table className="table table-striped" style={{marginBottom: "0px"}}>
                    <thead>
                    <tr>
                        <th>Team</th>
                        <th>Score</th>
                        <th>Leads</th>
                        <th>QS</th>
                        <th>Close</th>
                        <th>Scheduled Installs</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        teamScoresSort !== null ? teamScoresSort.map((stat) => {
                            if (stat.Name !== 'Idaho' && stat.Name !== 'Oregon' && stat.Name !== 'Wolf' && stat.Name !== 'Fox' && stat.Name !== 'PWR Dialers' && stat.Name !== 'Amp' &&  stat.Name !== 'Boise' &&  stat.Name !== 'Medford' &&  stat.Name !== 'Klamath Falls' ) {
                                // console.log("STAT NAME ", stat.Name)
                                return (
                                    <tr>
                                        <td className={tableMode === 'fm' ? "teams-icon greyColor  active" : "teams-icon  "}>
                                            <a className="greyColor" style={{cursor: "pointer"}}
                                               onClick={() => emit.TeamStateChange(stat.Name)}>
                                                {stat.Name}
                                            </a>
                                        </td>
                                        <td>{stat.Score}</td>
                                        <td>{stat.Leads}</td>
                                        <td>{stat.Qs}</td>
                                        <td>{stat.Closes}</td>
                                        <td>{stat.Installs}</td>
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




