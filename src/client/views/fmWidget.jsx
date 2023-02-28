import {emit, view} from "../framework";
// import fmStore from '../stores/fmStore'
import salesforceStore from '../stores/salesforceStore'

export default view(function FMWidget() {
    // const {fmStats, sortByFM} = fmStore
    const { fieldMarketers, staticSort, reverseSort } = salesforceStore

    let f = -1
    let fmStatsTop = []
    while (++f < fieldMarketers.length) {
        if (fieldMarketers[f].Score > 0) {
            fmStatsTop.push(fieldMarketers[f])
        }
    }
    // console.log("FM STATS TOP ARRAY ", fmStatsTop) ,
    // console.log("FM STATS LENGTH ", fmStatsTop.length)

    // console.log(fmStats)

    let fmStatsSort = []
    let fmStatsTopSort = []

    // function changeTableFM(table, mode, initOtherTables) {
    //     console.log("CHANGE TABLE RAN", mode, initOtherTables)
    //     emit.changeTableFM({table})
    //     emit.ChangeMode({mode, initOtherTables})
    //     // emit.ChangeMode({initOtherTables})
    //
    // }
    // fmStatsSort = fmStats.sort((r1, r2) => sortByFM ? (r1[sortByFM] > r2[sortByFM] ? -1 : 1) : 0)
    // fmStatsTopSort = fmStatsTop.sort((r1, r2) => sortByFM ? (r1[sortByFM] > r2[sortByFM] ? -1 : 1) : 0)
    fmStatsTopSort = fmStatsTop.sort((r1, r2) => staticSort ? (r1[staticSort] > r2[staticSort] ? -1 : 1) : 0)

    function changeDateEC() {
        let timePeriod = document.getElementById('periodSelectEC').value
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
            console.log("DIFFERENCE ", difference)
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


        console.log('start fm')
        console.log(start[0])
        console.log('end fm')
        console.log(end[0])


        emit.GetStatsFM({start: start[0], end: end[0]})
    }


    return (
        <div className="panel  panel-default" style={{boxShadow: "0 1px 24px 0 rgba(0,0,0,.25)",
    border: "0"}}>
            <div className="panel-heading">
                <div style={{display: "flex"}}>
                    <div style={{flex: "1", textAlign: "left"}}>TOP FIELD MARKETERS</div>
                    {/*<select className="period"*/}
                    {/*        style={{display: "inline", float: "right", color: "black"}}*/}
                    {/*        id="periodSelectEC" onInput={changeDateEC.bind(this)}*/}
                    {/*         >*/}
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

            <ul className="list-group">
                {

                    // initOtherTables === 'fm' && sortedTableFM.length !== 0 ? sortedTableFM.map((stat1) => {
                    // fmStatsSort !== null ? fmStatsSort.map((stat1) => {
                    fmStatsTopSort.length !== 0 ? fmStatsTopSort.slice(0, 3).map((stat1) => {

                        return (
                            <li className="list-group-item">
                                <div className="info-wrapper">
                                    <button className="btn btn-primary"
                                            type="button">{stat1.Name }
                                        <span className="badge"
                                              style={{marginLeft: "10px"}}>Score: {stat1.Score} </span>
                                    </button>
                                </div>
                            </li>
                        )
                    }) : (
                        <h5 style={{textAlign: "center"}}>Everyone have 0 leads </h5>)

                }
            </ul>
        </div>
    )
})