import {emit, view} from "../../framework"
// import fmStore from '../stores/fmStore'
import salesforceStore from '../../stores/salesforceStore'
import weeklyReportStorereportStore from "../../stores/weeklyReportStore"
import ReactCardFlip from 'react-card-flip'
import weeklyReportStore from "../../stores/weeklyReportStore";
import ToggleLineChart from "../charts/toggleLineChart"
import ReportCompanyReps from "../reportReps"
//import ReportTeams from "../reports/reportTeams"
import ReportTeamsCollapsed from "../reports/reportTeamsCollapsed"


@view
export default class WeeklyCompanyReportCard extends React.Component {

    state = {
        rexOneFlipped: false,
        boiseOneFlipped: false,
        kfOneFlipped: false,
    }

    render() {
        const {weekReport, reportRangeState} = weeklyReportStore

        // console.log("INSIDE VIEW weekReport ", weekReport)

        function changeQuarter() {
            let timePeriod = document.getElementById('periodSelectChart').value
            // console.log("change quarter ", timePeriod)
            emit.RangeSelectionChanged({rangeSelection: timePeriod})
            emit.GetWeeksForChart({rangeSelection: timePeriod})
        }

        function handleClick(e) {
            e.preventDefault()
            this.setState(prevState => ({rexOneFlipped: !prevState.rexOneFlipped}))
            // this.setState(prevState => ({boiseOneFlipped: !prevState.boiseOneFlipped}))
        }

        let startDate = weekReport.start_date.split("T")
        startDate = startDate[0]
        let endDate = weekReport.end_date.split("T")
        endDate = endDate[0]

        // let teamNumbers = JSON.parse(weekReport.team_numbers)
        // console.log("repsList ", repsList)
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ]

        let startMonthNumber = new Date(weekReport.start_date).getMonth()
        let endMonthNumber = new Date(weekReport.end_date).getMonth()

        const fullStartDate = monthNames[startMonthNumber] + " " + (new Date(weekReport.start_date).getDate() + 1) + " " + new Date(weekReport.start_date).getFullYear()
        const fullEndtDate = monthNames[endMonthNumber] + " " + (new Date(weekReport.end_date).getDate() + 1) + " " + new Date(weekReport.end_date).getFullYear()
        // console.log("startMonthNumber ", startMonthNumber)
        
        return (
            <div className="panel  panel-default">
                {/*<ReportHeader />*/}
                <div className="panel-heading" style={{paddingBottom: "0px", border: "none"}}>
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            <h5>Company Report Card from {fullStartDate} to {fullEndtDate} </h5>
                        </div>
                        <div className="input-group" style={{maxWidth: "275px", flex: "1"}}>
                            <select
                                className={"period form-control dropdown block"}
                                style={{display: "inline", float: "right", color: "black"}}
                                id="periodSelectChart"
                                onInput={changeQuarter.bind(this)}
                                defaultValue={reportRangeState}
                            >
                                <option>Select Quarter..</option>
                                <option value="current">Current Quarter</option>
                                <option value="previous">Previous Quarter</option>
                                <option value="previous and current">Previous and Current</option>
                                <option value="this year">This Year</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div id="chart" className="panel-body" style={{paddingTop: "0px"}}>
                    <div className="row text-center" style={{padding: '0px', margin: '0px -20px'}}>
                        <div className="col-xs-12" style={{padding: '0px', margin: '0px'}}>
                            <ToggleLineChart/>
                        </div>
                    </div>
                    <div className="row text-center overall-scores">
                        <h3 className="text-center">Overall Scores </h3>
                        <div className="col-xs-4">
                            <div className="stat-wrapper">
                                <h1 className="overall-scores text-center">
                                    <b>{weekReport.fm_unit_score !== null ? weekReport.fm_unit_score.toFixed(2) : 0}%</b>
                                </h1>

                                <span style={{fontSize: "12px"}}>FM Unit</span>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="stat-wrapper">
                                <h1 className=" overall-scores text-center">
                                    <b>{weekReport.ec_unit_score !== null ? weekReport.ec_unit_score.toFixed(2) : 0}%</b>
                                </h1>
                                <span style={{fontSize: "12px"}}>EC Unit </span>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="stat-wrapper">
                                <h1 className="overall-scores text-center">
                                    <b>
                                        {/*{(((parseInt(fmRexUnit) + parseInt(fmBoiseUnit) + parseInt(fmKFUnit)) / 3) + ((parseInt(ecRexUnit) + parseInt(ecBoiseUnit) + parseInt(ecKFUnit)) / 3) / 2).toFixed(2)}%*/}
                                        {weekReport.week_score !== null ? (weekReport.week_score).toFixed(2) : 0}%
                                    </b>
                                </h1>
                                <span style={{fontSize: "12px"}}>Weighted Company  </span>
                            </div>
                        </div>
                    </div>
                    <div className="row text-center">
                        <br/>
                        <h3 className="text-center">Numbers Achieved</h3>
                        <div className="col-xs-1">
                        </div>
                        <div className="col-xs-2">
                            <h1 className="overall-scores">
                                <b>
                                    {(weekReport.ec_leads !== null ? weekReport.fm_leads + weekReport.ec_leads : weekReport.fm_leads)}
                                    {/*{totalFMLeads}*/}
                                </b>
                            </h1>
                            <span style={{fontSize: "12px"}}>Leads </span>
                        </div>
                        {/*<div className="col-xs-2">*/}
                        {/*    <h1 className="overall-scores">*/}
                        {/*        <b>{weekReport.fm_qs}  </b>*/}
                        {/*    </h1>*/}
                        {/*    <span style={{fontSize: "12px"}}>QS</span>*/}
                        {/*</div>*/}
                        {/*<div className="col-xs-2">*/}
                        {/*    <h1 className="overall-scores">*/}
                        {/*        <b>{weekReport.ec_sits}</b>*/}
                        {/*    </h1>*/}
                        {/*    <span style={{fontSize: "12px"}}>Sits </span>*/}
                        {/*</div>*/}
                        <div className="col-xs-2">
                            <h1 className="overall-scores">
                                <b> {weekReport.ec_sits}</b>
                            </h1>
                            <span style={{fontSize: "12px"}}>Sits</span>
                        </div>
                        <div className="col-xs-2">
                            <h1 className="overall-scores">
                                <b>{weekReport.fm_ass}</b>
                            </h1>
                            <span style={{fontSize: "12px"}}>Assists </span>
                        </div>
                        <div className="col-xs-2">
                            <h1 className="overall-scores">
                                <b>{weekReport.ec_closes}</b>
                            </h1>
                            <span style={{fontSize: "12px"}}>Closes </span>
                        </div>
                        <div className="col-xs-2">
                            <h1 className="overall-scores">
                                <b>{weekReport.ec_scheduled_installs} </b>
                            </h1>
                            <span
                                style={{fontSize: "12px"}}>Scheduled Installs </span>
                        </div>
                        <div className="col-xs-1">
                        </div>
                    </div>
                    <ReportTeamsCollapsed/>
                    <br/>
                </div>
            </div>
        )
    }
}
