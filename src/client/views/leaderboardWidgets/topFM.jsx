import {emit, view} from "../../framework";

import salesforceStore from '../../stores/salesforceStore'

export default view(function TopFM() {
    // const {fmStats, sortByFM} = fmStore
    const { fieldMarketers, staticSort, reverseSort } = salesforceStore

    let f = 0
    let fmStatsTop = []
    while (++f < fieldMarketers.length) {
        if (fieldMarketers[f].Score > 0) {
            fmStatsTop.push(fieldMarketers[f])
        }
    }

    let fmStatsSort = []
    let fmStatsTopSort = []

    fmStatsTopSort = fmStatsTop.sort((r1, r2) => staticSort ? (r1[staticSort] > r2[staticSort] ? -1 : 1) : 0)

    let fmListSort = fieldMarketers.sort((r1, r2) => r2.ReportScore - r1.ReportScore)


    return (
        <div className="panel  panel-default">
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

            <ul className="list-group" style={{overflowY: "hidden"}} >
                {

                    // initOtherTables === 'fm' && sortedTableFM.length !== 0 ? sortedTableFM.map((stat1) => {
                    // fmStatsSort !== null ? fmStatsSort.map((stat1) => {
                    fmListSort.length !== 0 ? fmListSort.map((stat1) => {

                        return (
                            <li className="list-group-item">
                                <div className="info-wrapper">
                                    <button className="btn btn-primary"
                                            type="button">{stat1.Name }
                                        {/*<span className="badge"*/}
                                        {/*      style={{marginLeft: "10px"}}>Score: {stat1.Score} - {stat1.Team}</span>*/}
                                        <span className="badge"
                                              style={{marginLeft: "10px"}}>Score: {stat1.ReportScore}%</span>
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