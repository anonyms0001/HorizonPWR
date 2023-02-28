import {view} from "../framework";
// import reportStore from "../stores/reportStore"
import weeklyReportStore from "../stores/weeklyReportStore"
// import reportStore from "../stores/reportStore"


export default view(function ReportCompanyReps() {

    const {weekReport, pointsArray, reportRangeState} = weeklyReportStore
    // console.log("weekReport ", weekReport)
    let teamNumbers = JSON.parse(weekReport.team_numbers)


    let startDateFormatted = weekReport.start_date.split("T")
    let endDateFormatted = weekReport.end_date.split("T")

    // console.log("pointsArray ", pointsArray)
    // console.log("reportRangeState ", reportRangeState)

    // let dateRangeSelection = document.getElementById('periodSelectChart').value
    // console.log("dateRangeSelection HERE ", dateRangeSelection)

    function excludeRep(repName, key, actionType, position) {
        // console.log("repName, actionType", repName, key, actionType, position)
        document.getElementById(key + '-' + position + '-ok').classList.remove("active")
        document.getElementById(key + '-' + position + '-ok').style.backgroundColor = 'rgb(249 246 243)'
        document.getElementById(key + '-' + position + '-ok-icon').style.color = 'rgb(92, 184, 92)'
        document.getElementById(key + '-' + position + '-exclude').classList.add("active")
        document.getElementById(key + '-' + position + '-exclude').style.backgroundColor = 'rgb(217, 83, 79)'
        document.getElementById(key + '-' + position + '-exclude-icon').style.color = '#fff'

        emit.ClickedChangeRepPosition({
            weekStats: teamNumbers,
            start: startDateFormatted[0],
            end: endDateFormatted[0],
            weekId: weekReport.id,
            Rep: repName,
            action: actionType,
            pointsArray: pointsArray,
            rangeSelection: reportRangeState
        })
    }

    function allowRep(repName, key, actionType, position) {
        // console.log("repName, actionType", repName, key, actionType, position)
        document.getElementById(key + '-' + position + '-exclude').classList.remove("active")
        document.getElementById(key + '-' + position + '-exclude').style.backgroundColor = 'rgb(249 246 243)'
        document.getElementById(key + '-' + position + '-exclude-icon').style.color = 'rgb(217, 83, 79)'
        document.getElementById(key + '-' + position + '-ok').classList.add("active")
        document.getElementById(key + '-' + position + '-ok').style.backgroundColor = 'rgb(92, 184, 92)'
        document.getElementById(key + '-' + position + '-ok-icon').style.color = '#fff'

        emit.ClickedChangeRepPosition({
            weekStats: teamNumbers,
            start: startDateFormatted[0],
            end: endDateFormatted[0],
            weekId: weekReport.id,
            Rep: repName,
            action: actionType,
            pointsArray: pointsArray,
            rangeSelection: reportRangeState
        })
    }


    function fmAction(repName, key, actionType) {
        // console.log("repName, actionType", repName, key, actionType)
        document.getElementById(key + '-' + 'fm-on').classList.remove("active")
        document.getElementById(key + '-' + 'fm-on').style.backgroundColor = '#fbf7f4'
        document.getElementById(key + '-' + 'fm-on').style.color = '#569cd4'
        // document.getElementById(key + '-' + '-fm-off').classList.remove("active")
        document.getElementById(key + '-' + 'fm-off').style.backgroundColor = '#569cd4'
        document.getElementById(key + '-' + 'fm-off').style.color = '#fff'
        document.getElementById(key + '-' + 'fm-off').style.borderRadius = '30px'

        emit.ClickedChangeRepPosition({
            weekStats: teamNumbers,
            start: startDateFormatted[0],
            end: endDateFormatted[0],
            weekId: weekReport.id,
            Rep: repName,
            action: actionType,
            pointsArray: pointsArray,
            rangeSelection: reportRangeState
        })
    }

    function ecAction(repName, key, actionType) {
        console.log("repName, actionType", repName, key, actionType)
        document.getElementById(key + '-' + 'ec-on').classList.remove("active")
        document.getElementById(key + '-' + 'ec-on').style.backgroundColor = '#fbf7f4'
        document.getElementById(key + '-' + 'ec-on').style.color = '#569cd4'
        // document.getElementById(key + '-' + '-fm-off').classList.remove("active")
        document.getElementById(key + '-' + 'ec-off').style.backgroundColor = '#569cd4'
        document.getElementById(key + '-' + 'ec-off').style.color = '#fff'
        document.getElementById(key + '-' + 'ec-off').style.borderRadius = '30px'

        // if (actionType === "ec-fm") {
        emit.ClickedChangeRepPosition({
            weekStats: teamNumbers,
            start: startDateFormatted[0],
            end: endDateFormatted[0],
            weekId: weekReport.id,
            Rep: repName,
            action: actionType,
            pointsArray: pointsArray,
            rangeSelection: reportRangeState
        })
        // }
    }

    function demoteRep(repName, key, actionType) {
        console.log("repName, actionType", repName, key, actionType)

    }

    let countEC = 0
    let countFM = 0


    return (
        <div className="row">
            <div className="col-md-6" style={{borderRight: "solid 1px #ddd"}}>
                <h5>FIELD MARKETERS</h5>
                {
                    teamNumbers.map((teamStatsFM, key) => {
                        return (

                            teamStatsFM.fieldMarketers ? teamStatsFM.fieldMarketers.map((fm, key) => {
                                // console.log("fm ", fm)
                                countFM++
                                return (
                                    <div className="row info-wrapper" key={key}>
                                        <div className="col-md-3">
                                            <div className="toggle-options open"
                                                 style={{float: "right", opacity: "0.3", pointerEvents: "none"}}>
                                                <div id={countFM + "-fm-ok"} className={"toggle-options-val active"}
                                                     style={{background: "#5cb85c"}}
                                                     onClick={allowRep.bind(this, fm.Name, countFM, 'activating', 'fm')}
                                                ><i id={countFM + "-fm-ok-icon"}
                                                    className=" glyphicon glyphicon glyphicon-ok-sign"/>
                                                </div>
                                                <div id={countFM + "-fm-exclude"}
                                                    // className={tableMode === 'ec' ? "toggle-options-val active" : "toggle-options-val"}
                                                     className={"toggle-options-val"}
                                                     onClick={excludeRep.bind(this, fm.Name, countFM, 'excluding', 'fm')}
                                                ><i id={countFM + "-fm-exclude-icon"} style={{color: "#d9534f"}}
                                                    className="glyphicon glyphicon-minus-sign"/>
                                                </div>
                                                <div className="clear"></div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <h3 className="text-center" style={{marginTop: "8px"}}
                                                key={key}>{fm.Name}</h3>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="toggle-options open"
                                                 style={{float: "right"}}>
                                                <div id={countFM + "-fm-on"} className={"toggle-options-val active"}
                                                     onClick={fmAction.bind(this, fm.Name, countFM, 'ec-fm')}
                                                >F.M.
                                                </div>
                                                <div id={countFM + "-fm-off"}
                                                    // className={tableMode === 'ec' ? "toggle-options-val active" : "toggle-options-val"}
                                                     className={"toggle-options-val"}
                                                     onClick={fmAction.bind(this, fm.Name, countFM, 'fm-ec')}
                                                >E.C.
                                                </div>
                                                <div className="clear"></div>
                                            </div>
                                        </div>
                                        <br/>
                                        <br/>
                                        <div className="col-md-6 text-center">
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
                                                    <p>ASSISTS GRADE</p>
                                                </div>
                                                <div style={{flex: "1"}}>
                                                    <p>{(((fm.AssistedCloses / 2) * 1.3) * 100).toFixed(2)}%</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div style={{display: "flex"}}>
                                                <div style={{flex: "1", textAlign: "center"}}>
                                                    <h5><b>EXPECTED</b></h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>10</b></h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>8</b></h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>2</b></h5>
                                                </div>
                                                <div style={{flex: "1", textAlign: "center"}}>
                                                    <h5><b>ACTUAL</b></h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}>
                                                        <b>{fm.Leads}</b></h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>{fm.Qs}</b>
                                                    </h5>
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}>
                                                        <b>{fm.AssistedCloses}</b>
                                                    </h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-12 text-center" style={{marginTop: "5px"}}>
                                            <h5><b>OVERALL SCORE/GRADE</b></h5>
                                            <h1 style={{
                                                color: "rgb(231, 145, 54)",
                                                fontSize: "4em",
                                                marginTop: "0px"
                                            }}>
                                                <b>{(((((fm.Leads / 10) * 0.8) * 100) + (((fm.Qs / 8) * 0.8) * 100) + (((fm.AssistedCloses / 2) * 1.3) * 100)) / 3).toFixed(2)}%</b>
                                            </h1>
                                            <hr/>
                                        </div>
                                    </div>
                                )

                            }) : null

                        )
                    })
                }

            </div>
            <div className="col-md-6" style={{borderRight: "solid 1px #ddd"}}>
                <h5>ENERGY CONSULTANTS</h5>
                {
                    teamNumbers.map((teamStatsEC) => {
                        return (
                            teamStatsEC.energyConsultants ? teamStatsEC.energyConsultants.map((ec, key) => {
                                // console.log("fm ", fm)
                                countEC++
                                return (
                                    <div className="row info-wrapper" key={key}>
                                        <div className="col-md-3">
                                            <div className="toggle-options open"
                                                 style={{float: "right", opacity: "0.3", pointerEvents: "none"}}>
                                                <div id={countEC + "-ec-ok"} className={"toggle-options-val active"}
                                                     style={{background: "#5cb85c"}}
                                                     onClick={allowRep.bind(this, ec.Name, countEC, 'activating', 'ec')}
                                                ><i id={countEC + "-ec-ok-icon"}
                                                    className=" glyphicon glyphicon glyphicon-ok-sign"/>
                                                </div>
                                                <div id={countEC + "-ec-exclude"}
                                                    // className={tableMode === 'ec' ? "toggle-options-val active" : "toggle-options-val"}
                                                     className={"toggle-options-val"}
                                                     onClick={excludeRep.bind(this, ec.Name, countEC, 'excluding', 'ec')}
                                                ><i id={countEC + "-ec-exclude-icon"} style={{color: "#d9534f"}}
                                                    className="glyphicon glyphicon-minus-sign"/>
                                                </div>
                                                <div className="clear"></div>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <h3 className="text-center" style={{marginTop: "8px"}}
                                                key={key}>{ec.Name}</h3>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="toggle-options open"
                                                 style={{float: "right"}}>
                                                <div id={countEC + "-ec-off"} className={"toggle-options-val "}
                                                     onClick={ecAction.bind(this, ec.Name, countEC, 'ec-fm')}
                                                >F.M.
                                                </div>
                                                <div id={countEC + "-ec-on"}
                                                    // className={tableMode === 'ec' ? "toggle-options-val active" : "toggle-options-val"}
                                                     className={"toggle-options-val active"}
                                                     onClick={ecAction.bind(this, ec.Name, countEC, 'fm-ec')}
                                                >E.C.
                                                </div>
                                                <div className="clear"></div>
                                            </div>
                                        </div>
                                        <br/>
                                        <br/>


                                        <div className="col-md-6 text-center">
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
                                        <div className="col-md-6">
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
                                                    <h5 style={{color: "rgb(231, 145, 54)"}}>
                                                        <b>{ec.ScheduledInstalls}</b></h5>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-12 text-center">
                                            <h5><b>OVERALL SCORE/GRADE</b></h5>
                                            <h1 style={{
                                                color: "rgb(231, 145, 54)",
                                                fontSize: "4em",
                                                marginTop: "0px"
                                            }}>
                                                <b>{(((((ec.Sits / 12) * 0.9) * 100) + (((ec.Closes / 2) * 0.9) * 100) + (((ec.ScheduledInstalls / 2) * 0.9) * 100)) / 3).toFixed(2)}%</b>
                                            </h1>
                                            <hr/>
                                        </div>

                                    </div>
                                )

                            }) : null

                        )
                    })
                }
            </div>
        </div>


    )
})