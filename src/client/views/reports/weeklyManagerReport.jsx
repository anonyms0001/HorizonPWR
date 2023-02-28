import {emit, view} from "../../framework"
import weeklyReportStore from "../../stores/weeklyReportStore"
import sessionStore from "../../stores/sessionStore"
//import LineChart from "../charts/lineChart"
import ManagerLineChart from "../charts/managerLineChart"


export default view(function WeeklyManagerReport() {

    const {weekReport} = weeklyReportStore
    const {user} = sessionStore

    let teamNumbers = JSON.parse(weekReport.team_numbers)
     // console.log("weekReport ", weekReport)
     // console.log("user ", user)
    // console.log("teamNumbers ", teamNumbers)
    // let t = -1
    // let teamStats = 0
    //
    // while (++t < weekReport.team_numbers.length) {
    //
    //
    // }
    // {
    //     weekReport.team_numbers ? weekReport.team_numbers.map((team, key) => {
    //         console.log("team map inside ", key)
    //     }) : null
    // }

    function changeQuarter() {
        let timePeriod = document.getElementById('periodSelectChart').value
        // console.log("change quarter ", timePeriod)
        emit.GetWeeksForChart({rangeSelection: timePeriod})
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    let startMonthNumber = new Date(weekReport.start_date).getMonth()
    let endMonthNumber = new Date(weekReport.end_date).getMonth()


    const fullStartDate = monthNames[startMonthNumber] + " " + (new Date(weekReport.start_date).getDate() + 1) + " " + new Date(weekReport.start_date).getFullYear()
    const fullEndtDate = monthNames[endMonthNumber] + " " + (new Date(weekReport.end_date).getDate() + 1) + " " + new Date(weekReport.end_date).getFullYear()

    return (
        <div className="panel  panel-default">
            <div className="panel-heading" style={{border: "0px"}}>
                <div style={{display: "flex"}}>
                    <div style={{flex: "1", textAlign: "left"}}>
                        <h4>{user.teamName} Report Card from {fullStartDate} to {fullEndtDate}  </h4>
                    </div>
                    <div className="input-group" style={{maxWidth: "275px", flex: "1"}}>
                        <select
                            className={"period form-control dropdown block"}
                            style={{display: "inline", float: "right", color: "black"}}
                            id="periodSelectChart"
                            onInput={changeQuarter.bind(this)}
                            defaultValue={'current'}
                        >
                            <option>Select Quarter..</option>
                            <option value="current">Current Quarter</option>
                            {/*<option value="previous">Previous Quarter</option>*/}
                            <option value="previous and current">Previous and Current</option>
                            <option value="this year">This Year</option>
                        </select>
                    </div>
                </div>
            </div>
            <div id="chart" className="panel-body" style={{paddingTop: "0px"}}>
                <div className="row text-center" style={{padding: '0px', margin: '0px -20px'}}>
                    <div className="col-xs-12" style={{padding: '0px', margin: '0px'}}>
                        <ManagerLineChart/> 
                    </div>
                </div>
                {
                    teamNumbers.length !== 0 ? teamNumbers.filter(teamNumber => teamNumber.Name === user.teamName).map((team) => {
                        return (
                            <div>
                                <div className="row text-center overall-scores ">
                                    <h3 className="text-center">Overall Scores </h3>
                                    <div className="col-xs-4">
                                        <h1 className="overall-scores text-center">
                                            <b>{team.fmScore !== null ?team.fmScore.toFixed(2) : 0}%</b>
                                        </h1>
                                        <span style={{fontSize: "12px"}}>FM Unit</span>
                                    </div>
                                    <div className="col-xs-4">
                                        <h1 className=" overall-scores text-center">
                                            <b>{team.ecScore !== null ? team.ecScore.toFixed(2) : 0}%</b>
                                        </h1>
                                        <span style={{fontSize: "12px"}}>EC Unit</span>
                                    </div>
                                    <div className="col-xs-4">
                                        <h1 className="overall-scores text-center">
                                            <b>{team.teamScore !== null ? team.teamScore.toFixed(2) : 0}%</b>
                                        </h1>
                                        <span style={{fontSize: "12px"}}>Weighted Team</span>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row text-center">
                                    <div className="col-md-12">
                                        <h3 className="text-center">Numbers Achieved </h3>
                                    </div>
                                    <div className="col-xs-2">
                                        <h1 className="overall-scores">
                                            <b>{team.Leads}</b>
                                        </h1>
                                        <span style={{fontSize: "12px"}}>Leads</span>
                                    </div>
                                    <div className="col-xs-2">
                                        <h1 className="overall-scores">
                                            <b>{team.Qs}</b>
                                        </h1>
                                        <span style={{fontSize: "12px"}}>QS</span>
                                    </div>
                                    <div className="col-xs-2">
                                        <h1 className="overall-scores">
                                            <b>{team.Sits}</b>
                                        </h1>
                                        <span style={{fontSize: "12px"}}>Sits</span>
                                    </div>
                                    <div className="col-xs-2">
                                        <h1 className="overall-scores">
                                            <b>{team.Ass}</b>
                                        </h1>
                                        <span style={{fontSize: "12px"}}>Assists</span>
                                    </div>
                                    <div className="col-xs-2">
                                        <h1 className="overall-scores">
                                            <b>{team.Closes}</b>
                                        </h1>
                                        <span style={{fontSize: "12px"}}>Closes</span>
                                    </div>
                                    <div className="col-xs-2">
                                        <h1 className="overall-scores">
                                            <b>{team.ScheduledInstalls}</b>
                                        </h1>
                                        <span style={{fontSize: "12px"}}>Installs Scheduled</span>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row text-center">
                                    <div className="col-md-6">
                                        <h5 className="text-left">FIELD MARKETERS</h5>
                                        {
                                            team.fieldMarketers ? team.fieldMarketers.map((fm, key) => {
                                                return (
                                                    <div className="row info-wrapper" key={key}>
                                                        <h3 className="text-center" style={{marginTop: "8px"}}
                                                            key={key}>{fm.Name}</h3>
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
                                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>10</b>
                                                                    </h5>
                                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>8</b>
                                                                    </h5>
                                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>2</b>
                                                                    </h5>
                                                                </div>
                                                                <div style={{flex: "1", textAlign: "center"}}>
                                                                    <h5><b>ACTUAL</b></h5>
                                                                    <h5 style={{color: "rgb(231, 145, 54)"}}>
                                                                        <b>{fm.Leads}</b></h5>
                                                                    <h5 style={{color: "rgb(231, 145, 54)"}}>
                                                                        <b>{fm.Qs}</b>
                                                                    </h5>
                                                                    <h5 style={{color: "rgb(231, 145, 54)"}}>
                                                                        <b>{fm.AssistedCloses}</b>
                                                                    </h5>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 text-center"
                                                             style={{marginTop: "5px"}}>
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
                                        }
                                    </div>
                                    <div className="col-md-6" style={{borderLeft: "1px solid #dddddd"}}>
                                        <h5 className="text-left">ENERGY CONSULTANT</h5>
                                        {
                                            team.energyConsultants ? team.energyConsultants.map((ec, key) => {
                                                // console.log("fm ", fm)
                                                return (
                                                    <div className="row info-wrapper">
                                                        <h3 className="text-center" style={{marginTop: "8px"}}
                                                            key={key}>{ec.Name}</h3>
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
                                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>12</b>
                                                                    </h5>
                                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>2</b>
                                                                    </h5>
                                                                    <h5 style={{color: "rgb(231, 145, 54)"}}><b>2</b>
                                                                    </h5>
                                                                </div>
                                                                <div style={{flex: "1", textAlign: "center"}}>
                                                                    <h5><b>ACTUAL</b></h5>
                                                                    <h5 style={{color: "rgb(231, 145, 54)"}}>
                                                                        <b>{ec.Sits}</b></h5>
                                                                    <h5 style={{color: "rgb(231, 145, 54)"}}>
                                                                        <b>{ec.Closes}</b></h5>
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
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    }) : null
                }
                <br/>
                <br/>


            </div>
        </div>
    )
})