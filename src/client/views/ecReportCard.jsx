import {emit, view} from "../framework";
// import fmStore from '../stores/fmStore'
import salesforceStore from '../stores/salesforceStore'
import weekStatsStore from "../stores/weekStatsStore";
import sessionStore from "../stores/sessionStore";

export default view(function ECReportCard() {

    const {teamState, currentDateRange, datePickerOption} = weekStatsStore
    const {energyConsultants, staticSort} = salesforceStore
    const {user} = sessionStore


    // console.log("FM ", fieldMarketers)


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


        // console.log('start')
        // console.log(start[0])
        // console.log('end')
        // console.log(end[0])

        emit.currentDateRangeChange({start: start[0], end: end[0]})
        emit.GetStatsWeek({start: start[0], end: end[0]})
        emit.GetStatsFM({start: start[0], end: end[0]})
        emit.GetStatsEC({start: start[0], end: end[0]})
        emit.GetStats({start: start[0], end: end[0]})
    }

    let today = new Date()
    let formattedToday = ""
    let fromCurrentDate = new Date(currentDateRange.end)
    if (currentDateRange.end < today) {
        formattedToday = today.getFullYear() + '-' + ((today.getMonth() + 1) < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1)) + '-' + (today.getDate() < 10 ? '0' + today.getDate() : today.getDate())
    } else {
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



    let fullName = user.firstName + " " + user.lastName

    return (
        <div className="panel  panel-default">
            <div className="panel-heading">
                <div style={{display: "flex"}}>
                    <div style={{flex: "1", textAlign: "left"}}>
                        <h4>{fullName} Report Card </h4>
                    </div>
                    {
                        datePickerOption === "custom_date" ?
                            //custom date picker form
                            <form action=""
                                  onSubmit={e => {
                                      e.preventDefault()
                                      emit.GetStatsWeek({
                                          start: document.getElementById('startDate').value,
                                          end: document.getElementById('endDate').value
                                      })
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
                                  }} style={{maxWidth: "365px"}}>
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
                            <div className="input-group" style={{maxWidth: "155px", flex: "1"}}>
                                    <span id="custom_date_btn" className="input-group-addon" style={{cursor: "pointer"}}
                                          onClick={() => emit.DatePickerChange("custom_date")}>
                                        <div id="custom-popover" className="popover fade top in"
                                             style={{top: "-46px", left: "-44%"}}>
                                              <div className="arrow"></div>
                                            {/*<h3 className="popover-title" style={{color: "#333333"}}>Scores</h3>*/}
                                            <div className="popover-content" style={{color: "#333333", padding: "9px"}}>
                                             Use Custom Date Selector
                                            </div>
                                        </div>
                                         <span className="glyphicon glyphicon-calendar"></span>
                                    </span>
                                <select
                                    className={"period form-control " + (datePickerOption === "dropdown" ? "block" : "none")}
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
                                    <option value="90:90">This Quarter</option>
                                    <option value="This Year">This Year</option>
                                    <option value="Last Year">Last Year</option>
                                    <option value="Custom Date">Custom Date</option>
                                </select>
                            </div>

                    }
                </div>
            </div>
            <div id="chart" className="panel-body">
                <div className="row">
                    <div className="row">
                        <div className="col-md-12">
                            {
                                energyConsultants.length !== 0 ? energyConsultants.filter(energyConsultants => energyConsultants.Name === fullName).map((ec) => {

                                    return (
                                        <div className="row info-wrapper">
                                            <div className="col-md-4 text-center">
                                                <h5><b>OVERALL SCORE/GRADE</b></h5>
                                                <h1 style={{color: "rgb(231, 145, 54)", fontSize: "4em", marginTop: "0px"}}>
                                                    <b>{(( (((ec.Sits / 12) * 0.9) * 100) + (((ec.Closes / 2) * 0.9) * 100) + (((ec.ScheduledInstalls / 2) * 0.9) * 100)) / 3).toFixed(2)}%</b>
                                                </h1>
                                            </div>
                                            <div className="col-md-4 text-center">
                                                <h5><b>SCORE BREAKDOWN</b></h5>
                                                <div style={{display: "flex"}}>
                                                    <div style={{flex: "1"}}>
                                                        <p>SITS GRADE</p>
                                                    </div>
                                                    <div style={{flex: "1"}}>
                                                        <p>{(((ec.Sits / 12) * 0.9) * 100).toFixed(2)}%</p>
                                                    </div>
                                                </div>
                                                <div style={{display: "flex"}}>
                                                    <div style={{flex: "1"}}>
                                                        <p>CLOSES GRADE</p>
                                                    </div>
                                                    <div style={{flex: "1"}}>
                                                        <p>{(((ec.Closes / 2) * 0.9) * 100).toFixed(2)}%</p>
                                                    </div>
                                                </div>
                                                <div style={{display: "flex"}}>
                                                    <div style={{flex: "1"}}>
                                                        <p>SCHEDULED INSTALLS GRADE</p>
                                                    </div>
                                                    <div style={{flex: "1"}}>
                                                        <p>{(((ec.ScheduledInstalls / 2) * 0.9) * 100).toFixed(2)}%</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-4">
                                                <div style={{display: "flex"}}>
                                                    <div style={{flex: "1", textAlign: "center"}}>
                                                        <h5><b>EXPECTED</b></h5>
                                                        <h5 style={{color: "rgb(231, 145, 54)"}}><b>12</b></h5>
                                                        <h5 style={{color: "rgb(231, 145, 54)"}}><b>2</b></h5>
                                                        <h5 style={{color: "rgb(231, 145, 54)"}}><b>2</b></h5>
                                                    </div>
                                                    <div style={{flex: "1", textAlign: "center"}}>
                                                        <h5><b>ACTUAL</b></h5>
                                                        <h5 style={{color: "rgb(231, 145, 54)"}}><b>{ec.Sits}</b></h5>
                                                        <h5 style={{color: "rgb(231, 145, 54)"}}><b>{ec.Closes}</b></h5>
                                                        <h5 style={{color: "rgb(231, 145, 54)"}}><b>{ec.ScheduledInstalls}</b></h5>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*<div className="info-wrapper">*/}
                                            {/*    /!*<button className="btn btn-primary"*!/*/}
                                            {/*    /!*        type="button">{stat1.Name }*!/*/}
                                            {/*    /!*    /!*<span className="badge"*!/*!/*/}
                                            {/*    /!*    /!*      style={{marginLeft: "10px"}}></span>*!/*!/*/}
                                            {/*    /!*</button>*!/*/}
                                            {/*    <div>*/}
                                            {/*        <p>{stat1.Name} - Team - {stat1.Team}</p>*/}
                                            {/*    </div>*/}
                                            {/*    <div>*/}
                                            {/*        <p> Score: {stat1.Score}&nbsp; -&nbsp;*/}
                                            {/*            /!*Leads: {stat1.Leads} -*!/*/}
                                            {/*            Sits: {stat1.Sits} - Closes: {stat1.Closes} - Scheduled*/}
                                            {/*            Installs: {stat1.ScheduledInstalls}</p>*/}
                                            {/*    </div>*/}
                                            {/*    <div>*/}
                                            {/*        Weighted Score*/}
                                            {/*        <br/>*/}
                                            {/*        <p>*/}
                                            {/*            /!*Lead Grade:&nbsp;*!/*/}
                                            {/*            /!*<b>{(((stat1.Leads / (stat1.Team === 'Rexburg' ? rexECTeam : stat1.Team === 'Wolf' || stat1.Team === 'Boise' ? wolfECTeam : stat1.Team === 'Klamath Falls' || stat1.Team === 'Fox' ? foxECTeam : 0)) / 8) * 0.8).toFixed(2) * 1000}%</b>&nbsp;-*!/*/}
                                            {/*            Sit*/}
                                            {/*            Rating: &nbsp;*/}
                                            {/*            <b>{(((stat1.Sits / 12) * 0.9) * 100).toFixed(2)}%</b> -*/}
                                            {/*            Closes Rating:&nbsp;*/}
                                            {/*            /!*<b>{(((stat1.Closes / (stat1.Team === 'Rexburg' ? rexECTeam : stat1.Team === 'Wolf' || stat1.Team === 'Boise' ? wolfECTeam : stat1.Team === 'Klamath Falls' || stat1.Team === 'Fox' ? foxECTeam : 0)) / 1.5) * 0.9).toFixed(2) * 1000}%</b>*!/*/}
                                            {/*            <b>{(((stat1.Closes / 2) * 0.9) * 100).toFixed(2)}%</b>*/}
                                            {/*            <br/>*/}
                                            {/*            Scheduled Installs:&nbsp;*/}
                                            {/*            <b>{(((stat1.ScheduledInstalls / 2) * 0.9) * 100).toFixed(2)}%</b>*/}
                                            {/*            &nbsp;-&nbsp;Overall Grade:&nbsp;*/}
                                            {/*            <b>{(((((stat1.Sits / 12) * 0.9) * 100) + (((stat1.Closes / 2) * 0.9) * 100) + (((stat1.ScheduledInstalls / 2) * 0.9) * 100)) / 3).toFixed(2)}%</b>*/}
                                            {/*        </p>*/}
                                            {/*    </div>*/}
                                            {/*    <br/>*/}
                                            {/*    <br/>*/}
                                            {/*</div>*/}
                                        </div>
                                    )
                                }) : (
                                    <h5 style={{textAlign: "center"}}>Everyone have 0 leads </h5>)

                            }
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
})