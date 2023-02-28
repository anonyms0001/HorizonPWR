import {emit, view} from "../framework"
// import fmStore from '../stores/fmStore'
import salesforceStore from '../stores/salesforceStore'
import reportStore from "../stores/reportStore"
import weekStatsStore from "../stores/weekStatsStore"
import ReactCardFlip from 'react-card-flip'
import LineChart from "./charts/lineChart"
import ReportCompanyReps from "./reportReps"
import ReportHeader from "./companyReportCardHeader"


@view
export default class CompanyReportCard extends React.Component {

    state = {
        rexOneFlipped: false,
        boiseOneFlipped: false,
        kfOneFlipped: false,
    }

    render() {
        const {currentDateRange, datePickerOption} = weekStatsStore
        const {energyConsultants, fieldMarketers, staticSort} = salesforceStore
        const {companyScore, companyFMNumbers, companyECNumbers, teamNumbers, selectedWeek} = reportStore

        // console.log("selectedWeek ", selectedWeek)

        function handleClick(e) {
            e.preventDefault()
            this.setState(prevState => ({rexOneFlipped: !prevState.rexOneFlipped}))
            // this.setState(prevState => ({boiseOneFlipped: !prevState.boiseOneFlipped}))
        }

        function handleClickBoise(e) {
            e.preventDefault()
            // this.setState(prevState => ({rexOneFlipped: !prevState.rexOneFlipped}))
            this.setState(prevState => ({boiseOneFlipped: !prevState.boiseOneFlipped}))
        }

        function handleClickKF(e) {
            e.preventDefault()
            // this.setState(prevState => ({rexOneFlipped: !prevState.rexOneFlipped}))
            this.setState(prevState => ({kfOneFlipped: !prevState.kfOneFlipped}))
        }

        function changeQuarter() {
            let timePeriod = document.getElementById('periodSelectChart').value
            // console.log("change quarter ", timePeriod)
            // emit.GetWeeksReport({quarter: timePeriod})
            emit.QuarterChange({quarter: timePeriod})
            // emit.GetWeeksReport({quarter: 'current'})
        }

        //format report week range start date
        let startDate = new Date(selectedWeek.start)
        startDate.setDate(startDate.getDate() + 1)
        // console.log("startDate ", startDate)
        let startDateTimeFormat = new Intl.DateTimeFormat('en', {year: 'numeric', month: 'short', day: '2-digit'})
        let [{value: startMonth}, , {value: startDay}, , {value: startYear}] = startDateTimeFormat.formatToParts(startDate)
        startDate = `${startMonth}-${startDay}-${startYear}`

        //format report week range end date

        let endDate = new Date(selectedWeek.end)
        endDate.setDate(endDate.getDate() + 1)
        // endDate.setHours(22, 0, 0, 0)
        // console.log("endDate ", endDate)
        let endDateTimeFormat = new Intl.DateTimeFormat('en', {year: 'numeric', month: 'short', day: '2-digit'})
        let [{value: endMonth}, , {value: endDay}, , {value: endYear}] = endDateTimeFormat.formatToParts(endDate)
          endDate = `${endMonth}-${endDay}-${endYear}`


        return (
            <div className="panel  panel-default">
                {/*<ReportHeader />*/}
                <div className="panel-heading" style={{paddingBottom: "0px", border: "none"}}>
                    <div style={{display: "flex"}}>
                        <div style={{flex: "1", textAlign: "left"}}>
                            <h5>Company Report Card from {startDate} to {endDate} </h5>
                        </div>
                        <div className="input-group" style={{maxWidth: "275px", flex: "1"}}>
                                    {/*<span id="custom_date_btn" className="input-group-addon" style={{cursor: "pointer"}}*/}
                                    {/*    // onClick={() => emit.DatePickerChange("custom_date")}*/}
                                    {/*>*/}
                                    {/*    <div id="custom-popover" className="popover fade top in"*/}
                                    {/*         style={{top: "-46px", left: "-44%"}}>*/}
                                    {/*          <div className="arrow"></div>*/}
                                    {/*        /!*<h3 className="popover-title" style={{color: "#333333"}}>Scores</h3>*!/*/}
                                    {/*        <div className="popover-content" style={{color: "#333333", padding: "9px"}}>*/}
                                    {/*         Use Custom Date Selector*/}
                                    {/*        </div>*/}
                                    {/*    </div>*/}
                                    {/*     <span className="glyphicon glyphicon-calendar"></span>*/}
                                    {/*</span>*/}
                            <select
                                className={"period form-control " + (datePickerOption === "dropdown" ? "block" : "none")}
                                style={{display: "inline", float: "right", color: "black"}}
                                id="periodSelectChart"
                                onInput={changeQuarter.bind(this)}
                                defaultValue={'This Week'}
                            >
                                <option>Select Quarter..</option>
                                <option value="current">Current</option>
                                <option value="previous">Previous</option>
                                <option value="previous and current">Previous and Currrent</option>
                                <option value="this year">This Year</option>
                            </select>
                        </div>


                    </div>
                </div>
                <div id="chart" className="panel-body" style={{paddingTop: "0px"}}>
                    <div className="row text-center" style={{padding: '0px', margin: '0px -20px'}}>
                        <div className="col-xs-12" style={{padding: '0px', margin: '0px'}}>
                            <LineChart/>
                        </div>
                    </div>
                    <div className="row text-center overall-scores">
                        <h3 className="text-center">Overall Scores </h3>
                        <div className="col-xs-4">
                            <div className="stat-wrapper">
                                <h1 className="overall-scores text-center">
                                    <b>{companyFMNumbers.CompanyFMScore !== null ? companyFMNumbers.CompanyFMScore.toFixed(2) : 0}%</b>
                                </h1>

                                <span style={{fontSize: "12px"}}>FM Unit</span>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="stat-wrapper">
                                <h1 className=" overall-scores text-center">
                                    <b>{companyECNumbers.CompanyECScore !== null ? companyECNumbers.CompanyECScore.toFixed(2) : 0}%</b>
                                </h1>
                                <span style={{fontSize: "12px"}}>EC Unit </span>
                            </div>
                        </div>
                        <div className="col-xs-4">
                            <div className="stat-wrapper">
                                <h1 className="overall-scores text-center">
                                    <b>
                                        {/*{(((parseInt(fmRexUnit) + parseInt(fmBoiseUnit) + parseInt(fmKFUnit)) / 3) + ((parseInt(ecRexUnit) + parseInt(ecBoiseUnit) + parseInt(ecKFUnit)) / 3) / 2).toFixed(2)}%*/}
                                        {companyScore !== null ? (companyScore).toFixed(2) : 0}%
                                    </b>
                                </h1>
                                <span style={{fontSize: "12px"}}>Weighted Company  </span>
                            </div>
                        </div>
                    </div>
                    <div className="row text-center">
                        <hr/>
                        <h3 className="text-center">Numbers Achieved</h3>
                        <div className="col-xs-2">
                            <h1 className="overall-scores">
                                <b>{companyFMNumbers.CompanyLeads}
                                    {/*{totalFMLeads}*/}
                                </b>
                            </h1>
                            <span style={{fontSize: "12px"}}>Leads </span>
                        </div>
                        <div className="col-xs-2">
                            <h1 className="overall-scores">
                                <b>{companyFMNumbers.CompanyQS} </b>
                            </h1>
                            <span style={{fontSize: "12px"}}>QS</span>
                        </div>
                        <div className="col-xs-2">
                            <h1 className="overall-scores">
                                <b>{companyECNumbers.CompanySits}</b>
                            </h1>
                            <span style={{fontSize: "12px"}}>Sits </span>
                        </div>
                        <div className="col-xs-2">
                            <h1 className="overall-scores">
                                <b>{companyFMNumbers.CompanyAss}</b>
                            </h1>
                            <span style={{fontSize: "12px"}}>Assists </span>
                        </div>
                        <div className="col-xs-2">
                            <h1 className="overall-scores">
                                <b>{companyECNumbers.CompanyCloses}</b>
                            </h1>
                            <span style={{fontSize: "12px"}}>Closes </span>
                        </div>
                        <div className="col-xs-2">
                            <h1 className="overall-scores">
                                <b>{companyECNumbers.CompanyScheduledInstalls} </b>
                            </h1>
                            <span
                                style={{fontSize: "12px"}}>Scheduled Installs </span>
                        </div>
                    </div>
                    {/*team tiles*/}
                    <div className="row text-center">
                        <hr/>
                        {
                            // initOtherTables === 'fm' && sortedTableFM.length !== 0 ? sortedTableFM.map((stat1) => {
                            // fmStatsSort !== null ? fmStatsSort.map((stat1) => {
                            teamNumbers.length !== 0 ? teamNumbers.map((team) => {
                                return (
                                    <div className="col-md-4" style={{borderRight: "1px solid rgb(221, 221, 221)"}}>
                                        <div className="row">
                                            <div className="col-xs-6">
                                                <h3 style={{textAlign: "left"}}>{team.Name} </h3>
                                            </div>
                                            <div className="col-xs-6">
                                                <h3 style={{textAlign: "right"}}>FMs: {team.fieldMarketers.length}-
                                                    ECs: {team.energyConsultants.length}</h3>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-xs-4">
                                                <h3 className="text-center">
                                                    <b>{team.fmScore ? (team.fmScore).toFixed(2) : 0}%</b>
                                                </h3>
                                                <span style={{fontSize: "12px"}}>FM Unit</span>
                                            </div>
                                            <div className="col-xs-4">
                                                <h3 className="text-center">
                                                    <b>{team.ecScore ? (team.ecScore).toFixed(2) : 0}%</b>
                                                </h3>
                                                <span style={{fontSize: "12px"}}>EC Unit</span>
                                            </div>
                                            <div className="col-xs-4">
                                                <h3 className="text-center">
                                                    <b>{team.teamScore ? (team.teamScore).toFixed(2) : 0}%</b>
                                                </h3>
                                                <span style={{fontSize: "12px"}}>Weighted Team</span>
                                            </div>
                                        </div>
                                        <br/>
                                        <ReactCardFlip isFlipped={this.state.rexOneFlipped} flipDirection="horizontal">
                                            <div style={this.state.rexOneFlipped ? {border: "1px solid #ddd"} : {
                                                display: "block",
                                                border: "1px solid #ddd"
                                            }}>
                                                <div className="row">
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.LeadsScore ? (team.LeadsScore).toFixed(2) : 0}%</b>
                                                        </h3>
                                                        <span style={{fontSize: "12px"}}>Leads</span>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.QsScore ? (team.QsScore).toFixed(2) : 0}%</b>
                                                        </h3>
                                                        <span
                                                            style={{fontSize: "12px"}}>QS {team.QsPRA ? team.QsPRA.toFixed(2) : 0}</span>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.AssScore ? (team.AssScore).toFixed(2) : 0}%</b>
                                                        </h3>
                                                        <span style={{fontSize: "12px"}}>Assists</span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.Sits ? (team.Sits).toFixed(2) : 0}%</b>
                                                        </h3>
                                                        <span style={{fontSize: "12px"}}>Sits</span>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.ClosesScore ? (team.ClosesScore).toFixed(2) : 0}%</b>
                                                        </h3>
                                                        <span style={{fontSize: "12px"}}>Closes</span>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.ScheduledInstallsScore ? (team.ScheduledInstallsScore).toFixed(2) : 0}%</b>
                                                        </h3>
                                                        <span style={{fontSize: "12px"}}>Installs Scheduled</span>
                                                    </div>
                                                </div>
                                                <div style={{cursor: "pointer", padding: "5px"}}
                                                     onClick={handleClick.bind(this)}>
                                                    Numbers Achieved&nbsp;
                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                         width="24px" height="24px" viewBox="0 0 24 24" version="1.1"
                                                         className="kt-svg-icon">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12"
                                                                    cy="12"
                                                                    r="10"/>
                                                            <path
                                                                d="M7.96323356,15.1775211 C7.62849853,15.5122561 7.08578582,15.5122561 6.75105079,15.1775211 C6.41631576,14.842786 6.41631576,14.3000733 6.75105079,13.9653383 L11.8939067,8.82248234 C12.2184029,8.49798619 12.7409054,8.4866328 13.0791905,8.79672747 L18.2220465,13.5110121 C18.5710056,13.8308912 18.5945795,14.3730917 18.2747004,14.7220508 C17.9548212,15.0710098 17.4126207,15.0945838 17.0636617,14.7747046 L12.5257773,10.6149773 L7.96323356,15.1775211 Z"
                                                                id="Path-94" fill="#000000" fillRule="nonzero"
                                                                transform="translate(12.500001, 12.000001) rotate(-270.000000) translate(-12.500001, -12.000001) "/>
                                                        </g>
                                                    </svg>
                                                </div>
                                                {/*<button onClick={handleClick.bind(this)}>Click to flip</button>*/}
                                            </div>
                                            {/*</YOUR_FRONT_CCOMPONENT>*/}
                                            {/*<YOUR_BACK_COMPONENT>*/}
                                            <div
                                                style={this.state.rexOneFlipped ? {border: "1px solid #ddd"} : {border: "1px solid #ddd"}}>
                                                <div className="row">
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.Leads}</b>
                                                        </h3>
                                                        <span style={{fontSize: "12px"}}>Leads</span>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.Qs}</b>
                                                        </h3>
                                                        <span style={{fontSize: "12px"}}>QS</span>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.Ass}</b>
                                                        </h3>
                                                        <span style={{fontSize: "12px"}}>Assists</span>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.Sits}</b>
                                                        </h3>
                                                        <span style={{fontSize: "12px"}}>Sits</span>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.Closes}</b>
                                                        </h3>
                                                        <span style={{fontSize: "12px"}}>Closes</span>
                                                    </div>
                                                    <div className="col-xs-4">
                                                        <h3 className="text-center">
                                                            <b>{team.ScheduledInstalls}</b>
                                                        </h3>
                                                        <span style={{fontSize: "12px"}}>Installs Scheduled</span>
                                                    </div>
                                                </div>
                                                <div style={{cursor: "pointer", padding: "5px 0"}}
                                                     onClick={handleClick.bind(this)}>

                                                    <svg xmlns="http://www.w3.org/2000/svg"
                                                        // xmlns:xlink="http://www.w3.org/1999/xlink"
                                                         width="24px" height="24px"
                                                         viewBox="0 0 24 24" version="1.1" className="kt-svg-icon">
                                                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                                            <rect id="bound" x="0" y="0" width="24" height="24"/>
                                                            <circle id="Oval-5" fill="#000000" opacity="0.3" cx="12"
                                                                    cy="12"
                                                                    r="10"/>
                                                            <path
                                                                d="M6.96323356,15.1775211 C6.62849853,15.5122561 6.08578582,15.5122561 5.75105079,15.1775211 C5.41631576,14.842786 5.41631576,14.3000733 5.75105079,13.9653383 L10.8939067,8.82248234 C11.2184029,8.49798619 11.7409054,8.4866328 12.0791905,8.79672747 L17.2220465,13.5110121 C17.5710056,13.8308912 17.5945795,14.3730917 17.2747004,14.7220508 C16.9548212,15.0710098 16.4126207,15.0945838 16.0636617,14.7747046 L11.5257773,10.6149773 L6.96323356,15.1775211 Z"
                                                                id="Path-94" fill="#000000" fillRule="nonzero"
                                                                transform="translate(11.500001, 12.000001) scale(-1, 1) rotate(-270.000000) translate(-11.500001, -12.000001) "/>
                                                        </g>
                                                    </svg>
                                                    Report Card
                                                </div>
                                                {/*<button onClick={handleClick.bind(this)}>Click to flip</button>*/}
                                            </div>
                                            {/*</YOUR_BACK_COMPONENT>*/}
                                        </ReactCardFlip>
                                    </div>

                                )
                            }) : null
                        }

                    </div>
                    <br/>
                    <ReportCompanyReps/>
                </div>
            </div>
        )
    }
}
