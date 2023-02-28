import {emit, view} from "../../framework";
import salesforceStore from '../../stores/salesforceStore'

export default view(function TopEC() {

    // const {ecStats, sortByEC} = ecStore
    const { energyConsultants,  staticSort, reverseSort } = salesforceStore

    // console.log("staticSort ", staticSort)

    let e = -1
    let ecStatsTop = []
    while (++e < energyConsultants.length) {
        // console.log(energyConsultants[e])
        if (energyConsultants[e].Score > 0) {
            ecStatsTop.push(energyConsultants[e])
        }
    }

    // console.log(ecStats)

    let ecStatsSort = []
    let ecStatsTopSort = []

    // function changeTableFM(table, mode, initOtherTables) {
    //     console.log("CHANGE TABLE RAN", mode, initOtherTables)
    //     emit.changeTableFM({table})
    //     emit.ChangeMode({mode, initOtherTables})
    //     // emit.ChangeMode({initOtherTables})
    //
    // }
    // ecStatsSort = ecStats.sort((r1, r2) => sortByEC ? (r1[sortByEC] > r2[sortByEC] ? -1 : 1) : 0)
    // ecStatsTopSort = ecStatsTop.sort((r1, r2) => sortByEC ? (r1[sortByEC] > r2[sortByEC] ? -1 : 1) : 0)
    ecStatsTopSort = ecStatsTop.sort((r1, r2) => staticSort ? (r1[staticSort] > r2[staticSort] ? -1 : 1) : 0)
    let ecListSort = energyConsultants.sort((r1, r2) => r2.ReportScore - r1.ReportScore)

    function changeDateEC() {
        let timePeriod = document.getElementById('periodSelectEC').value

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
            console.log("start difference ", startDifference)
            startDate.setDate(startDifference)
            start = startDate.toIsoString()
            console.log("start else ", start[0])
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


        emit.GetStatsEC({start: start[0], end: end[0]})
    }


    return (
        <div className="panel  panel-default">
            <div className="panel-heading">
                <div style={{display: "flex"}}>
                    <div style={{flex: "1", textAlign: "left"}}>TOP ENERGY CONSULTANTS</div>
                    {/*<select className="period"*/}
                    {/*        style={{display: "inline", float: "right", color: "black"}}*/}
                    {/*        id="periodSelectEC" onInput={changeDateEC.bind(this)}*/}
                    {/*>*/}
                    {/*    <option value="0:0">Today</option>*/}
                    {/*    <option value="1:0">Yesterday</option>*/}
                    {/*    <option value="This Week">This Week</option>*/}
                    {/*    <option value="Last Week">Last Week</option>*/}
                    {/*    <option value="This Month">This Month</option>*/}
                    {/*    <option value="Last Month">Last Month</option>*/}
                    {/*    <option value="90:90">This Quarter</option>*/}
                    {/*    <option value="This Year">This Year</option>*/}
                    {/*    <option value="Last Year">Last Year</option>*/}
                    {/*    <option value="All Time">All Time</option>*/}
                    {/*</select>*/}
                </div>
            </div>

            <ul className="list-group" style={{overflowY: "hidden"}}>
                {

                    // initOtherTables === 'fm' && sortedTableFM.length !== 0 ? sortedTableFM.map((stat1) => {
                    ecListSort.length !== 0 ? ecListSort.filter(stat1 => stat1.Name !== 'Rob Thornburgh' && stat1.Name !== 'Cayden Larsen').map((stat1) =>{

                        return (
                            <li className="list-group-item">
                                <div className="info-wrapper">
                                    <button className="btn btn-primary"
                                            type="button">{stat1.Name }
                                        <span className="badge"
                                        style={{marginLeft: "10px"}}>Score: {stat1.ReportScore}%</span>
                                        {/*<span className="badge"*/}
                                        {/*      style={{marginLeft: "10px"}}>Score: {stat1.Score} - {stat1.Team}</span>*/}
                                    </button>
                                </div>
                            </li>
                        )
                    }) : (
                        <h5 style={{textAlign: "center"}}>Everyone have 0 leads  </h5>)

                }
            </ul>
        </div>
    )
})