// import Link from '../../components/link'
import {view, emit} from '../../framework'
// import StatesTable from './tables/statesTable'
// import TeamsTable from './tables/teamsTable'
import ReportTeamsTable from './reportTeamsTable'
import userStore from '../../stores/userStore'
import salesforceStore from '../../stores/salesforceStore'
import sessionStore from '../../stores/sessionStore'


export default view(function ReportsLeaderboard() {

    const {user} = sessionStore
    const {energyConsultants, fieldMarketers, teamScores, currentTable, teamState, tableMode, sortBy, reverseSort, repNameSelection} = salesforceStore

    let rexFMCount = fieldMarketers.filter((rep) => {
        return (rep.Team === 'Rexburg')
    })
    let rexECCount = energyConsultants.filter((rep) => {
        return (rep.Team === 'Rexburg')
    })

    console.log("rexFMCount HERE ", rexFMCount)
    console.log("rexECCount HERE ", rexECCount)


    let repsList = []
    let repsListSort = []


    // let remainder = []
    let ec = -1
    let fm = -1
    while (ec++ < energyConsultants.length) {

        if (energyConsultants[ec] !== undefined) {
            // console.log(energyConsultants[ec].Name)
            if (energyConsultants[ec].Name === 'Judd Ferguson')
                continue

            repsList.push(energyConsultants[ec])

        }
    }


    while (fm++ < fieldMarketers.length) {

        if (fieldMarketers[fm] !== undefined) {
            repsList.push(fieldMarketers[fm])

        }
    }

    repsListSort = repsList.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
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


    let viewLeads = (user.roleId <= 4)
    let fullName = user.firstName + " " + user.lastName

    return (
        <div id='reps-view'>
            <table
                className={teamState === "Reps" ? "table table-striped table-ec active" : "table table-striped table-ec"}>
                <thead>
                <tr style={{backgroundColor: "rgb(231, 146, 54)"}}>
                    <th className="ec-sort" param="DESC"
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
        </div>

    )


}