import Link from '../components/link'
import { view, emit } from '../framework'
import userStore from '../stores/userStore'
import salesforceStore from '../stores/salesforceStore'

export default view(function CurrentTable() {
    
    const { energyConsultants, fieldMarketers, teamScores, currentTable, tableMode, sortBy, reverseSort } = salesforceStore

    let sortedTable = []
    if (currentTable) {
        sortedTable = currentTable.sort((r1, r2) => sortBy ? (r1[sortBy] > r2[sortBy] ? -1 : 1) : 0)
        if (reverseSort) {
            sortedTable = sortedTable.reverse()
        }
        console.log("teamScores", teamScores);
        // console.log("currentTable", currentTable);
        console.log("sortedTable2", sortedTable[4]);
    }
    
    let companyLeads = 0
    let companyQs = 0
    let companyCloses = 0
    let companyInstalls = 0
    for (let i = 0; i < sortedTable.length; i++) {
        companyLeads += sortedTable[i].Leads
        companyQs += sortedTable[i].Qs
        companyCloses += sortedTable[i].Closes
        companyInstalls += sortedTable[i].Installs
    }

    const headOptions = [
        { sortBy: 'score', label: 'Score' },
        { sortBy: 'leads', label: 'Leads' },
        { sortBy: 'qs', label: 'QS' },
        
        { sortBy: 'assistedClose', label: 'Assisted Close'},
        { sortBy: 'close', label: 'Close' },
        { sortBy: 'assistedInstalls', label: 'Assisted Installs' },
        { sortBy: 'selfGeneratedInstalls', label: 'Self Generated Installs' },
    ]

    const dateOptions = [
        {value: "Today",}
    ]

    function changeTable(table, mode) {
        emit.ChangeTable({ table })
        emit.ChangeMode({ mode })
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
        }
        else if (timePeriod === "Last Week")  {
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - startDate.getDay() - 7)
            let now = new Date(startDate)
            now.setDate(startDate.getDate() + 6) 
            start = startDate.toISOString()
            start = start.split("T")
            end = now.toISOString()
            end = end.split("T")
        }
        else if (timePeriod === "This Month") {
            let now = new Date()
            //we want the 1st day of the month
            let days = now.getDate() - 1
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - days)
            start = startDate.toISOString()
            start = start.split("T")
            end = now.toISOString()
            end = end.split("T")
        }
        else if (timePeriod === "Last Month") {
            let now = new Date()
            now.setDate(0)
            let startDate = new Date(now)
            startDate.setDate(1)
            start = startDate.toISOString()
            start = start.split("T")
            end = now.toISOString()
            end = end.split("T")
        }
        else if (timePeriod === "This Year") {
            let now = new Date()
            start = new Date(now.getFullYear().toString())
            start = start.toISOString()
            start = start.split("T")
            end = new Date(now.getFullYear(), 12, 31, 23, 60, 60)
            end = end.toISOString()
            end = end.split("T")
        }
        else if (timePeriod === "Last Year") {
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
        }
        else if (timePeriod === "All Time") {
            start.push('1970-01-01')
            end.push('2069-12-31')
        }
        else {
            let difference = timePeriod.split(':')
            let startDate = new Date()
            let startDifference = startDate.getDate() - Number(difference[0])
            startDate.setDate(startDifference)
            start = startDate.toISOString()
            start = start.split("T")
            let endDifference = startDate.getDate() + Number(difference[1])
            startDate.setDate(endDifference)
            end = startDate.toISOString()
            end = end.split("T")
        }
        console.log('start')
        console.log(start[0])
        console.log('end')
        console.log(end[0])
        emit.GetStats({ start: start[0], end: end[0] })
    }

    return (
        <div id="content" className="content">        
            <div class="container">
                <div class="clear50"></div> 
                <div>
                  
                </div>
                <div class="clear50"></div>           	
                <div class="tab-section">
                    <div className="tab-option-holder">
                        <div className={tableMode === 'team' ? "teams-icon tab-option active" : "teams-icon tab-option"} onClick={changeTable.bind(this, teamScores, 'team')}><div class="icon-badge"></div>Teams</div>
                        <div className={tableMode === 'ec' || tableMode === 'fm' ? "topreps-icon tab-option active" : "teams-icon tab-option"}  onClick={changeTable.bind(this, energyConsultants, 'ec')}><div class="icon-badge"></div>Top Reps</div>
                    </div>
                    <div class="tab-content">
                        <div class="tab-content-top"> 
                            <strong>Period</strong><select className="period" style={{ display: "inline" }} id="periodSelect" onChange={changeDate.bind(this)}>
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
                            <div className="toggle-options open" style={tableMode !== 'team' ? {  float: "right"  } : { display: "none" }}>        					
                                <div className={tableMode === 'ec' ? "toggle-options-val active" : "toggle-options-val"} onClick={changeTable.bind(this, energyConsultants, 'ec')}>E.C.</div>
                                <div className={tableMode === 'fm' ? "toggle-options-val active" : "toggle-options-val"} onClick={changeTable.bind(this, fieldMarketers, 'fm')}>F.M.</div>
                                <div class="clear"></div>
                            </div>
                            {/* <div class="custom-time-holder">
                                <div class="clear20"></div>
                                Start <input type="date" name="prevtime" max="<?php echo date("Y-m-d"); ?>" value="<?php echo date("Y-m-d"); ?>">
                                End <input type="date" name="curtime" max="<?php echo date("Y-m-d"); ?>" value="<?php echo date("Y-m-d"); ?>">
                            </div> */}
                        </div>
                        <div id="teams" className={tableMode === 'team' ? "tab-content-bottom active" : "tab-content-bottom"}>
                            <div class="table-header">
                                <table>
                                    <thead>
                                        <tr>
                                            <th class="team-sort" param="DESC">Team</th>
                                            <th class="team-sort" param="DESC">Score</th>
                                            <th class="team-sort" param="DESC">Leads</th>
                                            <th class="team-sort" param="DESC">QS</th>
                                            <th class="team-sort" param="DESC">Close</th>                                            
                                            <th class="team-sort" param="DESC">Installs</th>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="table-content">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Team</th>
                                            <th>Score</th>
                                            <th>Leads</th>
                                            <th>QS</th>
                                            <th>Close</th>
                                            <th>Installs</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className='greyColor active'>
                                            <td className="greyColor">Company</td>
                                            <td className="greyColor"></td>
                                            <td className="greyColor">{companyLeads}</td>
                                            <td className="greyColor">{companyQs}</td>
                                            <td className="greyColor">{companyCloses}</td>
                                            <td className="greyColor">{companyInstalls}</td>
                                        </tr>
                                        {
                                            sortedTable !== null ? sortedTable.map((stat) => {
                                                return (
                                                    <tr>
                                                        
                                                          {/*<td>{stat.Name}</td>*/}
                                                          <td>{stat.Name}</td>
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
                        <div id="topreps" className={tableMode !== 'team' ? "tab-content-bottom active" : "tab-content-bottom"}>
                            <div class="table-header">
                                <table className={tableMode === "ec" ? "table-ec active" : "table-ec"}>
                                    <thead>
                                        <tr>
                                            <th class="ec-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Name" })}>Rep</th>
                                            <th class="ec-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Score" })}>Score</th>
                                            <th class="ec-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Leads" })}>Leads</th>
                                            <th class="ec-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Qs" })}>QS</th>
                                            <th class="ec-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Closes" })}>Close</th>
                                            <th class="ec-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "AssistedInstalls" })}>Assisted Installs</th>                                  
                                            <th class="ec-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "SelfGenInstall" })}>Self Generated Installs</th>                                        
                                        </tr>
                                    </thead>
                                </table>
                                <table className={tableMode === "fm" ? "table-fm active" : "table-fm"}>
                                    <thead>
                                        <tr>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Name" })}>Rep1</th>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Score" })}>Score</th>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Leads" })}>Leads</th>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Qs" })}>QS</th>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "AssistedCloses" })}>Assisted Close</th>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "AssistedInstalls" })}>Assisted Installs</th>                                                                      
                                        </tr>
                                    </thead>
                                </table>
                            </div>  
                            <div class="table-content">
                                <table className={tableMode === "ec" ? "table-ec active" : "table-ec"}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Score" })}>Score</th>
                                            <th onClick={() => emit.SelectedStatsSortBy({ sortBy: "Leads" })}>Leads</th>
                                            <th onClick={() => emit.SelectedStatsSortBy({ sortBy: "Qs" })}>QS</th>
                                            <th onClick={() => emit.SelectedStatsSortBy({ sortBy: "Closes" })}>Close</th>
                                            <th onClick={() => emit.SelectedStatsSortBy({ sortBy: "AssistedInstalls" })}>Assisted Installs</th>                                  
                                            <th onClick={() => emit.SelectedStatsSortBy({ sortBy: "SelfGenInstall" })}>Self Generated Installs</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sortedTable !== null ? sortedTable.map((stat) => {
                                                return (
                                                    <tr>
                                                        <td>{stat.Name}</td>
                                                        <td>{stat.Score}</td>
                                                        <td>{stat.Leads}</td>
                                                        <td>{stat.Qs}</td>
                                                        <td>{stat.Closes}</td>
                                                        <td>{stat.AssistedInstalls}</td>
                                                        <td>{stat.SelfGenInstall}</td>
                                                    </tr>
                                                )
                                            }) : null
                                        } 
                                    </tbody>
                                </table>
                                <table className={tableMode === "fm" ? "table-fm active" : "table-fm"}>
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Score" })}>Score</th>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Leads" })}>Leads</th>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "Qs" })}>QS</th>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "AssistedCloses" })}>Assisted Close</th>
                                            <th class="fm-sort" param="DESC" onClick={() => emit.SelectedStatsSortBy({ sortBy: "AssistedInstalls" })}>Assisted Installs</th>                                                                        
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            sortedTable !== null ? sortedTable.map((stat) => {
                                                return (
                                                    <tr>
                                                        <td>{stat.Name}</td>
                                                        <td>{stat.Score}</td>
                                                        <td>{stat.Leads}</td>
                                                        <td>{stat.Qs}</td>
                                                        <td>{stat.AssistedCloses}</td>
                                                        <td>{stat.AssistedInstalls}</td>
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
        </div>
    )
})