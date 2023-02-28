import {emit, view} from "../framework";
// import fmStore from '../stores/fmStore'
import salesforceStore from '../stores/salesforceStore'
import weekStatsStore from "../stores/weekStatsStore"
import userStore from "../stores/userStore"
import sessionStore from '../stores/sessionStore'

export default view(function FMReportCard() {

    const {teamState, currentDateRange, datePickerOption} = weekStatsStore
    const {fieldMarketers, staticSort} = salesforceStore
    const {user} = sessionStore


    // console.log("FM ", fieldMarketers)

    let f = -1

    let fmStatsTop = []
    let rexTeam = 0
    let wolfTeam = 0
    let foxTeam = 0
    let totalFMLeads = 0
    let totalRexLeads = 0
    let totalRexQs = 0
    let totalRexSits = 0
    let totalRexAssists = 0
    let totalRexCloses = 0
    let totalRexSheduledInstalls = 0
    let totalFMQs = 0
    let totalFMAssists = 0
    let totalBoiseLeads = 0
    let totalBoiseQs = 0
    let totalBoiseSits = 0
    let totalBoiseAssists = 0
    let totalBoiseCloses = 0
    let totalBoiseSheduledInstalls = 0
    let totalKFLeads = 0
    let totalKFQs = 0
    let totalKFSits = 0
    let totalKFAssists = 0
    let totalKFCloses = 0
    let totalKFSheduledInstalls = 0


    while (++f < fieldMarketers.length) {


        totalFMAssists += fieldMarketers[f].AssistedCloses

        if (fieldMarketers[f].Score > 0) {
            fmStatsTop.push(fieldMarketers[f])
        }

        if (fieldMarketers[f].Team === 'Rexburg') {
            totalFMQs += fieldMarketers[f].Qs
            totalFMLeads += fieldMarketers[f].Leads
            totalRexLeads += fieldMarketers[f].Leads
            totalRexQs += fieldMarketers[f].Qs
            totalRexAssists += fieldMarketers[f].AssistedCloses
            rexTeam += 1
        } else if (fieldMarketers[f].Team === 'Boise') {
            totalFMQs += fieldMarketers[f].Qs
            totalFMLeads += fieldMarketers[f].Leads
            totalBoiseLeads += fieldMarketers[f].Leads
            totalBoiseQs += fieldMarketers[f].Qs
            totalBoiseAssists += fieldMarketers[f].AssistedCloses
            wolfTeam += 1
        } else if (fieldMarketers[f].Team === 'Klamath Falls') {
            totalFMQs += fieldMarketers[f].Qs
            totalFMLeads += fieldMarketers[f].Leads
            totalKFLeads += fieldMarketers[f].Leads
            totalKFQs += fieldMarketers[f].Qs
            totalKFAssists += fieldMarketers[f].AssistedCloses
            foxTeam += 1
        }


    }

    let fmStatsSort = []
    let fmStatsTopSort = []
    let LeadsPRA = totalFMLeads / fieldMarketers.length


    fmStatsTopSort = fmStatsTop.sort((r1, r2) => staticSort ? (r1[staticSort] > r2[staticSort] ? -1 : 1) : 0)

    let e = -1
    let ecStatsTop = []
    let totalECLeads = 0
    let totalECSits = 0
    let rexECTeam = 0
    let wolfECTeam = 0
    let foxECTeam = 0


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


    //Rexburg Calculations
    // let fmRexLeadUnit = (((((totalRexLeads / rexTeam) / 8) / 8) * .8) * 1000).toFixed(2)
    // let fmRexSitsUnit = (((((totalRexSits / rexECTeam) / 8) / 8) * .9) * 1000).toFixed(2)
    // let fmRexQsUnit = (((((totalRexQs / rexTeam) / 6) / 8) * .8) * 1000).toFixed(2)
    // let fmRexAssistsUnit = (((((totalRexAssists / rexTeam) / 1.5) / 1.3) * 1.3) * 100).toFixed(2)
    // let fmRexClosessUnit = (((totalRexCloses / rexTeam) / (4 / rexTeam)) * 100).toFixed(2)
    // let fmRexFMUnit = (((fmRexLeadUnit * 0.8) + (fmRexSitsUnit * 0.8) + (fmRexAssistsUnit * 1.2)) / 3).toFixed(2)
    let fmRexLeadUnit = ((((totalRexLeads / rexTeam) / 8) * .8) * 100).toFixed(2)
    let fmRexQsUnit = ((((totalRexQs / rexTeam) / 6) * .8) * 100).toFixed(2)
    let fmRexAssistsUnit = ((((totalRexAssists / rexTeam) / 1.5) * 1.3) * 100).toFixed(2)
    let rexSitsUnit = ((((totalRexSits / rexECTeam) / 8) * .9) * 100).toFixed(2)
    let rexClosesUnit = ((((totalRexCloses / rexTeam) / 1.5) * .9) * 100).toFixed(2)
    let rexISUnit = ((((totalRexSheduledInstalls / rexECTeam) / 1.5) * .9) * 100).toFixed(2)
    let fmRexUnit = ((parseInt(fmRexLeadUnit) + parseInt(fmRexQsUnit) + parseInt(fmRexAssistsUnit)) / 3).toFixed(2)
    let ecRexUnit = ((parseInt(rexSitsUnit) + parseInt(rexClosesUnit) + parseInt(rexISUnit)) / 3).toFixed(2)

    //Boise FM Calculations
    // let fmBoiseLeadUnit = (((((totalBoiseLeads / wolfTeam) / 8) / 8) * .8) * 1000).toFixed(2)
    // let fmBoiseSitsUnit = (((((totalBoiseSits / wolfTeam) / 6) / 8) * .8) * 1000).toFixed(2)
    // let fmBoiseAssistsUnit = (((((totalBoiseAssists / wolfTeam) / 1.5) / 1.3) * 1.3) * 100).toFixed(2)
    // let fmBoiseFMUnit = (((fmBoiseLeadUnit * 0.8) + (fmBoiseSitsUnit * 0.8) + (fmBoiseAssistsUnit * 1.2)) / 3).toFixed(2)
    let fmBoiseLeadUnit = ((((totalBoiseLeads / rexTeam) / 8) * .8) * 100).toFixed(2)
    let fmBoiseQsUnit = ((((totalBoiseQs / rexTeam) / 6) * .8) * 100).toFixed(2)
    let fmBoiseAssistsUnit = ((((totalBoiseAssists / rexTeam) / 1.5) * 1.3) * 100).toFixed(2)
    let boiseSitsUnit = ((((totalBoiseSits / rexECTeam) / 8) * .9) * 100).toFixed(2)
    let boiseClosesUnit = ((((totalBoiseCloses / rexTeam) / 1.5) * .9) * 100).toFixed(2)
    let boiseISUnit = ((((totalBoiseSheduledInstalls / rexECTeam) / 1.5) * .9) * 100).toFixed(2)
    let fmBoiseUnit = ((parseInt(fmBoiseLeadUnit) + parseInt(fmBoiseQsUnit) + parseInt(fmBoiseAssistsUnit)) / 3).toFixed(2)
    let ecBoiseUnit = ((parseInt(boiseSitsUnit) + parseInt(boiseClosesUnit) + parseInt(boiseISUnit)) / 3).toFixed(2)

    //KF FM Calculations
    // let fmKFLeadUnit = (((((totalKFLeads / foxTeam) / 8) / 8) * .8) * 1000).toFixed(2)
    // let fmKFSitsUnit = (((((totalKFSits / foxTeam) / 6) / 8) * .8) * 1000).toFixed(2)
    // let fmKFAssistsUnit = (((((totalKFAssists / foxTeam) / 1.5) / 1.3) * 1.3) * 100).toFixed(2)
    // let fmKFFMUnit = (((fmKFLeadUnit * 0.8) + (fmKFSitsUnit * 0.8) + (fmKFAssistsUnit * 1.2)) / 3).toFixed(2)
    let fmKFLeadUnit = ((((totalKFLeads / foxTeam) / 8) * .8) * 100).toFixed(2)
    let fmKFQsUnit = ((((totalKFQs / foxTeam) / 6) * .8) * 100).toFixed(2)
    let fmKFAssistsUnit = ((((totalKFAssists / foxTeam) / 1.5) * 1.3) * 100).toFixed(2)
    let kfSitsUnit = ((((totalKFSits / foxECTeam) / 8) * .9) * 100).toFixed(2)
    let kfClosesUnit = ((((totalKFCloses / foxTeam) / 1.5) * .9) * 100).toFixed(2)
    let kfISUnit = ((((totalKFSheduledInstalls / foxECTeam) / 1.5) * .9) * 100).toFixed(2)
    let fmKFUnit = ((parseInt(fmKFLeadUnit) + parseInt(fmKFQsUnit) + parseInt(fmKFAssistsUnit)) / 3).toFixed(2)
    let ecKFUnit = ((parseInt(kfSitsUnit) + parseInt(kfClosesUnit) + parseInt(kfISUnit)) / 3).toFixed(2)

    let fullName = user.firstName + " " + user.lastName


    return (
        <div className="panel  panel-default">
            <div className="panel-heading">
                <div style={{display: "flex"}}>
                    <div style={{flex: "1", textAlign: "left"}}>
                        <h4>{user.firstName} {user.lastName} Report Card </h4>
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
                    <div className="col-md-12">
                        {
                            fieldMarketers.length !== 0 ? fieldMarketers.filter(fieldMarketers => fieldMarketers.Name === fullName).map((fm) => {

                                return (
                                    <div className="row info-wrapper">
                                        <div className="col-md-4 text-center">
                                            <h5><b>OVERALL SCORE/GRADE</b></h5>
                                            <h1 style={{color: "rgb(231, 145, 54)", fontSize: "4em", marginTop: "0px"}}>
                                                <b>{(((((fm.Leads / 10) * 0.8) * 100) + (((fm.Qs / 8) * 0.8) * 100) + (((fm.AssistedCloses / 2) * 1.3) * 100)) / 3).toFixed(2)}%</b>
                                            </h1>
                                        </div>
                                        <div className="col-md-4 text-center">
                                            <h5><b>SCORE BREAKDOWN</b></h5>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: "1"}}>
                                                    <p>LEAD GRADE</p>
                                                </div>
                                                <div style={{flex: "1"}}>
                                                    <p>{(((fm.Leads / 10) * 0.8) * 100).toFixed(2)}%</p>
                                                </div>
                                            </div>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: "1"}}>
                                                    <p>QS GRADE</p>
                                                </div>
                                                <div style={{flex: "1"}}>
                                                    <p>{(((fm.Qs / 8) * 0.8) * 100).toFixed(2)}%</p>
                                                </div>
                                            </div>
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: "1"}}>
                                                    <p>Assists Grade</p>
                                                </div>
                                                <div style={{flex: "1"}}>
                                                    <p>{(((fm.AssistedCloses / 2) * 1.3) * 100).toFixed(2)}%</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: "1", textAlign: "center"}}>
                                                    <h5><b>EXPECTED</b></h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>10</b></h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>8</b></h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>2</b></h5>
                                                </div>
                                                <div style={{flex: "1", textAlign: "center"}}>
                                                    <h5><b>ACTUAL</b></h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>{fm.Leads}</b></h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>{fm.Qs}</b></h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>{fm.AssistedCloses}</b></h5>
                                                </div>
                                            </div>
                                        </div>
                                        {/*<div>*/}
                                        {/*    <p>{fm.Name} - Report Card Team: {fm.Team}</p>*/}
                                        {/*</div>*/}
                                        {/*<div>*/}
                                        {/*    <p> Score: {fm.Score} - {fm.Team} - Leads: {fm.Leads} -*/}
                                        {/*        Qs: {fm.Qs} - Assist: {fm.AssistedCloses} </p>*/}
                                        {/*</div>*/}
                                        {/*<div>*/}
                                        {/*    Weighted Score*/}
                                        {/*    <br/>*/}
                                        {/*    <p>*/}
                                        {/*        Lead Grade:&nbsp;*/}
                                        {/*        <b>{(((fm.Leads / 10) * 0.8) * 100).toFixed(2)}%</b>&nbsp;-*/}
                                        {/*        QS*/}
                                        {/*        Grade: <b>{(((fm.Qs / 8) * 0.8) * 100).toFixed(2)}%</b> -*/}
                                        {/*        Assists*/}
                                        {/*        Grade:&nbsp;*/}
                                        {/*        /!*<b>{((((stat1.AssistedCloses / (stat1.Team === 'Rexburg' ? rexTeam :  stat1.Team === 'Boise' ? wolfTeam : stat1.Team === 'Klamath Falls'  ? foxTeam : 0)) / 1.5) * 1.3) * 100).toFixed(2)}%</b>*!/*/}
                                        {/*        <b>{(((fm.AssistedCloses / 2) * 1.3) * 100).toFixed(2)}%</b>&nbsp;*/}

                                        {/*    </p>*/}
                                        {/*</div>*/}
                                        {/*<br/>*/}
                                        {/*<br/>*/}
                                    </div>
                                )
                            }) : (
                        <h5 style={{textAlign: "center"}}>Everyone have 0 leads </h5>)

                        }
                    </div>
                </div>
            </div>
        </div>
    )
})