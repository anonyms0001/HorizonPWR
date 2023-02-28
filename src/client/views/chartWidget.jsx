// import React, { useMemo } from "react";
import {emit, view} from "../framework";
import CompanyChart from './charts/companyChart'
// import KFChart from './charts/kfChart'
// import BoiseChart from './charts/boiseChart'
// import RexburgChart from './charts/rexburgChart'
import IdahoChart from './charts/idahoChart'
import OregonChart from './charts/oregonChart'
import weekStatsStore from "../stores/weekStatsStore";

export default view(function ChartWidget() {
      const {teamState, currentDateRange, datePickerOption} = weekStatsStore
    //  console.log("currentDateRange ", currentDateRange)
    // console.log("datePickerOption ", datePickerOption)

    function changeDateChart() {
        let timePeriod = document.getElementById('periodSelectChart').value

        let start = []
        let end = []
        if (timePeriod === "This Week") {
            let now = new Date()
            let days = now.getDay()
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - days)
            start = startDate.toIsoString()
            start = start.split("T")
            end = now.toIsoString()
            end = end.split("T")
        } else if (timePeriod === "Last Week") {
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - startDate.getDay() - 7)
            let now = new Date(startDate)
            now.setDate(startDate.getDate() + 6)
            start = startDate.toIsoString()
            start = start.split("T")
            end = now.toIsoString()
            end = end.split("T")
        } else if (timePeriod === "This Month") {
            let now = new Date()
            //we want the 1st day of the month
            let days = now.getDate() - 1
            let startDate = new Date()
            startDate.setDate(startDate.getDate() - days)
            start = startDate.toIsoString()
            start = start.split("T")
            end = now.toIsoString()
            end = end.split("T")
        } else if (timePeriod === "Last Month") {
            let now = new Date()
            now.setDate(0)
            let startDate = new Date(now)
            startDate.setDate(1)
            start = startDate.toIsoString()
            start = start.split("T")
            end = now.toIsoString()
            end = end.split("T")
        } else if (timePeriod === "This Year") {
            let now = new Date()
            start = new Date(now.getFullYear().toString())
            start = start.toIsoString()
            start = start.split("T")
            end = new Date(now.getFullYear(), 12, 31, 23, 60, 60)
            end = end.toIsoString()
            end = end.split("T")
        } else if (timePeriod === "Last Year") {
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
        } else if (timePeriod === "Custom Date") {
            emit.DatePickerChange("custom_date")
            return
        } else if (timePeriod === "This Quarter") {
            let d = new Date()
            d.setHours(d.getHours() - 6);
            let todayString = d.toISOString()
            let todayFormatted = todayString.split('T')
            let qStart
            let q1Start = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
            let q2Start = new Date(Date.UTC(d.getUTCFullYear(), 3, 1))
            let q3Start = new Date(Date.UTC(d.getUTCFullYear(), 6, 1))
            let q4Start = new Date(Date.UTC(d.getUTCFullYear(), 9, 1))
            let monthVal = d.getMonth()
            //date ranges that includes today's date

            qStart = (monthVal <= 2 ? q1Start : monthVal >= 3 && monthVal <= 5 ? q2Start : monthVal >= 6 && monthVal <= 8 ? q3Start : q4Start)

            // console.log("qStart and todayFormatted ", qStart, todayFormatted)
            start[0] = qStart
            end[0] = todayFormatted[0]
        } else {
            let difference = timePeriod.split(':')

            let startDate = new Date()
            let startDifference = startDate.getDate() - Number(difference[0])
            // console.log("start difference ", startDifference)
            startDate.setDate(startDifference)
            start = startDate.toIsoString()
            // console.log("start else ", start[0])
            start = start.split("T")
            let endDifference = startDate.getDate() + Number(difference[1])
            startDate.setDate(endDifference)
            end = startDate.toIsoString()
            end = end.split("T")
        }


        console.log('start')
        console.log(start[0])
        console.log('end')
        console.log(end[0])

        emit.currentDateRangeChange({start: start[0], end: end[0]})
        if (timePeriod === "This Week"){
            emit.GetStatsWeek({start: start[0], end: end[0], render: 'init'})
        
        }else{
            emit.GetStatsWeek({start: start[0], end: end[0], render: 'noWeek'})
        }
        
        emit.GetStatsFM({start: start[0], end: end[0]})
        emit.GetStatsEC({start: start[0], end: end[0]})
        emit.GetStats({start: start[0], end: end[0]})
    }

    let today = new Date()
    let formattedToday = ""
    let fromCurrentDate = new Date(currentDateRange.end)
    if(currentDateRange.end < today) {
        formattedToday = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate())
    }else{
        formattedToday = currentDateRange.end
    }
    const absoluteToday = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate())

       function changeAllTime() {
        let start = []
        let now = new Date()
        let days = now.getDay()
        let startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
        start = startDate.toIsoString()
        start = start.split("T")
        emit.currentDateRangeChange({start: start[0], end: absoluteToday})
        emit.GetStatsWeek({start: start[0], end: absoluteToday})
        emit.GetStatsFM({start: start[0], end: absoluteToday})
        emit.GetStatsEC({start: start[0], end: absoluteToday})
        emit.GetStats({start: start[0], end: absoluteToday})

        emit.DatePickerChange("dropdown")
    }

    return (
        <div className="panel panel-default" style={{boxShadow: "0 1px 24px 0 rgba(0,0,0,.25)",
    border: "0"}}>
            <div className="panel-heading">
                <div style={{display: "flex"}}>
                    <div style={{flex: "1", textAlign: "left"}}>
                        {teamState === "Reps" ? "COMPANY" : teamState === "Boise" ? "BOISE" : teamState === "Klamath Falls" ? "KLAMATH FALLS" : teamState === "Rexburg" ? "REXBURG" : teamState === "Idaho" ? "IDAHO" : teamState === "Oregon" ? "OREGON" : teamState === "PWR Dialers" ? "PWR DIALERS" : teamState === "Amp" ? "AMP" : teamState === "Medford" ? "MEDFORD" : teamState === "Bend" ? "BEND" : teamState === "Pocatello" ? "POCATELLO" : teamState === "MIT" ? "MIT" : teamState === "Meridian" ? "MERIDIAN" : teamState === "Caldwell" ? "CALDWELL" : teamState === "Twim Falls" ? "TWIN FALLS" : "COMPANY"} SNAPSHOTS
                    </div>
                       {
                        datePickerOption === "custom_date" ?
                            //custom date picker form
                            <form action=""
                                  onSubmit={e => {
                                      e.preventDefault()
                                      console.log("START and END ", document.getElementById('startDate').value,  document.getElementById('endDate').value)
                                       emit.GetStatsFM({
                                          start: document.getElementById('startDate').value,
                                          end: document.getElementById('endDate').value
                                      })
                                      emit.GetStatsEC({
                                          start: document.getElementById('startDate').value,
                                          end: document.getElementById('endDate').value
                                      })
                                    
                                       
                                      emit.GetStats({
                                          start: document.getElementById('startDate').value,
                                          end: document.getElementById('endDate').value
                                      })

                                       emit.GetStatsWeek({
                                          start: document.getElementById('startDate').value,
                                          end: document.getElementById('endDate').value
                                      })
                                  }}  style={{maxWidth: "365px"}}>
                                <div className="input-group">
                            <span className="input-group-addon" id="basic-addon1" onClick={changeAllTime.bind()}>
                                <div className="popover fade top in" style={{top: "-47px", left: "-19%"}}>
                                      <div className="arrow"></div>
                                        {/*<h3 className="popover-title" style={{color: "#333333"}}>Scores</h3>*/}
                                      <div className="popover-content" style={{color: "#333333"}}>
                                        Back to Fix Date Selector
                                     </div>
                                </div>
                                <span className="glyphicon glyphicon-calendar"></span>
                            </span>
                                    <input id="startDate" type="date" name="start_date"
                                           style={{padding: "5px 0px 5px 2px", color: "#000000", maxWidth: "133px"}}
                                           defaultValue={currentDateRange.start} max={absoluteToday}/>
                                    <input id="endDate" type="date" name="end_date"
                                           style={{padding: "5px 0px 5px 2px", color: "#000000", maxWidth: "133px"}}
                                           defaultValue={formattedToday} max={absoluteToday}/>
                                    <span className="input-group-btn">
                                    <button className="btn btn-default" type="submit" name="submit">Go!</button>
                                </span>

                                </div>
                            </form>
                            :
                            //fixed dropdown date picker
                           <div className="input-group"  style={{maxWidth: "155px", flex: "1"}}>
                                    <span id="custom_date_btn" className="input-group-addon" style={{cursor: "pointer"}} onClick={() =>emit.DatePickerChange("custom_date")}>
                                        <div id="custom-popover" className="popover fade top in" style={{top: "-46px", left: "-44%"}}>
                                              <div className="arrow"></div>
                                            {/*<h3 className="popover-title" style={{color: "#333333"}}>Scores</h3>*/}
                                            <div className="popover-content" style={{color: "#333333", padding: "9px"}}>
                                             Use Custom Date Selector
                                            </div>
                                        </div>
                                         <span className="glyphicon glyphicon-calendar" ></span>
                                    </span>
                                <select className={"period form-control " + (datePickerOption === "dropdown" ? "block" : "none")}
                                        style={{display: "inline", float: "right", color: "black"}}
                                        id="periodSelectChart" onInput={changeDateChart.bind(this)}
                                        defaultValue={'This Week'}
                                >
                                    <option value="0:0">Today</option>
                                    <option value="1:0">Yesterday</option>
                                    <option value="This Week">This Week</option>
                                    <option value="Last Week">Last Week</option>
                                    <option value="This Month">This Month</option>
                                    <option value="Last Month">Last Month</option>
                                    {/* <option value="90:90">This Quarter</option> */}
                                    <option value="This Quarter">This Quarter</option>
                                    <option value="This Year">This Year</option>
                                    <option value="Last Year">Last Year</option>
                                    <option value="Custom Date">Custom Date</option>
                                </select>
                            </div>

                    }
                </div>
            </div>
            <div id="chart" className="panel-body">
                <CompanyChart/>
                {/*<IdahoChart/>
                <OregonChart/>*/}
                {/*<BoiseChart/>*/}
                {/*<RexburgChart/>*/}
            </div>
        </div>
    )
})